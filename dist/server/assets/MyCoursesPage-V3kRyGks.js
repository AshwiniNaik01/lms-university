import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { u as useAuth, C as COURSE_NAME, V as STUDENT_PORTAL_URL } from "../entry-server.js";
import Cookies from "js-cookie";
import { FaClock, FaArrowRight, FaBook, FaSearch, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./enrollments-Cj9iMtZ0.js";
import { f as fetchStudentDetails } from "./profile-D_s45P6s.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
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
const EnrolledCourseCard = ({ enrollment, onUnenrollSuccess }) => {
  const { token } = useAuth();
  useMemo(() => {
    if (!enrollment) return 0;
    const totalContent = (enrollment.youtubeVideos?.length || 0) + (enrollment.notes?.length || 0);
    if (totalContent === 0) return 0;
    const completedCount = enrollment.completedContent?.length || 0;
    return Math.round(completedCount / totalContent * 100);
  }, [enrollment]);
  if (!enrollment) {
    return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-center h-48", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-400 italic", children: [
      COURSE_NAME,
      " data is not available."
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "p-[4px] rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:shadow-lg transition-shadow duration-300", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl h-full flex flex-col p-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2", children: enrollment.title }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-1", children: [
      /* @__PURE__ */ jsx(FaClock, { className: "w-4 h-4 text-indigo-500" }),
      /* @__PURE__ */ jsx("span", { children: enrollment.duration || "Duration not available" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow" }),
    /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-gray-100 flex justify-between items-center", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/courses/${enrollment._id}/study`,
        className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200",
        children: [
          "Continue",
          /* @__PURE__ */ jsx(FaArrowRight, { className: "w-3 h-3" })
        ]
      }
    ) })
  ] }) });
};
const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const token = Cookies.get("token");
  console.log("token:", token);
  if (!token) throw new Error("Authentication token not found.");
  const { isAuthenticated, currentUser } = useAuth();
  useEffect(() => {
    const loadStudentData = async () => {
      if (isAuthenticated && currentUser?.user?.role === "student") {
        setLoading(true);
        setError("");
        try {
          const studentData = await fetchStudentDetails();
          console.log("✅ Student data fetched:", studentData);
          if (studentData.success && studentData.data) {
            console.log(
              "📘 Enrolled courses:",
              studentData.data.enrolledCourses
            );
            setEnrollments(studentData.data.enrolledCourses || []);
          } else {
            console.warn("⚠️ No enrolledCourses found in response");
            setEnrollments([]);
            setError("No courses found.");
          }
        } catch (err) {
          console.error("❌ Error loading student data:", err);
          setError("Failed to load your courses. Please try again later.");
          setEnrollments([]);
        }
        setLoading(false);
      } else if (!isAuthenticated) {
        console.warn("🔒 User not authenticated");
        setError("Please log in to see your courses.");
        setLoading(false);
      } else {
        console.warn("ℹ️ User is not a student");
        setLoading(false);
      }
    };
    loadStudentData();
  }, [isAuthenticated, currentUser]);
  const handleUnenrollSuccess = (unenrolledCourseId) => {
    setEnrollments(
      (prevEnrollments) => prevEnrollments.filter((e) => e._id !== unenrolledCourseId)
    );
  };
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in-progress") {
      const progress = calculateProgress(enrollment);
      return progress > 0 && progress < 100;
    }
    if (activeFilter === "completed") {
      const progress = calculateProgress(enrollment);
      return progress === 100;
    }
    if (activeFilter === "not-started") {
      const progress = calculateProgress(enrollment);
      return progress === 0;
    }
    return true;
  });
  const calculateProgress = (enrollment) => {
    console.log(
      "📊 Calculating progress for:",
      enrollment.title || enrollment._id
    );
    if (!enrollment) {
      console.warn("❗ No enrollment object found");
      return 0;
    }
    const youtubeCount = enrollment.youtubeVideos?.length || 0;
    const notesCount = enrollment.notes?.length || 0;
    const completedCount = enrollment.completedContent?.length || 0;
    const totalContent = youtubeCount + notesCount;
    console.log(
      `➡️ Video: ${youtubeCount}, Notes: ${notesCount}, Completed: ${completedCount}, Total: ${totalContent}`
    );
    if (totalContent === 0) return 0;
    const progress = Math.round(completedCount / totalContent * 100);
    console.log(
      `✅ Progress for ${enrollment.title || enrollment._id}: ${progress}%`
    );
    return progress;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg font-medium text-gray-600", children: "Loading your courses..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-6 bg-white rounded-xl shadow-md max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-8 h-8",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          xmlns: "http://www.w3.org/2000/svg",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 mb-2", children: "Something went wrong" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
          children: "Try Again"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(FaBook, { className: "text-indigo-600" }),
          "My Learning"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: enrollments.length > 0 ? `You're enrolled in ${enrollments.length} course${enrollments.length !== 1 ? "s" : ""}` : "Your enrolled courses will appear here" })
      ] }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${STUDENT_PORTAL_URL}courses`,
          className: "mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md",
          target: "_blank",
          rel: "noopener noreferrer",
          children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "w-4 h-4" }),
            "Browse Courses"
          ]
        }
      )
    ] }),
    filteredEnrollments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-indigo-100 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsx(FaGraduationCap, { className: "w-10 h-10" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-3", children: enrollments.length === 0 ? "No courses yet" : "No courses match this filter" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 max-w-md mx-auto", children: enrollments.length === 0 ? "You haven't enrolled in any courses yet. Explore our catalog to find courses that interest you." : "There are no courses that match your current filter selection." }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${STUDENT_PORTAL_URL}courses`,
          className: "inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md",
          target: "_blank",
          rel: "noopener noreferrer",
          children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "w-4 h-4" }),
            "Browse Courses"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredEnrollments.map((enrollment) => /* @__PURE__ */ jsx(
      EnrolledCourseCard,
      {
        enrollment,
        onUnenrollSuccess: handleUnenrollSuccess
      },
      enrollment._id
    )) })
  ] }) });
};
export {
  MyCoursesPage as default
};
