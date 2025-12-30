import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaClone, FaFolderPlus, FaListAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { u as useAuth, C as COURSE_NAME, S as ScrollableTable, M as Modal, g as getAllCourses, e as canPerformAction, f as fetchCourseById, h as cloneCourse, i as deleteCourse } from "../entry-server.js";
import { useSelector } from "react-redux";
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
const CourseTable = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourseData, setModalCourseData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error2) {
      console.error(`Error fetching ${COURSE_NAME}:`, error2);
      Swal.fire({
        icon: "error",
        title: `Failed to load ${COURSE_NAME}`,
        text: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const handleDelete = async (id) => {
    if (!canPerformAction(rolePermissions, "course", "delete")) {
      Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: `You do not have permission to delete this ${COURSE_NAME}.`
      });
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete this ${COURSE_NAME}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((course) => course._id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${COURSE_NAME} deleted successfully.`,
        confirmButtonColor: "#28a745"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: err.message || `Failed to delete ${COURSE_NAME}.`,
        confirmButtonColor: "#d33"
      });
    } finally {
      setDeletingId(null);
    }
  };
  const handleViewClick = async (id) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const courseData = await fetchCourseById(id);
      setModalCourseData(courseData);
    } catch (err) {
      console.error(err);
      setModalCourseData(null);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || `Failed to fetch ${COURSE_NAME} details`
      });
    } finally {
      setModalLoading(false);
    }
  };
  const handleClone = async (id) => {
    if (!canPerformAction(rolePermissions, "course", "create")) {
      Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: `You do not have permission to clone this ${COURSE_NAME}.`
      });
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to clone this ${COURSE_NAME}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, clone it!",
      cancelButtonText: "Cancel"
    });
    if (result.isConfirmed) {
      try {
        const data = await cloneCourse(id);
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Cloned!",
            text: data.message || `${COURSE_NAME} cloned successfully.`
          });
          fetchCourses();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || `Failed to clone ${COURSE_NAME}.`
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Please Try Again !!"
        });
      }
    }
  };
  const columns = [
    { header: "Title", accessor: "title" },
    // { header: "Duration", accessor: "duration" },
    {
      header: "Batches Assigned",
      accessor: (row) => {
        const hasBatches = row.batches?.length > 0;
        return /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (hasBatches) {
                navigate(`/manage-batches?courseId=${row._id}`);
              } else {
                navigate(`/add-batch?courseId=${row._id}`);
              }
            },
            title: hasBatches ? "View Batch" : "Add Batch",
            className: `
            px-4 py-2 rounded-full font-semibold transition-transform
            ${hasBatches ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:scale-105 hover:from-blue-600 hover:to-blue-700" : "bg-gray-300 text-gray-800 shadow-inner hover:scale-105"}
          `,
            children: row.batches?.length || 0
          }
        ) });
      }
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleViewClick(row._id),
            title: "View",
            className: "p-2 bg-sky-500 text-white rounded hover:bg-sky-600",
            children: /* @__PURE__ */ jsx(FaEye, { size: 16 })
          }
        ),
        canPerformAction(rolePermissions, "course", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/courses/edit/${row._id}`),
            title: "Edit",
            className: "p-2 bg-amber-400 text-white rounded hover:bg-amber-500",
            children: /* @__PURE__ */ jsx(FaEdit, { size: 16 })
          }
        ),
        canPerformAction(rolePermissions, "course", "create") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleClone(row._id),
            title: "Clone",
            className: "p-2 bg-violet-600 text-white rounded hover:bg-violet-700",
            children: /* @__PURE__ */ jsx(FaClone, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/add-curriculum?type=phase&courseId=${row._id}`),
            title: "Add Curriculum",
            className: "p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700",
            children: /* @__PURE__ */ jsx(FaFolderPlus, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/manage-curriculum?courseId=${row._id}`),
            title: "Manage Curriculum",
            className: "p-2  bg-teal-600 text-white rounded hover:bg-teal-700",
            children: /* @__PURE__ */ jsx(FaListAlt, { size: 16 })
          }
        ),
        canPerformAction(rolePermissions, "course", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(row._id),
            disabled: deletingId === row._id,
            title: "Delete",
            className: "p-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50",
            children: /* @__PURE__ */ jsx(FaTrash, { size: 16 })
          }
        )
      ] })
    }
  ];
  const filteredAndSortedCourses = courses.filter(
    (course) => course.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  if (loading)
    return /* @__PURE__ */ jsx("div", { className: "text-center p-4 text-indigo-600", children: "Loading..." });
  if (error)
    return /* @__PURE__ */ jsx("div", { className: "text-center p-4 text-red-600 font-semibold", children: error });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center bg-white shadow-md px-6 py-4 rounded-md sticky top-0 z-10 gap-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-700 tracking-wide", children: [
        "Manage ",
        COURSE_NAME
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-72", children: [
          /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sky-800", size: 16 }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Search training...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10 pr-4 py-2 border border-sky-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 w-full shadow-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/add-courses"),
            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 shadow",
            children: "+ Create Training"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-sm rounded-md p-4", children: /* @__PURE__ */ jsx("div", { className: "max-h-[500px] overflow-auto rounded-md border", children: /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: filteredAndSortedCourses,
        maxHeight: "500px",
        emptyMessage: `No ${COURSE_NAME} Found`
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: modalCourseData ? modalCourseData.title : "Loading...",
        children: modalLoading ? /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center py-6", children: "Loading..." }) : modalCourseData ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-gray-700", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Description:" }),
            " ",
            modalCourseData.description
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Overview:" }),
            " ",
            modalCourseData.overview
          ] }),
          modalCourseData.learningOutcomes?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Learning Outcomes:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 space-y-1", children: modalCourseData.learningOutcomes.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) })
          ] }),
          modalCourseData.benefits?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Benefits:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 space-y-1", children: modalCourseData.benefits.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) })
          ] }),
          modalCourseData.keyFeatures?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Key Features:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 space-y-2", children: modalCourseData.keyFeatures.map((feature) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsxs("strong", { children: [
                feature.title,
                ":"
              ] }),
              " ",
              feature.description,
              feature.subPoints?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-decimal ml-5 mt-1", children: feature.subPoints.map((sub, i) => /* @__PURE__ */ jsx("li", { children: sub }, i)) })
            ] }, feature._id)) })
          ] }),
          modalCourseData.trainer?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Trainer Info:" }),
            modalCourseData.trainer.map((t) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "border border-gray-200 p-3 rounded-md mb-3",
                children: [
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Name:" }),
                    " ",
                    t.fullName
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Title:" }),
                    " ",
                    t.title
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Qualification:" }),
                    " ",
                    t.highestQualification
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "College:" }),
                    " ",
                    t.collegeName
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Total Experience:" }),
                    " ",
                    t.totalExperience
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "Available Timing:" }),
                    " ",
                    t.availableTiming
                  ] }),
                  /* @__PURE__ */ jsxs("p", { children: [
                    /* @__PURE__ */ jsx("strong", { children: "LinkedIn:" }),
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: t.linkedinProfile?.trim(),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-blue-600 underline",
                        children: t.linkedinProfile?.trim()
                      }
                    )
                  ] })
                ]
              },
              t._id
            ))
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Rating:" }),
            " ",
            modalCourseData.rating
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Enrolled Count:" }),
            " ",
            modalCourseData.enrolledCount
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Status:" }),
            " ",
            modalCourseData.isActive ? "Active" : "Inactive"
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center py-6", children: "No data found." })
      }
    )
  ] });
};
export {
  CourseTable as default
};
