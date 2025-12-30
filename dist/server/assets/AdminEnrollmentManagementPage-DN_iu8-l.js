import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { a as fetchAllEnrollmentsAdmin } from "./enrollments-Cj9iMtZ0.js";
import { u as useAuth, S as ScrollableTable } from "../entry-server.js";
import "js-cookie";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/fa";
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
const AdminEnrollmentManagementPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  useEffect(() => {
    const loadEnrollments = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await fetchAllEnrollmentsAdmin(token);
          setEnrollments(res.data?.data || []);
          setError("");
        } catch (err) {
          setError("Failed to load enrollments.");
          console.error(err);
        }
        setLoading(false);
      }
    };
    loadEnrollments();
  }, [token]);
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600 mt-10", children: "Loading enrollments..." });
  if (error)
    return /* @__PURE__ */ jsx("p", { className: "text-center text-red-500 font-medium mt-10", children: error });
  const columns = [
    {
      header: "Training Title",
      accessor: (row) => row.enrollment.enrolledCourses?.map((c) => c.title).join(", ") || "N/A"
    },
    {
      header: "Enrolled On",
      accessor: (row) => row.enrollment.enrolledAt ? new Date(row.enrollment.enrolledAt).toLocaleDateString() : "N/A"
    },
    {
      header: "Participate Name",
      accessor: (row) => row.student?.fullName || "N/A"
    },
    {
      header: "Mobile No",
      accessor: (row) => row.student?.mobileNo || "N/A"
    },
    {
      header: "Email",
      accessor: (row) => row.student?.email || "N/A"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6 text-gray-900", children: "All Participate Enrollments" }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: enrollments,
        maxHeight: "600px",
        emptyMessage: "No enrollments found"
      }
    )
  ] });
};
export {
  AdminEnrollmentManagementPage as default
};
