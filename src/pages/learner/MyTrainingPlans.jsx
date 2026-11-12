import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getTrainingPlans,
  cancelTrainingPlan,
  transferInstructor,
} from "../../services/trainingPlanService";
import { getInstructors } from "../../services/userService";

function MyTrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingPlanId, setCancellingPlanId] = useState(null);
  const [transferringPlanId, setTransferringPlanId] = useState(null);
  const [newInstructorId, setNewInstructorId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const plansData = await getTrainingPlans();
      if (plansData) setPlans(plansData);

      const instructorsData = await getInstructors();
      if (instructorsData) setInstructors(instructorsData);
    } catch (err) {
      console.error("Error fetching training plans:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCancelSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await cancelTrainingPlan(cancellingPlanId, cancelReason);
      setCancellingPlanId(null);
      setCancelReason("");
      setMessage("Training plan cancelled successfully.");
      loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to cancel plan. Reason must be between 20 and 140 characters.",
      );
    }
  }

  async function handleTransferSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await transferInstructor(transferringPlanId, newInstructorId);
      setTransferringPlanId(null);
      setNewInstructorId("");
      setMessage("Instructor transfer request submitted successfully.");
      loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to transfer instructor.",
      );
    }
  }

  return (
    <div className="my-training-plans-page">
      <h1>My Training Plans</h1>
      <p>View your training requests, check status, and manage instructors.</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {plans.length === 0 ? (
        <div className="empty-state">
          <p>You have not requested any training plans yet.</p>
          <Link to="/find-instructors">Find an Instructor</Link>
        </div>
      ) : (
        <div className="plans-list">
          {plans.map((onePlan) => (
            <div key={onePlan._id} className="plan-card">
              <h3>Instructor: {onePlan.instructor?.username || "Unknown"}</h3>
              <p>
                <b>Hourly Rate:</b> ${onePlan.instructor?.hourlyRate} / hour
              </p>
              <p>
                <b>Status:</b> {onePlan.status}
              </p>

              {onePlan.weeklySchedule && onePlan.weeklySchedule.length > 0 && (
                <div className="plan-schedule">
                  <b>Weekly Schedule:</b>
                  <ul>
                    {onePlan.weeklySchedule.map((slot, index) => (
                      <li key={index}>
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {onePlan.reason && (
                <p>
                  <b>Reason / Note:</b> {onePlan.reason}
                </p>
              )}

              <div className="plan-actions">
                {(onePlan.status === "pending" ||
                  onePlan.status === "active") && (
                  <button
                    onClick={() => {
                      setCancellingPlanId(onePlan._id);
                      setTransferringPlanId(null);
                      setError("");
                    }}
                  >
                    Cancel Plan
                  </button>
                )}

                {onePlan.status === "active" && (
                  <button
                    onClick={() => {
                      setTransferringPlanId(onePlan._id);
                      setCancellingPlanId(null);
                      setError("");
                    }}
                  >
                    Change Instructor
                  </button>
                )}
              </div>

              {cancellingPlanId === onePlan._id && (
                <form onSubmit={handleCancelSubmit} className="cancel-form">
                  <h4>Cancel Training Plan</h4>
                  <label htmlFor="cancelReason">
                    Reason (20 - 140 characters):
                  </label>
                  <input
                    type="text"
                    id="cancelReason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Write your cancellation reason..."
                    minLength={20}
                    maxLength={140}
                    required
                  />
                  <button type="submit">Confirm Cancel</button>
                  <button
                    type="button"
                    onClick={() => setCancellingPlanId(null)}
                  >
                    Close
                  </button>
                </form>
              )}

              {transferringPlanId === onePlan._id && (
                <form onSubmit={handleTransferSubmit} className="transfer-form">
                  <h4>Transfer to Another Instructor</h4>
                  <label htmlFor="newInstructor">Select New Instructor:</label>
                  <select
                    id="newInstructor"
                    value={newInstructorId}
                    onChange={(e) => setNewInstructorId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Instructor --</option>
                    {instructors
                      .filter((inst) => inst._id !== onePlan.instructor?._id)
                      .map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.username} (${inst.hourlyRate}/hr)
                        </option>
                      ))}
                  </select>
                  <button type="submit">Submit Transfer</button>
                  <button
                    type="button"
                    onClick={() => setTransferringPlanId(null)}
                  >
                    Close
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrainingPlans;
