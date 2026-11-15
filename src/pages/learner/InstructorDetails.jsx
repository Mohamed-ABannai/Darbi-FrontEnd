import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getUserById } from "../../services/userService";
import { getAllReviews } from "../../services/reviewService";
import { createTrainingPlan } from "../../services/trainingPlanService";

function InstructorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [lessons, setLessons] = useState([{ date: "", startTime: "09:00", endTime: "11:00" }]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getUserById(id), getAllReviews(id)]).then(([instructorData, reviewsData]) => {
      if (!active) return;
      setInstructor(instructorData);
      setReviews(reviewsData);
    }).catch((err) => {
      console.error("Error loading instructor details:", err);
    });
    return () => { active = false; };
  }, [id]);

  function handleScheduleChange(index, e) {
    setLessons((current) => current.map((lesson, i) => i === index ? { ...lesson, [e.target.name]: e.target.value } : lesson));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createTrainingPlan({
        instructor: id,
        lessonSchedule: lessons,
      });
      navigate("/my-plans");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="instructor-details-page">
      <button className="back-link" onClick={() => navigate(-1)}>← Back to instructors</button>

      {instructor && (
        <div className="instructor-info profile-feature">
          <span className="profile-initial profile-initial-large" aria-hidden="true">{(instructor.username || "I").charAt(0).toUpperCase()}</span>
          <div><span className="section-kicker">Driving instructor</span><h1>{instructor.username}</h1>
          <p className="rate-display">{instructor.hourlyRate ? <><strong>{Number(instructor.hourlyRate).toFixed(3)} BHD</strong> / hour</> : "Rate not provided"}</p>
          {instructor.availability && (
            <p>
              Available from: {new Date(instructor.availability).toLocaleDateString()}
            </p>
          )}</div>
        </div>
      )}

      <hr />

      <div className="request-section">
        <h2>Request Training Plan</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            {lessons.map((lesson, index) => <fieldset key={index}>
              <legend>Lesson {index + 1}</legend>
              <label>Date<input type="date" name="date" value={lesson.date} min={new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bahrain" })} onChange={(event) => handleScheduleChange(index, event)} required /></label>
              <label>Start time<input type="time" name="startTime" value={lesson.startTime} onChange={(event) => handleScheduleChange(index, event)} required /></label>
              <label>End time<input type="time" name="endTime" value={lesson.endTime} onChange={(event) => handleScheduleChange(index, event)} required /></label>
              <p>{lesson.date || "Choose a date"} · {lesson.startTime}–{lesson.endTime} · {lesson.startTime < lesson.endTime ? ( (Number(lesson.endTime.slice(0,2))*60+Number(lesson.endTime.slice(3))-Number(lesson.startTime.slice(0,2))*60-Number(lesson.startTime.slice(3)))/60).toFixed(2) : "Invalid duration"} hours · {instructor?.username || "Instructor"}</p>
              {lessons.length > 1 && <button type="button" onClick={() => setLessons((current) => current.filter((_, i) => i !== index))}>Remove lesson</button>}
            </fieldset>)}
            <button type="button" onClick={() => setLessons((current) => [...current, { date: "", startTime: "09:00", endTime: "11:00" }])}>Add lesson</button>
          </div>

          <button type="submit" disabled={submitting}>{submitting ? "Sending request…" : "Send training request"}</button>
        </form>
      </div>

      <hr />

      <div className="reviews-section">
        <h2>Instructor Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet for this instructor.</p>
        ) : (
          reviews.map((oneReview) => (
            <div key={oneReview._id} className="review-card">
              <p className="review-rating"><span aria-label={`${oneReview.rating} out of 5 stars`}>★</span> {oneReview.rating} / 5</p>
              <p>Patience: {oneReview.patience} / 5</p>
              {oneReview.raiseVoice && <p>Raised Voice: Yes</p>}
              <p>Comment: {oneReview.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InstructorDetails;
