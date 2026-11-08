import api from "./api";

async function getLessons() {
  try {
    const response = await api.get("/lessons");
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }
}

async function getLessonById(id) {
  try {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }
}

async function cancelLesson(id, cancellationReason) {
  try {
    const response = await api.put(`/lessons/${id}`, {
      status: "cancelled",
      cancellationReason,
    });
    return response.data;
  } catch (error) {
    console.error("Error cancelling lesson:", error);
  }
}

export { getLessons, getLessonById, cancelLesson };
