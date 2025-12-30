import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { f as fetchCourseById } from "../entry-server.js";
import { FaCertificate, FaClock, FaStar, FaUsers, FaChevronUp, FaChevronDown, FaPlayCircle, FaFilePdf } from "react-icons/fa";
import "react-dom/server";
import "react-toastify";
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
const TrainerCourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-20 text-xl font-medium text-gray-600", children: "Loading course details..." });
  if (!course)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-20 text-red-500 text-xl font-medium", children: "Course not found." });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold", children: course.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg", children: course.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-4 md:mt-0 text-white", children: [
        course.features?.certificate && /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 bg-indigo-600 rounded-full text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaCertificate, {}),
          " Certificate"
        ] }),
        course.features?.codingExercises && /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-green-600 rounded-full text-sm", children: "Coding Exercises" }),
        course.features?.recordedLectures && /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-yellow-500 rounded-full text-sm", children: "Recorded Lectures" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6 mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center", children: [
        /* @__PURE__ */ jsx(FaClock, { className: "text-indigo-500" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: course.duration })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center", children: [
        /* @__PURE__ */ jsx(FaStar, { className: "text-yellow-400" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: course.rating })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center", children: [
        /* @__PURE__ */ jsx(FaUsers, { className: "text-green-500" }),
        " ",
        /* @__PURE__ */ jsxs("span", { children: [
          course.enrolledCount,
          " Participates"
        ] })
      ] })
    ] }),
    course.learningOutcomes?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-xl p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Learning Outcomes" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-700", children: course.learningOutcomes.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) })
    ] }),
    course.benefits?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-xl p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Benefits" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-700", children: course.benefits.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) })
    ] }),
    course.keyFeatures?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-xl p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Key Features" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: course.keyFeatures.map((kf) => /* @__PURE__ */ jsxs("li", { className: "border-l-4 border-indigo-500 pl-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-semibold text-gray-800", children: [
          kf.title,
          ":",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-normal", children: kf.description })
        ] }),
        kf.subPoints?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside ml-6 mt-1 text-gray-700", children: kf.subPoints.map((sp, i) => /* @__PURE__ */ jsx("li", { children: sp }, i)) })
      ] }, kf._id)) })
    ] }),
    course.videolectures?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-xl p-6", children: [
      /* @__PURE__ */ jsxs(
        "h2",
        {
          className: "text-2xl font-semibold mb-4 flex items-center justify-between cursor-pointer",
          onClick: () => toggleSection("videos"),
          children: [
            "Video Lectures",
            " ",
            openSection === "videos" ? /* @__PURE__ */ jsx(FaChevronUp, {}) : /* @__PURE__ */ jsx(FaChevronDown, {})
          ]
        }
      ),
      openSection === "videos" && /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: course.videolectures.map((video) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition",
          children: [
            /* @__PURE__ */ jsx(FaPlayCircle, { className: "text-indigo-500" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: video.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
                video.duration,
                " - ",
                video.description
              ] })
            ] })
          ]
        },
        video._id
      )) })
    ] }),
    course.notes?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-xl p-6", children: [
      /* @__PURE__ */ jsxs(
        "h2",
        {
          className: "text-2xl font-semibold mb-4 flex items-center justify-between cursor-pointer",
          onClick: () => toggleSection("notes"),
          children: [
            "Notes",
            " ",
            openSection === "notes" ? /* @__PURE__ */ jsx(FaChevronUp, {}) : /* @__PURE__ */ jsx(FaChevronDown, {})
          ]
        }
      ),
      openSection === "notes" && /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: course.notes.map((note) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition",
          children: [
            /* @__PURE__ */ jsx(FaFilePdf, { className: "text-red-500" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: note.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: note.duration })
            ] })
          ]
        },
        note._id
      )) })
    ] })
  ] });
};
export {
  TrainerCourseDetailsPage as default
};
