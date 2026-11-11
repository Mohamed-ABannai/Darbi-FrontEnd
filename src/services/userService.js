import api from "./api";

export async function getInstructors() {
  const response = await api.get("/users");
  return response.data;
}

export async function getUsers() {
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

export async function getProfileImage(id) {
  const response = await api.get(`/users/${id}/image`, {
    responseType: "blob"
  });
  return response.data;
}

export async function getInstructorDocuments(id) {
  const response = await api.get(`/users/${id}/documents`, {
    responseType: "blob"
  });
  return response.data;
}

export async function approveInstructor(id) {
  const response = await api.put(`/users/${id}`, {
    isApproved: true
  });
  return response.data;
}

export async function updateUserStatus(id, userData) {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

export async function deactivateUser(id) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}