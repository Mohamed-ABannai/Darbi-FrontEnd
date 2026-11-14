import { useState, useEffect } from "react";
import {
  getLessons,
  createLesson,
  updateLesson,
  completeLesson,
  cancelLesson
} from "../../services/lessonService";
import { getTrainingPlans } from "../../services/trainingPlanService";

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
      const lessonData = {
        TrainingPlan: formData.TrainingPlan,
        date: formData.date,
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
      date: lesson.date ? lesson.date.slice(0, 16) : "",
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

  return (
    <div>
      <h1>Instructor Lessons</h1>
      <p>Manage your training lessons.</p>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

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
                      ? new Date(lesson.date).toLocaleString()
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
                          <button
                            onClick={() => {
                              setCancellingLessonId(lesson._id);
                              setCancellationReason("");
                            }}
                          >
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