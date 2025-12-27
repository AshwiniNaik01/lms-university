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
 * Register a new trainer (CREATE)
 * POST → /api/trainer/register
 */
export const registerTrainer = async (formData) => {
  try {
    const resp = await apiClient.post(`${BASE_PATH}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
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

/**
 * Update trainer by ID (UPDATE)
 * PUT → /api/trainer/update/:id
 */
export const updateTrainer = async (id, formData) => {
  try {
    const resp = await apiClient.put(`${BASE_PATH}/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
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


/**
 * Update trainer data by ID
 */
// export const updateTrainer = async (id, formData) => {
//   try {
//     const resp = await apiClient.put(`${BASE_PATH}/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     if (resp.data.success) {
//       return resp.data;
//     } else {
//       throw new Error(resp.data.message || 'Update failed');
//     }
//   } catch (error) {
//     console.error('Error in updateTrainer:', error);
//     throw error;
//   }
// };


/**
 * Fetch all trainer profiles
 * Returns an array of { label, value } objects suitable for selects
 */
export const fetchAllTrainerProfiles = async () => {
  try {
    const response = await apiClient.get(`${BASE_PATH}/all-profile`);
    // Map to { label, value } format
    return response.data?.data?.map((t) => ({
      label: t.fullName,
      value: t._id,
    })) || [];
  } catch (error) {
    console.error("Failed to fetch trainers:", error);
    throw error;
  }
};