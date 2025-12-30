import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { u as useAuth, e as canPerformAction, S as ScrollableTable, M as Modal, d as DIR, j as apiClient } from "../entry-server.js";
import { useDispatch, useSelector } from "react-redux";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();
  JSON.parse(localStorage.getItem("permissions")) || [];
  const searchParams = new URLSearchParams(window.location.search);
  const batchId = searchParams.get("b_id");
  const { currentUser } = useAuth();
  currentUser?.user?.role;
  useDispatch();
  const { rolePermissions, loading: permLoading } = useSelector(
    (state) => state.permissions
  );
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/assignments");
      if (res.data.success) {
        let filteredAssignments = res.data.data;
        if (batchId) {
          filteredAssignments = res.data.data.filter(
            (assignment) => assignment.batches?.includes(batchId)
          );
        }
        setAssignments(filteredAssignments || []);
      } else {
        setError(res.data.message || "Failed to fetch assignments");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAssignments();
  }, []);
  const handleEdit = (id) => {
    if (!canPerformAction(rolePermissions, "assignment", "update")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to update assignments."
      });
      return;
    }
    navigate(`/edit-assignment/${id}`);
  };
  const handleDelete = async (id) => {
    if (!canPerformAction(rolePermissions, "assignment", "delete")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to delete assignments."
      });
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });
    if (!result.isConfirmed) return;
    try {
      await apiClient.delete(`/api/assignments/${id}`);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The assignment has been deleted successfully.",
        confirmButtonColor: "#0E55C8",
        timer: 2e3
      });
      fetchAssignments();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Failed to delete assignment.",
        confirmButtonColor: "#0E55C8"
      });
    }
  };
  const handleView = (assignment) => setSelectedAssignment(assignment);
  const closeModal = () => setSelectedAssignment(null);
  if (loading || permLoading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  const columns = [
    { header: "Title", accessor: "title" },
    // { header: "Chapter", accessor: (row) => row.chapter?.title || "-" },
    {
      header: "Deadline",
      accessor: (row) => row.deadline?.split("T")[0] || "-"
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleView(row),
            className: "px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition",
            children: "View"
          }
        ),
        canPerformAction(rolePermissions, "assignment", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEdit(row._id),
            className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "assignment", "create") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(
              `/evaluate-assignment?assignmentId=${row._id}&batchId=${batchId}`
            ),
            className: "px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition",
            children: "Evaluate"
          }
        ),
        canPerformAction(rolePermissions, "assignment", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(row._id),
            className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition",
            children: "Delete"
          }
        )
      ] })
    }
  ];
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading assignments..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  return /* @__PURE__ */ jsx("div", { className: "p-8 max-h-screen bg-white font-sans", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: "Manage Assignments" }),
      canPerformAction(rolePermissions, "assignment", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/add-assignment"),
          className: "px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition",
          children: "+ Add Assignment"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: assignments,
        maxHeight: "550px",
        emptyMessage: "No assignments available."
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: !!selectedAssignment,
        onClose: closeModal,
        header: selectedAssignment?.title || "Assignment Details",
        children: selectedAssignment ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase", children: "Title" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-800", children: selectedAssignment.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase", children: "Deadline" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-800", children: selectedAssignment.deadline ? new Date(selectedAssignment.deadline).toLocaleDateString() : "No deadline" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-500 uppercase", children: "Assignment File" }),
            selectedAssignment.fileUrl ? /* @__PURE__ */ jsx(
              "a",
              {
                href: `${DIR.ASSIGNMENT_FILES}${selectedAssignment.fileUrl}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 mt-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition",
                children: "📄 View Assignment File"
              }
            ) : /* @__PURE__ */ jsx("p", { className: "text-gray-400 italic", children: "No file uploaded" })
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { children: "Loading..." })
      }
    )
  ] }) });
}
export {
  ManageAssignments as default
};
