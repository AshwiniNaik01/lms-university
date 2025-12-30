import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { j as apiClient } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
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
const ViewTestQuestions = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (testId) {
      fetchTestQuestions(testId);
    }
  }, [testId]);
  const fetchTestQuestions = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/tests/questions/${id}`);
      console.log("Test Questions:", response.data);
      if (response.data.success && response.data.data) {
        setTest(response.data.data);
      } else {
        setError("No test found.");
        Swal.fire({
          icon: "warning",
          title: "No Tests Available",
          text: "We couldn't find any tests. Please try again later.",
          confirmButtonColor: "#f0ad4e"
        });
      }
    } catch (err) {
      console.error("Error fetching test questions:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch test questions";
      setError(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Failed Fetching Test Questions",
        text: errorMessage,
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gray-800 py-4 px-8 shadow-lg z-20 mb-6", children: /* @__PURE__ */ jsxs("h3", { className: "text-4xl font-bold text-center text-white tracking-wide leading-tight transition-transform transform hover:scale-110 font-poppins", children: [
      "📋 ",
      test?.title || "Test Questions"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-auto p-6 bg-gradient-to-r from-blue-100 to-purple-100 shadow-xl rounded-lg", children: [
      loading && /* @__PURE__ */ jsx("p", { className: "text-blue-500 text-center", children: "Loading..." }),
      error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-center", children: error }),
      test?.questions?.length > 0 ? test.questions.map((q, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "mb-4 p-6 bg-white border-l-8 border-blue-500 shadow-md rounded-lg",
          children: [
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
              index + 1,
              ". ",
              q.question
            ] }),
            q.chapterName && /* @__PURE__ */ jsxs("div", { className: "text-md text-black italic text-right", children: [
              "Chapter: ",
              q.chapterName
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: ["optionA", "optionB", "optionC", "optionD"].map((key, i) => {
              const optionValue = q[key];
              const optionLetter = String.fromCharCode(65 + i);
              const isCorrect = q.correctAns === optionLetter || q.correctAns === optionValue;
              return /* @__PURE__ */ jsxs(
                "p",
                {
                  className: `ml-6 p-2 border rounded-md cursor-pointer transition-all duration-300 
                        ${isCorrect ? "bg-green-300 font-bold text-green-900" : "bg-gray-100"}`,
                  children: [
                    optionLetter,
                    ". ",
                    optionValue
                  ]
                },
                i
              );
            }) })
          ]
        },
        q._id
      )) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center", children: "No questions available" })
    ] })
  ] });
};
export {
  ViewTestQuestions as default
};
