import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { j as apiClient } from "../entry-server.js";
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
const TestManagementPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/tests");
      setTests(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch tests. Please try again later.");
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTests();
  }, []);
  const handleDelete = async (id) => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this test?")) {
      try {
        await apiClient.delete(`/api/tests/${id}`);
        setTests(tests.filter((test) => test._id !== id));
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete the test.";
        setError(errorMessage);
        console.error(`Error deleting test with id ${id}:`, err);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "🧪 Test Management" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/tests/create",
          className: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-purple-700 transition",
          children: "➕ Create New Test"
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "text-center text-blue-600 font-medium animate-pulse", children: "Loading tests..." }),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded shadow", children: error }),
    !loading && !error && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-lg overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-100 text-left text-gray-600 uppercase text-sm tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "📘 Title" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "🎓 Course" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "🏫 Branch" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "❓ Questions" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "⚙️ Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: tests.length > 0 ? tests.map((test) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-800", children: test.title }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: test.course?.title || "N/A" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: test.branch?.name || "N/A" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: test.questions?.length || 0 }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(test._id),
            className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition",
            children: "🗑️ Delete"
          }
        ) })
      ] }, test._id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs(
        "td",
        {
          colSpan: "5",
          className: "text-center px-6 py-6 text-gray-500",
          children: [
            "No tests found. Click ",
            /* @__PURE__ */ jsx("strong", { children: '"Create New Test"' }),
            " to add one."
          ]
        }
      ) }) })
    ] }) })
  ] });
};
export {
  TestManagementPage as default
};
