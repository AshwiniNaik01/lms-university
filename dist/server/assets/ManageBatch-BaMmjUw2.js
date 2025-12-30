import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { e as canPerformAction, C as COURSE_NAME, S as ScrollableTable, M as Modal, g as getAllCourses, a6 as fetchAllBatches, l as fetchBatchesByCourseId, F as fetchActiveBatchById, a7 as deleteBatch } from "../entry-server.js";
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
const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [noBatchesMessage, setNoBatchesMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchBatches = async () => {
    try {
      const data = await fetchAllBatches();
      setBatches(data);
      setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
    } catch (err) {
      setNoBatchesMessage(err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Batches",
        text: err.message,
        confirmButtonColor: "#3085d6"
      });
    }
  };
  const loadBatchesByCourse = async (courseId) => {
    try {
      if (courseId === "all") {
        const data2 = await fetchAllBatches();
        setBatches(data2);
        setNoBatchesMessage(data2.length === 0 ? "No batches available" : "");
        return;
      }
      const data = await fetchBatchesByCourseId(courseId);
      if (data.length > 0) {
        setBatches(data);
        setNoBatchesMessage("");
      } else {
        setBatches([]);
        setNoBatchesMessage(`No batches found for this ${COURSE_NAME}`);
        Swal.fire({
          icon: "info",
          title: "No Batches Found",
          text: `No batches found for this selected ${COURSE_NAME}.`,
          confirmButtonColor: "#3085d6"
        });
      }
    } catch (err) {
      setBatches([]);
      setNoBatchesMessage(err.message);
      Swal.fire({
        icon: "error",
        title: `Error Fetching ${COURSE_NAME} Batches`,
        text: err.message,
        confirmButtonColor: "#d33"
      });
    }
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData || []);
        const queryParams = new URLSearchParams(location.search);
        const courseIdFromURL = queryParams.get("courseId");
        if (courseIdFromURL && coursesData.some((c) => c._id === courseIdFromURL)) {
          setSelectedCourseId(courseIdFromURL);
          await loadBatchesByCourse(courseIdFromURL);
        } else {
          setSelectedCourseId("all");
          await fetchBatches();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: `Error Fetching ${COURSE_NAME}`,
          text: err.response?.data?.message || err.message,
          confirmButtonColor: "#d33"
        });
      }
    };
    initialize();
  }, [location.search]);
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the batch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (!confirmation.isConfirmed) return;
    try {
      await deleteBatch(id);
      fetchBatches();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Batch has been deleted successfully.",
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete batch";
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: errorMessage
      });
    }
  };
  const handleView = async (batchId) => {
    try {
      const batch = await fetchActiveBatchById(batchId);
      setSelectedBatch(batch);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch batch details";
      Swal.fire({
        icon: "warning",
        title: "Error Fetching Details",
        text: errorMessage,
        confirmButtonColor: "#d33"
      });
    }
  };
  const handleEdit = (batchId) => navigate(`/add-batch/${batchId}`);
  const handleCourseFilterChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    loadBatchesByCourse(courseId);
  };
  const columns = [
    { header: "Batch Name", accessor: (row) => row.batchName || "-" },
    {
      header: "Time",
      accessor: (row) => `${row.time?.start || "-"} - ${row.time?.end || "-"}`
    },
    { header: "Mode", accessor: (row) => row.mode || "-" },
    // {
    //   header: "Trainers",
    //   accessor: (row) =>
    //     row.trainersAssigned?.map((t) => t?.fullName).join(", ") || "-",
    // },
    // { header: "Status", accessor: (row) => row.status || "-" },
    {
      header: "Actions",
      accessor: (row) => {
        const batchId = row._id;
        const courseIds = row.coursesAssigned?.map((c) => c._id).join(",");
        return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleView(batchId),
              className: "px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm",
              children: "View"
            }
          ),
          canPerformAction(rolePermissions, "batch", "update") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEdit(batchId),
              className: "px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm",
              children: "Edit"
            }
          ),
          canPerformAction(rolePermissions, "batch", "delete") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(batchId),
              className: "px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm",
              children: "Delete"
            }
          ),
          canPerformAction(rolePermissions, "enrollment", "create") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(
                `/enrollments/upload-excel?batchId=${batchId}&courseIds=${courseIds}`
              ),
              className: "px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm",
              children: "Add Participate"
            }
          ),
          canPerformAction(rolePermissions, "enrollment", "read") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(`/enrolled-student-list?b_id=${batchId}`),
              className: "px-2 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600 text-sm",
              children: "View Participate"
            }
          ),
          canPerformAction(rolePermissions, "feedback", "create") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.href = `/create-feedback?batchId=${batchId}&courseId=${courseIds}`,
              className: "px-2 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 text-sm",
              children: "Create Feedback"
            }
          ),
          canPerformAction(rolePermissions, "enrollment", "read") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(
                `/manage-feedback?b_id=${batchId}&courseId=${courseIds}`
              ),
              className: "px-2 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm",
              children: "View Feedback"
            }
          ),
          canPerformAction(rolePermissions, "assignment", "read") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(
                `/manage-assignments?b_id=${batchId}&courseId=${courseIds}`
              ),
              className: "px-2 py-1 rounded-md bg-pink-500 text-white hover:bg-pink-600 text-sm",
              children: "View Assignment"
            }
          ),
          canPerformAction(rolePermissions, "test", "read") && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(`/view-tests/batch/${batchId}`),
              className: "px-2 py-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 text-sm",
              children: "View Assessment"
            }
          )
        ] });
      }
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "p-8 font-sans bg-white max-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold text-gray-800", children: "Manage Batches" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("label", { className: "font-semibold text-gray-700", children: [
            "Filter by ",
            COURSE_NAME,
            ":"
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedCourseId,
              onChange: handleCourseFilterChange,
              className: "p-2 border rounded-md border-gray-300",
              children: [
                /* @__PURE__ */ jsxs("option", { value: "all", children: [
                  "All ",
                  COURSE_NAME
                ] }),
                courses.map((course) => /* @__PURE__ */ jsx("option", { value: course._id, children: course.title }, course._id))
              ]
            }
          )
        ] }),
        canPerformAction(rolePermissions, "batch", "create") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/add-batch"),
            className: "bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition",
            children: "+ Create Batch"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: batches,
        maxHeight: "600px",
        emptyMessage: noBatchesMessage || "No batches found"
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: selectedBatch ? `Batch: ${selectedBatch.batchName}` : "Batch Details",
        children: selectedBatch ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Time:" }),
              " ",
              selectedBatch.time?.start || "-",
              " -",
              " ",
              selectedBatch.time?.end || "-"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Mode:" }),
              " ",
              selectedBatch.mode || "-"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
              /* @__PURE__ */ jsx("strong", { children: "Days:" }),
              " ",
              selectedBatch.days?.length > 0 ? selectedBatch.days.join(", ") : "-"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
            /* @__PURE__ */ jsxs("strong", { children: [
              COURSE_NAME,
              ":"
            ] }),
            " ",
            selectedBatch.coursesAssigned?.map((c) => c?.title).join(", ") || "-"
          ] }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
            /* @__PURE__ */ jsx("strong", { children: "Notes:" }),
            " ",
            selectedBatch.additionalNotes || "No notes available"
          ] }) })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic", children: "Loading batch details..." })
      }
    )
  ] });
};
export {
  ManageBatch as default
};
