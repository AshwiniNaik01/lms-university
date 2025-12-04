import Cookies from "js-cookie";
import apiClient from "./axiosConfig";

// =================================================================
//      FOR STUDENTS
// =================================================================

const token = Cookies.get("token");
// const token = import.meta.env.VITE_ENV === 'local'
//   ? import.meta.env.VITE_TEST_JWT
//   : Cookies.get('token');

console.log("Using token:", token);

export const fetchMyEnrollments = async (token) => {
  try {
    const response = await apiClient("/api/enrollments/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Axios always returns 2xx in .then
    console.log("API Axios response:", response);

    return response.data.data; // ✅ This is where your array of enrollments is
  } catch (error) {
    console.error("Axios error in fetchMyEnrollments:", error);

    let errorMessage = "Failed to fetch enrollments";

    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

export const enrollInCourseApi = async (courseId, token) => {
  const response = await fetch("/api/enrollments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to enroll in course");
  return data;
};

// Function to unenroll a student from a course
export const unenrollFromCourseApi = async (enrollmentId, token) => {
  const response = await fetch(`/api/enrollments/${enrollmentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to unenroll");
  return data;
};

// Function to mark content as complete
export const markContentCompleteApi = async (
  enrollmentId,
  contentId,
  token
) => {
  const response = await fetch(`/api/enrollments/${enrollmentId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentId }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to mark as complete");
  return data;
};

// Function to mark content as incomplete
export const markContentIncompleteApi = async (
  enrollmentId,
  contentId,
  token
) => {
  const response = await fetch(`/api/enrollments/${enrollmentId}/incomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contentId }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to mark as incomplete");
  return data;
};

// =================================================================
//      FOR ADMINS
// =================================================================

// /**
//  * Fetches all enrollments for the admin dashboard.
//  * @param {string} token - The admin's authentication token.
//  * @returns {Promise<Array>} - A list of all enrollments.
//  */
// export const fetchAllEnrollmentsAdmin = async (token) => {
//     const response = await fetch('/api/enrollments', { // Admin GET request to the base route
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch all enrollments');
//     }
//     return data.data; // Assuming the API returns { success, data: [...] }
// };

export const fetchAllEnrollmentsAdmin = async () => {
  try {
    const response = await apiClient.get("/api/enrollments");
    return response.data.data; // Assuming response.data has { success, data, ... }
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch all enrollments";
    throw new Error(message);
  }
};


/**
 * Delete an enrollment by ID
 * @param {string} enrollmentId - The ID of the enrollment to delete
 * @returns {Promise<object>} - Server response
 */
export const deleteEnrollment = async (enrollmentId) => {
  if (!enrollmentId) throw new Error("Enrollment ID is required");

  try {
    const response = await apiClient.delete(`/api/enrollments/${enrollmentId}`);
    return response.data; // Assuming response.data has { success, data, message }
  } catch (error) {
    console.error(`Error deleting enrollment ${enrollmentId}:`, error.response?.data || error.message);
    const message = error.response?.data?.message || "Failed to delete enrollment";
    throw new Error(message);
  }
};


/**
 * Fetch a single enrollment by ID
 * @param {string} enrollmentId - The ID of the enrollment
 * @returns {Promise<object>} - The enrollment object
 */
export const getEnrollmentById = async (enrollmentId) => {
  if (!enrollmentId) throw new Error("Enrollment ID is required");

  try {
    const res = await apiClient.get(`/api/enrollments/${enrollmentId}`);
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to fetch enrollment");
    }
  } catch (err) {
    console.error(`Error fetching enrollment ${enrollmentId}:`, err.response?.data || err.message);
    const message = err.response?.data?.message || "Failed to fetch enrollment";
    throw new Error(message);
  }
};

/**
 * Create a new enrollment (admin)
 * @param {FormData} formData - Enrollment data
 * @returns {Promise<object>} - Created enrollment
 */
export const createEnrollment = async (formData) => {
  try {
    const res = await apiClient.post("/api/enrollments/admin/enroll", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating enrollment:", err.response?.data || err.message);
    const message = err.response?.data?.message || "Failed to create enrollment";
    throw new Error(message);
  }
};

/**
 * Update an existing enrollment by ID
 * @param {string} enrollmentId - The enrollment ID
 * @param {FormData} formData - Updated enrollment data
 * @returns {Promise<object>} - Updated enrollment
 */
export const updateEnrollment = async (enrollmentId, formData) => {
  if (!enrollmentId) throw new Error("Enrollment ID is required");

  try {
    const res = await apiClient.put(`/api/enrollments/${enrollmentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(`Error updating enrollment ${enrollmentId}:`, err.response?.data || err.message);
    const message = err.response?.data?.message || "Failed to update enrollment";
    throw new Error(message);
  }
};

/**
 * Upload enrollments via Excel
 * @param {Array|Object} excelData - Parsed Excel data
 * @param {string} courseId - Course ID to enroll
 * @param {string} batchId - Batch ID to enroll
 * @returns {Promise<object>} - Server response
 */
export const uploadEnrollments = async (excelData, courseId, batchId) => {
  if (!excelData || !courseId || !batchId) {
    throw new Error("Excel data, course ID, and batch ID are required");
  }

  try {
    const res = await apiClient.post("/api/enrollments/upload", {
      excelData,
      enrolledCourses: courseId,
      enrolledBatches: batchId,
    });

    return res.data; // Assuming res.data has { success, message, data }
  } catch (err) {
    console.error("Error uploading enrollments:", err.response?.data || err.message);
    const message = err.response?.data?.message || "Upload failed";
    throw new Error(message);
  }
};