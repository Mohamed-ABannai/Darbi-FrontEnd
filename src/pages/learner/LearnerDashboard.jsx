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

  async function loadDashboardData() {
    try {
      const lessonsData = await getLessons();
      if (lessonsData) setLessons(lessonsData);

      const paymentsData = await getPayments();
      if (paymentsData) setPayments(paymentsData);

      const testsData = await getDrivingTests();
      if (testsData) setTests(testsData);

      const plansData = await getTrainingPlans();
      if (plansData) setPlans(plansData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const completedHours = lessons
    .filter((lesson) => lesson.status === "completed")
    .reduce((total, lesson) => total + (lesson.hours || 0), 0);

  const upcomingLessonsCount = lessons.filter(
    (lesson) => lesson.status === "scheduled",
  ).length;

  const pendingPaymentsCount = payments.filter(
    (payment) => payment.status === "pending",
  ).length;

  const latestTest = tests.length > 0 ? tests[tests.length - 1] : null;

  const activePlan = plans.find((p) => p.status === "active");
  return (
    <div className="learner-dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user.username} 👋</h1>
        <p>Track your driving lessons, hours, payments, and test readiness.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Training Hours</h3>
          <p className="stat-value">{completedHours} / 22 hrs</p>
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
              <b>Rate:</b> ${activePlan.instructor?.hourlyRate} / hour
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
