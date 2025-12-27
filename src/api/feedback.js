// import apiClient from "../utils/apiClient";

import apiClient from "./axiosConfig";

export const getAllFeedback = async () => {
  const response = await apiClient.get("/api/feedback-questions");
  return response.data;
};


export const deleteFeedback = async (id) => {
  const response = await apiClient.delete(`/api/feedback-questions/${id}`);
  return response.data;
};
