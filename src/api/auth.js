import apiClient from "./axiosConfig";
/**
 * User ko register karta hai
 */
// export const register = async (formData) => {
//   try {
//     // SAHI URL: http://localhost:5001/api/auth/register
//     // URL se '.js' hata diya gaya hai
//     const response = await apiClient.post(`/api/auth/register`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Register Error:", error.response?.data || error.message);
//     throw (
//       error.response?.data || {
//         success: false,
//         message: "Server error during registration.",
//       }
//     );
//   }
// };



// POST: Register a student
// export const registerStudent = async (formData) => {
//   const response = await apiClient.post('/api/student/register', formData);
//   return response.data;
// };

export const register = async (formData) => {
  try {
    const response = await apiClient.post(`/api/auth/register`, formData, {
      headers: {
        "Content-Type": "application/json", // ✅ Correct for JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Register Error:", error.response?.data || error.message);
    throw (
      error.response?.data || {
        success: false,
        message: "Server error during registration.",
      }
    );
  }
};


/**
 * User ko login karta hai
 */
// export const login = async (email, password, faceImageBase64) => {
//   try {
//     // SAHI URL: http://localhost:5001/api/auth/login
//     // URL se '.js' hata diya gaya hai
//     const response = await apiClient.post(`/api/auth/login`, {
//       email,
//       password,
//       // faceImageBase64,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Login Error:", error.response?.data || error.message);
//     throw (
//       error.response?.data || {
//         success: false,
//         message: "Server error during login.",
//       }
//     );
//   }
// };

// api/auth.js


export const login = async (email, password, role) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, {
      email,
      password,
       role,
    });
    return response.data; // { success, token, user }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Server error during login.",
      }
    );
  }
};


/**
 * Email verification token ko backend par bhejta hai
 */
export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.get(`/api/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error(
      "API Verify Email Error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        success: false,
        message: "Server error during email verification.",
      }
    );
  }
};
