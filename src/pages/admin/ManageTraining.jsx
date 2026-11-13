import { useState, useEffect } from "react";
import { getTrainingPlans } from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";

function ManageTraining() {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  async function getData() {
    try {
      const plansResponse = await getTrainingPlans();
      const lessonsResponse = await getLessons();
      setTrainingPlans(plansResponse);
      setLessons(lessonsResponse);
    } catch (err) {
      setError("Failed to load training data");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Manage Training</h1>
      <p>Monitor training plans, lessons, and learner progress.</p>
      {error && <p>{error}</p>}
      <h2>Training Plans</h2>
      <table>
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
              <td>{plan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Lessons</h2>
      <table>
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
              <td>{lesson.TrainingPlan}</td>
              <td>{new Date(lesson.date).toLocaleDateString()}</td>
              <td>{lesson.hours}</td>
              <td>{lesson.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Learner Progress</h2>
      {trainingPlans.map((plan) => (
        <div key={plan._id}>
          <p>{plan.learner?.username} - {plan.instructor?.username}</p>
          <p>Completed Lessons: {lessons.filter((lesson) => lesson.TrainingPlan === plan._id && lesson.status === "completed").length}</p>
        </div>
      ))}
    </div>
  );
}

export default ManageTraining;