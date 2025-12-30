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
const ResultDetailPage = () => {
  const { resultId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const [resultDetails, setResultDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token || !resultId) {
      setLoading(false);
      setError("Missing required information to fetch result details.");
      return;
    }
    const fetchResultDetails = async () => {
      try {
        setLoading(true);
        const data = await testService.getResultDetails(resultId, token);
        console.log("API se mila data (resultDetails):", data);
        setResultDetails(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch result details.");
        console.error("Result details laane mein error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResultDetails();
  }, [resultId, token]);
  const findUserAnswer = (questionId) => {
    if (!resultDetails?.answers || resultDetails.answers.length === 0) {
      return null;
    }
    const answer = resultDetails.answers.find((a) => a.question && a.question.toString() === questionId.toString());
    return answer ? answer.selectedOption : null;
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "container", style: { padding: "2rem" }, children: "Loading Result Details..." });
  if (error) return /* @__PURE__ */ jsxs("div", { className: "container", style: { color: "red", padding: "2rem" }, children: [
    "Error: ",
    error
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "result-detail-container", style: { padding: "20px", maxWidth: "900px", margin: "auto" }, children: [
    /* @__PURE__ */ jsx("button", { onClick: () => navigate(-1), className: "button button-secondary", style: { marginBottom: "20px", display: "inline-block" }, children: "← Go Back" }),
    /* @__PURE__ */ jsxs("h2", { style: { textAlign: "center" }, children: [
      "Result for: ",
      resultDetails?.test?.title
    ] }),
    /* @__PURE__ */ jsx("div", { style: { textAlign: "center", fontSize: "1.2rem", marginBottom: "30px" }, children: /* @__PURE__ */ jsxs("strong", { children: [
      "Your Score: ",
      resultDetails?.score,
      " / ",
      resultDetails?.totalMarks
    ] }) }),
    (!resultDetails?.answers || resultDetails.answers.length === 0) && /* @__PURE__ */ jsxs("div", { style: { padding: "20px", backgroundColor: "#fff3cd", color: "#856404", textAlign: "center", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ffeeba" }, children: [
      /* @__PURE__ */ jsx("strong", { children: "Note:" }),
      " Detailed answers are not available for this result."
    ] }),
    resultDetails?.test?.questions.map((q, qIndex) => {
      const userAnswerIndex = findUserAnswer(q._id);
      const correctAnswerIndex = q.correctOption;
      return /* @__PURE__ */ jsxs("div", { style: { marginBottom: "25px", border: "1px solid #f0f0f0", padding: "20px", borderRadius: "8px" }, children: [
        /* @__PURE__ */ jsx("h4", { style: { marginTop: 0 }, children: `Q${qIndex + 1}: ${q.questionText}` }),
        q.options.map((option, oIndex) => {
          let style = {};
          if (resultDetails?.answers?.length > 0) {
            if (oIndex === correctAnswerIndex) {
              style = { backgroundColor: "#d4edda", color: "#155724", fontWeight: "bold" };
            }
            if (oIndex === userAnswerIndex && userAnswerIndex !== correctAnswerIndex) {
              style = { backgroundColor: "#f8d7da", color: "#721c24" };
            }
          }
          return /* @__PURE__ */ jsxs("div", { style: { padding: "10px", margin: "5px 0", borderRadius: "5px", ...style }, children: [
            option,
            resultDetails?.answers && oIndex === userAnswerIndex && /* @__PURE__ */ jsx("span", { style: { fontWeight: "bold" }, children: " ← Your Answer" })
          ] }, oIndex);
        })
      ] }, q._id);
    })
  ] });
};
export {
  ResultDetailPage as default
};
