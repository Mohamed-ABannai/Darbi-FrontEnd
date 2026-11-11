import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";
import { getPayments } from "../../services/paymentService";

function InstructorDashboard({ user }) {
  const [plans, setPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [plansData, lessonsData, paymentsData] = await Promise.all([
          getTrainingPlans(),
          getLessons(),
          getPayments(),
        ]);
        setPlans(plansData);
        setLessons(lessonsData);
        setPayments(paymentsData);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pendingRequests = plans.filter((plan) => plan.status === "pending");
  const activeLearners = plans.filter((plan) => plan.status === "active");
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const upcomingLessons = lessons.filter((lesson) => lesson.status === "scheduled");
  
  let completedHours = 0;
  for (const lesson of completedLessons) {
    completedHours = completedHours + (lesson.hours || 0);
  }

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>Welcome, {user?.username}</div>
      <div>Instructor Dashboard</div>

      <div>Active Learners: {activeLearners.length}</div>
      <div>Pending Requests: {pendingRequests.length}</div>
      <div>Hours Taught: {completedHours} hrs</div>
      <div>Pending Payments: {pendingPayments.length}</div>

      <div>Quick Actions</div>
      <ul>
        <li><Link to="/instructor/requests">Training Requests ({pendingRequests.length})</Link></li>
        <li><Link to="/instructor/learners">My Learners ({activeLearners.length})</Link></li>
        <li><Link to="/instructor/lessons">Manage Lessons</Link></li>
        <li><Link to="/instructor/payments">Confirm Payments ({pendingPayments.length})</Link></li>
      </ul>

      <div>Recent Training Requests</div>
      <Link to="/instructor/requests">View all</Link>
      {pendingRequests.length === 0 ? (
        <div>No pending requests.</div>
      ) : (
        <ul>
          {pendingRequests.slice(0, 5).map((plan) => (
            <li key={plan._id}>
              <div>Learner: {plan.learner?.username || "Learner"}</div>
              <div>Requested Schedule: {plan.weeklySchedule ? new Date(plan.weeklySchedule).toLocaleString() : "Flexible"}</div>
              <div>Status: {plan.status}</div>
            </li>
          ))}
        </ul>
      )}

      <div>Upcoming Lessons</div>
      <Link to="/instructor/lessons">View all</Link>
      {upcomingLessons.length === 0 ? (
        <div>No upcoming lessons scheduled.</div>
      ) : (
        <ul>
          {upcomingLessons.slice(0, 5).map((lesson) => (
            <li key={lesson._id}>
              <div>Learner: {lesson.TrainingPlan?.learner?.username || "Learner"}</div>
              <div>Date &amp; Time: {new Date(lesson.date).toLocaleString()}</div>
              <div>Hours: {lesson.hours} hrs</div>
              <div>Status: {lesson.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InstructorDashboard;