import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { u as useAuth, j as apiClient } from "../entry-server.js";
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
const CreateTestPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, branchesRes] = await Promise.all([
          apiClient.get("/api/courses/all", { headers: { Authorization: `Bearer ${token}` } }),
          apiClient.get("/api/branches", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCourses(coursesRes.data.data || []);
        setBranches(branchesRes.data.data || []);
      } catch (err) {
        setError("Failed to load courses and branches. Please try again.");
        console.error(err);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !courseId || !branchId || questions.some((q) => !q.questionText || !q.correctAnswer)) {
      setError("Please fill all required fields, including all question and answer fields.");
      return;
    }
    setLoading(true);
    setError("");
    const testData = {
      title,
      duration,
      course: courseId,
      branch: branchId,
      questions
    };
    try {
      await apiClient.post("/api/tests", testData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/tests");
    } catch (error2) {
      setError(error2.response?.data?.message || "Failed to create test.");
      console.error("Error creating test:", error2);
    } finally {
      setLoading(false);
    }
  };
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };
  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };
  return /* @__PURE__ */ jsxs("div", { className: "create-test-container", children: [
    /* @__PURE__ */ jsx("h2", { children: "Create a New Test" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      error && /* @__PURE__ */ jsx("p", { className: "error-message", style: { color: "red" }, children: error }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { children: "Test Title" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { children: "Branch" }),
        /* @__PURE__ */ jsxs("select", { value: branchId, onChange: (e) => setBranchId(e.target.value), required: true, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select Branch" }),
          branches.map((branch) => /* @__PURE__ */ jsx("option", { value: branch._id, children: branch.name }, branch._id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { children: "Course" }),
        /* @__PURE__ */ jsxs("select", { value: courseId, onChange: (e) => setCourseId(e.target.value), required: true, disabled: !branchId, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select Course" }),
          courses.filter((c) => c.branch?._id === branchId).map((course) => /* @__PURE__ */ jsx("option", { value: course._id, children: course.title }, course._id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { children: "Duration (in minutes)" }),
        /* @__PURE__ */ jsx("input", { type: "number", value: duration, onChange: (e) => setDuration(parseInt(e.target.value, 10)), required: true })
      ] }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("h3", { children: "Questions" }),
      questions.map((q, qIndex) => /* @__PURE__ */ jsxs("div", { className: "question-block", children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("h4", { children: [
            "Question ",
            qIndex + 1
          ] }),
          questions.length > 1 && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeQuestion(qIndex), className: "btn-remove", children: "Remove" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { children: "Question Text" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "questionText", value: q.questionText, onChange: (e) => handleQuestionChange(qIndex, e), required: true })
        ] }),
        q.options.map((opt, oIndex) => /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            "Option ",
            oIndex + 1
          ] }),
          /* @__PURE__ */ jsx("input", { type: "text", value: opt, onChange: (e) => handleOptionChange(qIndex, oIndex, e), required: true })
        ] }, oIndex)),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { children: "Correct Answer (Select the correct option)" }),
          /* @__PURE__ */ jsxs("select", { name: "correctAnswer", value: q.correctAnswer, onChange: (e) => handleQuestionChange(qIndex, e), required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Correct Answer" }),
            q.options.filter((opt) => opt).map((opt, oIndex) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, oIndex))
          ] })
        ] })
      ] }, qIndex)),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: addQuestion, className: "btn-secondary", children: "Add Another Question" }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "btn-primary", disabled: loading, children: loading ? "Creating..." : "Create Test" })
    ] })
  ] });
};
export {
  CreateTestPage as default
};
