import { useState, useEffect } from "react";
import {
  getDrivingTests,
  createDrivingTest,
  cancelDrivingTest,
} from "../../services/drivingTestService";

function LearnerDrivingTests() {
  const [tests, setTests] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTests() {
    try {
      const data = await getDrivingTests();
      setTests(data);
    } catch (err) {
      console.error("Error fetching driving tests:", err);
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await createDrivingTest({ date });
      setDate("");
      setMessage("Driving test requested successfully!");
      loadTests();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to request driving test.");
    }
  }

  async function handleCancel(testId) {
    try {
      await cancelDrivingTest(testId);
      loadTests();
    } catch (err) {
      console.error("Error cancelling test:", err);
    }
  }

  return (
    <div className="learner-driving-tests-page">
      <h1>Driving Tests</h1>

      <div className="request-test-section">
        <h2>Request a Driving Test</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="testDate">Select Test Date & Time:</label>
          <input
            type="datetime-local"
            id="testDate"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit">Submit Request</button>
        </form>
      </div>

      <hr />

      <div className="tests-list-section">
        <h2>My Test History</h2>
        {tests.length === 0 ? (
          <p>No driving tests booked yet.</p>
        ) : (
          <div className="tests-list">
            {tests.map((oneTest) => (
              <div key={oneTest._id} className="test-card">
                <p>
                  <b>Date:</b> {new Date(oneTest.date).toLocaleString()}
                </p>
                <p>
                  <b>Status:</b> {oneTest.status}
                </p>
                <p>
                  <b>Result:</b> {oneTest.result}
                </p>
                {oneTest.extraHours > 0 && (
                  <p>
                    <b>Required Extra Hours:</b> {oneTest.extraHours} hours
                  </p>
                )}

                {oneTest.status === "pending" && (
                  <button onClick={() => handleCancel(oneTest._id)}>
                    Cancel Test
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnerDrivingTests;