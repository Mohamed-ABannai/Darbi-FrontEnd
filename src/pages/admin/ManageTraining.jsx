import { useState, useEffect } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";

function ManageTraining() {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getTrainingPlans(), getLessons()]).then(([plans, lessons]) => {
      if (!active) return;
      setTrainingPlans(plans);
      setLessons(lessons);
    }).catch(() => {
      if (active) setError("Failed to load training data");
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="manage-training-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Training operations</span><h1>Manage training</h1><p>Monitor learner plans, scheduled lessons, and completed training hours.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      <h2>Training Plans</h2>
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Learner</th>
            <th>Instructor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trainingPlans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.learner?.username}</td>
              <td>{plan.instructor?.username}</td>
              <td><span className={`status-chip status-${plan.status}`}>{plan.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <h2>Lessons</h2>
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Training Plan</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id}>
              <td>{lesson.TrainingPlan?.learner?.username || lesson.TrainingPlan?.instructor?.username || (typeof lesson.TrainingPlan === "string" ? lesson.TrainingPlan : "Training plan")}</td>
              <td>{new Date(lesson.date).toLocaleDateString()}</td>
              <td>{lesson.hours}</td>
              <td><span className={`status-chip status-${lesson.status}`}>{lesson.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <h2>Learner Progress</h2>
      <div className="progress-roster">{trainingPlans.map((plan) => {
        const planLessons = lessons.filter((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id) && lesson.status === "completed");
        const hours = planLessons.reduce((total, lesson) => total + Number(lesson.hours || 0), 0);
        return <div className="progress-roster-row" key={plan._id}>
          <div><strong>{plan.learner?.username || "Learner"}</strong><span>{plan.instructor?.username || "Instructor"}</span></div>
          <div><span>{hours} / 22 hours</span><div className="progress-track"><span style={{width:`${Math.min(100,Math.max(0,hours/22*100))}%`}} /></div></div>
          <span>{planLessons.length} completed lessons</span>
        </div>
      })}</div>
    </div>
  );
}

export default ManageTraining;
