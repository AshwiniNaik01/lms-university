import { j as apiClient } from "../entry-server.js";
import Cookies from "js-cookie";
const fetchUserProfile = async () => {
  const token = Cookies.get("token");
  console.log("token from profile.js api page", token);
  if (!token) throw new Error("Authentication token not found.");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await apiClient.get("/api/users/profile", config);
  return response.data;
};
const updateUserProfileApi = async (profileData) => {
  const response = await apiClient.put("/api/auth/profile", profileData);
  return response.data;
};
const getStudentById = async (id) => {
  try {
    const response = await apiClient.get(`/api/student/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchStudentDetails = async () => {
  const studentId = Cookies.get("studentId");
  if (!studentId) {
    throw new Error("Student ID not found in cookies");
  }
  try {
    const response = await apiClient.get(`/api/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateStudentProfile = async (id, data) => {
  try {
    const res = await apiClient.put(`/api/student/update/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating student:", err);
    return { success: false };
  }
};
export {
  fetchUserProfile as a,
  updateStudentProfile as b,
  fetchStudentDetails as f,
  getStudentById as g,
  updateUserProfileApi as u
};
