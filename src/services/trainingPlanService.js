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

export async function cancelTrainingPlan(id, reason) {
  const response = await api.put(`/training-plans/${id}`, {
    status: "cancelled",
    reason,
  });
  return response.data;
}
export async function transferInstructor(id, instructorId) {
  const response = await api.put(`/training-plans/${id}`, {
    instructor: instructorId,
  });
  return response.data;
}