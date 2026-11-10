import { useEffect, useState } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";

function MyTrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActivePlans() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        const activePlans = data.filter((plan) => plan.status === "active");
        setPlans(activePlans);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load active training plans.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivePlans();
  }, []);

  if (loading) return <div>Loading active training plans...</div>;

  return (
    <div>
      <h1>My Active Training Plans</h1>

      {error && <div>{error}</div>}

      {plans.length === 0 ? (
        <p>No active training plans found.</p>
      ) : (
        <div>
          {plans.map((plan) => (
            <div key={plan._id}>
              <div>
                <p><strong>Name:</strong> {plan.learner?.username || plan.learner?.name || "Learner"}</p>
                <p><strong>Email:</strong> {plan.learner?.email || "N/A"}</p>
                <p><strong>Schedule:</strong> {plan.weeklySchedule ? new Date(plan.weeklySchedule).toLocaleString() : "Flexible"}</p>
                <p><strong>Status:</strong> <span style={{ color: "green" }}>ACTIVE</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrainingPlans;
