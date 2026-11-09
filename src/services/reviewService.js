import api from "./api";

export async function getAllReviews(instructorId) {
        const response = await api.get("/reviews", {
            params: instructorId ? { instructor: instructorId } : undefined,
        });
        return response.data;
    }

export async function createNewReview(newReview) {
    const response = await api.post("/reviews", newReview);
    return response.data;
}

export async function updateReviewById(id, updatedReview) {
    const response = await api.put(`/reviews/${id}`, updatedReview);
    return response.data;
}
export async function deleteReviewById(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
}

