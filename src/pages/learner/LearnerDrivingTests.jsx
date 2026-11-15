import { useState, useEffect } from "react";
import {
  getDrivingTests,
  getDrivingTestEligibility,
  createDrivingTest,
  cancelDrivingTest,
} from "../../services/drivingTestService";

function getDateTimeLocalMinimum() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function LearnerDrivingTests() {
  const [tests, setTests] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingTestId, setCancellingTestId] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadTests() {
    try {
      const data = await getDrivingTests();
      const eligibilityData = await getDrivingTestEligibility();
      setTests(data);
      setEligibility(eligibilityData);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load driving test information.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadTests, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const requestedDate = new Date(date);
      if (Number.isNaN(requestedDate.getTime()) || requestedDate <= new Date()) {
        setError("Choose a future test date and time.");
        return;
      }
      await createDrivingTest({ date: requestedDate.toISOString() });
      setDate("");
      setMessage("Driving test requested successfully!");
      await loadTests();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to request driving test.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(testId) {
    if (!window.confirm("Cancel this driving test request?")) return;
    setError("");
    setMessage("");
    setCancellingTestId(testId);
    try {
      await cancelDrivingTest(testId);
      setMessage("Driving test cancelled successfully.");
      await loadTests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel driving test.");
    } finally {
      setCancellingTestId(null);
    }
  }

  return (
    <div className="learner-driving-tests-page">
      <h1>Driving Tests</h1>

      <div className="request-test-section">
        <h2>Request a Driving Test</h2>
        {eligibility && <p className={eligibility.eligible ? "success" : "field-hint"} role="status">{eligibility.hasActivePlan ? `${Number(eligibility.totalHours)} of ${Number(eligibility.requiredHours)} required training hours completed.${eligibility.remainingHours > 0 ? ` Complete ${eligibility.remainingHours} more hour${eligibility.remainingHours === 1 ? "" : "s"} before booking.` : " You are eligible to request a test."}` : "An active training plan is required before you can request a test."}</p>}
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="testDate">Select Test Date & Time:</label>
          <input
            type="datetime-local"
            min={getDateTimeLocalMinimum()}
            id="testDate"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button type="submit" disabled={!eligibility?.eligible || submitting}>{submitting ? "Submitting…" : "Submit Request"}</button>
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

                {oneTest.examiner?.username && <p><b>Assigned examiner:</b> {oneTest.examiner.username}</p>}
                {["pending", "scheduled"].includes(oneTest.status) && (
                  <button onClick={() => handleCancel(oneTest._id)} disabled={cancellingTestId === oneTest._id}>
                    {cancellingTestId === oneTest._id ? "Cancelling…" : "Cancel Test"}
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
