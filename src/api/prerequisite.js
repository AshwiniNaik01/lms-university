import apiClient from "./axiosConfig";

/**
 * Create a new prerequisite
 * @param {Object} prerequisiteData - Payload for creating prerequisite
 * @returns {Promise<Object>}
 */
export const createPrerequisite = async (prerequisiteData) => {
  try {
    const res = await apiClient.post("/api/prerequisite", prerequisiteData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating prerequisite:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};