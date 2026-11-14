import { useState, useEffect } from "react";
import {
  getTrainingPlans,
  acceptTrainingPlan,
  rejectTrainingPlan
} from "../../services/trainingPlanService";

function TrainingRequests() {
  const [plans, setPlans] = useState([]);
  const [rejectingPlanId, setRejectingPlanId] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getTrainingPlans();
      setPlans(response);
    } catch (err) {
      setError("Failed to load training requests");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleAccept(id) {
    setError("");
    setMessage("");

    try {
      await acceptTrainingPlan(id);
      setMessage("Training request accepted successfully");
      setRejectingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    }
  }

  async function handleReject(id) {
    setError("");
    setMessage("");

    if (reason.trim().length < 20) {
      setError("Rejection reason must be at least 20 characters");
      return;
    }

    try {
      await rejectTrainingPlan(id, reason.trim());
      setMessage("Training request rejected successfully");
      setRejectingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    }
  }

  const pendingPlans = plans.filter((plan) => plan.status === "pending");

  return (
    <div>
      <h1>Training Requests</h1>
      <p>View and respond to learner training requests.</p>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {pendingPlans.length === 0 ? (
        <p>No pending training requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingPlans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.learner?.username || "Learner"}</td>
                <td>{plan.status}</td>
                <td>
                  <button onClick={() => handleAccept(plan._id)}>
                    Accept
                  </button>

                  {rejectingPlanId === plan._id ? (
                    <div>
                      <label htmlFor={`reason-${plan._id}`}>
                        Rejection Reason
                      </label>
                      <input
                        id={`reason-${plan._id}`}
                        type="text"
                        minLength={20}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                      />

                      <button onClick={() => handleReject(plan._id)}>
                        Confirm Rejection
                      </button>

                      <button
                        onClick={() => {
                          setRejectingPlanId(null);
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
                        setRejectingPlanId(plan._id);
                        setReason("");
                        setError("");
                      }}
                    >
                      Reject
                    </button>
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

export default TrainingRequests;