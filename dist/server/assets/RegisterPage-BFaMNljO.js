import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { u as useAuth, C as COURSE_NAME } from "../entry-server.js";
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
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { firstName, lastName, email, password, confirmPassword } = formData;
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const nextStep = () => {
    if (currentStep === 1 && firstName && lastName) {
      setCurrentStep(2);
    } else if (currentStep === 2 && email) {
      setCurrentStep(3);
    }
  };
  const prevStep = () => setCurrentStep(currentStep - 1);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    const registrationData = { firstName, lastName, email, password };
    try {
      const response = await register(registrationData);
      if (response.success) {
        alert(response.message || "Registration successful! Please check your email.");
        navigate("/login");
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-2 px-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:w-2/5 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 text-white relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/20" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-8", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🎓" }) }),
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "EduPlatform" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-4 leading-tight", children: "Start Your Learning Journey" }),
            /* @__PURE__ */ jsxs("p", { className: "text-blue-100 text-lg mb-8", children: [
              "Join thousands mastering new skills with interactive ",
              COURSE_NAME
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(Feature, { icon: "⚡", title: `Interactive ${COURSE_NAME}`, desc: "Learn by doing with projects" }),
            /* @__PURE__ */ jsx(Feature, { icon: "👥", title: "Expert Community", desc: "Connect with mentors" }),
            /* @__PURE__ */ jsx(Feature, { icon: "📊", title: "Progress Tracking", desc: "Monitor your journey" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:w-3/5 bg-white p-8 md:p-12", children: [
        /* @__PURE__ */ jsx(StepProgress, { currentStep }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          error && /* @__PURE__ */ jsx(ErrorMessageBox, { message: error }),
          currentStep === 1 && /* @__PURE__ */ jsx(
            Step1,
            {
              firstName,
              lastName,
              onChange,
              nextStep
            }
          ),
          currentStep === 2 && /* @__PURE__ */ jsx(
            Step2,
            {
              email,
              onChange,
              prevStep,
              nextStep
            }
          ),
          currentStep === 3 && /* @__PURE__ */ jsx(
            Step3,
            {
              password,
              confirmPassword,
              showPassword,
              showConfirmPassword,
              setShowPassword,
              setShowConfirmPassword,
              onChange,
              prevStep,
              loading
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-center pt-6 border-t border-gray-200", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/login",
                className: "text-purple-600 font-bold hover:text-purple-700 hover:underline",
                children: "Sign in here"
              }
            )
          ] }) })
        ] })
      ] })
    ] })
  ] });
};
const Feature = ({ icon, title, desc }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm", children: [
  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center", children: icon }),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-sm", children: desc })
  ] })
] });
const StepProgress = ({ currentStep }) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: [1, 2, 3].map((step) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
  /* @__PURE__ */ jsx(
    "div",
    {
      className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === currentStep ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-110" : step < currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`,
      children: step < currentStep ? "✓" : step
    }
  ),
  step < 3 && /* @__PURE__ */ jsx(
    "div",
    {
      className: `w-16 h-1 mx-2 transition-all duration-300 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`
    }
  )
] }, step)) });
const ErrorMessageBox = ({ message }) => /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3", children: [
  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-red-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-red-500 text-lg", children: "⚠️" }) }),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-red-800", children: "Registration Error" }),
    /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: message })
  ] })
] });
const Step1 = ({ firstName, lastName, onChange, nextStep }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Personal Information" }),
  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "First Name", name: "firstName", value: firstName, onChange, icon: "👤" }),
    /* @__PURE__ */ jsx(Input, { label: "Last Name", name: "lastName", value: lastName, onChange, icon: "👥" })
  ] }),
  /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: nextStep,
      disabled: !firstName || !lastName,
      className: "w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50",
      children: "Continue to Email"
    }
  )
] });
const Step2 = ({ email, onChange, prevStep, nextStep }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Email Address" }),
  /* @__PURE__ */ jsx(Input, { label: "Email", name: "email", type: "email", value: email, onChange, icon: "📧" }),
  /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: prevStep,
        className: "flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-purple-500 hover:text-purple-700 transition-all",
        children: "Back"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: nextStep,
        disabled: !email,
        className: "flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50",
        children: "Continue to Password"
      }
    )
  ] })
] });
const Step3 = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  onChange,
  prevStep,
  loading
}) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-center text-gray-800 mb-2", children: "Secure Your Account" }),
  /* @__PURE__ */ jsx(
    Input,
    {
      label: "Password",
      name: "password",
      type: showPassword ? "text" : "password",
      value: password,
      onChange,
      icon: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowPassword(!showPassword),
          className: "text-gray-500 hover:text-purple-500",
          children: showPassword ? "🙈" : "👁️"
        }
      )
    }
  ),
  /* @__PURE__ */ jsx(
    Input,
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      value: confirmPassword,
      onChange,
      icon: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowConfirmPassword(!showConfirmPassword),
          className: "text-gray-500 hover:text-purple-500",
          children: showConfirmPassword ? "🙈" : "👁️"
        }
      )
    }
  ),
  confirmPassword && /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-center space-x-2 text-sm font-semibold ${password === confirmPassword ? "text-green-600" : "text-red-600"}`,
      children: [
        /* @__PURE__ */ jsx("span", { children: password === confirmPassword ? "✅" : "❌" }),
        /* @__PURE__ */ jsx("span", { children: password === confirmPassword ? "Passwords match perfectly!" : "Passwords don't match" })
      ]
    }
  ),
  /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: prevStep,
        className: "flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-purple-500 hover:text-purple-700",
        children: "Back"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: loading || !password || !confirmPassword || password !== confirmPassword,
        className: "flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50",
        children: loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
          /* @__PURE__ */ jsx("span", { children: "Creating Account..." })
        ] }) : /* @__PURE__ */ jsx("span", { children: "🚀 Launch My Account" })
      }
    )
  ] })
] });
const Input = ({ label, name, type = "text", value, onChange, icon }) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
  /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: label }),
  /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type,
        name,
        value,
        onChange,
        placeholder: label,
        className: "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300 pr-12",
        required: true
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 text-purple-500", children: icon })
  ] })
] });
const RegisterPage = () => {
  return /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "form-container", children: /* @__PURE__ */ jsx(RegisterForm, {}) }) });
};
export {
  RegisterPage as default
};
