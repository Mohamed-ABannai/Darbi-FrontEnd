
import { useEffect, useState } from "react";
import { getTrainingPlans, acceptTrainingPlan, rejectTrainingPlan } from "../../services/trainingPlanService";

function TrainingRequests() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        setPlans(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load training requests.");
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  async function handleStatusUpdate(planId, newStatus) {
    try {
      setError("");
      setActionMessage("");
      if (newStatus === "active") {
        await acceptTrainingPlan(planId);
      } else {
        await rejectTrainingPlan(planId);
      }

      setActionMessage(`Training request successfully ${newStatus}!`);

      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan._id === planId ? { ...plan, status: newStatus } : plan
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${newStatus} the request.`);
    }
  }

  if (loading) return <div>Loading training requests...</div>;

  return (
    <div>
      <h1>Training Requests</h1>

      {error && <div className="error">{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      {plans.length === 0 ? (
        <p>No training requests found.</p>
      ) : (
        <div>
          {plans.map((plan) => (
            <div key={plan._id}>
              <div>
                <p>Learner: {plan.learner?.username || "Learner"}</p>
                <p>Schedule: {plan.weeklySchedule?.length ? plan.weeklySchedule.map((s) => `${s.day} ${s.startTime}-${s.endTime}`).join(", ") : "Flexible"}</p>
                <p>Status: {plan.status}</p>
                {plan.reason && <p>Reason: {plan.reason}</p>}
              </div>

              {plan.status === "pending" ? (
                <div>
                  <button onClick={() => handleStatusUpdate(plan._id, "active")}>
                    Accept
                  </button>
                  <button onClick={() => handleStatusUpdate(plan._id, "rejected")}>
                    Reject
                  </button>
                </div>
              ) : (
                <span>
                  {plan.status.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainingRequests;

