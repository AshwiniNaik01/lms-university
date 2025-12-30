import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { courseId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const token = currentUser?.token;
  useEffect(() => {
    console.log("[Debug] AvailableTests Component Mounted.");
    console.log("[Debug] Course ID from URL:", courseId);
    console.log("[Debug] Token from AuthContext:", token ? "Token Found" : "Token NOT Found");
    if (!token) {
      console.log("[Debug] Token is missing. Setting error and stopping.");
      setError("Please log in to see available tests.");
      setLoading(false);
      return;
    }
    const fetchTests = async () => {
      try {
        setLoading(true);
        console.log(`[Debug] Calling API: testService.getTests for courseId: ${courseId}`);
        const data = await testService.getTests(courseId, token);
        console.log("[Debug] API Response Received:", data);
        setTests(data);
        setError("");
      } catch (err) {
        console.error("[Debug] ERROR fetching tests:", err.response || err.message || err);
        setError(err.response?.data?.message || "Failed to fetch tests. Check browser console for details.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchTests();
    } else {
      console.log("[Debug] No courseId found in URL. Not fetching tests.");
      setLoading(false);
    }
  }, [courseId, token]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "container", children: "Loading available tests..." });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "container", style: { color: "red" }, children: [
      "Error: ",
      error
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "available-tests-container", style: { padding: "20px", maxWidth: "900px", margin: "auto" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsx("h2", { children: "Available Tests" }),
      /* @__PURE__ */ jsx(Link, { to: `/course/${courseId}/study`, className: "button", children: "Back to Course" })
    ] }),
    tests.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginTop: "50px", padding: "30px", border: "1px dashed #ccc", borderRadius: "8px" }, children: [
      /* @__PURE__ */ jsx("h3", { children: "No Tests Available" }),
      /* @__PURE__ */ jsx("p", { children: "There are currently no tests available for this course. Please check back later." })
    ] }) : /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0 }, children: tests.map((test) => /* @__PURE__ */ jsxs("li", { style: { border: "1px solid #ccc", padding: "15px", marginBottom: "10px", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 10px 0" }, children: test.title }),
        /* @__PURE__ */ jsxs("p", { style: { margin: 0 }, children: [
          "Duration: ",
          test.duration || "N/A",
          " minutes"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: `/test/${test._id}/attempt`, children: /* @__PURE__ */ jsx("button", { className: "button button-primary", style: { padding: "10px 20px", cursor: "pointer" }, children: "Start Test" }) })
    ] }, test._id)) })
  ] });
};
export {
  AvailableTests as default
};
