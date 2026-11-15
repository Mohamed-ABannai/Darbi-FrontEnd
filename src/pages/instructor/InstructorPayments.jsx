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
    } catch {
      setError("Failed to load payments");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(getData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function handleStatus(id, status) {
    setError("");
    setMessage("");
    try {
      await updatePayment(id, { status });
      setMessage("Payment updated successfully");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment");
    }
  }

  return (
    <div className="instructor-payments-page admin-table-page">
      <div className="page-heading"><span className="section-kicker">Payment review</span><h1>Instructor payments</h1><p>Confirm or reject learner payments, then review their payment status here.</p></div>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      {payments.length === 0 ? (
        <div className="empty-state"><h2>No payments yet</h2><p>Learner payment submissions will appear here when ready for review.</p></div>
      ) : (
      <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>Learner / lesson</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
              <td><strong>{payment.lesson?.TrainingPlan?.learner?.username || "Learner"}</strong>{payment.lesson?.date && <small className="table-secondary">{new Date(payment.lesson.date).toLocaleDateString()} · {Number(payment.lesson.hours || 0)} hours</small>}</td>
              <td><strong>{Number(payment.amount || 0).toFixed(3)} BHD</strong><small className="table-secondary">{Number(payment.lesson?.hourlyRateSnapshot || (payment.amount / (payment.lesson?.hours || 1))).toFixed(3)} BHD/hour</small></td>
              <td>{payment.method}</td>
              <td><span className={`status-chip status-${payment.status}`}>{payment.status}</span></td>
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
      </table></div>
      )}
    </div>
  );
}

export default InstructorPayments;
