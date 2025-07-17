// src/api/trainerApi.ts
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";

// const BASE_URL = "https://your-base-url.com"; // 🔁 Replace with your actual base URL

export const registerTrainer = async (formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/api/trainer/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
