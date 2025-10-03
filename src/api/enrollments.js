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
