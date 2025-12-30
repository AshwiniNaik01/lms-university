import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { e as canPerformAction, S as ScrollableTable, C as COURSE_NAME, M as Modal, j as apiClient, F as fetchActiveBatchById } from "../entry-server.js";
import { useSelector } from "react-redux";
import { u as usePassword } from "./usePassword-CcEJjiKI.js";
import "react-dom/server";
import "react-toastify";
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
const EnrolledStudentList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get("b_id");
  const [enrollments, setEnrollments] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [resetUser, setResetUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    password: resetPassword,
    setPassword: setResetPassword,
    generate: generateResetPassword
  } = usePassword("");
  const handleResetPassword = async () => {
    if (!resetPassword || !confirmPassword) {
      Swal.fire("Error", "Password fields cannot be empty", "error");
      return;
    }
    if (resetPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }
    if (!resetUser?.enrollmentId) {
      Swal.fire("Error", "No enrollment selected for password reset", "error");
      return;
    }
    try {
      await apiClient.put(
        `/api/enrollments/${resetUser.enrollmentId}`,
        { password: resetPassword }
        // sending as JSON
      );
      Swal.fire("Success", "Password reset successfully", "success");
      setResetUser(null);
      setResetPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    }
  };
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/enrollments");
        let data = res.data.data || [];
        if (batchIdParam) {
          data = data.filter(
            (enroll) => enroll.enrollment?.enrolledBatches?.some(
              (b) => b._id === batchIdParam
            )
          );
        }
        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [batchIdParam]);
  const columns = [
    {
      header: "Participate Name",
      accessor: (row) => row.student?.fullName || "-"
    },
    {
      header: "Email",
      accessor: (row) => row.student?.email || "-"
    },
    // {
    //   header: "Mobile No",
    //   accessor: (row) => row.student?.mobileNo || "-",
    // },
    // ✅ Only show Training Program column if no batch filter
    !batchIdParam && {
      // header: "Training Program",
      header: COURSE_NAME,
      accessor: (row) => {
        const count = row.enrollment?.enrolledCourses?.length || 0;
        return count > 0 ? /* @__PURE__ */ jsxs(
          "button",
          {
            className: "text-blue-600 font-medium hover:underline",
            onClick: () => {
              navigate(`/enrollments/${row.enrollment._id}/courses`, {
                state: {
                  enrolledCourses: row.enrollment?.enrolledCourses || []
                }
              });
            },
            children: [
              count,
              " ",
              count === 1 ? "Training" : "Trainings"
            ]
          }
        ) : "—";
      }
    },
    {
      header: "Enrolled At",
      accessor: (row) => new Date(row.enrollment?.enrolledAt).toLocaleString() || "-"
    },
    {
      header: "Reset Password",
      accessor: (row) => canPerformAction(rolePermissions, "enrollment", "update") ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setResetUser({ ...row.student, enrollmentId: row.enrollment._id }),
          className: "text-indigo-600 hover:underline text-sm font-medium",
          children: "Reset"
        }
      ) : null
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/enrollments/${row.enrollment._id}`),
            className: "text-white font-medium bg-blue-500 px-4 py-2 rounded-md",
            children: "View"
          }
        ),
        canPerformAction(rolePermissions, "enrollment", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/enroll-student/${row.enrollment._id}`),
            className: "text-white font-medium bg-yellow-500 px-4 py-2 rounded-md",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "enrollment", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: async () => {
              const result = await Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete ${row.student?.fullName}'s enrollment?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
              });
              if (result.isConfirmed) {
                try {
                  setLoading(true);
                  await apiClient.delete(
                    `/api/enrollments/${row.enrollment._id}`
                  );
                  Swal.fire(
                    "Deleted!",
                    "Enrollment has been deleted.",
                    "success"
                  );
                  setEnrollments(
                    (prev) => prev.filter(
                      (e) => e.enrollment._id !== row.enrollment._id
                    )
                  );
                } catch (err) {
                  console.error(err);
                  Swal.fire(
                    "Error",
                    err.response?.data?.message || "Failed to delete enrollment.",
                    "error"
                  );
                } finally {
                  setLoading(false);
                }
              }
            },
            className: "text-white font-medium bg-red-500 px-4 py-2 rounded-md",
            children: "Delete"
          }
        )
      ] })
    }
  ].filter(Boolean);
  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchIdParam) return;
      try {
        setBatchLoading(true);
        const response = await fetchActiveBatchById(batchIdParam);
        console.log("Fetched batch:", response);
        setBatchName(response?.batchName || "");
      } catch (err) {
        console.error("Error fetching batch:", err);
      } finally {
        setBatchLoading(false);
      }
    };
    fetchBatch();
  }, [batchIdParam]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-h-screen bg-white font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-8 py-2 bg-white shadow-md z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: batchLoading ? "Loading batch..." : batchName ? `Enrolled Participate list for ${batchName}` : "Manage Enrolled Participate" }),
      canPerformAction(rolePermissions, "enrollment", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/enroll-student"),
          className: "px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition",
          children: "+ Enroll New Participate"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-10 text-lg font-medium", children: "Loading enrollments..." }) : /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: enrollments,
        maxHeight: "440px",
        emptyMessage: "No enrollments found."
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: modalType === "courses" ? "Training Enrolled" : selectedEnrollment?.student?.fullName || "Enrollment Details",
        children: selectedEnrollment && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Participate Name" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedEnrollment.student?.fullName })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Email" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedEnrollment.student?.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Mobile" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedEnrollment.student?.mobileNo })
          ] })
        ] }) })
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
export {
  EnrolledStudentList as default
};
