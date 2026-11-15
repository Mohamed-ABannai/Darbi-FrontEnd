import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getUsers } from "../../services/userService";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getDrivingTests } from "../../services/drivingTestService";
import { getPayments } from "../../services/paymentService";

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [drivingTests, setDrivingTests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const usersData = await getUsers();
        const plansData = await getTrainingPlans();
        const testsData = await getDrivingTests();
        const paymentsData = await getPayments();
        setUsers(usersData);
        setTrainingPlans(plansData);
        setDrivingTests(testsData);
        setPayments(paymentsData);
      } catch {
        setError("Failed to load dashboard");
      }
    }
    getData();
  }, []);

  const learners = users.filter((user) => user.role === "learner");
  const instructors = users.filter((user) => user.role === "instructor");
  const pendingInstructors = instructors.filter((user) => !user.isApproved);
  const activePlans = trainingPlans.filter((plan) => plan.status === "active");
  const pendingTests = drivingTests.filter((test) => test.status === "pending");
  const completedPayments = payments.filter((payment) => payment.status === "completed");

  return (
    <div className="admin-dashboard-page role-dashboard">
      <div className="page-heading"><span className="section-kicker">Operations desk</span><h1>DARBI overview</h1><p>Monitor platform activity and move the important queues forward.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="stats-grid"><div className="stat-card"><h3>Total users</h3><p className="stat-value">{users.length}</p></div><div className="stat-card"><h3>Learners</h3><p className="stat-value">{learners.length}</p></div><div className="stat-card"><h3>Instructors</h3><p className="stat-value">{instructors.length}</p></div><div className="stat-card stat-attention"><h3>Instructor approvals</h3><p className="stat-value">{pendingInstructors.length}</p><Link to="/admin/instructor-approvals">Review queue →</Link></div><div className="stat-card"><h3>Active plans</h3><p className="stat-value">{activePlans.length}</p></div><div className="stat-card"><h3>Pending tests</h3><p className="stat-value">{pendingTests.length}</p></div><div className="stat-card"><h3>Completed payments</h3><p className="stat-value">{completedPayments.length}</p></div></div>
      <h2>Management</h2>
      <div className="quick-links-grid admin-quick-links">
        <Link to="/admin/users">Manage users <span>→</span></Link>
        {user?.role === "superAdmin" && (
        <Link to="/admin/manage-admins">Manage admins <span>→</span></Link>
         )}
        <Link to="/admin/instructor-approvals">Instructor approvals <span>→</span></Link>
        <Link to="/admin/training">Manage training <span>→</span></Link>
        <Link to="/admin/driving-tests">Driving tests <span>→</span></Link>
        <Link to="/admin/reviews">Review moderation <span>→</span></Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
