import apiClient from "./axiosConfig";
import Cookies from "js-cookie";

// Dono functions mein token automatically lagega

// export const fetchUserProfile = async () => {
//     try {
//         const response = await apiClient.get('/api/auth/profile');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching user profile:', error.response?.data || error.message);
//         throw error.response?.data || error;
//     }
// };

export const fetchUserProfile = async () => {
  const token = Cookies.get("token");
  // const token = import.meta.env.VITE_TEST_JWT;
  // console.log("token from profile.js api page",token);
  // if (!token) throw new Error('Authentication token not found.');

  // const token = import.meta.env.VITE_ENV === 'local'
  //   ? import.meta.env.VITE_TEST_JWT
  //   : Cookies.get('token');

  console.log("token from profile.js api page", token);

  if (!token) throw new Error("Authentication token not found.");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await apiClient.get("/api/users/profile", config);
  return response.data;
};

export const updateUserProfileApi = async (profileData) => {
  const response = await apiClient.put("/api/auth/profile", profileData);
  return response.data;
};

// src/api/student.js
//Student Profile Page - get data

export const getStudentById = async (id) => {
  try {
    const response = await apiClient.get(`/api/student/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get student details by student id
// src/api/student.js
export const fetchStudentDetails = async () => {
  const studentId = Cookies.get("studentId");

  if (!studentId) {
    throw new Error("Student ID not found in cookies");
  }

  // const url = `${baseUrl}/api/student/${studentId}`;

  try {
    const response = await apiClient.get(`/api/student/${studentId}`);
    return response.data; // adapt this based on your API response structure
  } catch (error) {
    throw error;
  }
};

// 🔹 Update student by ID (PUT) profile page
export const updateStudentProfile = async (id, data) => {
  try {
    const res = await apiClient.put(`/api/student/update/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating student:", err);
    return { success: false };
  }
};
