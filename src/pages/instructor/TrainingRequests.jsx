import { useState, useEffect } from "react";
import { getTrainingPlans, acceptTrainingPlan, rejectTrainingPlan } from "../../services/trainingPlanService";

function TrainingRequests() {
    const [plans, setPlans] = useState([]);
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function getData() {
        try {
            const response = await getTrainingPlans();
            setPlans(response.filter((plan) => plan.status === "pending"));
        } catch (err) {
            setError("Failed to load training requests");
        }
    }

    useEffect(() => {
        getData();
    }, []);

    async function handleAccept(id) {
        setError("");
        setMessage("");
        try {
            const response = await acceptTrainingPlan(id);
            setMessage("Training request accepted successfully");
            getData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to accept request");
        }
    }

    async function handleReject(id) {
        setError("");
        setMessage("");
        try {
            if (reason.trim().length < 20) {
                setError("Rejection reason must be at least 20 characters");
                return;
            }
            const response = await rejectTrainingPlan(id, reason);
            setMessage("Training request rejected successfully");
            setReason("");
            getData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reject request");
        }
    }

    return (
        <div>
            <h1>Training Requests</h1>
            <p>Review learner requests to start training with you.</p>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            {plans.length === 0 ? (
                <p>No pending training requests.</p>
            ) : (
                plans.map((plan) => (
                    <div key={plan._id}>
                        <h3>{plan.learner?.username || "Learner"}</h3>
                        <p>Status: {plan.status}</p>
                        <button onClick={() => handleAccept(plan._id)}>Accept</button>
                        <div>
                            <label htmlFor={`reason-${plan._id}`}>Rejection Reason</label>
                            <input
                                id={`reason-${plan._id}`}
                                type="text"
                                minLength={20}
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                            />
                            <button onClick={() => handleReject(plan._id)}>Reject</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default TrainingRequests;