import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useAuth, G as fetchBranches, N as updateBranch, O as createBranch, P as deleteBranch } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom";
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
const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchDesc, setNewBranchDesc] = useState("");
  const [editingBranch, setEditingBranch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await fetchBranches();
      setBranches(data || []);
    } catch (err) {
      setError("Failed to load branches.");
    }
    setLoading(false);
  };
  useEffect(() => {
    loadBranches();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      alert("Branch name cannot be empty.");
      return;
    }
    setError("");
    try {
      const response = await createBranch(
        { name: newBranchName, description: newBranchDesc },
        token
      );
      if (response.success) {
        loadBranches();
        setNewBranchName("");
        setNewBranchDesc("");
        alert("Branch created!");
      } else {
        setError(response.message || "Failed to create branch.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error creating branch.");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBranch || !editingBranch.name.trim()) {
      alert("Branch name cannot be empty for update.");
      return;
    }
    setError("");
    try {
      const response = await updateBranch(
        editingBranch._id,
        { name: editingBranch.name, description: editingBranch.description },
        token
      );
      if (response.success) {
        loadBranches();
        setEditingBranch(null);
        alert("Branch updated!");
      } else {
        setError(response.message || "Failed to update branch.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating branch.");
    }
  };
  const handleDelete = async (branchId, branchName) => {
    if (typeof window !== "undefined" && window.confirm(
      `Are you sure you want to delete branch "${branchName}"? Associated courses might prevent deletion.`
    )) {
      setError("");
      try {
        const response = await deleteBranch(branchId, token);
        if (response.success) {
          loadBranches();
          alert("Branch deleted!");
        } else {
          setError(response.message || "Failed to delete branch.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting branch.");
      }
    }
  };
  if (loading) return /* @__PURE__ */ jsx("p", { children: "Loading branches..." });
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-12 px-4 sm:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-center text-indigo-700 mb-12 drop-shadow-lg", children: "Branch Management" }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-indigo-600 mb-6 flex items-center gap-2", children: editingBranch ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm", children: "Editing" }),
          " ",
          "Edit Branch: ",
          editingBranch.initialName || editingBranch.name
        ] }) : "Create New Branch" }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: editingBranch ? handleUpdate : handleCreate,
            className: "space-y-5",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Branch Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: editingBranch ? editingBranch.name : newBranchName,
                    onChange: (e) => editingBranch ? setEditingBranch({
                      ...editingBranch,
                      name: e.target.value
                    }) : setNewBranchName(e.target.value),
                    required: true,
                    placeholder: "Enter branch name",
                    className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    rows: 3,
                    value: editingBranch ? editingBranch.description : newBranchDesc,
                    onChange: (e) => editingBranch ? setEditingBranch({
                      ...editingBranch,
                      description: e.target.value
                    }) : setNewBranchDesc(e.target.value),
                    placeholder: "Optional branch description",
                    className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md",
                    children: editingBranch ? "Save Changes" : "Create Branch"
                  }
                ),
                editingBranch && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setEditingBranch(null),
                    className: "bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition shadow-md",
                    children: "Cancel"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl rounded-2xl p-6 border border-gray-200 max-h-[600px]", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-indigo-600 mb-4", children: "Existing Branches" }),
        branches.length === 0 && !loading ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center py-4", children: "No branches found." }) : /* @__PURE__ */ jsxs("div", { className: "border border-gray-300 rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ jsx("table", { className: "min-w-full text-sm", children: /* @__PURE__ */ jsx("thead", { className: "bg-indigo-100 text-indigo-700", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-left", children: "Name" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-left", children: "Description" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-semibold text-center", children: "Actions" })
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-[400px]", children: /* @__PURE__ */ jsx("table", { className: "min-w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200 bg-white", children: branches.map((b) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: b.name }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: b.description || "-" }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 flex gap-2 justify-center", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditingBranch({ ...b, initialName: b.name }),
                  className: "bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs shadow",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(b._id, b.name),
                  className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow",
                  children: "Delete"
                }
              )
            ] })
          ] }, b._id)) }) }) })
        ] })
      ] })
    ] })
  ] }) });
};
const AdminBranchManagementPage = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(BranchManagement, {}) });
};
export {
  AdminBranchManagementPage as default
};
