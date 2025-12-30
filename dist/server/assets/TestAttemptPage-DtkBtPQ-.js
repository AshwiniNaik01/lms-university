import { jsx, jsxs } from "react/jsx-runtime";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { K as AuthContext } from "../entry-server.js";
import { t as testService } from "./TestServices-Dvv1xOwo.js";
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
const TestAttemptPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const token = currentUser?.token;
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!token) {
      setError("Please log in to attempt the test.");
      setLoading(false);
      return;
    }
    const fetchTest = async () => {
      try {
        setLoading(true);
        const data = await testService.getTestById(testId, token);
        setTest(data);
        setAnswers(new Array(data.questions.length).fill(null));
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load the test.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, token]);
  const handleOptionChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const unansweredQuestions = answers.filter((ans) => ans === null).length;
    if (unansweredQuestions > 0) {
      if (typeof window !== "undefined") {
        const confirmed = window.confirm(
          `You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`
        );
        if (!confirmed) return;
      }
    }
    setSubmitting(true);
    try {
      const submissionData = { testId, answers };
      await testService.submitTest(submissionData, token);
      navigate("/my-results", { state: { message: "Test submitted successfully!" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit the test.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "container", children: "Loading Test..." });
  if (error) return /* @__PURE__ */ jsxs("div", { style: { color: "red" }, children: [
    "Error: ",
    error
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "test-attempt-container", style: { padding: "20px", maxWidth: "900px", margin: "auto" }, children: [
    /* @__PURE__ */ jsx("h2", { style: { marginBottom: "20px", textAlign: "center" }, children: test?.title }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      test?.questions.map((q, qIndex) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: "25px", border: "1px solid #f0f0f0", padding: "20px", borderRadius: "8px" }, children: [
        /* @__PURE__ */ jsx("h4", { style: { marginTop: 0 }, children: `Q${qIndex + 1}: ${q.questionText}` }),
        q.options.map((option, oIndex) => (
          // --- START: ALIGNMENT FIX ---
          // Humne yahan 'label' ko container banaya hai
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: `q${qIndex}-o${oIndex}`,
              style: {
                display: "flex",
                // Flexbox istemal karein
                alignItems: "flex-start",
                // Top se align karein
                marginBottom: "12px",
                cursor: "pointer"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    id: `q${qIndex}-o${oIndex}`,
                    name: `question-${qIndex}`,
                    value: oIndex,
                    checked: answers[qIndex] === oIndex,
                    onChange: () => handleOptionChange(qIndex, oIndex),
                    style: { marginRight: "12px", marginTop: "4px", flexShrink: 0 }
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: option })
              ]
            },
            oIndex
          )
        ))
      ] }, q._id || qIndex)),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: submitting, className: "button button-primary", style: { padding: "12px 25px", fontSize: "16px", cursor: "pointer", width: "100%" }, children: submitting ? "Submitting..." : "Submit Test" })
    ] })
  ] });
};
export {
  TestAttemptPage as default
};
