import { useState, useEffect } from "react";
import {
  getTrainingPlans,
  acceptTrainingPlan,
  rejectTrainingPlan
} from "../../services/trainingPlanService";

function TrainingRequests() {
  const [plans, setPlans] = useState([]);
  const [rejectingPlanId, setRejectingPlanId] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getData() {
    try {
      const response = await getTrainingPlans();
      setPlans(response);
    } catch {
      setError("Failed to load training requests");
    }
  }

  useEffect(() => {
    let active = true;
    getTrainingPlans().then((response) => { if (active) setPlans(response); }).catch(() => { if (active) setError("Failed to load training requests"); });
    return () => { active = false; };
  }, []);

  async function handleAccept(id) {
    setError("");
    setMessage("");

    try {
      await acceptTrainingPlan(id);
      setMessage("Training request accepted successfully");
      setRejectingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    }
  }

  async function handleReject(id) {
    setError("");
    setMessage("");

    if (reason.trim().length < 20) {
      setError("Rejection reason must be at least 20 characters");
      return;
    }

    try {
      await rejectTrainingPlan(id, reason.trim());
      setMessage("Training request rejected successfully");
      setRejectingPlanId(null);
      setReason("");
      await getData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    }
  }

  const pendingPlans = plans.filter((plan) => plan.status === "pending");

  return (
    <div className="instructor-requests-page">
      <div className="page-heading"><span className="section-kicker">Learner enquiries</span><h1>Training requests</h1><p>Review each learner’s selected lesson dates and decide what fits your availability. Accepting creates each lesson separately in Manage Lessons.</p></div>

      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}

      {pendingPlans.length === 0 ? (
        <div className="empty-state"><h2>All caught up</h2><p>New training requests will appear here.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Requested lessons</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingPlans.map((plan) => (
              <tr key={plan._id}>
                <td><strong>{plan.learner?.username || "Learner"}</strong></td>
                <td>{plan.lessonSchedule?.length ? plan.lessonSchedule.map((slot, index) => <span className="schedule-line" key={`${plan._id}-${index}`}>{slot.date} · {slot.startTime}–{slot.endTime} · {slot.hours} hours</span>) : plan.weeklySchedule?.length ? plan.weeklySchedule.map((slot, index) => <span className="schedule-line" key={`${plan._id}-${index}`}>{slot.day} · {slot.startTime || slot.start || "—"}–{slot.endTime || slot.end || "—"} (legacy)</span>) : "Schedule not provided"}</td>
                <td><span className={`status-chip status-${plan.status}`}>{plan.status}</span></td>
                <td>
                  <button onClick={() => handleAccept(plan._id)}>
                    Accept
                  </button>

                  {rejectingPlanId === plan._id ? (
                    <div>
                      <label htmlFor={`reason-${plan._id}`}>
                        Rejection Reason
                      </label>
                      <input
                        id={`reason-${plan._id}`}
                        type="text"
                        minLength={20}
                        maxLength={140}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                      />

                      <button onClick={() => handleReject(plan._id)}>
                        Confirm Rejection
                      </button>

                      <button
                        onClick={() => {
                          setRejectingPlanId(null);
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
                        setRejectingPlanId(plan._id);
                        setReason("");
                        setError("");
                      }}
                    >
                      Reject
                    </button>
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

export default TrainingRequests;
