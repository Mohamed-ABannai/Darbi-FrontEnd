import { useState, useEffect } from "react";
import { getLessons, cancelLesson, createLesson } from "../../services/lessonService";
import { getTrainingPlans } from "../../services/trainingPlanService";

function LearnerLessons() {
  const [lessons, setLessons] = useState([]);
  const [cancellingLessonId, setCancellingLessonId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [plans, setPlans] = useState([]);
  const [booking, setBooking] = useState({ TrainingPlan: "", date: "", hours: "1" });
  const [saving, setSaving] = useState(false);

  async function loadLessons() {
    try {
      const data = await getLessons();
      if (data) setLessons(data);
      const planData = await getTrainingPlans();
      setPlans(planData.filter((plan) => plan.status === "active"));
      setError("");
    } catch {
      setError("Could not load your lessons. Please refresh the page.");
    }
  }

  async function handleBookLesson(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const response = await createLesson({ ...booking, date: new Date(booking.date).toISOString(), hours: Number(booking.hours) });
      setLessons((currentLessons) => [...currentLessons, response]);
      setBooking({ ...booking, date: "", hours: "1" });
      setMessage("Lesson request sent to your instructor.");
      await loadLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request lesson.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadLessons, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleCancelSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await cancelLesson(cancellingLessonId, cancellationReason);
      setCancellingLessonId(null);
      setCancellationReason("");
      setMessage("Lesson cancelled successfully.");
      await loadLessons();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to cancel lesson.");
      }
    }
  }

  async function beginCancel(id) {
    if (!window.confirm("Cancel this lesson only? Other lessons and your training plan will stay active.")) return;
    setCancellingLessonId(id);
    setCancellationReason("");
  }

  const completedHours = lessons
    .filter((lesson) => lesson.status === "completed")
    .reduce((total, lesson) => total + Number(lesson.hours || 0), 0);

  return (
    <div className="learner-lessons-page">
      <h1>My Lessons</h1>

      <div className="hours-summary">
        <h3>Completed Training Hours: {completedHours} / 22 hrs</h3>
      </div>

      <section>
        <h2>Book a lesson</h2>
        {plans.length === 0 ? <p>Accept a training plan before booking lessons.</p> : <form onSubmit={handleBookLesson}>
          <label htmlFor="plan">Active training plan</label>
          <select id="plan" value={booking.TrainingPlan} onChange={(event) => setBooking({ ...booking, TrainingPlan: event.target.value })} required>
            <option value="">Choose an instructor</option>
            {plans.map((plan) => <option key={plan._id} value={plan._id}>{plan.instructor?.username || "Instructor"}</option>)}
          </select>
          <label htmlFor="lesson-date">Date and time</label>
          <input id="lesson-date" type="datetime-local" value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} required />
          <label htmlFor="lesson-hours">Hours</label>
          <input id="lesson-hours" type="number" min="0.5" max="8" step="0.5" value={booking.hours} onChange={(event) => setBooking({ ...booking, hours: event.target.value })} required />
          <button type="submit" disabled={saving}>{saving ? "Sending…" : "Request lesson"}</button>
        </form>}
      </section>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <hr />

      {error ? null : lessons.length === 0 ? (
        <p>No lessons scheduled yet.</p>
      ) : (
        <div className="lessons-list">
          {lessons.map((oneLesson) => (
            <div key={oneLesson._id} className="lesson-card">
              <p>
                <b>Date & Time:</b> {new Date(oneLesson.date).toLocaleString("en-BH", { timeZone: "Asia/Bahrain" })}
              </p>
              <p><b>Instructor:</b> {oneLesson.TrainingPlan?.instructor?.username || "Instructor"}</p>
              <p>
                <b>Duration:</b> {oneLesson.hours} hours
              </p>
              <p>
                <b>Status:</b> {oneLesson.status === "pending" ? "Awaiting instructor" : oneLesson.status}
              </p>

              {oneLesson.cancellationReason && (
                <p>
                  <b>Cancellation Reason:</b> {oneLesson.cancellationReason}
                </p>
              )}

              {["pending", "scheduled"].includes(oneLesson.status) && (
                <button
                  onClick={() => { setError(""); beginCancel(oneLesson._id); }}
                >
                  Cancel Lesson
                </button>
              )}

              {cancellingLessonId === oneLesson._id && (
                <form onSubmit={handleCancelSubmit} className="cancel-form">
                  <label htmlFor="cancellationReason">Reason for cancellation:</label>
                  <input
                    type="text"
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Enter reason..."
                    required
                  />
                  <button type="submit">Confirm Cancel</button>
                  <button
                    type="button"
                    onClick={() => setCancellingLessonId(null)}
                  >
                    Close
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LearnerLessons;
