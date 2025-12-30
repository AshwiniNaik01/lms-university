import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { t as testService } from "./TestServices-Dvv1xOwo.js";
import { K as AuthContext } from "../entry-server.js";
import "axios";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
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
const MyResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("You must be logged in to see results.");
      return;
    }
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await testService.getMyResults(token);
        setResults(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "container", children: "Loading Your Results..." });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "container", style: { color: "red" }, children: [
    "Error: ",
    error
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "my-results-container", style: { padding: "20px", maxWidth: "900px", margin: "auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { textAlign: "center", marginBottom: "25px" }, children: "My Test Results" }),
    results.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginTop: "50px", padding: "30px", border: "1px dashed #ccc", borderRadius: "8px" }, children: [
      /* @__PURE__ */ jsx("h3", { children: "No Results Found" }),
      /* @__PURE__ */ jsx("p", { children: "It looks like you haven't attempted any tests yet." }),
      /* @__PURE__ */ jsx(Link, { to: "/courses", children: /* @__PURE__ */ jsx("button", { className: "button button-primary", style: { marginTop: "10px" }, children: "Find a Test" }) })
    ] }) : /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "2px solid #333" }, children: [
        /* @__PURE__ */ jsx("th", { style: { padding: "12px", textAlign: "left" }, children: "Test Title" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "12px", textAlign: "center" }, children: "Score" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "12px", textAlign: "left" }, children: "Submitted On" }),
        /* @__PURE__ */ jsx("th", { style: { padding: "12px", textAlign: "center" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: results.map((result) => /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #eee" }, children: [
        /* @__PURE__ */ jsx("td", { style: { padding: "12px" }, children: result.test?.title || "Test Title Not Available" }),
        /* @__PURE__ */ jsx("td", { style: { padding: "12px", textAlign: "center" }, children: `${result.score} / ${result.totalMarks}` }),
        /* @__PURE__ */ jsx("td", { style: { padding: "12px" }, children: new Date(result.submittedAt).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { style: { padding: "12px", textAlign: "center" }, children: /* @__PURE__ */ jsx(Link, { to: `/results/${result._id}`, children: /* @__PURE__ */ jsx("button", { className: "button button-secondary", children: "View Details" }) }) })
      ] }, result._id)) })
    ] })
  ] });
};
export {
  MyResultsPage as default
};
