import { useEffect, useState } from "react";

import { getTrainingPlans } from "../../services/trainingPlanService"; 

function InstructorPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const data = await getTrainingPlans();
        setPayments(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h1>Instructor Payments</h1>

      {error && <div>{error}</div>}

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div>
          {payments.map((payment) => (
            <div key={payment._id}>
              <div>
                <p><strong>Learner:</strong> {payment.learner?.username || payment.learner?.name || "Learner"}</p>
                <p><strong>Amount:</strong> {payment.amount || "N/A"}</p>
                <p><strong>Status:</strong> {payment.paymentStatus || "Pending"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorPayments;