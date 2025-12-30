import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { L as verifyEmail } from "../entry-server.js";
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
const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email, please wait...");
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is invalid. No token found.");
      return;
    }
    const verifyToken = async () => {
      try {
        const data = await verifyEmail(token);
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        }
      } catch (error) {
        setStatus("error");
        const errorMessage = error.message || "Verification failed. The link might be invalid or expired.";
        setMessage(errorMessage);
      }
    };
    verifyToken();
  }, [token]);
  const getStatusColor = () => {
    if (status === "success") return "green";
    if (status === "error") return "red";
    return "#333";
  };
  return /* @__PURE__ */ jsx("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    textAlign: "center",
    padding: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%"
  }, children: [
    /* @__PURE__ */ jsx("h1", { children: "Email Verification" }),
    /* @__PURE__ */ jsx("p", { style: { fontSize: "1.2em", color: getStatusColor(), minHeight: "50px" }, children: message }),
    status !== "verifying" && /* @__PURE__ */ jsx(Link, { to: "/login", style: {
      display: "inline-block",
      marginTop: "20px",
      padding: "12px 24px",
      backgroundColor: "#007bff",
      color: "white",
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "1em"
    }, children: "Go to Login Page" })
  ] }) });
};
export {
  VerifyEmailPage as default
};
