import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { e as canPerformAction, S as ScrollableTable, j as apiClient } from "../entry-server.js";
import { useSelector } from "react-redux";
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
const ManageTest = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const columns = [
    { header: "Test Name", accessor: (row) => row.title || "Untitled" },
    { header: "Level", accessor: (row) => row.testLevel || "N/A" },
    {
      header: "Duration",
      accessor: (row) => `${row.testDuration?.minutes || 0}m ${row.testDuration?.seconds || 0}s`
    },
    { header: "Total Marks", accessor: (row) => row.totalMarks || "--" },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all",
            onClick: () => navigate(`/view-excel/${row._id}`),
            children: "📂 View"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-purple-500 text-white px-4 py-2 rounded-lg",
            onClick: () => handleShare(row._id),
            children: "🔗 Share Test"
          }
        ),
        canPerformAction(rolePermissions, "test", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            className: "bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all",
            onClick: () => handleDelete(row._id),
            children: "🗑️ Delete"
          }
        )
      ] })
    }
  ];
  const handleShare = (testId) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/start-test/${testId}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: "success",
      title: "Test Link Copied!",
      text: url,
      confirmButtonText: "OK"
    });
  };
  const fetchTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/tests`);
      console.log("API Response:", response.data);
      if (response.data?.data && Array.isArray(response.data.data)) {
        setTests(response.data.data);
      } else {
        setTests([]);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError("Failed to fetch tests. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Error fetching data"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTests();
  }, []);
  const handleDelete = async (testId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this test?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/tests/${testId}`);
        Swal.fire("Deleted!", "Test has been deleted.", "success");
        fetchTests();
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to delete test.",
          "error"
        );
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-full h-full mx-auto p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800", children: "All Tests 📘" }),
      canPerformAction(rolePermissions, "test", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all",
          onClick: () => navigate("/add-test"),
          children: "+ Add Assessment Test"
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("p", { className: "text-blue-500 font-semibold", children: "Loading..." }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-500 font-semibold", children: error }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: tests,
        maxHeight: "500px",
        emptyMessage: "No tests found."
      }
    )
  ] });
};
export {
  ManageTest as default
};
