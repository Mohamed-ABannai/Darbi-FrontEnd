import { useState, useEffect } from "react";
import { getPayments, updatePayment } from "../../services/paymentService";

function InstructorPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getPayments();
      setPayments(response);
    } catch (err) {
      setError("Failed to load payments");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleStatus(id, status) {
    setError("");
    setMessage("");
    try {
      const response = await updatePayment(id, { status });
      setMessage("Payment updated successfully");
      getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment");
    }
  }

  return (
    <div>
      <h1>Instructor Payments</h1>
      <p>Review and manage learner payments.</p>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.amount} BHD</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status === "pending" && (
                    <div>
                      <button onClick={() => handleStatus(payment._id, "completed")}>Confirm</button>
                      <button onClick={() => handleStatus(payment._id, "rejected")}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InstructorPayments;