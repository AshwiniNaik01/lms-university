import apiClient from "./axiosConfig";

// Fetch all batches
export const fetchAllBatches = async () => {
  try {
    const res = await apiClient.get("/api/batches/all");
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching batches:", err);
    const errorMessage =
      err.response?.data?.message || "Failed to fetch batches";
    throw new Error(errorMessage);
  }
};

/**
 * Fetch a batch by its ID
 * @param {string} id - The ID of the batch
 * @returns {Promise<object>} - The batch object
 */
export const fetchBatchById = async (id) => {
  if (!id) throw new Error("Batch ID is required");

  try {
    const res = await apiClient.get(`/api/batches/batches/${id}`);
    const batch = Array.isArray(res.data.data)
      ? res.data.data[0]
      : res.data.data;
    return batch;
  } catch (error) {
    console.error(
      `Error fetching batch ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

/**
 * Create a new batch
 * @param {object} batchData - The batch payload
 * @returns {Promise<object>}
 */
export const createBatch = async (batchData) => {
  try {
    const response = await apiClient.post("/api/batches", batchData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating batch:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

/**
 * Update an existing batch by ID
 * @param {string} id - Batch ID
 * @param {object} batchData - The batch payload
 * @returns {Promise<object>}
 */
export const updateBatch = async (id, batchData) => {
  try {
    const response = await apiClient.put(`/api/batches/${id}`, batchData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating batch ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Fetch batches by course ID
export const fetchBatchesByCourseId = async (courseId) => {
  try {
    const res = await apiClient.get(`/api/batches/${courseId}`);
    if (res.data && res.data.success) {
      return res.data.data || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching batches by course ID:", err);
    const errorMessage =
      err.response?.data?.message || "Failed to fetch batches for this course";
    throw new Error(errorMessage);
  }
};

// Delete a batch
export const deleteBatch = async (id) => {
  const res = await apiClient.delete(`/api/batches/${id}`);
  return res.data;
};

// Fetch batch details by ID
export const fetchActiveBatchById = async (batchId) => {
  const res = await apiClient.get(`/api/batches/batches/${batchId}`);
  const batch = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
  return batch;
};
