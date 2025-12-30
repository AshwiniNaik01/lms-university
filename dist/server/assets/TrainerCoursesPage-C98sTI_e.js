import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { a as fetchTrainerById } from "./trainerApi-uqZoQf46.js";
import { FaClock, FaStar, FaUsers, FaCertificate } from "react-icons/fa";
import "../entry-server.js";
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
const TrainerCoursesPage = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const trainerId = Cookies.get("trainerId");
        if (!trainerId) return;
        const trainerData = await fetchTrainerById(trainerId);
        setTrainer(trainerData);
      } catch (error) {
        console.error("Failed to fetch trainer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx("p", { className: "text-xl font-medium text-gray-600", children: "Loading Courses..." }) });
  }
  if (!trainer) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsx("p", { className: "text-xl font-medium text-red-500", children: "Trainer not found" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-6 space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-6 shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold", children: trainer.fullName }),
        /* @__PURE__ */ jsx("p", { className: "text-lg", children: trainer.title })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 md:mt-0 text-right", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Status:",
          " ",
          /* @__PURE__ */ jsx(
            "span",
            {
              className: trainer.isApproved ? "text-green-500" : "text-yellow-500",
              children: trainer.approvalStatus
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Active: ",
          trainer.isActive ? "✅" : "❌"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: "My Courses" }),
      trainer.courses.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No courses found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: trainer.courses.map((course) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-xl shadow-md p-6 border-l-8 border-indigo-400 hover:scale-105 transition-transform duration-300",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: course.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-4", children: course.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
              /* @__PURE__ */ jsx(FaClock, { className: "text-gray-500" }),
              /* @__PURE__ */ jsx("span", { children: course.duration })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
              /* @__PURE__ */ jsx(FaStar, { className: "text-yellow-400" }),
              /* @__PURE__ */ jsx("span", { children: course.rating })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
              /* @__PURE__ */ jsx(FaUsers, { className: "text-green-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                course.enrolledCount,
                " participates"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              course.features?.certificate && /* @__PURE__ */ jsxs("span", { className: "bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(FaCertificate, {}),
                " Certificate"
              ] }),
              course.features?.codingExercises && /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded", children: "Coding Exercises" }),
              course.features?.recordedLectures && /* @__PURE__ */ jsx("span", { className: "bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded", children: "Recorded Lectures" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => navigate(`/trainer-courses/${course._id}`),
                className: "mt-4 w-full bg-indigo-500 text-white font-semibold py-2 rounded hover:bg-indigo-600 transition",
                children: "View Details"
              }
            )
          ]
        },
        course._id
      )) })
    ] })
  ] });
};
export {
  TrainerCoursesPage as default
};
