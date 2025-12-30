import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { j as apiClient, u as useAuth } from "../entry-server.js";
import { Link } from "react-router-dom";
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
const getAllResultsAdmin = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await apiClient.get("/api/tests/all-results", config);
  return response.data;
};
const AdminAllResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  useEffect(() => {
    const fetchResults = async () => {
      if (token) {
        try {
          const data = await getAllResultsAdmin(token);
          setResults(Array.isArray(data.results) ? data.results : []);
        } catch (err) {
          setError("Failed to fetch results. " + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("h2", { children: "Loading All Student Results..." }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "alert alert-danger", children: error }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("h1", { style: { marginBottom: "1.5rem", textAlign: "center" }, children: "All Student Test Results" }),
    Array.isArray(results) && results.length === 0 ? /* @__PURE__ */ jsx("p", { children: "No results found." }) : /* @__PURE__ */ jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Student Name" }),
        /* @__PURE__ */ jsx("th", { children: "Email" }),
        /* @__PURE__ */ jsx("th", { children: "Test Title" }),
        /* @__PURE__ */ jsx("th", { children: "Score" }),
        /* @__PURE__ */ jsx("th", { children: "Percentage" }),
        /* @__PURE__ */ jsx("th", { children: "Date" }),
        /* @__PURE__ */ jsx("th", { children: "Details" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: results.map((result) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { children: result.student ? `${result.student.firstName} ${result.student.lastName}` : "N/A" }),
        /* @__PURE__ */ jsx("td", { children: result.student ? result.student.email : "N/A" }),
        /* @__PURE__ */ jsx("td", { children: result.test ? result.test.title : "Test Deleted" }),
        /* @__PURE__ */ jsxs("td", { children: [
          result.score,
          " / ",
          result.totalMarks
        ] }),
        /* @__PURE__ */ jsxs("td", { children: [
          (result.score / result.totalMarks * 100).toFixed(2),
          "%"
        ] }),
        /* @__PURE__ */ jsx("td", { children: new Date(result.submittedAt).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Link, { to: `/results/${result._id}`, className: "btn btn-sm", children: "View" }) })
      ] }, result._id)) })
    ] })
  ] });
};
export {
  AdminAllResultsPage as default
};
