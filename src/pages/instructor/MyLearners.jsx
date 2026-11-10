import { useEffect, useState } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";

function MyLearners() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActiveLearners() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        const activePlans = data.filter((plan) => plan.status === "active");
        setLearners(activePlans);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load active learners.");
      } finally {
        setLoading(false);
      }
    }

    fetchActiveLearners();
  }, []);

  if (loading) return <div>Loading active learners...</div>;

  return (
    <div>
      <h1>My Active Learners</h1>

      {error && <div>{error}</div>}

      {learners.length === 0 ? (
        <p>No active learners found.</p>
      ) : (
        <div>
          {learners.map((plan) => (
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

export default MyLearners;