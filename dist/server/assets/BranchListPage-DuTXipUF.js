import { jsx, jsxs } from "react/jsx-runtime";
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
const BranchListPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/branches");
        setBranches(response.data.data || []);
        setError("");
      } catch (err) {
        setError("Failed to load branches. Please try again later.");
        console.error(err);
      }
      setLoading(false);
    };
    loadBranches();
  }, []);
  if (loading) return /* @__PURE__ */ jsx("p", { children: "Loading branches..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "error-message", children: error });
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-100 to-blue-200 overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-17 left-0 w-full z-20 backdrop-blur-md bg-white/70 border-b border-indigo-200 shadow-sm py-3 px-4 md:px-16", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500", children: "🎓 Branch Management" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-indigo-600 mt-0.5", children: "Explore branches & their course offerings" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "pt-[120px] px-4 md:px-20 pb-16 overflow-y-auto", children: branches.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-gray-700 text-lg mt-20", children: "No branches available at the moment." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn", children: branches.map((branch) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white/70 backdrop-blur-xl border border-indigo-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-indigo-800 mb-1 truncate", children: branch.name }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm line-clamp-3", children: branch.description || "No description available." })
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/courses?branchId=${branch._id}`,
              className: "mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-sm font-medium text-center px-4 py-2 rounded-lg transition-all duration-300",
              children: "View Courses"
            }
          )
        ]
      },
      branch._id
    )) }) })
  ] });
};
export {
  BranchListPage as default
};
