import { j as apiClient } from "../entry-server.js";
const getChaptersByCourse = async (courseId) => {
  const res = await apiClient.get(`/api/chapters/course/${courseId}`);
  return res.data;
};
export {
  getChaptersByCourse as g
};
