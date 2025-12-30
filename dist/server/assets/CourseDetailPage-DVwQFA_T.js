import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaClock, FaUsers, FaStar, FaPlay } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { u as useAuth, f as fetchCourseById } from "../entry-server.js";
import { f as fetchMyEnrollments } from "./enrollments-Cj9iMtZ0.js";
import "react-dom/server";
import "react-toastify";
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
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, token, currentUser } = useAuth();
  const loadCourseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const courseResponse = await fetchCourseById(courseId);
      setCourse(courseResponse);
      if (isAuthenticated && currentUser?.user?.role === "student" && courseResponse) {
        const enrollmentsData = await fetchMyEnrollments(token);
        const enrollment = (enrollmentsData ?? []).find(
          (e) => e.course._id === courseResponse._id
        );
        setCurrentEnrollment(enrollment || null);
      }
    } catch (err) {
      setError("Failed to load course details.");
      console.error(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadCourseDetails();
  }, [courseId, isAuthenticated, token, currentUser]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-4 py-16 text-center animate-pulse", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "Loading course details..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsx("p", { className: "text-red-500", children: error }) });
  }
  if (!course) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: "Course not found." }) });
  }
  const isEnrolled = !!currentEnrollment;
  const handleStart = () => {
    navigate(`/courses/${courseId}/study`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-8xl bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 mx-auto px-10 py-10 space-y-12 animate-fadeIn", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-indigo-800 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(HiOutlineInformationCircle, { className: "text-indigo-600 text-4xl" }),
        course.title
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6 text-gray-600 text-sm mt-4", children: [
        course.trainer && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaChalkboardTeacher, { className: "text-indigo-500" }),
          /* @__PURE__ */ jsx("strong", { children: "Instructor:" }),
          " ",
          course.trainer.fullName
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaClock, { className: "text-indigo-500" }),
          /* @__PURE__ */ jsx("strong", { children: "Duration:" }),
          " ",
          course.duration
        ] }),
        course.enrolledCount !== void 0 && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaUsers, { className: "text-indigo-500" }),
          /* @__PURE__ */ jsx("strong", { children: "Enrolled:" }),
          " ",
          course.enrolledCount.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FaStar, { className: "text-yellow-500" }),
          /* @__PURE__ */ jsx("strong", { children: "Rating:" }),
          " ",
          course.rating?.toFixed(1)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-semibold mb-4 text-indigo-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(HiOutlineInformationCircle, {}),
        " About the Course"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 leading-relaxed", children: course.description })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-semibold mb-4 text-blue-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(GiProgression, {}),
        " What You'll Learn"
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: course.learningOutcomes?.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-green-50 p-6 rounded-xl shadow-md border border-green-100", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MdOutlineEmojiEvents, {}),
        " Why Join This Course?"
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-2 text-gray-700", children: course.benefits?.map((benefit, idx) => /* @__PURE__ */ jsx("li", { children: benefit }, idx)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "space-y-6 text-center", children: isAuthenticated && currentUser?.user?.role === "student" ? isEnrolled ? /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleStart,
        className: "inline-flex items-center justify-center gap-2 w-full md:w-auto py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:scale-105 duration-200",
        children: [
          /* @__PURE__ */ jsx(FaPlay, {}),
          " Start Learning"
        ]
      }
    ) : /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold text-center", children: "You are not enrolled in this course." }) : /* @__PURE__ */ jsx("p", { className: "text-gray-600 italic text-center", children: "Please log in as a participate to start learning." }) })
  ] });
};
export {
  CourseDetailPage as default
};
