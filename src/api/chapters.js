import apiClient from "./axiosConfig";
/**
 * Fetch chapters by course ID
 * @param {string} courseId
 * @returns {Promise<Object>} { success, data, message }
 */
export const getChaptersByCourse = async (courseId) => {
  const res = await apiClient.get(`/api/chapters/course/${courseId}`);
  return res.data; // returns { success, data, message }
};
