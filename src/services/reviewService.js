import api from "./api";

const BASE_URL = "/reviews";
async function getAllReviews() {
    try{
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.log("Error.message:", error.message);
    }

}
const createReview = async (reviewData) => {
  const response = await api.post(BASE_URL, reviewData);
  return response.data;
};
const getReviewById = async (id) => {
    try {
        const reviews = await getAllReviews();
        return reviews?.find((review) => review._id === id);
    } catch (error) {
        console.log("Error.message:", error.message);
    }
};
const getReviewsByUserId = async (userId) => {
    try {
        const response = await api.get(BASE_URL, {
            params: { instructor: userId },
        });
        return response.data;
    } catch (error) {
        console.log("Error.message:", error.message);
    }
};
const updateReview = async (id, reviewData) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, reviewData);
        return response.data;
    } catch (error) {
        console.log("Error.message:", error.message);
    }
};
const deleteReview = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.log("Error.message:", error.message);
    }
};

export { getAllReviews, getReviewById, createReview, getReviewsByUserId, updateReview, deleteReview };
