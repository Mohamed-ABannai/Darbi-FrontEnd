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
    } catch (err) {
      setError("Failed to load assigned tests");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleResult(id, result) {
    setError("");
    setMessage("");
    try {
      const response = await submitDrivingTestResult(id, result);
      setMessage("Test result submitted successfully");
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit result");
    }
  }

  return (
    <div>
      <h1>Assigned Driving Tests</h1>
      <p>View your assigned tests and record results.</p>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      {tests.length === 0 ? (
        <p>No assigned driving tests found.</p>
      ) : (
        <table>
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
                <td>{test.status}</td>
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
        </table>
      )}
    </div>
  );
}

export default AssignedTests;
