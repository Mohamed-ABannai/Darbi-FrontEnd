import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getTrainingPlans
} from "../../services/trainingPlanService";
import { getLessons } from "../../services/lessonService";
import { getPayments } from "../../services/paymentService";
import { getProfileImage } from "../../services/userService";
import { cancelLesson } from "../../services/lessonService";

function MyTrainingPlans() {
  const [plans, setPlans] = useState([]);
  const [plansLoaded, setPlansLoaded] = useState(false);
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
      let lessonDetailsLoaded = true;
      let paymentDetailsLoaded = true;
      try {
        const lessonData = await getLessons();
        setLessons(lessonData || []);
      } catch {
        lessonDetailsLoaded = false;
      }
      try {
        const paymentData = await getPayments();
        setPayments(paymentData || []);
      } catch {
        paymentDetailsLoaded = false;
      }
      if (!lessonDetailsLoaded || !paymentDetailsLoaded) {
        setError("Training plans loaded, but some lesson or payment details could not be loaded.");
      }
      const photos = {};
      for (const plan of planData) {
        const instructorId = plan.instructor?._id;
        if (!instructorId) {
          photos[plan._id] = "";
          continue;
        }
        try {
          const image = await getProfileImage(instructorId);
          photos[plan._id] = URL.createObjectURL(image);
        } catch {
          photos[plan._id] = "";
        }
      }
      setInstructorPhotos(photos);
    } catch {
      setError("Failed to load training plans");
      setPlansLoaded(true);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(getData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(instructorPhotos).forEach((photoUrl) => {
        if (photoUrl) URL.revokeObjectURL(photoUrl);
      });
    };
  }, [instructorPhotos]);

  function beginLessonCancellation(id) {
    if (!window.confirm("Cancel this lesson only? The training plan and other lessons will stay active.")) return;
    setError("");
    setCancellingLessonId(id);
    setLessonReason("");
  }

  function closeLessonCancellation() {
    setCancellingLessonId(null);
    setLessonReason("");
  }

  async function handleCancelLesson(id) {
    if (!lessonReason.trim()) {
      setError("Please enter a cancellation reason");
      return;
    }

    setError("");
    setMessage("");
    try {
      await cancelLesson(id, lessonReason.trim());
      closeLessonCancellation();
      setMessage("Lesson cancelled; the rest of the plan remains active.");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel lesson");
    }
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
          {plans.map((plan) => {
            const planLessons = lessons.filter((lesson) => String(lesson.TrainingPlan?._id || lesson.TrainingPlan) === String(plan._id));
            const completed = planLessons.filter((lesson) => lesson.status === "completed");
            const completedHours = completed.reduce((total, lesson) => total + Number(lesson.hours || 0), 0);
            const upcoming = planLessons.filter((lesson) => lesson.status === "scheduled" && new Date(lesson.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
            const planPayments = payments.filter((payment) => planLessons.some((lesson) => String(lesson._id) === String(payment.lesson?._id || payment.lesson)));

            return (
              <div key={plan._id} className="training-plan-card">
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
                {["pending", "scheduled"].includes(lesson.status) && plan.status === "active" && (cancellingLessonId === lesson._id ? <span>
                  <input aria-label="Cancellation reason" maxLength={140} value={lessonReason} onChange={(event) => setLessonReason(event.target.value)} placeholder="Cancellation reason" />
                  <button className="button-danger" onClick={() => handleCancelLesson(lesson._id)}>Confirm lesson cancellation</button>
                  <button onClick={closeLessonCancellation}>Back</button>
                </span> : <button onClick={() => beginLessonCancellation(lesson._id)}>Cancel lesson</button>)}
                {lesson.cancellationReason && <small> · {lesson.cancellationReason}</small>}
              </li>)}</ul> : <p>No lessons scheduled yet.</p>}

              {plan.status === "rejected" && <p>Find another approved instructor to submit a new training request.</p>}
              {(plan.status === "active" || plan.status === "completed") && <div className="plan-actions"><Link to="/lessons">View lessons</Link><Link to="/payments">View payments</Link></div>}

              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default MyTrainingPlans;
