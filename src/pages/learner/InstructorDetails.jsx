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
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInstructor() {
      try {
        const instructorData = await getUserById(id);
        const reviewsData = await getAllReviews(id);
        setInstructor(instructorData);
        setReviews(reviewsData);
      } catch {
        setError("Could not load instructor details.");
      }
    }

    const timer = window.setTimeout(loadInstructor, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createTrainingPlan({ instructor: id });
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
          <p>Send a request to work with this instructor. You can arrange individual lessons after the instructor accepts.</p>
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
