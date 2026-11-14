import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getDrivingTests } from "../../services/drivingTestService";

function ExaminerDashboard({ user }) {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await getDrivingTests();
      setTests(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load driving tests");
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  const pendingTests = tests.filter((test) => test.status === "pending");
  const scheduledTests = tests.filter((test) => test.status === "scheduled");
  const completedTests = tests.filter((test) => test.status === "completed");
  const passedTests = tests.filter((test) => test.result === "passed");
  const failedTests = tests.filter((test) => test.result === "failed");

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Examiner Dashboard</h1>
      <p>Welcome, {user?.username}</p>
      {error && <p>{error}</p>}
      <h2>Overview</h2>
      <p>Total Assigned Tests: {tests.length}</p>
      <p>Pending Tests: {pendingTests.length}</p>
      <p>Scheduled Tests: {scheduledTests.length}</p>
      <p>Completed Tests: {completedTests.length}</p>
      <p>Passed Tests: {passedTests.length}</p>
      <p>Failed Tests: {failedTests.length}</p>
      <h2>Assigned Driving Tests</h2>
      <p><Link to="/examiner/assigned-tests">Assigned Tests</Link></p>
      
      {tests.length === 0 ? (
        <p>No assigned driving tests found.</p>
      ) : (
        tests.map((test) => (
          <div key={test._id}>
            <p>Learner: {test.Learner?.username || "Learner"}</p>
            <p>Date: {test.date ? new Date(test.date).toLocaleString() : "Not scheduled"}</p>
            <p>Status: {test.status}</p>
            <p>Result: {test.result}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ExaminerDashboard;