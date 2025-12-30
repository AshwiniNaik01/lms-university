import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { u as useAuth, G as fetchBranches, H as fetchCourses } from "../entry-server.js";
import { f as fetchMyEnrollments } from "./enrollments-Cj9iMtZ0.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();
  const { isAuthenticated, currentUser, token } = useAuth();
  const initialBranchId = query.get("branchId");
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");
      try {
        const branchesData = await fetchBranches();
        setBranches(branchesData || []);
        const coursesResponse = await fetchCourses(initialBranchId);
        setCourses(coursesResponse?.data || coursesResponse || []);
        if (isAuthenticated && currentUser?.user?.role === "student" && token) {
          const enrollmentsData = await fetchMyEnrollments(token);
          const ids = new Set(enrollmentsData.map((e) => e.course._id));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        setError("Failed to load course data. Please try again later.");
        console.error("Error loading course list data:", err);
      }
      setLoading(false);
    };
    loadInitialData();
  }, [initialBranchId, isAuthenticated, currentUser, token]);
  console.log("Token from course list page ", token);
  const handleEnrollSuccess = (enrolledCourseId) => {
    setEnrolledCourseIds((prevIds) => /* @__PURE__ */ new Set([...prevIds, enrolledCourseId]));
  };
  if (error) {
    return /* @__PURE__ */ jsx("p", { className: "text-center text-red-500 mt-6 text-lg", children: error });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full bg-gradient-to-tr from-indigo-200 via-purple-100 to-blue-200 pt-[100px] px-6 pb-16", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-17 left-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-indigo-200 shadow-md px-6 py-4 md:px-20", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500", children: "🚀 Available Courses" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm md:text-base text-indigo-600", children: "Explore and enroll in courses from various branches" })
    ] }) }) }),
    loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-indigo-700 text-xl mt-12 animate-pulse", children: "Loading courses..." }) : courses.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-indigo-700 text-lg mt-12", children: "No courses available for the selected branch." }) : (
      // Courses Grid
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4 md:px-20 pb-16 overflow-y-auto", children: courses.map((course) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white/70 backdrop-blur-xl border border-indigo-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-indigo-800 mb-1 truncate", children: course.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm line-clamp-3", children: course.description || "No description provided." })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: enrolledCourseIds.has(course._id),
                onClick: () => handleEnrollSuccess(course._id),
                className: `mt-4  text-white text-sm font-medium text-center px-4 py-2 rounded-lg transition-all duration-300 ${enrolledCourseIds.has(course._id) ? "bg-green-600 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"}`,
                children: enrolledCourseIds.has(course._id) ? "Enrolled" : "Enroll Now"
              }
            )
          ]
        },
        course._id
      )) })
    )
  ] });
};
export {
  CourseListPage as default
};
