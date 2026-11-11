import api from "./api";

async function signUp(formData) {
  const response = await api.post("/auth/sign-up", formData);
  return response.data;
}

async function signIn(formData) {
  const response = await api.post("/auth/sign-in", formData);

  localStorage.setItem("token", response.data.accessToken);

  return response.data.user;
}

async function createAdmin(adminData) {
  const response = await api.post("/auth/create-admin", adminData);
  return response.data;
}

function logout() {
  localStorage.removeItem("token");
}

export {
  signUp,
  signIn,
  createAdmin,
  logout
};