import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getLessons } from "../../services/lessonService";
import { getPayments } from "../../services/paymentService";
import { getDrivingTests } from "../../services/drivingTestService";
import { getTrainingPlans } from "../../services/trainingPlanService";

function LearnerDashboard({ user }) {
  const [lessons, setLessons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tests, setTests] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const lessonsData = await getLessons();
      const paymentsData = await getPayments();
      const testsData = await getDrivingTests();
      const plansData = await getTrainingPlans();
      setLessons(lessonsData || []);
      setPayments(paymentsData || []);
      setTests(testsData || []);
      setPlans(plansData || []);
    } catch {
      setError("Could not load your dashboard. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const completedHours = lessons
    .filter((lesson) => lesson.status === "completed")
    .reduce((total, lesson) => total + Number(lesson.hours || 0), 0);

  const upcomingLessons = lessons.filter((lesson) => lesson.status === "scheduled" && new Date(lesson.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingLessonsCount = upcomingLessons.length;

  const pendingPaymentsCount = payments.filter(
    (payment) => payment.status === "pending" || payment.status === "unsubmitted",
  ).length;

  const latestTest = [...tests].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0] || null;

  const activePlan = plans.find((p) => p.status === "active");
  if (loading) return <p>Loading dashboard…</p>;

  return (
    <div className="learner-dashboard-page">
      <div className="dashboard-header page-heading">
        <span className="section-kicker">Your learner space</span><h1>Good to see you, {user.username}</h1>
        <p>Every lesson is a step closer to feeling at home behind the wheel.</p>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card progress-stat">
          <h3>Training Hours</h3>
          <p className="stat-value">{completedHours} / 22 hrs</p>
          <div className="progress-track" role="progressbar" aria-label="Training hours completed" aria-valuenow={Math.min(completedHours, 22)} aria-valuemin="0" aria-valuemax="22"><span style={{ width: `${Math.min(100, Math.max(0, completedHours / 22 * 100))}%` }} /></div>
          <Link to="/lessons">View Lessons</Link>
        </div>

        <div className="stat-card">
          <h3>Upcoming Lessons</h3>
          <p className="stat-value">{upcomingLessonsCount}</p>
          <Link to="/lessons">Manage Schedule</Link>
        </div>

        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="stat-value">{pendingPaymentsCount}</p>
          <Link to="/payments">Go to Payments</Link>
        </div>

        <div className="stat-card">
          <h3>Driving Test</h3>
          <p className="stat-value">
            {latestTest ? latestTest.status : "Not Requested"}
          </p>
          <Link to="/driving-tests">View Test Status</Link>
        </div>
      </div>

      <section className="dashboard-section next-lesson-section"><div className="section-title-row"><div><span className="section-kicker">Coming up</span><h2>Next lesson</h2></div><Link to="/lessons">View schedule →</Link></div>{upcomingLessons[0] ? <div className="next-lesson-card"><span className="next-date">{new Date(upcomingLessons[0].date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span><div><h3>Driving lesson</h3><p>{new Date(upcomingLessons[0].date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · {upcomingLessons[0].hours} hours</p></div><span className="status-chip status-scheduled">Scheduled</span></div> : <div className="empty-state compact-empty"><p>No upcoming lessons yet.</p><Link to={activePlan ? "/lessons" : "/find-instructors"}>{activePlan ? "View your lessons" : "Find an instructor"} →</Link></div>}</section>

      <div className="dashboard-overview-section">
        <h2>Active Training Plan</h2>
        {activePlan ? (
          <div className="active-plan-card">
            <p>
              <b>Instructor:</b> {activePlan.instructor?.username || "Assigned"}
            </p>
            <p>
              <b>Status:</b> {activePlan.status}
            </p>
            <p>
              <b>Rate:</b> {(activePlan.hourlyRateSnapshot || activePlan.instructor?.hourlyRate) ? `${Number(activePlan.hourlyRateSnapshot || activePlan.instructor.hourlyRate).toFixed(3)} BHD / hour` : "Not provided"}
            </p>
            <Link to="/my-plans">View Full Plan Details</Link>
          </div>
        ) : (
          <div className="no-plan-card">
            <p>You do not have an active training plan yet.</p>
            <Link to="/find-instructors">Find an Instructor</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnerDashboard;
