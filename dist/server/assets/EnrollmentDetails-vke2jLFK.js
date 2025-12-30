import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FiUser, FiMail, FiBook, FiCalendar, FiCheckCircle, FiFileText, FiBarChart2, FiStar, FiUsers, FiClock, FiMapPin, FiXCircle, FiVideo, FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { C as COURSE_NAME, j as apiClient } from "../entry-server.js";
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
const EnrollmentDetails = () => {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheckCircle
      },
      completed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FiCheckCircle
      },
      upcoming: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FiClock
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: FiClock
      },
      inactive: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FiXCircle
      }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`,
        children: [
          /* @__PURE__ */ jsx(IconComponent, { size: 14 }),
          status
        ]
      }
    );
  };
  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart2 },
    { id: "courses", label: COURSE_NAME, icon: FiBook },
    { id: "batches", label: "Batches", icon: FiCalendar },
    { id: "attendance", label: "Attendance", icon: FiCheckCircle },
    { id: "assignments", label: "Assignments", icon: FiFileText }
  ];
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/enrollments/${id}`);
        if (res.data.success) {
          setEnrollment(res.data.data);
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to fetch enrollment",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [id]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Loading enrollment details..." })
    ] }) });
  }
  if (!enrollment) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(FiUser, { className: "text-gray-400 text-6xl mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "No Enrollment Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "The requested enrollment details could not be loaded." })
    ] }) });
  }
  const attendanceStats = enrollment.attendance?.reduce(
    (acc, record) => {
      const studentRecord = record.studentAttendance?.find(
        (s) => s.student === enrollment.studentId
      );
      if (studentRecord?.present) acc.present++;
      acc.total++;
      return acc;
    },
    { present: 0, total: 0 }
  ) || { present: 0, total: 0 };
  const attendancePercentage = attendanceStats.total > 0 ? Math.round(attendanceStats.present / attendanceStats.total * 100) : 0;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(FiUser, { className: "text-white text-2xl" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-900", children: enrollment.fullName }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsx(FiMail, { size: 16 }),
          enrollment.email
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-sm mt-1", children: [
          "Enrolled on",
          " ",
          new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center", children: [
        /* @__PURE__ */ jsx(FiBook, { className: "text-blue-600 text-xl mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: enrollment.enrolledCourses.length }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Training" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center", children: [
        /* @__PURE__ */ jsx(FiCalendar, { className: "text-green-600 text-xl mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: enrollment.enrolledBatches.length }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Batches" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center", children: [
        /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-purple-600 text-xl mx-auto mb-2" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
          attendancePercentage,
          "%"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Attendance" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center", children: [
        /* @__PURE__ */ jsx(FiFileText, { className: "text-orange-600 text-xl mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: enrollment.assignmentSubmissions.filter((a) => a.submitted).length }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Submitted" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto", children: tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 18 }),
            tab.label
          ]
        },
        tab.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FiUser, { className: "text-blue-600" }),
            "Participate Information"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Full Name" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: enrollment.fullName })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Email" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: enrollment.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Mobile" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: enrollment.mobileNo })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Password" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: enrollment.password })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Enrollment Date" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: new Date(enrollment.enrolledAt).toLocaleDateString() })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-green-600" }),
            "Attendance Summary"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative inline-block", children: [
            /* @__PURE__ */ jsx("div", { className: "w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [
                attendancePercentage,
                "%"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Present" })
            ] }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-green-500 border-t-8 border-r-8 border-b-8 border-l-8",
                style: {
                  clipPath: `inset(0 0 0 50%)`,
                  transform: `rotate(${attendancePercentage * 3.6}deg)`,
                  transformOrigin: "center"
                }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: attendanceStats.present }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Present" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-400", children: attendanceStats.total - attendanceStats.present }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Absent" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "courses" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: enrollment.enrolledCourses.map((course) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: course.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full", children: [
                /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-500", size: 14 }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-yellow-700", children: course.rating })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: course.description }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Duration" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: course.duration })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Participates" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FiUsers, { className: "text-gray-400", size: 14 }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: course.enrolledCount })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("button", { className: "flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm", children: "View Details" }),
              /* @__PURE__ */ jsx("button", { className: "flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm", children: "Resources" })
            ] })
          ]
        },
        course._id
      )) }),
      activeTab === "batches" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6", children: enrollment.enrolledBatches.map((batch) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900", children: batch.batchName }),
              getStatusBadge(batch.status)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ jsx(FiCalendar, { className: "text-blue-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Schedule" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: batch.days.join(", ") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ jsx(FiClock, { className: "text-green-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Timing" }),
                  /* @__PURE__ */ jsxs("p", { className: "font-semibold text-gray-900", children: [
                    batch.time.start,
                    " - ",
                    batch.time.end
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ jsx(FiMapPin, { className: "text-purple-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Mode" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 capitalize", children: batch.mode })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ jsx(FiUsers, { className: "text-orange-600" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Participates" }),
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: batch.studentCount })
                ] })
              ] })
            ] }),
            batch.additionalNotes && /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-blue-50 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800", children: [
              /* @__PURE__ */ jsx("strong", { children: "Notes: " }),
              batch.additionalNotes
            ] }) })
          ]
        },
        batch._id
      )) }),
      activeTab === "attendance" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: enrollment.attendance?.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center", children: [
        /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-gray-300 text-6xl mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "No Attendance Records" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Attendance records will appear here once classes begin." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: enrollment.attendance?.map((record) => {
        const studentRecord = record.studentAttendance?.find(
          (s) => s.student === enrollment.studentId
        );
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: record.meeting?.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: record.course?.title })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  studentRecord?.present ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200", children: [
                    /* @__PURE__ */ jsx(FiCheckCircle, { size: 14 }),
                    "Present"
                  ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200", children: [
                    /* @__PURE__ */ jsx(FiXCircle, { size: 14 }),
                    "Absent"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: new Date(record.markedAt).toLocaleDateString() })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiClock, { className: "text-gray-400" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Duration: ",
                    record.meeting?.duration,
                    " minutes"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiVideo, { className: "text-gray-400" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Platform: ",
                    record.meeting?.platform
                  ] })
                ] })
              ] }),
              record.meeting?.meetingDescription && /* @__PURE__ */ jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: record.meeting.meetingDescription }) })
            ]
          },
          record._id
        );
      }) }) }),
      activeTab === "assignments" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: enrollment.assignmentSubmissions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center", children: [
        /* @__PURE__ */ jsx(FiFileText, { className: "text-gray-300 text-6xl mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "No Assignments Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Assignments will appear here once they are assigned." })
      ] }) : enrollment.assignmentSubmissions.map((assignment) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-1", children: assignment.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: assignment.description })
              ] }),
              assignment.submitted ? getStatusBadge(assignment.submitted.status) : getStatusBadge("pending")
            ] }),
            assignment.submitted ? /* @__PURE__ */ jsx("div", { className: "bg-green-50 rounded-xl p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Submitted:" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: new Date(
                    assignment.submitted.submittedAt
                  ).toLocaleDateString() })
                ] }),
                assignment.submitted.remarks && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Remarks:" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: assignment.submitted.remarks })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: assignment.submitted.fileUrl,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors font-semibold text-sm",
                  children: [
                    /* @__PURE__ */ jsx(FiDownload, { size: 16 }),
                    "Download"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 rounded-xl p-4 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-yellow-700 font-medium", children: "Awaiting submission" }),
              /* @__PURE__ */ jsxs("p", { className: "text-yellow-600 text-sm mt-1", children: [
                "Due:",
                " ",
                assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "Not specified"
              ] })
            ] })
          ]
        },
        assignment._id
      )) })
    ] })
  ] }) });
};
export {
  EnrollmentDetails as default
};
