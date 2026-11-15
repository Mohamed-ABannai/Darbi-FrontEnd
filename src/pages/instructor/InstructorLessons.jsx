import { useState, useEffect } from "react";
import { getLessons, updateLesson, completeLesson, cancelLesson } from "../../services/lessonService";

function InstructorLessons() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadLessons() {
    try {
      const response = await getLessons();
      setLessons(response);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadLessons, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleAccept(id) {
    setError("");
    setMessage("");
    try {
      await updateLesson(id, { status: "scheduled" });
      setMessage("Lesson booking accepted.");
      await loadLessons();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update lesson.");
    }
  }

  async function handleReject(id) {
    setError("");
    setMessage("");
    try {
      await updateLesson(id, { status: "rejected" });
      setMessage("Lesson booking rejected.");
      await loadLessons();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update lesson.");
    }
  }

  async function handleComplete(id) {
    setError("");
    setMessage("");
    try {
      await completeLesson(id);
      setMessage("Lesson completed and payment prepared.");
      await loadLessons();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update lesson.");
    }
  }

  async function handleCancel(id) {
    const reason = window.prompt("Why are you cancelling this lesson?");
    if (!reason?.trim()) return;

    setError("");
    setMessage("");
    try {
      await cancelLesson(id, reason.trim());
      setMessage("Lesson cancelled.");
      await loadLessons();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update lesson.");
    }
  }

  return <div className="instructor-lessons-page">
    <div className="page-heading"><span className="section-kicker">Teaching schedule</span><h1>My lessons</h1><p>Accept lesson requests from learners with active training plans. Complete lessons to record hours and prepare payment.</p></div>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p className="success" role="status">{message}</p>}
    {loading ? <p>Loading lessons…</p> : lessons.length === 0 ? <p>No lesson requests yet.</p> : <div className="table-scroll"><table>
      <thead><tr><th>Learner</th><th>Date and time</th><th>Hours</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{lessons.map((lesson) => <tr key={lesson._id}>
        <td>{lesson.TrainingPlan?.learner?.username || "Learner"}</td>
        <td>{new Date(lesson.date).toLocaleString("en-BH", { timeZone: "Asia/Bahrain" })}</td>
        <td>{lesson.hours}</td><td>{lesson.status}</td>
        <td>
          {lesson.status === "pending" && <><button onClick={() => handleAccept(lesson._id)}>Accept</button><button onClick={() => handleReject(lesson._id)}>Reject</button></>}
          {lesson.status === "scheduled" && <><button onClick={() => handleComplete(lesson._id)}>Complete</button><button onClick={() => handleCancel(lesson._id)}>Cancel</button></>}
        </td>
      </tr>)}</tbody>
    </table></div>}
  </div>;
}

export default InstructorLessons;
