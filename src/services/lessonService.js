import api from "./api";

async function getLessons() {
  const response = await api.get("/lessons");
  return response.data;
}

async function getLessonById(id) {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
}

async function cancelLesson(id, cancellationReason) {
  const response = await api.put(`/lessons/${id}`, {
    status: "cancelled",
    cancellationReason,
  });
  return response.data;
}

export { getLessons, getLessonById, cancelLesson };
