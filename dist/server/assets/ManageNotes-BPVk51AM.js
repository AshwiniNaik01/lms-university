import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { a as fetchAllNotes, d as deleteNote } from "./notes-CrravVGs.js";
import { e as canPerformAction, S as ScrollableTable, M as Modal, d as DIR } from "../entry-server.js";
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
const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const loadNotes = async () => {
    setLoading(true);
    try {
      const notesData = await fetchAllNotes();
      setNotes(notesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotes();
  }, []);
  const handleEdit = (id) => {
    navigate(`/edit-note/${id}`);
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this Study Material!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e55c8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      await deleteNote(id);
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Study Material deleted successfully!"
      });
      loadNotes();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete note."
      });
    }
  };
  const handleView = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };
  const columns = [
    { header: "Title", accessor: "title" },
    // {
    //   header: "Chapter",
    //   accessor: (row) => row.chapter?.title || row.chapter || "-",
    // },
    // { header: "Duration", accessor: (row) => row.duration || "-" },
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
        canPerformAction(rolePermissions, "note", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEdit(row._id),
            className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "note", "delete") && /* @__PURE__ */ jsx(
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
  if (loading) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading notes..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-h-screen bg-white font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-8 py-2 bg-white shadow-md z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: "Manage Reference Material Repository" }),
      canPerformAction(rolePermissions, "note", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/add-notes"),
          className: "px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition",
          children: "+ Add Reference Material"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsx(ScrollableTable, { columns, data: notes, maxHeight: "440px" }) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: selectedNote?.title || "Note Details",
        children: selectedNote && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Title" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedNote.title })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Content" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedNote.content || "No description available." })
            ] })
          ] }),
          selectedNote.file && /* @__PURE__ */ jsxs("div", { className: "flex flex-col mt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "File" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: DIR.COURSE_NOTES + selectedNote.file,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "mt-2 text-blue-600 hover:underline font-medium",
                children: "View File"
              }
            )
          ] })
        ] })
      }
    )
  ] });
};
export {
  ManageNotes as default
};
