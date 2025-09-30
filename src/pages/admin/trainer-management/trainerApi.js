// trainerService.js
import apiClient from "../../../api/axiosConfig";

const BASE_PATH = "/api/trainer";

//  Fetch all trainer profiles.
export const fetchAllTrainers = async () => {
  const response = await apiClient.get(`${BASE_PATH}/all`);
  return response.data?.data || [];
};


//  Approve a trainer by ID.
export const approveTrainer = async (trainerId) => {
  await apiClient.put(`${BASE_PATH}/approve/${trainerId}`, {
    status: "approved",
  });
};

// Delete a trainer by ID.
export const deleteTrainer = async (trainerId) => {
  await apiClient.delete(`${BASE_PATH}/delete/${trainerId}`);
};
 


/**
 * Fetch trainer data by ID
 */
export const fetchTrainerById = async (id) => {
  try {
    const resp = await apiClient.get(`${BASE_PATH}/${id}`);
    if (resp.data && resp.data.success) {
      return resp.data.data;  // Adjust according to your API response structure
    } else {
      throw new Error('Failed to fetch trainer data');
    }
  } catch (error) {
    console.error('Error in fetchTrainerById:', error);
    throw error;
  }
};

/**
 * Update trainer data by ID
 */
export const updateTrainer = async (id, formData) => {
  try {
    const resp = await apiClient.put(`${BASE_PATH}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (resp.data.success) {
      return resp.data;
    } else {
      throw new Error(resp.data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Error in updateTrainer:', error);
    throw error;
  }
};