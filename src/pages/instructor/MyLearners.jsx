
import { useEffect, useState } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";

function MyLearners() {
  const [learners, setLearners] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActiveLearners() {
      try {
        setLoading(true);
        const [data, lessonsData] = await Promise.all([
          getTrainingPlans(),
          getLessons(),
        ]);
        const activePlans = data.filter((plan) => plan.status === "active");
        setLearners(activePlans);
        setLessons(lessonsData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load active learners.");
      } finally {
        setLoading(false);
      }
    }

    fetchActiveLearners();
  }, []);

  // completed hours for each learner (lesson.TrainingPlan is the plan id)
  function getCompletedHours(planId) {
    let hours = 0;
    for (const lesson of lessons) {
      if (lesson.TrainingPlan === planId && lesson.status === "completed") {
        hours = hours + (lesson.hours || 0);
      }
    }
    return hours;
  }

  if (loading) return <div>Loading active learners...</div>;

  return (
    <div>
      <h1>My Active Learners</h1>

      {error && <div className="error">{error}</div>}

      {learners.length === 0 ? (
        <p>No active learners found.</p>
      ) : (
        <div>
          {learners.map((plan) => (
            <div key={plan._id}>
              <div>
                <p><strong>Name:</strong> {plan.learner?.username || "Learner"}</p>
                <p><strong>Schedule:</strong> {plan.weeklySchedule?.length ? plan.weeklySchedule.map((s) => `${s.day} ${s.startTime}-${s.endTime}`).join(", ") : "Flexible"}</p>
                <p><strong>Completed Hours:</strong> {getCompletedHours(plan._id)} hrs</p>
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

