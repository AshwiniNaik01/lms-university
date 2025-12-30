import { j as apiClient } from "../entry-server.js";
const BASE_PATH = "/api/trainer";
const fetchAllTrainers = async () => {
  const response = await apiClient.get(`${BASE_PATH}/all`);
  return response.data?.data || [];
};
const deleteTrainer = async (trainerId) => {
  await apiClient.delete(`${BASE_PATH}/delete/${trainerId}`);
};
const fetchTrainerById = async (id) => {
  try {
    const resp = await apiClient.get(`${BASE_PATH}/${id}`);
    if (resp.data && resp.data.success) {
      return resp.data.data;
    } else {
      throw new Error("Failed to fetch trainer data");
    }
  } catch (error) {
    console.error("Error in fetchTrainerById:", error);
    throw error;
  }
};
const registerTrainer = async (formData) => {
  try {
    const resp = await apiClient.post(`${BASE_PATH}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (resp.data.success) {
      return resp.data;
    } else {
      throw new Error(resp.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error in registerTrainer:", error);
    throw error;
  }
};
const updateTrainer = async (id, formData) => {
  try {
    const resp = await apiClient.put(`${BASE_PATH}/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (resp.data.success) {
      return resp.data;
    } else {
      throw new Error(resp.data.message || "Update failed");
    }
  } catch (error) {
    console.error("Error in updateTrainer:", error);
    throw error;
  }
};
export {
  fetchTrainerById as a,
  deleteTrainer as d,
  fetchAllTrainers as f,
  registerTrainer as r,
  updateTrainer as u
};
