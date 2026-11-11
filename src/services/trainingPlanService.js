import api from "./api";

export async function getTrainingPlans() {
  const response = await api.get("/training-plans");
  return response.data;
}

export async function getTrainingPlanById(id) {
  const response = await api.get(`/training-plans/${id}`);
  return response.data;
}

export async function createTrainingPlan(planData) {
  const response = await api.post("/training-plans", planData);
  return response.data;
}

export async function acceptTrainingPlan(id) {
  const response = await api.put(`/training-plans/${id}`, {
    status: "active"
  });
  return response.data;
}

export async function rejectTrainingPlan(id, reason) {
  const response = await api.put(`/training-plans/${id}`, {
    status: "rejected",
    reason
  });
  return response.data;
}

export async function cancelTrainingPlan(id, reason) {
  const response = await api.put(`/training-plans/${id}`, {
    status: "cancelled",
    reason
  });
  return response.data;
}

export async function transferInstructor(id, instructorId) {
  const response = await api.put(`/training-plans/${id}`, {
    instructor: instructorId
  });
  return response.data;
}

export async function updateWeeklySchedule(id, weeklySchedule) {
  const response = await api.put(`/training-plans/${id}`, {
    weeklySchedule
  });
  return response.data;
}