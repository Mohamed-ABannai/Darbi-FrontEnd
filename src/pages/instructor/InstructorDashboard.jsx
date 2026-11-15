import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";
import { getPayments } from "../../services/paymentService";

function InstructorDashboard({ user }) {
  const [plans, setPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getTrainingPlans(), getLessons(), getPayments()]).then(([plansResponse, lessonsResponse, paymentsResponse]) => {
      if (!active) return;
      setPlans(plansResponse);
      setLessons(lessonsResponse);
      setPayments(paymentsResponse);
      setLoading(false);
    }).catch(() => {
      if (active) {
        setError("Failed to load dashboard");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const pendingRequests = plans.filter((plan) => plan.status === "pending");
  const activePlans = plans.filter((plan) => plan.status === "active");
  const scheduledLessons = lessons.filter((lesson) => lesson.status === "scheduled" && new Date(lesson.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const pendingPayments = payments.filter((payment) => payment.status === "pending");

  let completedHours = 0;
  completedLessons.forEach((lesson) => {
    completedHours += Number(lesson.hours || 0);
  });

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="instructor-dashboard-page role-dashboard">
      <div className="page-heading"><span className="section-kicker">Teaching overview</span><h1>Welcome back, {user?.username}</h1><p>Your day at a glance: learners, upcoming lessons, and requests that need a response.</p></div>
      {error && <p className="error" role="alert">{error}</p>}

      <h2>Today at a glance</h2>
      <div className="stats-grid"><div className="stat-card"><h3>Active learners</h3><p className="stat-value">{activePlans.length}</p></div><div className="stat-card"><h3>Requests to review</h3><p className="stat-value">{pendingRequests.length}</p></div><div className="stat-card"><h3>Upcoming lessons</h3><p className="stat-value">{scheduledLessons.length}</p></div><div className="stat-card"><h3>Completed teaching hours</h3><p className="stat-value">{completedHours}</p></div><div className="stat-card"><h3>Payments to confirm</h3><p className="stat-value">{pendingPayments.length}</p></div></div>

      <h2>Management</h2>
      <div className="quick-links-grid"><Link to="/instructor/requests">Review requests <span>→</span></Link><Link to="/instructor/lessons">Manage lessons <span>→</span></Link><Link to="/instructor/learners">View learners <span>→</span></Link><Link to="/instructor/payments">Confirm payments <span>→</span></Link></div>

      <h2>Recent Training Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        pendingRequests.slice(0, 5).map((plan) => (
          <div key={plan._id} className="dashboard-list-item">
            <p>Learner: {plan.learner?.username}</p>
            <p>Status: {plan.status}</p>
          </div>
        ))
      )}

      <h2>Scheduled Lessons</h2>
      {scheduledLessons.length === 0 ? (
        <p>No scheduled lessons.</p>
      ) : (
        scheduledLessons.slice(0, 5).map((lesson) => (
          <div key={lesson._id} className="dashboard-list-item">
            <p>Date: {new Date(lesson.date).toLocaleString()}</p>
            <p>Hours: {lesson.hours}</p>
            <p>Status: {lesson.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default InstructorDashboard;
