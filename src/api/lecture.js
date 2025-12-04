import apiClient from "./axiosConfig";

/**
 * Create a new lecture
 * @param {FormData} formData - The lecture data including file uploads
 * @returns {Promise<Object>} - Server response
 */
export const createLecture = async (formData) => {
  try {
    const res = await apiClient.post("/api/lectures", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating lecture:", err.response?.data || err.message);
    const errorMessage =
      err.response?.data?.message || "Failed to create lecture";
    throw new Error(errorMessage);
  }
};

/**
 * Update an existing lecture
 * @param {string} lectureId - The ID of the lecture to update
 * @param {FormData} formData - The lecture data including file uploads
 * @returns {Promise<Object>} - Server response
 */
export const updateLecture = async (lectureId, formData) => {
  try {
    const res = await apiClient.put(`/api/lectures/${lectureId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(`Error updating lecture ${lectureId}:`, err.response?.data || err.message);
    const errorMessage =
      err.response?.data?.message || "Failed to update lecture";
    throw new Error(errorMessage);
  }
};


/**
 * Fetch a lecture by ID
 * @param {string} lectureId - The ID of the lecture
 * @returns {Promise<Object>} - The lecture object
 */
export const getLectureById = async (lectureId) => {
  if (!lectureId) throw new Error("Lecture ID is required");

  try {
    const res = await apiClient.get(`/api/lectures/${lectureId}`);
    if (res.data.success && res.data.data) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Lecture not found");
    }
  } catch (err) {
    console.error(`Error fetching lecture ${lectureId}:`, err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || "Failed to fetch lecture";
    throw new Error(errorMessage);
  }
};

/**
 * Fetch all lectures
 * @returns {Promise<Object[]>} - Array of lecture objects
 */
export const fetchLectures = async () => {
  try {
    const res = await apiClient.get("/api/lectures");
    if (res.data.success) {
      return res.data.data || [];
    } else {
      throw new Error(res.data.message || "Failed to fetch lectures");
    }
  } catch (err) {
    console.error("Error fetching lectures:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || "Failed to fetch lectures";
    throw new Error(errorMessage);
  }
};


/**
 * Delete a lecture by ID
 * @param {string} lectureId - The ID of the lecture to delete
 * @returns {Promise<Object>} - The response from the server
 */
export const deleteLecture = async (lectureId) => {
  if (!lectureId) throw new Error("Lecture ID is required");

  try {
    const res = await apiClient.delete(`/api/lectures/${lectureId}`);
    return res.data; // returns { success, data, message }
  } catch (err) {
    console.error(`Error deleting lecture ${lectureId}:`, err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || "Failed to delete lecture";
    throw new Error(errorMessage);
  }
};