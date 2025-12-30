import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { j as apiClient, S as ScrollableTable } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
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
const EventTablePage = ({ isOpen, onClose, onEdit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/event");
      if (res.data.success) setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (typeof window === "undefined" || !window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiClient.delete(`/api/event/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Slug", accessor: "slug" },
    { header: "Category", accessor: (row) => row.category?.name || "N/A" },
    {
      header: "Start Date",
      accessor: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"
    },
    {
      header: "End Date",
      accessor: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"
    },
    { header: "Mode", accessor: "mode" },
    { header: "Organizer", accessor: "organizer" },
    { header: "Max Participants", accessor: "maxParticipants" },
    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate(`/session-category/${row.category?._id}/manage`),
            className: "px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(FaEdit, { size: 14 }),
              " Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleDelete(row._id),
            className: "px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(FaTrash, { size: 14 }),
              " Delete"
            ]
          }
        )
      ] })
    }
  ];
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl w-full max-w-6xl shadow-lg p-6 relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-red-500 hover:text-red-700",
        children: /* @__PURE__ */ jsx(FaTimes, { size: 20 })
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Events Table" }),
    loading ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500", children: "Loading events..." }) : /* @__PURE__ */ jsx(ScrollableTable, { columns, data: events, maxHeight: "500px" })
  ] }) });
};
export {
  EventTablePage as default
};
