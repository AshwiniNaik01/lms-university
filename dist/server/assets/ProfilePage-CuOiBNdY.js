import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { u as updateUserProfileApi } from "./profile-D_s45P6s.js";
import { u as useAuth } from "../entry-server.js";
import "js-cookie";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
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
const ProfilePage = () => {
  const { currentUser, updateUserContext } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: ""
    // branchId: "", // Only relevant if role is 'student'
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!currentUser?.user) return;
    const user = currentUser.user;
    setProfileData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || ""
    });
    setLoading(false);
  }, [currentUser]);
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmNewPassword") setConfirmNewPassword(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    setError("");
    setSuccess("");
    setLoading(true);
    const updatePayload = { ...profileData };
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        setLoading(false);
        return;
      }
      updatePayload.password = newPassword;
    }
    try {
      const response = await updateUserProfileApi(updatePayload);
      console.log("API response:", response);
      if (response.success) {
        setSuccess("Profile updated successfully!");
        updateUserContext(response.data);
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err.response || err);
      setError(
        err.response?.data?.message || err.message || "Error updating profile."
      );
    }
    setLoading(false);
  };
  if (loading && !profileData.email) return /* @__PURE__ */ jsx("p", { children: "Loading profile..." });
  if (!currentUser) return /* @__PURE__ */ jsx("p", { children: "Please log in to view your profile." });
  return /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-r from-pink-200 via-blue-100 to-blue-100 py-5 max-h-fit", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto bg-white backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-[#53b8ec]/20", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-tr from-blue-100 via-indigo-100 to-purple-100 rounded-2xl shadow-md p-8 border border-gray-200 flex flex-col justify-between h-full", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          alt: "Admin illustration",
          className: "w-48 h-48 object-contain mx-auto mb-6"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-[#485dac] text-center mb-2", children: "Welcome, Admin!" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center", children: "Keep your profile updated to ensure secure access and personalized experience across the platform." }),
        /* @__PURE__ */ jsxs("ul", { className: "mt-6 text-sm text-gray-500 list-disc pl-5 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Secure your account with a strong password." }),
          /* @__PURE__ */ jsx("li", { children: "Ensure your name is accurate for certifications." }),
          /* @__PURE__ */ jsx("li", { children: "Email is fixed and used for login." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold text-[#485dac] mb-8 text-center lg:text-left", children: "Admin Profile" }),
      success && /* @__PURE__ */ jsx("p", { className: "text-green-600 text-center mb-4 animate-fade-in", children: success }),
      error && /* @__PURE__ */ jsx("p", { className: "text-red-600 text-center mb-4 animate-fade-in", children: error }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[#485dac] font-medium mb-1", children: [
              /* @__PURE__ */ jsx(FaUser, {}),
              " First Name"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                name: "firstName",
                value: profileData.firstName,
                onChange: handleChange,
                className: "w-full px-4 py-2 border border-[#53b8ec]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53b8ec] bg-white shadow-sm",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[#485dac] font-medium mb-1", children: [
              /* @__PURE__ */ jsx(FaUser, {}),
              " Last Name"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                name: "lastName",
                value: profileData.lastName,
                onChange: handleChange,
                className: "w-full px-4 py-2 border border-[#53b8ec]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53b8ec] bg-white shadow-sm",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[#485dac] font-medium mb-1", children: [
              /* @__PURE__ */ jsx(FaEnvelope, {}),
              " Email"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: profileData.email,
                disabled: true,
                className: "w-full px-4 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg shadow-inner"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-[#e9577c]/30", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xl font-semibold text-[#e9577c] mb-6", children: [
            "Change Password",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[#485dac] font-medium mb-1", children: [
                /* @__PURE__ */ jsx(FaKey, {}),
                " New Password"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  name: "newPassword",
                  value: newPassword,
                  onChange: handlePasswordChange,
                  className: "w-full px-4 py-2 border border-[#e9577c]/40 rounded-lg focus:ring-2 focus:ring-[#e9577c] bg-white shadow-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[#485dac] font-medium mb-1", children: [
                /* @__PURE__ */ jsx(FaKey, {}),
                " Confirm Password"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  name: "confirmNewPassword",
                  value: confirmNewPassword,
                  onChange: handlePasswordChange,
                  className: "w-full px-4 py-2 border border-[#e9577c]/40 rounded-lg focus:ring-2 focus:ring-[#e9577c] bg-white shadow-sm"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full py-3 mt-6 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.01] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed",
            style: {
              backgroundImage: "linear-gradient(to right, #53B8EC, #485DAC, #E9577C)"
            },
            children: loading ? "Updating..." : "Update Profile"
          }
        )
      ] })
    ] })
  ] }) }) });
};
export {
  ProfilePage as default
};
