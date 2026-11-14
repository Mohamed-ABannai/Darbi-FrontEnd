
import { useEffect, useState } from "react";
import { getPayments, updatePayment } from "../../services/paymentService";

function InstructorPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const data = await getPayments();
        setPayments(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  async function handlePaymentUpdate(paymentId, newStatus) {
    try {
      setError("");
      setActionMessage("");

      const body = { status: newStatus };

      if (newStatus === "rejected") {
        const reason = window.prompt("Reason for rejecting this payment:");
        if (!reason) return;
        body.cancellationReason = reason;
      }

      await updatePayment(paymentId, body);
      setActionMessage(`Payment ${newStatus}!`);

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update the payment.");
    }
  }

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h1>Instructor Payments</h1>

      {error && <div className="error">{error}</div>}
      {actionMessage && <div>{actionMessage}</div>}

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div>
          {payments.map((payment) => (
            <div key={payment._id}>
              <div>
                <p><strong>Lesson Date:</strong> {payment.lesson?.date ? new Date(payment.lesson.date).toLocaleString() : "N/A"}</p>
                <p><strong>Amount:</strong> {payment.amount} BHD</p>
                <p><strong>Method:</strong> {payment.method}</p>
                <p><strong>Status:</strong> {payment.status}</p>
                {payment.cancellationReason && (
                  <p><strong>Reason:</strong> {payment.cancellationReason}</p>
                )}
              </div>

              {payment.status === "pending" && (
                <div>
                  <button onClick={() => handlePaymentUpdate(payment._id, "completed")}>
                    Confirm
                  </button>
                  <button onClick={() => handlePaymentUpdate(payment._id, "rejected")}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorPayments;

