import { useState, useEffect } from "react";
import { getPayments, createPayment, downloadInvoicePdf } from "../../services/paymentService";
import { getLessons } from "../../services/lessonService";

const methods = ["Cash", "benefitPay", "bank transfer"];
const money = (amount) => `${Number(amount || 0).toFixed(3)} BHD`;

function LearnerPayments() {
  const [payments, setPayments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [method, setMethod] = useState("Cash");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadData() {
    const [paymentData, lessonData] = await Promise.all([getPayments(), getLessons()]);
    setPayments(paymentData || []);
    setLessons(lessonData || []);
  }

  useEffect(() => {
    let active = true;
    Promise.all([getPayments(), getLessons()]).then(([paymentData, lessonData]) => {
      if (active) { setPayments(paymentData || []); setLessons(lessonData || []); }
    }).catch(() => { if (active) setError("Could not load payment information. Please refresh the page."); });
    return () => { active = false; };
  }, []);

  const paidOrPending = new Set(payments.filter((payment) => payment.status !== "rejected").map((payment) => String(payment.lesson?._id || payment.lesson)));
  const readyLessons = lessons.filter((lesson) => lesson.status === "completed" && !paidOrPending.has(String(lesson._id)));
  const unsubmittedPayments = payments.filter((payment) => payment.status === "unsubmitted");
  const payableLessons = [...readyLessons, ...unsubmittedPayments.map((payment) => payment.lesson).filter(Boolean)];
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const history = payments.filter((payment) => payment.status === "completed" || payment.status === "rejected");
  const pricedLessons = payableLessons.filter((lesson) => Number(lesson.amountSnapshot) > 0 && Number(lesson.hourlyRateSnapshot) > 0);
  const legacyUnpricedLessons = readyLessons.filter((lesson) => !pricedLessons.includes(lesson));
  const selected = pricedLessons.find((lesson) => lesson._id === selectedLesson);

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setMessage("");
    if (!selected) { setError("Choose a completed lesson with saved pricing first."); return; }
    setBusy(true);
    try {
      await createPayment({ lesson: selected._id, method });
      setSelectedLesson(""); setMessage("Payment request submitted. It is awaiting instructor confirmation.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit the payment request.");
    } finally { setBusy(false); }
  }

  async function handleInvoice(paymentId) {
    try { await downloadInvoicePdf(paymentId); }
    catch (err) { setError(err.response?.data?.message || "Could not download the invoice."); }
  }

  function PaymentCard({ payment }) {
    const lesson = payment.lesson;
    const plan = lesson?.TrainingPlan;
    return <article className="payment-card">
      <div className="record-heading"><div><h3>{plan?.instructor?.username || "Driving instructor"}</h3><p>{lesson?.date ? new Date(lesson.date).toLocaleString() : "Lesson"} · {Number(lesson?.hours || 0)} hours</p></div><span className={`status-chip status-${payment.status}`}>{payment.status === "completed" ? "confirmed" : payment.status}</span></div>
      <p><b>Rate:</b> {money(lesson?.hourlyRateSnapshot || (Number(payment.amount) / Number(lesson?.hours || 1)))}/hour</p>
      <p><b>Total:</b> {money(payment.amount)}</p>
      {payment.method && <p><b>Method:</b> {payment.method}</p>}
      {payment.cancellationReason && <p><b>Reason:</b> {payment.cancellationReason}</p>}
      {payment.status === "unsubmitted" && <p className="field-hint">Choose a payment method below to submit this automatically calculated payment for instructor confirmation.</p>}
      {payment.status === "completed" && <p className="field-hint">Manually confirmed by the instructor; no online payment was processed.</p>}
      {payment.status === "completed" && <button type="button" onClick={() => handleInvoice(payment._id)}>Download invoice</button>}
    </article>;
  }

  return <div className="learner-payments-page">
    <div className="page-heading"><span className="section-kicker">Lesson billing</span><h1>Payments</h1><p>Each total is calculated from the completed lesson duration and the instructor’s saved rate. Submitted payments await confirmation.</p></div>
    {error && <p className="error" role="alert">{error}</p>}{message && <p className="success" role="status">{message}</p>}
    <section className="payment-form-section"><h2>Ready to pay</h2>
      {legacyUnpricedLessons.length > 0 && <p className="field-hint">Some older completed lessons do not have a saved rate snapshot and cannot be billed reliably. Contact your instructor or DARBI support to review those records.</p>}
      {pricedLessons.length === 0 ? <div className="empty-state compact-empty"><p>Completed lessons with saved pricing and no active payment request will appear here.</p></div> : <form onSubmit={handleSubmit}>
        <label htmlFor="payment-lesson">Completed lesson</label>
        <select id="payment-lesson" value={selectedLesson} onChange={(event) => setSelectedLesson(event.target.value)} required>
          <option value="">Choose a completed lesson</option>{pricedLessons.map((lesson) => <option key={lesson._id} value={lesson._id}>{new Date(lesson.date).toLocaleDateString()} · {lesson.hours} hours</option>)}
        </select>
        {selected && <div className="payment-lesson-summary"><p><b>Instructor:</b> {selected.TrainingPlan?.instructor?.username || "Driving instructor"}</p><p><b>Completed:</b> {Number(selected.hours)} hours</p><p><b>Hourly rate:</b> {money(selected.hourlyRateSnapshot)}/hour</p><p><b>Total due:</b> <strong>{money(selected.amountSnapshot)}</strong></p></div>}
        <label htmlFor="payment-method">Payment method</label><select id="payment-method" value={method} onChange={(event) => setMethod(event.target.value)}>{methods.map((item) => <option key={item} value={item}>{item === "benefitPay" ? "BenefitPay" : item === "bank transfer" ? "Bank transfer" : item}</option>)}</select>
        <p className="field-hint">This records your selected payment method for instructor confirmation. No online charge is processed.</p>
        <button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit for confirmation"}</button>
      </form>}
    </section>
    <section className="payments-history-section"><h2>Pending confirmation</h2>{pendingPayments.length ? <div className="payments-list">{pendingPayments.map((payment) => <PaymentCard key={payment._id} payment={payment} />)}</div> : <p>No payments are awaiting confirmation.</p>}</section>
    {unsubmittedPayments.length > 0 && <section className="payments-history-section"><h2>Available payments</h2><div className="payments-list">{unsubmittedPayments.map((payment) => <PaymentCard key={payment._id} payment={payment} />)}</div></section>}
    <section className="payments-history-section"><h2>Payment history</h2>{history.length ? <div className="payments-list">{history.map((payment) => <PaymentCard key={payment._id} payment={payment} />)}</div> : <p>Completed and rejected payments will appear here.</p>}</section>
  </div>;
}

export default LearnerPayments;
