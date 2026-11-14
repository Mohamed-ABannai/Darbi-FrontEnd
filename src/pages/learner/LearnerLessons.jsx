import { useState, useEffect } from "react";
import { getLessons, cancelLesson } from "../../services/lessonService";

function LearnerLessons() {
  const [lessons, setLessons] = useState([]);
  const [cancellingLessonId, setCancellingLessonId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadLessons() {
    try {
      const data = await getLessons();
      if (data) setLessons(data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  }

  useEffect(() => {
    loadLessons();
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
      loadLessons();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to cancel lesson.");
      }
    }
  }

  const completedHours = lessons
    .filter((lesson) => lesson.status === "completed")
    .reduce((total, lesson) => total + (lesson.hours || 0), 0);

  return (
    <div className="learner-lessons-page">
      <h1>My Lessons</h1>

      <div className="hours-summary">
        <h3>Completed Training Hours: {completedHours} / 22 hrs</h3>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <hr />

      {lessons.length === 0 ? (
        <p>No lessons scheduled yet.</p>
      ) : (
        <div className="lessons-list">
          {lessons.map((oneLesson) => (
            <div key={oneLesson._id} className="lesson-card">
              <p>
                <b>Date & Time:</b> {new Date(oneLesson.date).toLocaleString()}
              </p>
              <p>
                <b>Duration:</b> {oneLesson.hours} hours
              </p>
              <p>
                <b>Status:</b> {oneLesson.status}
              </p>

              {oneLesson.cancellationReason && (
                <p>
                  <b>Cancellation Reason:</b> {oneLesson.cancellationReason}
                </p>
              )}

              {oneLesson.status === "scheduled" && (
                <button
                  onClick={() => {
                    setCancellingLessonId(oneLesson._id);
                    setCancellationReason("");
                    setError("");
                  }}
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