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
  const [schedule, setSchedule] = useState({
    day: "Sunday",
    startTime: "09:00",
    endTime: "11:00",
  });
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

  function handleScheduleChange(e) {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await createTrainingPlan({
        instructor: id,
        weeklySchedule: [schedule],
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
            <p>
              Available from: {new Date(instructor.availability).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <hr />

      <div className="request-section">
        <h2>Request Training Plan</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="day">Preferred Day:</label>
            <select
              id="day"
              name="day"
              value={schedule.day}
              onChange={handleScheduleChange}
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div>
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={schedule.startTime}
              onChange={handleScheduleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={schedule.endTime}
              onChange={handleScheduleChange}
              required
            />
          </div>

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