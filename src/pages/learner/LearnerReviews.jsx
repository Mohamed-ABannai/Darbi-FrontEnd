import { useState, useEffect } from "react";
import {
  getAllReviews,
  createNewReview,
  updateReviewById,
  deleteReviewById,
} from "../../services/reviewService";
import { getTrainingPlans } from "../../services/trainingPlanService";

function LearnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    TrainingPlan: "",
    rating: 5,
    patience: 5,
    raiseVoice: false,
    comment: "",
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const plansData = await getTrainingPlans();
      setPlans(plansData);

      const allReviews = await getAllReviews();
      const myPlanIds = plansData.map((onePlan) => onePlan._id);
      const myReviews = allReviews.filter(
        (oneReview) =>
          oneReview.TrainingPlan &&
          myPlanIds.includes(oneReview.TrainingPlan._id),
      );
      setReviews(myReviews);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        TrainingPlan: formData.TrainingPlan,
        rating: Number(formData.rating),
        patience: Number(formData.patience),
        raiseVoice: formData.raiseVoice,
        comment: formData.comment,
      };

      if (editingReviewId) {
        await updateReviewById(editingReviewId, payload);
        setMessage("Review updated successfully.");
      } else {
        await createNewReview(payload);
        setMessage("Review submitted successfully.");
      }

      setEditingReviewId(null);
      setFormData({
        TrainingPlan: "",
        rating: 5,
        patience: 5,
        raiseVoice: false,
        comment: "",
      });
      loadData();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit review.");
      }
    }
  }

  function handleEditClick(oneReview) {
    setEditingReviewId(oneReview._id);
    setError("");
    setMessage("");
    setFormData({
      TrainingPlan: oneReview.TrainingPlan?._id || "",
      rating: oneReview.rating,
      patience: oneReview.patience,
      raiseVoice: oneReview.raiseVoice || false,
      comment: oneReview.comment || "",
    });
  }

  function handleCancelEdit() {
    setEditingReviewId(null);
    setFormData({
      TrainingPlan: "",
      rating: 5,
      patience: 5,
      raiseVoice: false,
      comment: "",
    });
  }

  async function handleDelete(reviewId) {
    setError("");
    setMessage("");
    try {
      await deleteReviewById(reviewId);
      setMessage("Review deleted successfully.");
      loadData();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to delete review.");
      }
    }
  }

  function getInstructorName(planId) {
    const foundPlan = plans.find((p) => p._id === planId);
    return foundPlan?.instructor?.username || "Instructor";
  }

  return (
    <div className="learner-reviews-page">
      <h1>Instructor Reviews</h1>

      <div className="review-form-section">
        <h2>{editingReviewId ? "Edit Review" : "Write a Review"}</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          {!editingReviewId && (
            <div>
              <label htmlFor="TrainingPlan">Select Training Plan:</label>
              <select
                id="TrainingPlan"
                name="TrainingPlan"
                value={formData.TrainingPlan}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Training Plan --</option>
                {plans.map((onePlan) => (
                  <option key={onePlan._id} value={onePlan._id}>
                    {onePlan.instructor?.username} ({onePlan.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="rating">Overall Rating (1 - 5):</label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="patience">Patience Level (1 - 5):</label>
            <input
              type="number"
              id="patience"
              name="patience"
              min="1"
              max="5"
              value={formData.patience}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="raiseVoice">
              <input
                type="checkbox"
                id="raiseVoice"
                name="raiseVoice"
                checked={formData.raiseVoice}
                onChange={handleChange}
              />
              Did the instructor raise their voice?
            </label>
          </div>

          <div>
            <label htmlFor="comment">Comment (10 - 150 characters):</label>
            <textarea
              id="comment"
              name="comment"
              rows="3"
              minLength={10}
              maxLength={150}
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your feedback about the instructor..."
              required
            />
          </div>

          <button type="submit">
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
          {editingReviewId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <hr />

      <div className="my-reviews-section">
        <h2>My Submitted Reviews</h2>
        {reviews.length === 0 ? (
          <p>You have not submitted any reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((oneReview) => (
              <div key={oneReview._id} className="review-card">
                <h3>
                  Instructor: {getInstructorName(oneReview.TrainingPlan?._id)}
                </h3>
                <p>
                  <b>Rating:</b> {oneReview.rating} / 5
                </p>
                <p>
                  <b>Patience:</b> {oneReview.patience} / 5
                </p>
                <p>
                  <b>Raised Voice:</b> {oneReview.raiseVoice ? "Yes" : "No"}
                </p>
                <p>
                  <b>Comment:</b> {oneReview.comment}
                </p>

                <button onClick={() => handleEditClick(oneReview)}>Edit</button>
                <button onClick={() => handleDelete(oneReview._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnerReviews;
