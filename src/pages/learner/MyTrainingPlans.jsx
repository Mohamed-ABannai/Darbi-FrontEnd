import { useState, useEffect } from "react";
import {
  getTrainingPlans,
  cancelTrainingPlan
} from "../../services/trainingPlanService";

function MyTrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [cancellingPlanId, setCancellingPlanId] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getTrainingPlans();
      setPlans(response);
    } catch (err) {
      setError("Failed to load training plans");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleCancel(id) {
    setError("");
    setMessage("");

    if (!reason.trim()) {
      setError("Please enter a cancellation reason");
      return;
    }

    try {
      await cancelTrainingPlan(id, reason.trim());
      setMessage("Training plan cancelled successfully");
      setCancellingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel training plan");
    }
  }

  return (
    <div>
      <h1>My Training Plans</h1>
      <p>View and manage your driving training plans.</p>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {plans.length === 0 ? (
        <p>You have no training plans yet.</p>
      ) : (
        <div>
          {plans.map((plan) => (
            <div key={plan._id}>
              <h2>Training Plan</h2>

              <p>
                <b>Instructor:</b>{" "}
                {plan.instructor?.username || "Not assigned"}
              </p>

              <p>
                <b>Hourly Rate:</b>{" "}
                {plan.instructor?.hourlyRate || "N/A"} BHD
              </p>

              <p>
                <b>Status:</b> {plan.status}
              </p>

              {plan.reason && (
                <p>
                  <b>Reason:</b> {plan.reason}
                </p>
              )}

              <h3>Weekly Schedule</h3>

              {!plan.weeklySchedule || plan.weeklySchedule.length === 0 ? (
                <p>No weekly schedule available.</p>
              ) : (
                <ul>
                  {plan.weeklySchedule.map((day, index) => (
                    <li key={index}>
                      {day.day}: {day.start} - {day.end}
                    </li>
                  ))}
                </ul>
              )}

              {(plan.status === "pending" || plan.status === "active") && (
                <div>
                  {cancellingPlanId === plan._id ? (
                    <div>
                      <label htmlFor={`reason-${plan._id}`}>
                        Cancellation Reason
                      </label>
                      <input
                        id={`reason-${plan._id}`}
                        type="text"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                      />

                      <button onClick={() => handleCancel(plan._id)}>
                        Confirm Cancellation
                      </button>

                      <button
                        onClick={() => {
                          setCancellingPlanId(null);
                          setReason("");
                          setError("");
                        }}
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCancellingPlanId(plan._id);
                        setReason("");
                        setError("");
                      }}
                    >
                      Cancel Training Plan
                    </button>
                  )}
                </div>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrainingPlans;