import api from "./api";

export async function getInstructors() {
  const response = await api.get("/users");
  return response.data;
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function updateProfile(id, formData) {
  const response = await api.put(`/users/${id}`, formData);
  return response.data;
}

