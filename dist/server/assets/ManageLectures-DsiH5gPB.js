import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { e as canPerformAction, S as ScrollableTable, M as Modal, j as apiClient } from "../entry-server.js";
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
const ManageLectures = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/lectures");
        if (data.success) {
          setLectures(data.data);
        } else {
          setError("Failed to fetch recordings");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch recordings");
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);
  const handleView = (lecture) => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };
  const handleEdit = (lectureId) => {
    navigate(`/edit-lecture/${lectureId}`);
  };
  const handleDelete = async (lectureId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This lecture will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/lectures/${lectureId}`);
        Swal.fire("Deleted!", "Lecture has been deleted.", "success");
        setLectures(lectures.filter((lec) => lec._id !== lectureId));
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete lecture.", "error");
      }
    }
  };
  if (loading) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading recordings..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  const columns = [
    { header: "Title", accessor: (row) => row.title },
    // { header: "Chapter", accessor: (row) => row.chapter?.title || "-" },
    // { header: "Duration (min)", accessor: (row) => row.duration },
    // { header: "Status", accessor: (row) => row.status },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleView(row),
            className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition",
            children: "View"
          }
        ),
        canPerformAction(rolePermissions, "lecture", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEdit(row._id),
            className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "lecture", "delete") && /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs("div", { className: "p-8 min-h-screen bg-blue-50 font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: "Manage Recordings" }),
        canPerformAction(rolePermissions, "lecture", "create") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/add-course-videos"),
            className: "px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition",
            children: "+ Add Recording"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(ScrollableTable, { columns, data: lectures, maxHeight: "600px" })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: "Lecture Details",
        children: selectedLecture && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Title:" }),
            " ",
            selectedLecture.title
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Description:" }),
            " ",
            selectedLecture.description || "-"
          ] }),
          selectedLecture.batches?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Batches:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 mt-1", children: selectedLecture.batches.map((batch) => /* @__PURE__ */ jsxs("li", { children: [
              batch.batchName,
              " - ",
              batch.mode,
              " - ",
              batch.status,
              " -",
              " ",
              batch.studentCount,
              " participates"
            ] }, batch._id)) })
          ] })
        ] })
      }
    )
  ] });
};
export {
  ManageLectures as default
};
