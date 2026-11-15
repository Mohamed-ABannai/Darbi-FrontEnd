import { useState, useEffect } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";

function MyLearners() {
  const [plans, setPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getTrainingPlans(), getLessons()]).then(([plansResponse, lessonsResponse]) => {
      if (!active) return;
      setPlans(plansResponse.filter((plan) => plan.status === "active"));
      setLessons(lessonsResponse);
    }).catch(() => {
      if (active) setError("Failed to load learners");
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="my-learners-page">
      <div className="page-heading"><span className="section-kicker">Your roster</span><h1>My learners</h1><p>Keep track of each active learner’s lessons and progress toward the 22-hour training target.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
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
                <td>{lessons.filter((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id) && lesson.status === "completed").length}</td>
                <td>{lessons.filter((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id) && lesson.status === "completed").reduce((total, lesson) => total + Number(lesson.hours || 0), 0)} / 22 hrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyLearners;
