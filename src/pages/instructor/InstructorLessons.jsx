import { useState, useEffect } from "react";
import {
  getLessons,
  createLesson,
  updateLesson,
  completeLesson,
  cancelLesson
} from "../../services/lessonService";
import { getTrainingPlans, schedulePlanLessons } from "../../services/trainingPlanService";

function toDateTimeLocalValue(date) {
  if (!date) return "";
  const localDate = new Date(date);
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function getDateTimeLocalMinimum() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function InstructorLessons() {
  const [lessons, setLessons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    TrainingPlan: "",
    date: "",
    hours: ""
  });
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [cancellingLessonId, setCancellingLessonId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const lessonsResponse = await getLessons();
      setLessons(lessonsResponse);
      const plansResponse = await getTrainingPlans();
      setPlans(plansResponse);
    } catch {
      setError("Failed to load lessons");
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([getLessons(), getTrainingPlans()]).then(([lessonsResponse, plansResponse]) => {
      if (!active) return;
      setLessons(lessonsResponse);
      setPlans(plansResponse);
    }).catch(() => {
      if (active) setError("Failed to load lessons");
    });
    return () => { active = false; };
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

    const lessonDate = new Date(formData.date);
    if (Number.isNaN(lessonDate.getTime()) || lessonDate <= new Date()) {
      setError("Choose a future lesson date and time.");
      return;
    }

    try {
      const lessonData = {
        TrainingPlan: formData.TrainingPlan,
        date: lessonDate.toISOString(),
        hours: Number(formData.hours)
      };

      if (editingLessonId) {
        await updateLesson(editingLessonId, lessonData);
        setMessage("Lesson updated successfully");
      } else {
        await createLesson(lessonData);
        setMessage("Lesson created successfully");
      }

      setEditingLessonId(null);
      setFormData({
        TrainingPlan: "",
        date: "",
        hours: ""
      });
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lesson");
    }
  }

  function handleEdit(lesson) {
    setEditingLessonId(lesson._id);
    setCancellingLessonId(null);
    setCancellationReason("");
    setError("");
    setMessage("");
    setFormData({
      TrainingPlan: lesson.TrainingPlan?._id || lesson.TrainingPlan || "",
      date: toDateTimeLocalValue(lesson.date),
      hours: lesson.hours || ""
    });
  }

  function handleCancelEdit() {
    setEditingLessonId(null);
    setFormData({
      TrainingPlan: "",
      date: "",
      hours: ""
    });
  }

  async function handleComplete(id) {
    setError("");
    setMessage("");

    try {
      await completeLesson(id);
      setMessage("Lesson completed successfully");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete lesson");
    }
  }

  async function handleCancel(id) {
    setError("");
    setMessage("");

    if (!cancellationReason.trim()) {
      setError("Please enter a cancellation reason");
      return;
    }

    try {
      await cancelLesson(id, cancellationReason);
      setMessage("Lesson cancelled successfully");
      setCancellationReason("");
      setCancellingLessonId(null);
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel lesson");
    }
  }

  async function confirmCancel(id) {
    if (!window.confirm("Cancel this lesson only? The training plan and its other lessons will stay unchanged.")) return;
    setCancellingLessonId(id);
    setCancellationReason("");
  }

  async function handleSchedulePlan(id) {
    setError("");
    setMessage("");
    try {
      await schedulePlanLessons(id);
      setMessage("Upcoming lessons scheduled from the learner’s weekly plan.");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not schedule lessons for this plan.");
    }
  }

  return (
    <div className="instructor-lessons-page">
      <div className="page-heading"><span className="section-kicker">Teaching schedule</span><h1>Manage lessons</h1><p>Accepted plans schedule the learner’s selected dates as individual lessons. Record completion or cancellation separately for each session.</p></div>

      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}

      {plans.filter((plan) => plan.status === "active" && !lessons.some((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id))).map((plan) => (
        <div className="empty-state compact-empty" key={`schedule-${plan._id}`}>
          <p>No lessons are scheduled yet for {plan.learner?.username || "this learner"}.</p>
          <button type="button" onClick={() => handleSchedulePlan(plan._id)}>Schedule upcoming weekly lessons</button>
        </div>
      ))}

      <h2>{editingLessonId ? "Edit Lesson" : "Create Lesson"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="TrainingPlan">Training Plan</label>
          <select
            id="TrainingPlan"
            name="TrainingPlan"
            value={formData.TrainingPlan}
            onChange={handleChange}
            required
          >
            <option value="">Select Training Plan</option>
            {plans.filter((plan) => plan.status === "active").map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.learner?.username || "Learner"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">Lesson Date and Time</label>
          <input
            id="date"
            type="datetime-local"
            min={getDateTimeLocalMinimum()}
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="hours">Lesson Hours</label>
          <input
            id="hours"
            type="number"
            name="hours"
            min="1"
            value={formData.hours}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {editingLessonId ? "Update Lesson" : "Create Lesson"}
        </button>

        {editingLessonId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>

      <h2>My Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.map((lesson) => {
              const plan = plans.find(
                (onePlan) =>
                  onePlan._id ===
                  (lesson.TrainingPlan?._id || lesson.TrainingPlan)
              );

              return (
                <tr key={lesson._id}>
                  <td>{plan?.learner?.username || "Learner"}</td>
                  <td>
                    {lesson.date
                      ? new Date(lesson.date).toLocaleString("en-BH", { timeZone: "Asia/Bahrain" })
                      : "Not scheduled"}
                  </td>
                  <td>{lesson.hours}</td>
                  <td>{lesson.status}</td>
                  <td>
                    {lesson.status === "scheduled" && (
                      <div>
                        <button onClick={() => handleEdit(lesson)}>
                          Edit
                        </button>

                        <button onClick={() => handleComplete(lesson._id)}>
                          Complete
                        </button>

                        {cancellingLessonId === lesson._id ? (
                          <div>
                            <label htmlFor={`reason-${lesson._id}`}>
                              Cancellation Reason
                            </label>
                            <input
                              id={`reason-${lesson._id}`}
                              type="text"
                              value={cancellationReason}
                              onChange={(event) =>
                                setCancellationReason(event.target.value)
                              }
                            />

                            <button onClick={() => handleCancel(lesson._id)}>
                              Confirm Cancellation
                            </button>

                            <button
                              onClick={() => {
                                setCancellingLessonId(null);
                                setCancellationReason("");
                              }}
                            >
                              Back
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => confirmCancel(lesson._id)}>
                            Cancel Lesson
                          </button>
                        )}
                      </div>
                    )}

                    {lesson.status === "cancelled" &&
                      lesson.cancellationReason && (
                        <p>Reason: {lesson.cancellationReason}</p>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InstructorLessons;
