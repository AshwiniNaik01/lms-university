import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { u as useAuth, J as setRole, j as apiClient } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role.selectedRole);
  const { login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/api/role");
        if (res.data?.message) {
          const validRoles = res.data.message.filter(
            (r) => r.role && r.permissions?.length >= 0
          );
          setRoles(validRoles);
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password, role);
      if (result.success && result.user) {
        const userRole = result.user.role?.toLowerCase();
        if (userRole === "trainer") {
          navigate("/trainer/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-[#e0ecfc] via-[#f5f7fa] to-[#e2e2e2] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "flex flex-col md:flex-row w-full max-w-5xl backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 p-10 bg-white/10 text-gray-800 flex flex-col items-center justify-center backdrop-blur-md", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-4 text-center", children: "Welcome Back 👋" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg mb-8 text-center max-w-sm", children: "Login to access your dashboard and manage your account." }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-3875.jpg",
              alt: "Login Illustration",
              className: "w-full max-w-xs rounded-xl shadow-lg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 bg-white px-10 py-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Login" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Enter your credentials to access your account." })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block mb-1 font-medium text-gray-700", children: [
                "Email ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                  placeholder: "Enter your email id",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  autoComplete: "username",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block mb-1 font-medium text-gray-700", children: [
                "Password ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPassword ? "text" : "password",
                    className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                    placeholder: "Enter your password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    autoComplete: "current-password",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    onClick: () => setShowPassword(!showPassword),
                    className: "absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg",
                    children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block mb-1 font-medium text-gray-700", children: [
                "Select Role ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: role,
                  onChange: (e) => dispatch(setRole(e.target.value)),
                  className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none",
                  required: true,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Choose a role" }),
                    roles.map((r) => /* @__PURE__ */ jsx("option", { value: r.role, children: r.role.charAt(0).toUpperCase() + r.role.slice(1) }, r._id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: !loading ? { scale: 1.05 } : {},
                whileTap: !loading ? { scale: 0.98 } : {},
                type: "submit",
                disabled: loading,
                className: `w-full px-4 py-2 rounded-xl text-white shadow-md transition-all
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"}`,
                children: loading ? "Logging in..." : "Login"
              }
            ),
            error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm text-center pt-2", children: error })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-center text-gray-500 mt-6", children: [
            "Are you a participate ?",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/student-login",
                className: "text-indigo-600 hover:underline font-medium",
                children: "Login here"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
const LoginPage = () => {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(LoginForm, {}) });
};
export {
  LoginPage as default
};
