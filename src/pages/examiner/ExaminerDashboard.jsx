import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getDrivingTests } from "../../services/drivingTestService";

function ExaminerDashboard({ user }) {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDrivingTests().then((response) => {
      if (active) setTests(response);
    }).catch((err) => {
      if (active) setError(err.response?.data?.message || "Failed to load driving tests");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const pendingTests = tests.filter((test) => test.status === "pending");
  const scheduledTests = tests.filter((test) => test.status === "scheduled");
  const completedTests = tests.filter((test) => test.status === "completed");
  const passedTests = tests.filter((test) => test.result === "passed");
  const failedTests = tests.filter((test) => test.result === "failed");

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="examiner-dashboard-page role-dashboard">
      <div className="page-heading"><span className="section-kicker">Test operations</span><h1>Welcome, {user?.username}</h1><p>Review your assigned tests and keep result recording up to date.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      <h2>Test overview</h2>
      <div className="stats-grid"><div className="stat-card"><h3>Total assigned</h3><p className="stat-value">{tests.length}</p></div><div className="stat-card"><h3>Pending</h3><p className="stat-value">{pendingTests.length}</p></div><div className="stat-card"><h3>Scheduled</h3><p className="stat-value">{scheduledTests.length}</p></div><div className="stat-card"><h3>Completed</h3><p className="stat-value">{completedTests.length}</p></div><div className="stat-card"><h3>Passed</h3><p className="stat-value">{passedTests.length}</p></div><div className="stat-card"><h3>Failed</h3><p className="stat-value">{failedTests.length}</p></div></div>
      <h2>Assigned Driving Tests</h2>
      <p><Link to="/examiner/assigned-tests">Assigned Tests</Link></p>
      
      {tests.length === 0 ? (
        <p>No assigned driving tests found.</p>
      ) : (
        tests.map((test) => (
          <div key={test._id} className="dashboard-list-item">
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
