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
