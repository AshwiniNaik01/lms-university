import apiClient from "./axiosConfig";

// Admin User Management
// export const fetchAllUsersAdmin = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await apiClient.get(`/api/users`, config);
//     return response.data;
// };


// export const fetchAllUsersAdmin = async () => {
//   try {
//     const response = await apiClient.get('/api/admin/users');
//     return response.data.data || [];
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw error;
//   }
// };



export const fetchAllUsersAdmin = async (token, roleFilter = "") => {
  try {
    const response = await apiClient.post(
      "/api/users",
      { role: roleFilter }, // POST payload
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// export const fetchAllUsersAdmin = async (token) => {
//   const config = { headers: { Authorization: `Bearer ${token}` } };
//   const response = await apiClient.get(`/api/admin/users`, config);

//   // LOG the response to verify structure
//   console.log("Fetched users response:", response.data);

//   // If users are under a `data` field, return only that
//   return response.data.data || []; // <-- Adjust based on real structure
// };

export const fetchUserByIdAdmin = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await apiClient.get(`/api/users/${userId}`, config);
  return response.data;
};

export const updateUserByAdminApi = async (userId, userData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await apiClient.put(
    `/api/users/${userId}`,
    userData,
    config
  );
  return response.data;
};

export const deleteUserByAdminApi = async (userId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await apiClient.delete(`/api/users/${userId}`, config);
  return response.data;
};

// --- START: NAYA FUNCTION ADD KIYA GAYA ---

/**
 * Fetches all test results for all students.
 * @param {string} token - The admin's authentication token.
 * @returns {Promise<Array>} - A promise that resolves to an array of all results.
 */
export const getAllResultsAdmin = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await apiClient.get("/api/tests/all-results", config);
  return response.data;
};

// --- END: NAYA FUNCTION ADD KIYA GAYA ---
