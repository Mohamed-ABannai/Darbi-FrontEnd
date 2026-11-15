import { useState, useEffect } from "react";
import { getDrivingTests, submitDrivingTestResult } from "../../services/drivingTestService";

function AssignedTests() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getDrivingTests();
      setTests(response);
    } catch {
      setError("Failed to load assigned tests");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(getData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleResult(id, result) {
    setError("");
    setMessage("");
    try {
      await submitDrivingTestResult(id, result);
      setMessage("Test result submitted successfully");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit result");
    }
  }

  return (
    <div className="assigned-tests-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Examiner workspace</span><h1>Assigned tests</h1><p>Review scheduled candidates and record pass or fail results after each test.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      {tests.length === 0 ? (
        <div className="empty-state"><h2>No tests assigned</h2><p>New examiner assignments will show here.</p></div>
      ) : (
      <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Date</th>
              <th>Status</th>
              <th>Result</th>
              <th>Extra Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test._id}>
                <td>{test.Learner?.username || "Learner"}</td>
                <td>{test.date ? new Date(test.date).toLocaleString() : "Not scheduled"}</td>
                <td><span className={`status-chip status-${test.status}`}>{test.status}</span></td>
                <td>{test.result}</td>
                <td>{test.extraHours || 0}</td>
                <td>
                  {test.status === "scheduled" && (
                    <div>
                      <button onClick={() => handleResult(test._id, "passed")}>Pass</button>
                      <button onClick={() => handleResult(test._id, "failed")}>Fail</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
      </table></div>
      )}
    </div>
  );
}

export default AssignedTests;
