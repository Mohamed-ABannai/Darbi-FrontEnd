import api from "./api";

export async function getLessons() {
  const response = await api.get("/lessons");
  return response.data;
}

export async function getLessonById(id) {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
}

export async function createLesson(lessonData) {
  const response = await api.post("/lessons", lessonData);
  return response.data;
}

export async function updateLesson(id, lessonData) {
  const response = await api.put(`/lessons/${id}`, lessonData);
  return response.data;
}

export async function completeLesson(id) {
  const response = await api.put(`/lessons/${id}`, {
    status: "completed"
  });
  return response.data;
}

export async function cancelLesson(id, cancellationReason) {
  const response = await api.put(`/lessons/${id}`, {
    status: "cancelled",
    cancellationReason
  });
  return response.data;
}

export async function deleteLesson(id) {
  const response = await api.delete(`/lessons/${id}`);
  return response.data;
}