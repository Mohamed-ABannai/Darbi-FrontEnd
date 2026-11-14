
import { useEffect, useState } from "react";
import { getLessons, cancelLesson, completeLesson } from "../../services/lessonService";

function InstructorLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        const data = await getLessons();
        setLessons(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  async function handleCancel(lessonId) {
    const reason = window.prompt("Reason for cancelling this lesson:");
    if (!reason) return;

    try {
      setError("");
      setActionMessage("");
      await cancelLesson(lessonId, reason);
      setActionMessage("Lesson cancelled.");

      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson._id === lessonId
            ? { ...lesson, status: "cancelled", cancellationReason: reason }
            : lesson
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel the lesson.");
    }
  }

  async function handleComplete(lesson) {
    const hours = window.prompt("Hours taught:", lesson.hours);
    if (!hours || Number(hours) <= 0) return;

    try {
      setError("");
      setActionMessage("");
      await completeLesson(lesson._id, Number(hours));
      setActionMessage("Lesson marked as completed.");

      setLessons((prevLessons) =>
        prevLessons.map((item) =>
          item._id === lesson._id
            ? { ...item, status: "completed", hours: Number(hours) }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete the lesson.");
    }
  }

  let completedHours = 0;
  for (const lesson of lessons) {
    if (lesson.status === "completed") {
      completedHours = completedHours + (lesson.hours || 0);
    }
  }

  if (loading) return <div>Loading instructor lessons...</div>;

  return (
    <div>
      <h1>My Lessons</h1>
      <p>Completed Hours: {completedHours} hrs</p>

      {error && <div className="error">{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <div>
          {lessons.map((lesson) => (
            <div key={lesson._id}>
              <div>
                <p><strong>Date:</strong> {new Date(lesson.date).toLocaleString()}</p>
                <p><strong>Hours:</strong> {lesson.hours} hrs</p>
                <p><strong>Status:</strong> {lesson.status}</p>
                {lesson.cancellationReason && (
                  <p><strong>Cancellation Reason:</strong> {lesson.cancellationReason}</p>
                )}
              </div>

              {lesson.status === "scheduled" && (
                <div>
                  <button onClick={() => handleComplete(lesson)}>
                    Mark Completed
                  </button>
                  <button onClick={() => handleCancel(lesson._id)}>
                    Cancel Lesson
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorLessons;

