// src/utils/authCookies.js
import Cookies from "js-cookie";

export const getStudentAuthFromCookies = () => {
  return {
    studentId: Cookies.get("studentId"),
    token: Cookies.get("token"),
    role: Cookies.get("role"),
  };
};
