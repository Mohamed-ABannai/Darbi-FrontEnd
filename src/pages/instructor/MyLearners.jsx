import { useState, useEffect } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";

function MyLearners() {
  const [plans, setPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  async function getData() {
    try {
      const plansResponse = await getTrainingPlans();
      const lessonsResponse = await getLessons();
      setPlans(plansResponse.filter((plan) => plan.status === "active"));
      setLessons(lessonsResponse);
    } catch (err) {
      setError("Failed to load learners");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>My Learners</h1>
      <p>View your assigned learners and their training progress.</p>
      {error && <p>{error}</p>}
      {plans.length === 0 ? (
        <p>No active learners found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Status</th>
              <th>Completed Lessons</th>
              <th>Completed Hours</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.learner?.username || "Learner"}</td>
                <td>{plan.status}</td>
                <td>
                  {lessons.filter((lesson) => lesson.TrainingPlan === plan._id && lesson.status === "completed").length}
                </td>
                <td>
                  {lessons
                    .filter((lesson) => lesson.TrainingPlan === plan._id && lesson.status === "completed")
                    .reduce((total, lesson) => total + lesson.hours, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyLearners;