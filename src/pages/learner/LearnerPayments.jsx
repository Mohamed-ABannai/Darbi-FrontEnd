import { useState, useEffect } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  downloadInvoicePdf,
} from "../../services/paymentService";
import { getLessons } from "../../services/lessonService";
import { getTrainingPlans } from "../../services/trainingPlanService";

function LearnerPayments() {
  const [payments, setPayments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [plans, setPlans] = useState([]);

  const [formData, setFormData] = useState({
    lesson: "",
    amount: "",
    method: "Cash",
  });

  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const paymentsData = await getPayments();
      if (paymentsData) setPayments(paymentsData);

      const lessonsData = await getLessons();
      if (lessonsData) setLessons(lessonsData);

      const plansData = await getTrainingPlans();
      if (plansData) setPlans(plansData);
    } catch (err) {
      console.error("Error loading payments data:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleLessonSelect(event) {
    const selectedLessonId = event.target.value;
    const foundLesson = lessons.find((oneLesson) => oneLesson._id === selectedLessonId);

    let calculatedAmount = "";
    if (foundLesson) {
      const foundPlan = plans.find((onePlan) => onePlan._id === foundLesson.TrainingPlan);
      const hourlyRate = foundPlan?.instructor?.hourlyRate || 0;
      calculatedAmount = foundLesson.hours * hourlyRate;
    }

    setFormData({
      ...formData,
      lesson: selectedLessonId,
      amount: calculatedAmount,
    });
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingPaymentId) {
        await updatePayment(editingPaymentId, {
          amount: Number(formData.amount),
          method: formData.method,
        });
        setMessage("Payment updated successfully.");
      } else {
        await createPayment({
          lesson: formData.lesson,
          amount: Number(formData.amount),
          method: formData.method,
        });
        setMessage("Payment submitted successfully. Waiting for confirmation.");
      }

      setEditingPaymentId(null);
      setFormData({
        lesson: "",
        amount: "",
        method: "Cash",
      });
      loadData();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to submit payment.");
      }
    }
  }

  function handleEditClick(onePayment) {
    setEditingPaymentId(onePayment._id);
    setError("");
    setMessage("");
    setFormData({
      lesson: onePayment.lesson?._id || "",
      amount: onePayment.amount,
      method: onePayment.method,
    });
  }

  function handleCancelEdit() {
    setEditingPaymentId(null);
    setFormData({
      lesson: "",
      amount: "",
      method: "Cash",
    });
  }

  async function handleDownloadInvoice(invoiceId) {
    try {
      await downloadInvoicePdf(invoiceId);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Failed to download invoice.");
      }
    }
  }

  const paidLessonIds = payments
    .filter((p) => p.status === "pending" || p.status === "completed")
    .map((p) => p.lesson?._id);

  const unpaidLessons = lessons.filter(
    (oneLesson) =>
      oneLesson.status !== "cancelled" && !paidLessonIds.includes(oneLesson._id)
  );

  return (
    <div className="learner-payments-page">
      <h1>My Payments</h1>

      <div className="payment-form-section">
        <h2>{editingPaymentId ? "Update Pending Payment" : "Make a Payment"}</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          {!editingPaymentId && (
            <div>
              <label htmlFor="lesson">Select Lesson:</label>
              <select
                id="lesson"
                name="lesson"
                value={formData.lesson}
                onChange={handleLessonSelect}
                required
              >
                <option value="">-- Choose Lesson --</option>
                {unpaidLessons.map((oneLesson) => (
                  <option key={oneLesson._id} value={oneLesson._id}>
                    {new Date(oneLesson.date).toLocaleDateString()} -{" "}
                    {oneLesson.hours} hrs ({oneLesson.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="amount">Amount (BHD):</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              step="0.5"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="method">Payment Method:</label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
            >
              <option value="Cash">Cash</option>
              <option value="benefitPay">BenefitPay</option>
              <option value="bank transfer">Bank Transfer</option>
            </select>
          </div>

          <button type="submit">
            {editingPaymentId ? "Update Payment" : "Submit Payment"}
          </button>
          {editingPaymentId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <hr />

      <div className="payments-history-section">
        <h2>Payment History</h2>
        {payments.length === 0 ? (
          <p>No payments recorded yet.</p>
        ) : (
          <div className="payments-list">
            {payments.map((onePayment) => (
              <div key={onePayment._id} className="payment-card">
                <p>
                  <b>Lesson Date:</b>{" "}
                  {onePayment.lesson?.date
                    ? new Date(onePayment.lesson.date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <b>Hours:</b> {onePayment.lesson?.hours} hrs
                </p>
                <p>
                  <b>Amount:</b> {onePayment.amount} BHD
                </p>
                <p>
                  <b>Method:</b> {onePayment.method}
                </p>
                <p>
                  <b>Status:</b> {onePayment.status}
                </p>

                {onePayment.cancellationReason && (
                  <p>
                    <b>Rejection Reason:</b> {onePayment.cancellationReason}
                  </p>
                )}

                {onePayment.status === "pending" && (
                  <button onClick={() => handleEditClick(onePayment)}>
                    Edit Payment
                  </button>
                )}

                {onePayment.status === "completed" && onePayment.invoice && (
                  <button
                    onClick={() => handleDownloadInvoice(onePayment.invoice._id)}
                  >
                    Download Invoice PDF
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnerPayments;