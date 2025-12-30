import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { j as apiClient, M as Modal, k as handleApiError } from "../entry-server.js";
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
const allActions = ["create", "read", "update", "delete"];
const RolePermissionManager = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/api/role");
        setRoles(res.data.message || []);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await apiClient.get("/api/module");
        if (res.data.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((m) => ({
            module: m.module.toLowerCase(),
            label: m.module
          }));
          setModules(formatted);
        }
      } catch (err) {
        console.error("Error fetching modules", err);
      }
    };
    fetchModules();
  }, []);
  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);
    apiClient.get(`/api/role/${selectedRoleId}`).then((res) => {
      const role = res.data.message;
      setSelectedRoleName(role.role);
      const formatted = {};
      if (role.permissions.length === 1 && role.permissions[0].module === "*") {
        modules.forEach((m) => {
          formatted[m.module] = [...allActions];
        });
      } else {
        modules.forEach((m) => formatted[m.module] = []);
        role.permissions.forEach((p) => {
          formatted[p.module] = p.actions;
        });
      }
      setPermissions(formatted);
    }).catch(console.error).finally(() => setLoading(false));
  }, [selectedRoleId, modules]);
  const handleCheckboxChange = (module, action) => {
    setPermissions((prev) => {
      const moduleActions = prev[module] || [];
      const updated = moduleActions.includes(action) ? moduleActions.filter((a) => a !== action) : [...moduleActions, action];
      return { ...prev, [module]: updated };
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      role: selectedRoleName,
      permissions: Object.entries(permissions).filter(([_, actions]) => actions.length > 0).map(([module, actions]) => ({ module, actions }))
    };
    try {
      let res;
      if (selectedRoleId) {
        res = await apiClient.put(`/api/role/${selectedRoleId}`, payload);
      } else {
        res = await apiClient.post(`/api/role`, payload);
      }
      Swal.fire({
        icon: "success",
        title: `${res?.data?.message}` || "Permissions saved successfully!"
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: handleApiError(err)
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddNewRole = async () => {
    if (!newRoleName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Role name is required!"
      });
    }
    setCreatingRole(true);
    try {
      const payload = { role: newRoleName.trim().toLowerCase() };
      const res = await apiClient.post("/api/role", payload);
      Swal.fire({
        icon: "success",
        title: `${res?.data?.success}` || "New role added successfully!",
        // timer: 1500,
        showConfirmButton: true
      });
      setRoles((prev) => [...prev, res.data.message]);
      setIsModalOpen(false);
      setNewRoleName("");
    } catch (err) {
      console.error(err);
      const errorMessage = handleApiError(err);
      Swal.fire({
        icon: "error",
        title: errorMessage || "Error creating role."
      });
    } finally {
      setCreatingRole(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-8 bg-gray-50 max-h-screen relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-indigo-700 mb-2", children: "Role Permission Manager" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Assign and manage access for roles." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsModalOpen(true),
          className: "flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md",
          children: [
            /* @__PURE__ */ jsx(FaPlus, {}),
            " Add New Role"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-gray-700 font-semibold mb-3", children: "Select Role" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: selectedRoleId,
          onChange: (e) => setSelectedRoleId(e.target.value),
          className: "w-64 border border-gray-300 rounded-lg px-4 py-2",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "-- Select Role --" }),
            roles.map((role) => /* @__PURE__ */ jsx("option", { value: role._id, children: role.role.toUpperCase() }, role._id))
          ]
        }
      )
    ] }),
    selectedRoleId && modules.length > 0 && /* @__PURE__ */ jsx("div", { className: "bg-white shadow-lg rounded-xl border border-gray-200 overflow-x-auto mb-6", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-indigo-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Module" }),
        allActions.map((action) => /* @__PURE__ */ jsx(
          "th",
          {
            className: "px-6 py-3 text-center text-sm font-semibold text-gray-700",
            children: action.toUpperCase()
          },
          action
        ))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: modules.map((m) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-indigo-50 transition", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-800 font-medium", children: m.label }),
        allActions.map((action) => /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: permissions[m.module]?.includes(action),
            onChange: () => handleCheckboxChange(m.module, action),
            disabled: selectedRoleName === "admin" || selectedRoleName === "super_admin",
            className: "h-5 w-5 text-indigo-600"
          }
        ) }, action))
      ] }, m.module)) })
    ] }) }),
    selectedRoleId && /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSubmit,
        disabled: loading,
        className: "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md",
        children: loading ? "Saving..." : "Save Permissions"
      }
    ) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: "Add New Role",
        primaryAction: {
          label: "Create Role",
          onClick: handleAddNewRole,
          loading: creatingRole
        },
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-gray-700 font-medium", children: "Role Name*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newRoleName,
              onChange: (e) => setNewRoleName(e.target.value),
              placeholder: "e.g., trainer",
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] })
      }
    )
  ] });
};
export {
  RolePermissionManager as default
};
