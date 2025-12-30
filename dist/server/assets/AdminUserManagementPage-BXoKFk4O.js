import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { u as useAuth, S as ScrollableTable, M as Modal, j as apiClient } from "../entry-server.js";
import { T as ToggleSwitch } from "./ToggleSwitch-DAPeiKLd.js";
import Swal from "sweetalert2";
import { u as usePassword } from "./usePassword-CcEJjiKI.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
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
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetUser, setResetUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    password: resetPassword,
    setPassword: setResetPassword,
    generate: generateResetPassword
  } = usePassword("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    role: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("admin");
  const { password, setPassword, generate } = usePassword("");
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };
  useEffect(() => {
    setFormData((prev) => ({ ...prev, password }));
  }, [password]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/api/role", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoles(res.data.message || []);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    if (token) fetchRoles();
  }, [token]);
  const loadUsers = async (roleFilter = "") => {
    setLoading(true);
    try {
      const res = await apiClient.post(
        "/api/users",
        { role: roleFilter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedUsers = res.data.data?.users || [];
      const fetchedTrainers = res.data.data?.trainers || [];
      let allItems = roleFilter ? [
        ...fetchedUsers.filter((u) => u.role === roleFilter),
        ...fetchedTrainers.filter((t) => t.role === roleFilter)
      ] : [...fetchedUsers, ...fetchedTrainers];
      const sortedItems = allItems.sort((a, b) => {
        const nameA = a.firstName ? `${a.firstName} ${a.lastName}` : a.fullName;
        const nameB = b.firstName ? `${b.firstName} ${b.lastName}` : b.fullName;
        return nameA.localeCompare(nameB);
      });
      setUsers(sortedItems);
      setError("");
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) loadUsers(selectedRole);
  }, [token, selectedRole]);
  useEffect(() => {
    if (isModalOpen) {
      setPassword("");
    }
  }, [isModalOpen]);
  const handleToggleLoginPermission = async (user) => {
    try {
      await apiClient.post(
        "/api/auth/logout",
        { _id: user._id, role: user.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        (prev) => prev.map(
          (u) => u._id === user._id ? { ...u, isLogin: !u.isLogin } : u
        )
      );
      Swal.fire(
        "Success",
        `${user.firstName || user.fullName} login permission ${user.isLogin ? "revoked" : "activated"}`,
        "success"
      );
    } catch (err) {
      console.error("Failed to toggle login permission", err);
      Swal.fire("Error", "Failed to toggle login permission", "error");
    }
  };
  const handleResetPassword = async () => {
    if (!resetPassword || !confirmPassword) {
      Swal.fire("Error", "Password fields cannot be empty", "error");
      return;
    }
    if (resetPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }
    try {
      await apiClient.put(
        "/api/auth/reset-password",
        {
          email: resetUser.email,
          role: resetUser.role,
          newPassword: resetPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Password reset successfully", "success");
      await loadUsers(selectedRole);
      setResetUser(null);
      setResetPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    }
  };
  const columns = [
    {
      header: "Name",
      accessor: (item) => item.firstName ? `${item.firstName} ${item.lastName}` : item.fullName
    },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: (item) => item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : ""
    },
    {
      header: "Login Permission",
      accessor: (item) => /* @__PURE__ */ jsx(
        ToggleSwitch,
        {
          label: "",
          name: `login-${item._id}`,
          checked: item.isLogin,
          onChange: () => handleToggleLoginPermission(item)
        }
      )
    },
    {
      header: "Password",
      accessor: (item) => {
        const isVisible = visiblePasswords[item._id] || false;
        const password2 = item.password || "";
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("span", { children: isVisible ? password2 : "" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => togglePasswordVisibility(item._id),
              className: "text-gray-500 hover:text-gray-700",
              children: isVisible ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
            }
          )
        ] });
      }
    },
    {
      header: "Reset Password",
      accessor: (item) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setResetUser(item),
          className: "text-indigo-600 hover:underline text-sm font-medium",
          children: "Reset"
        }
      )
    }
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUser = async () => {
    setFormLoading(true);
    setFormError("");
    try {
      const res = await apiClient.post("/api/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobileNo: "",
        role: ""
      });
      await loadUsers(selectedRole);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message || "User added successfully!",
        // ✅ now res is defined
        timer: 2e3,
        showConfirmButton: false
      });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add user");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to add user"
      });
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center py-12 animate-pulse", children: "Loading users..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center py-12 text-red-500", children: error });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-indigo-900", children: "User Management" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: "Filter by Role" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: selectedRole,
                onChange: (e) => setSelectedRole(e.target.value),
                className: "border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500",
                children: roles.map((roleObj) => /* @__PURE__ */ jsx("option", { value: roleObj.role, children: roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1) }, roleObj._id))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsModalOpen(true),
              className: "px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition",
              children: "+ Add User"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4", children: users.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg", children: "No users found" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Try changing the filter or add a new user" })
      ] }) : /* @__PURE__ */ jsx(ScrollableTable, { columns, data: users, maxHeight: "460px" }) })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: "Add New User",
        primaryAction: {
          label: "Add User",
          onClick: handleAddUser,
          loading: formLoading
        },
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          formError && /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm", children: formError }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "First Name*" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "firstName",
                  placeholder: "First Name",
                  value: formData.firstName,
                  onChange: handleChange,
                  className: "input border-2 border-blue-100 p-2 rounded-lg"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "Last Name*" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "lastName",
                  placeholder: "Last Name",
                  value: formData.lastName,
                  onChange: handleChange,
                  className: "input border-2 border-blue-100 p-2 rounded-lg"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "Email*" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                className: "input border-2 border-blue-100 p-2 rounded-lg"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col relative", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "Password*" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPassword ? "text" : "password",
                    name: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "w-full pr-10 border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    className: "relative right-5 text-gray-500 hover:text-gray-700",
                    children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => generate(6),
                    className: "ml-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition",
                    children: "Auto Generate"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "Mobile Number*" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  name: "mobileNo",
                  value: formData.mobileNo,
                  onChange: handleChange,
                  className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-50", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1", children: "Role*" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "role",
                value: formData.role,
                onChange: handleChange,
                className: "input border-2 border-blue-100 p-2 rounded-lg",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select Role" }),
                  roles.map((roleObj) => /* @__PURE__ */ jsx("option", { value: roleObj.role, children: roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1) }, roleObj._id))
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: !!resetUser,
        onClose: () => {
          setResetUser(null);
          setResetPassword("");
          setConfirmPassword("");
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },
        header: "Reset Password",
        primaryAction: {
          label: "Save",
          onClick: handleResetPassword
        },
        children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "Reset password for ",
            /* @__PURE__ */ jsx("b", { children: resetUser?.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showNewPassword ? "text" : "password",
                value: resetPassword,
                onChange: (e) => setResetPassword(e.target.value),
                className: "w-full border p-2 rounded-lg pr-10"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowNewPassword(!showNewPassword),
                className: "absolute right-3 top-9 text-gray-500",
                children: showNewPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Confirm Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showConfirmPassword ? "text" : "password",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                className: "w-full border p-2 rounded-lg pr-10"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute right-3 top-9 text-gray-500",
                children: showConfirmPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => generateResetPassword(6),
              className: "px-3 py-1 bg-indigo-600 text-white rounded-md",
              children: "Auto Generate"
            }
          )
        ] })
      }
    )
  ] });
};
const AdminUserManagementPage = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(UserList, {}) });
};
export {
  AdminUserManagementPage as default
};
