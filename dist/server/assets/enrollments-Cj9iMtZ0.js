import Cookies from "js-cookie";
import { j as apiClient } from "../entry-server.js";
const token = Cookies.get("token");
console.log("Using token:", token);
const fetchMyEnrollments = async (token2) => {
  try {
    const response = await apiClient("/api/enrollments/my", {
      headers: {
        Authorization: `Bearer ${token2}`
      }
    });
    console.log("API Axios response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Axios error in fetchMyEnrollments:", error);
    let errorMessage = "Failed to fetch enrollments";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    throw new Error(errorMessage);
  }
};
const fetchAllEnrollmentsAdmin = async () => {
  try {
    const response = await apiClient.get("/api/enrollments");
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch all enrollments";
    throw new Error(message);
  }
};
export {
  fetchAllEnrollmentsAdmin as a,
  fetchMyEnrollments as f
};
