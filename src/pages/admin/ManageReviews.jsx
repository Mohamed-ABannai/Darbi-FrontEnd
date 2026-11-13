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
    } catch (err) {
      setError("Failed to load reviews");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleDelete(id) {
    setError("");
    setMessage("");
    try {
      const response = await deleteReviewById(id);
      setMessage("Review deleted successfully");
      getData();
    } catch (err) {
      setError("Failed to delete review");
    }
  }

  return (
    <div>
      <h1>Manage Reviews</h1>
      <p>View and remove learner reviews.</p>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <table>
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
              <td>{review.rating}</td>
              <td>{review.patience}</td>
              <td>{review.raiseVoice ? "Yes" : "No"}</td>
              <td>{review.comment}</td>
              <td><button onClick={() => handleDelete(review._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageReviews;