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
  const [weeklySchedule, setWeeklySchedule] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const instructorData = await getUserById(id);
      setInstructor(instructorData);

      const reviewsData = await getAllReviews(id);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error loading instructor details:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await createTrainingPlan({
        instructor: id,
        weeklySchedule: weeklySchedule,
      });
      navigate("/my-plans");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send request.");
    }
  }

  return (
    <div className="instructor-details-page">
      <button onClick={() => navigate(-1)}>Back</button>

      {instructor && (
        <div className="instructor-info">
          <h1>{instructor.username}</h1>
          <p>Rate: ${instructor.hourlyRate} / hour</p>
          {instructor.availability && (
            <p>Available from: {new Date(instructor.availability).toLocaleDateString()}</p>
          )}
        </div>
      )}

      <hr />

      <div className="request-section">
        <h2>Request Training Plan</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="weeklySchedule">Choose Start Date & Time:</label>
          <input
            type="datetime-local"
            id="weeklySchedule"
            name="weeklySchedule"
            value={weeklySchedule}
            onChange={(e) => setWeeklySchedule(e.target.value)}
            required
          />
          <button type="submit">Send Request</button>
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
              <p>Rating: {oneReview.rating} / 5</p>
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