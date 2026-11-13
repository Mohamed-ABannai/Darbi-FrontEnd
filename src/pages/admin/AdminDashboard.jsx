import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getUsers } from "../services/userService";
import { getTrainingPlans } from "../services/trainingPlanService";
import { getDrivingTests } from "../services/drivingTestService";
import { getPayments } from "../services/paymentService";

function AdminDashboard() {
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
      } catch (err) {
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
    <div>
      <h1>Admin Dashboard</h1>
      <p>Overview of the DARBI platform</p>
      {error && <p>{error}</p>}
      <div>
        <h3>Total Users: {users.length}</h3>
        <h3>Learners: {learners.length}</h3>
        <h3>Instructors: {instructors.length}</h3>
        <h3>Pending Instructor Approvals: {pendingInstructors.length}</h3>
        <h3>Active Training Plans: {activePlans.length}</h3>
        <h3>Pending Driving Tests: {pendingTests.length}</h3>
        <h3>Completed Payments: {completedPayments.length}</h3>
      </div>
      <h2>Management</h2>
      <div>
        <p><Link to="/admin/users">Manage Users</Link></p>
        <p><Link to="/admin/instructor-approvals">Instructor Approvals</Link></p>
        <p><Link to="/admin/training">Manage Training</Link></p>
        <p><Link to="/admin/driving-tests">Manage Driving Tests</Link></p>
        <p><Link to="/admin/reviews">Manage Reviews</Link></p>
      </div>
    </div>
  );
}

export default AdminDashboard;