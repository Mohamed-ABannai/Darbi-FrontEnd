import { useState, useEffect } from "react";
import { getAllReviews, deleteReviewById } from "../../services/reviewService";

function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getAllReviews();
      setReviews(response);
    } catch {
      setError("Failed to load reviews");
    }
  }

  useEffect(() => {
    let active = true;
    getAllReviews().then((response) => {
      if (active) setReviews(response);
    }).catch(() => {
      if (active) setError("Failed to load reviews");
    });
    return () => { active = false; };
  }, []);

  async function handleDelete(id) {
    setError("");
    setMessage("");
    try {
      await deleteReviewById(id);
      setMessage("Review deleted successfully");
      getData();
    } catch {
      setError("Failed to delete review");
    }
  }

  return (
    <div className="manage-reviews-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Community feedback</span><h1>Review moderation</h1><p>Read learner feedback in context and remove reviews when moderation is needed.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      {reviews.length === 0 ? <div className="empty-state"><h2>No reviews to moderate</h2><p>Learner feedback will appear here.</p></div> : <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Rating</th>
            <th>Patience</th>
            <th>Raised Voice</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td><span className="review-rating">★ {review.rating} / 5</span></td>
              <td>{review.patience}</td>
              <td>{review.raiseVoice ? "Yes" : "No"}</td>
              <td>{review.comment}</td>
              <td><button className="button-danger" onClick={() => { if (window.confirm("Delete this review? This cannot be undone.")) handleDelete(review._id); }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table></div>}
    </div>
  );
}

export default ManageReviews;
