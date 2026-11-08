import api from "./api";

async function getInstructors() {
  const response = await api.get("/users");
  return response.data;
}

async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

async function updateProfile(id, formData) {
  const response = await api.put(`/users/${id}`, formData);
  return response.data;
}

export { getInstructors, getUserById, updateProfile };