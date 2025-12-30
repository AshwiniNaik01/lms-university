import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { j as apiClient } from "../entry-server.js";
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
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
const Attendance = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markAll, setMarkAll] = useState(false);
  useEffect(() => {
    if (!meetingId) {
      console.error("No meetingId found in URL");
      setLoading(false);
      return;
    }
    apiClient.get(`/api/meetings/${meetingId}`).then((res) => {
      const meetingData = res.data?.data;
      setMeeting(meetingData);
      const students = meetingData?.batch?.students || [];
      const initialAttendees = students.map((student) => ({
        studentId: student.studentId,
        batchId: meetingData.batch._id,
        fullName: student.fullName,
        email: student.email,
        present: false
      }));
      setAttendees(initialAttendees);
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || "Failed to fetch session details";
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: errorMessage,
        confirmButtonText: "OK"
      });
      console.error("Failed to fetch session details:", err);
    }).finally(() => setLoading(false));
  }, [meetingId]);
  const handleToggle = (index) => {
    const newAttendees = [...attendees];
    newAttendees[index].present = !newAttendees[index].present;
    setAttendees(newAttendees);
  };
  const handleToggleAll = () => {
    const newMarkAll = !markAll;
    setMarkAll(newMarkAll);
    setAttendees((prev) => prev.map((a) => ({ ...a, present: newMarkAll })));
  };
  const handleSubmit = () => {
    if (!meetingId || attendees.length === 0) return;
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Once submitted, you won’t be able to update or change attendance!",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          attendees: attendees.map(({ studentId, batchId, present }) => ({
            studentId,
            batchId,
            present
          }))
        };
        apiClient.post(`/api/attendance/mark/${meetingId}`, payload).then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data?.message || "Attendance marked successfully!",
            confirmButtonText: "OK"
          }).then(() => {
            navigate(-1);
          });
        }).catch((err) => {
          const errorMessage = err.response?.data?.message || "Please try again!";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonText: "OK"
          });
        });
      }
    });
  };
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading session..." });
  if (!meeting) return /* @__PURE__ */ jsx("div", { children: "No session data available." });
  if (!attendees.length) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-10 px-6 mt-50 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 space-y-2", children: [
      /* @__PURE__ */ jsx(FiAlertTriangle, { className: "w-8 h-8" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "No participates found in this batch" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-700", children: "Please check the batch or add participates to mark attendance." })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "max-h-fit", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 flex justify-between items-center text-white", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-1", children: "Attendance Records" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-sm", children: "Manage Participate attendance for this session" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-100", children: "Total Participate" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: attendees.length })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-blue-100", children: "Mark All" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleToggleAll,
              className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${markAll ? "bg-green-400" : "bg-gray-300"}`,
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${markAll ? "translate-x-6" : "translate-x-1"}`
                }
              )
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase", children: "Participate" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase", children: "Email" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100", children: attendees.map((attendee, index) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "transition hover:bg-blue-50/50",
            children: [
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-4", children: attendee.fullName.split(" ").map((n) => n[0]).join("") }),
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-800", children: attendee.fullName })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-gray-600", children: attendee.email }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${attendee.present ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `w-2 h-2 rounded-full mr-2 ${attendee.present ? "bg-green-500" : "bg-red-500"}`
                      }
                    ),
                    attendee.present ? "Present" : "Absent"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleToggle(index),
                  className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${attendee.present ? "bg-green-500" : "bg-gray-300"}`,
                  children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${attendee.present ? "translate-x-6" : "translate-x-1"}`
                    }
                  )
                }
              ) })
            ]
          },
          attendee.studentId
        )) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-8 pt-6 border-t border-gray-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
              "Present:",
              " ",
              /* @__PURE__ */ jsx("strong", { children: attendees.filter((a) => a.present).length })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-red-500 rounded-full" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
              "Absent:",
              " ",
              /* @__PURE__ */ jsx("strong", { children: attendees.filter((a) => !a.present).length })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleSubmit,
            disabled: attendees.length === 0 || loading,
            className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2",
            children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "animate-spin", children: "⏳" }),
              /* @__PURE__ */ jsx("span", { children: "Submitting..." })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: "✅" }),
              /* @__PURE__ */ jsx("span", { children: "Submit Attendance" })
            ] })
          }
        )
      ] })
    ] })
  ] }) }) });
};
export {
  Attendance as default
};
