import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getTrainingPlans,
  cancelTrainingPlan
} from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";
import { getPayments } from "../../services/paymentService";
import { getProfileImage } from "../../services/userService";
import { cancelLesson } from "../../services/lessonService";

function MyTrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [plansLoaded, setPlansLoaded] = useState(false);
  const [cancellingPlanId, setCancellingPlanId] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [lessons, setLessons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [instructorPhotos, setInstructorPhotos] = useState({});
  const [lessonReason, setLessonReason] = useState("");
  const [cancellingLessonId, setCancellingLessonId] = useState(null);

  async function getData() {
    try {
      const planData = await getTrainingPlans();
      setPlans(planData);
      setPlansLoaded(true);
      const [lessonResult, paymentResult] = await Promise.allSettled([getLessons(), getPayments()]);
      if (lessonResult.status === "fulfilled") setLessons(lessonResult.value || []);
      if (paymentResult.status === "fulfilled") setPayments(paymentResult.value || []);
      if (lessonResult.status === "rejected" || paymentResult.status === "rejected") {
        setError("Training plans loaded, but some lesson or payment details could not be loaded.");
      }
      const photoEntries = await Promise.all(planData.map(async (plan) => {
        const instructorId = plan.instructor?._id;
        if (!instructorId) return [plan._id, ""];
        try { return [plan._id, URL.createObjectURL(await getProfileImage(instructorId))]; }
        catch { return [plan._id, ""]; }
      }));
      setInstructorPhotos(Object.fromEntries(photoEntries));
    } catch {
      setError("Failed to load training plans");
      setPlansLoaded(true);
    }
  }

  useEffect(() => {
    let active = true;
    getTrainingPlans().then(async (planData) => {
      if (!active) return;
      setPlans(planData);
      setPlansLoaded(true);
      const [lessonResult, paymentResult] = await Promise.allSettled([getLessons(), getPayments()]);
      if (lessonResult.status === "fulfilled") setLessons(lessonResult.value || []);
      if (paymentResult.status === "fulfilled") setPayments(paymentResult.value || []);
      if (lessonResult.status === "rejected" || paymentResult.status === "rejected") {
        setError("Training plans loaded, but some lesson or payment details could not be loaded.");
      }
      const photoEntries = await Promise.all(planData.map(async (plan) => {
        const instructorId = plan.instructor?._id;
        if (!instructorId) return [plan._id, ""];
        try { return [plan._id, URL.createObjectURL(await getProfileImage(instructorId))]; }
        catch { return [plan._id, ""]; }
      }));
      if (active) setInstructorPhotos(Object.fromEntries(photoEntries));
    }).catch(() => {
      if (active) {
        setError("Failed to load training plans");
        setPlansLoaded(true);
      }
    });
    return () => { active = false; };
  }, []);

  async function handleCancel(id) {
    setError("");
    setMessage("");

    if (!reason.trim()) {
      setError("Please enter a cancellation reason");
      return;
    }

    try {
      await cancelTrainingPlan(id, reason.trim());
      setMessage("Training plan cancelled successfully");
      setCancellingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel training plan");
    }
  }

  async function handleCancelLesson(id) {
    if (!lessonReason.trim()) { setError("Please enter a cancellation reason"); return; }
    try {
      await cancelLesson(id, lessonReason.trim());
      setCancellingLessonId(null); setLessonReason(""); setMessage("Lesson cancelled; the rest of the plan remains active.");
      await getData();
    } catch (err) { setError(err.response?.data?.message || "Failed to cancel lesson"); }
  }

  return (
    <div>
      <div className="page-heading"><span className="section-kicker">Your learning journey</span><h1>My training plans</h1><p>Review your instructor requests and weekly schedule.</p></div>

      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}

      {!plansLoaded ? <p>Loading training plans…</p> : plans.length === 0 && !error ? (
        <div className="empty-state"><h2>Your plan starts here</h2><p>You have no training plans yet. Find an instructor to request your first plan.</p><Link className="button-link" to="/find-instructors">Find instructors</Link></div>
      ) : plans.length > 0 ? (
        <div>
          {plans.map((plan) => (
            <div key={plan._id} className="training-plan-card">
              {(() => {
                const planLessons = lessons.filter((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id));
                const completed = planLessons.filter((lesson) => lesson.status === "completed");
                const completedHours = completed.reduce((total, lesson) => total + Number(lesson.hours || 0), 0);
                const upcoming = planLessons.filter((lesson) => lesson.status === "scheduled" && new Date(lesson.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                const planPayments = payments.filter((payment) => planLessons.some((lesson) => String(lesson._id) === String(payment.lesson?._id || payment.lesson)));
                return <>
              <div className="record-heading"><div className="identity-inline">{instructorPhotos[plan._id] ? <img className="sidebar-avatar-image" src={instructorPhotos[plan._id]} alt="" /> : <span className="profile-initial" aria-hidden="true">{(plan.instructor?.username || "I").charAt(0).toUpperCase()}</span>}<div><span className="section-kicker">Training plan</span><h2>{plan.instructor?.username || "Instructor to be assigned"}</h2></div></div><span className={`status-chip status-${plan.status}`}>{plan.status}</span></div>

              <p>
                <b>Instructor:</b>{" "}
                {plan.instructor?.username || "Not assigned"}
              </p>

              <p>
                <b>Hourly Rate:</b>{" "}
                {(plan.hourlyRateSnapshot || plan.instructor?.hourlyRate) ? `${Number(plan.hourlyRateSnapshot || plan.instructor.hourlyRate).toFixed(3)} BHD` : "N/A"}
              </p>

              {plan.reason && (
                <p>
                  <b>Reason:</b> {plan.reason}
                </p>
              )}

              <div className="plan-progress-summary"><div className="section-title-row"><strong>Training progress</strong><span>{completedHours} / 22 hours</span></div><div className="progress-track" role="progressbar" aria-label={`Training hours for ${plan.instructor?.username || "plan"}`} aria-valuenow={Math.min(22, completedHours)} aria-valuemin="0" aria-valuemax="22"><span style={{ width: `${Math.min(100, Math.max(0, completedHours / 22 * 100))}%` }} /></div><small>{Math.max(0, 22 - completedHours)} hours remaining · {completed.length} completed lessons · {Math.max(0, completedHours).toFixed(1)} total hours</small></div>

              <h3>Weekly Schedule</h3>

              {!plan.weeklySchedule || plan.weeklySchedule.length === 0 ? (
                <p>No weekly schedule available.</p>
              ) : (
                <ul>
                  {plan.weeklySchedule.map((day, index) => (
                    <li key={index}>
                      {day.day}: {day.startTime || day.start || "Time not set"} – {day.endTime || day.end || "Time not set"}
                    </li>
                  ))}
                </ul>
              )}

              <div className="plan-activity-summary"><p><b>Upcoming lesson:</b> {upcoming ? new Date(upcoming.date).toLocaleString("en-BH", { timeZone: "Asia/Bahrain" }) : "None scheduled"}</p><p><b>Payments:</b> {planPayments.length ? planPayments.map((payment) => `${Number(payment.amount || 0).toFixed(3)} BHD · ${payment.status}`).join("; ") : "No payments yet"}</p></div>

              <h3>Individual lessons</h3>
              {planLessons.length ? <ul>{planLessons.slice().sort((a,b) => new Date(a.date)-new Date(b.date)).map((lesson) => <li key={lesson._id}>
                {new Date(lesson.date).toLocaleString("en-BH", { timeZone: "Asia/Bahrain" })} · {lesson.hours} hours · <span className={`status-chip status-${lesson.status}`}>{lesson.status}</span>
                {lesson.status === "scheduled" && plan.status === "active" && (cancellingLessonId === lesson._id ? <span>
                  <input aria-label="Cancellation reason" maxLength={140} value={lessonReason} onChange={(event) => setLessonReason(event.target.value)} placeholder="Cancellation reason" />
                  <button className="button-danger" onClick={() => handleCancelLesson(lesson._id)}>Confirm lesson cancellation</button>
                  <button onClick={() => { setCancellingLessonId(null); setLessonReason(""); }}>Back</button>
                </span> : <button onClick={() => { if (window.confirm("Cancel this lesson only?")) { setCancellingLessonId(lesson._id); setLessonReason(""); } }}>Cancel lesson</button>)}
                {lesson.cancellationReason && <small> · {lesson.cancellationReason}</small>}
              </li>)}</ul> : <p>No lessons scheduled yet.</p>}

              {plan.status === "rejected" && <p>Find another approved instructor to submit a new training request.</p>}
              {(plan.status === "active" || plan.status === "completed") && <div className="plan-actions"><Link to="/lessons">View lessons</Link><Link to="/payments">View payments</Link></div>}

              {(plan.status === "pending" || plan.status === "active") && (
                <div>
                  {cancellingPlanId === plan._id ? (
                    <div>
                      <label htmlFor={`reason-${plan._id}`}>
                        Cancellation Reason
                      </label>
                      <input
                        id={`reason-${plan._id}`}
                        type="text"
                        maxLength={140}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                      />

                      <button className="button-danger" onClick={() => handleCancel(plan._id)}>
                        Confirm Cancellation
                      </button>

                      <button
                        onClick={() => {
                          setCancellingPlanId(null);
                          setReason("");
                          setError("");
                        }}
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCancellingPlanId(plan._id);
                        setReason("");
                        setError("");
                      }}
                    >
                      Cancel Training Plan
                    </button>
                  )}
                </div>
              )}

                </>;
              })()}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default MyTrainingPlans;
