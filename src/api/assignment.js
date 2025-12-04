import apiClient from "./axiosConfig";
/**
 * Create a new assignment
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const createAssignment = async (formData) => {
  const res = await apiClient.post("/api/assignments/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * Update an existing assignment
 * @param {string} assignmentId
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const updateAssignment = async (assignmentId, formData) => {
  const res = await apiClient.put(
    `/api/assignments/${assignmentId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

/**
 * Fetch a single assignment by ID
 * @param {string} assignmentId
 * @returns {Promise<Object>}
 */
export const getAssignmentById = async (assignmentId) => {
  const res = await apiClient.get(`/api/assignments/${assignmentId}`);
  return res.data; // returns { success, data, message }
};



/**
 * Fetch all assignments
 * @returns {Promise<Object[]>} - Array of assignments
 */
export const fetchAssignments = async () => {
  try {
    const res = await apiClient.get("/api/assignments");
    if (res.data.success) {
      return res.data.data || [];
    } else {
      throw new Error(res.data.message || "Failed to fetch assignments");
    }
  } catch (err) {
    console.error("Error fetching assignments:", err.response?.data || err.message);
    const errorMessage =
      err.response?.data?.message || "Failed to fetch assignments";
    throw new Error(errorMessage);
  }
};


/**
 * Delete an assignment by ID
 * @param {string} assignmentId - The ID of the assignment to delete
 * @returns {Promise<Object>} - The response from the server
 */
export const deleteAssignment = async (assignmentId) => {
  try {
    const res = await apiClient.delete(`/api/assignments/${assignmentId}`);
    return res.data; // returns { success, data, message }
  } catch (err) {
    console.error(`Error deleting assignment ${assignmentId}:`, err.response?.data || err.message);
    const errorMessage =
      err.response?.data?.message || "Failed to delete assignment";
    throw new Error(errorMessage);
  }
};