import { useState, useEffect } from "react";
import { getLessons, createLesson, completeLesson, cancelLesson } from "../../services/lessonService";
import { getTrainingPlans } from "../../services/trainingPlanService";

function InstructorLessons() {
  const [lessons, setLessons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    TrainingPlan: "",
    date: "",
    hours: ""
  });
  const [cancellationReason, setCancellationReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const lessonsResponse = await getLessons();
      const plansResponse = await getTrainingPlans();
      setLessons(lessonsResponse);
      setPlans(plansResponse.filter((plan) => plan.status === "active"));
    } catch (err) {
      setError("Failed to load lessons");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await createLesson(formData);
      setMessage("Lesson created successfully");
      setFormData({ TrainingPlan: "", date: "", hours: "" });
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    }
  }

  async function handleComplete(id) {
    setError("");
    setMessage("");
    try {
      const response = await completeLesson(id);
      setMessage("Lesson completed successfully");
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete lesson");
    }
  }

  async function handleCancel(id) {
    setError("");
    setMessage("");
    try {
      const response = await cancelLesson(id, cancellationReason);
      setMessage("Lesson cancelled successfully");
      setCancellationReason("");
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel lesson");
    }
  }

  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");
  const completedHours = completedLessons.reduce((total, lesson) => total + lesson.hours, 0);

  return (
    <div>
      <h1>Instructor Lessons</h1>
      <p>Manage your lessons and training hours.</p>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <h2>Completed Hours: {completedHours}</h2>
      <h2>Create Lesson</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="TrainingPlan">Training Plan</label>
          <select id="TrainingPlan" name="TrainingPlan" value={formData.TrainingPlan} onChange={handleChange} required>
            <option value="">Select Training Plan</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>{plan.learner?.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Lesson Date</label>
          <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="hours">Hours</label>
          <input id="hours" type="number" name="hours" min="1" value={formData.hours} onChange={handleChange} required />
        </div>
        <button type="submit">Create Lesson</button>
      </form>
      <h2>My Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Cancellation Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson._id}>
                <td>{new Date(lesson.date).toLocaleString()}</td>
                <td>{lesson.hours}</td>
                <td>{lesson.status}</td>
                <td>{lesson.cancellationReason || "-"}</td>
                <td>
                  {lesson.status === "scheduled" && (
                    <div>
                      <button onClick={() => handleComplete(lesson._id)}>Complete</button>
                      <input type="text" placeholder="Cancellation reason" value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} />
                      <button onClick={() => handleCancel(lesson._id)}>Cancel</button>
                    </div>
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

export default InstructorLessons;