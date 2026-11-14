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

  async function getData() {
    try {
      const plansResponse = await getTrainingPlans();
      const lessonsResponse = await getLessons();
      const paymentsResponse = await getPayments();
      setPlans(plansResponse);
      setLessons(lessonsResponse);
      setPayments(paymentsResponse);
    } catch (err) {
      setError("Failed to load dashboard");
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const pendingRequests = plans.filter((plan) => plan.status === "pending");
  const activePlans = plans.filter((plan) => plan.status === "active");
  const scheduledLessons = lessons.filter((lesson) => lesson.status === "scheduled");
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const pendingPayments = payments.filter((payment) => payment.status === "pending");

  let completedHours = 0;
  completedLessons.forEach((lesson) => {
    completedHours += lesson.hours;
  });

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Instructor Dashboard</h1>
      <p>Welcome, {user?.username}</p>
      {error && <p>{error}</p>}

      <h2>Overview</h2>
      <div>
        <p>Active Training Plans: {activePlans.length}</p>
        <p>Pending Requests: {pendingRequests.length}</p>
        <p>Scheduled Lessons: {scheduledLessons.length}</p>
        <p>Completed Lessons: {completedLessons.length}</p>
        <p>Completed Hours: {completedHours}</p>
        <p>Pending Payments: {pendingPayments.length}</p>
      </div>

      <h2>Management</h2>
      <div>
        <p><Link to="/instructor/requests">Training Requests</Link></p>
        <p><Link to="/instructor/learners">My Learners</Link></p>
        <p><Link to="/instructor/lessons">Manage Lessons</Link></p>
        <p><Link to="/instructor/payments">Instructor Payments</Link></p>
      </div>

      <h2>Recent Training Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        pendingRequests.slice(0, 5).map((plan) => (
          <div key={plan._id}>
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
          <div key={lesson._id}>
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