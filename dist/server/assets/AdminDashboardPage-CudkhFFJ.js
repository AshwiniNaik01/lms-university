import { jsx, jsxs } from "react/jsx-runtime";
import { FaBook, FaClipboardList, FaFileAlt, FaCalendarCheck, FaTasks, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";
import { C as COURSE_NAME } from "../entry-server.js";
import "react-dom/server";
import "react";
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
const dashboardCards = [
  {
    title: "Batch Management",
    desc: `Add new batches, update existing ones, and manage study material structure.`,
    link: "/manage-batches",
    icon: /* @__PURE__ */ jsx(FaBook, {})
  },
  {
    title: `${COURSE_NAME} Management`,
    desc: `Add new ${COURSE_NAME}, update existing ones, and manage curriculum structure.`,
    link: "/manage-courses",
    icon: /* @__PURE__ */ jsx(FaBook, {})
  },
  {
    title: "Participant Management",
    desc: "View all participate enrollments, track progress, and manage participate data.",
    link: "/enrolled-student-list",
    icon: /* @__PURE__ */ jsx(FaClipboardList, {})
  },
  {
    title: "Trainer Management",
    desc: "Manage trainer profiles, assignments, and performance tracking.",
    link: "/trainer-management",
    icon: /* @__PURE__ */ jsx(HiOutlineUserGroup, {})
  },
  {
    title: "Pre requisite Learning",
    desc: "Manage trainer profiles, assignments, and performance tracking.",
    link: "/manage-prerequisite",
    icon: /* @__PURE__ */ jsx(HiOutlineUserGroup, {})
  },
  {
    title: "Assessment Tests",
    desc: "Create, manage, and evaluate assessment tests and quizzes.",
    link: "/manage-test",
    icon: /* @__PURE__ */ jsx(FaFileAlt, {})
  },
  {
    title: "Reference Materials Repository",
    desc: "Create, manage, and evaluate reference materials.",
    link: "/manage-notes",
    icon: /* @__PURE__ */ jsx(FaFileAlt, {})
  },
  {
    title: "Attendance Tracker",
    desc: "Monitor and manage participate attendance across all sessions.",
    link: "/manage-meeting",
    icon: /* @__PURE__ */ jsx(FaCalendarCheck, {})
  },
  {
    title: "Assignment Management",
    desc: "Create assignments, track submissions, and provide feedback.",
    link: "/manage-assignments",
    icon: /* @__PURE__ */ jsx(FaTasks, {})
  },
  {
    title: "Feedback Management",
    desc: "Create assignments, track submissions, and provide feedback.",
    link: "/manage-feedback",
    icon: /* @__PURE__ */ jsx(FaTasks, {})
  },
  {
    title: "Book Session - Upskilling",
    desc: "Schedule and manage upskilling sessions for participates or staff.",
    link: "/book-session",
    icon: /* @__PURE__ */ jsx(FaChalkboardTeacher, {})
  },
  {
    title: "User Management",
    desc: "View, edit, and manage all users with role-based access control.",
    link: "/users",
    icon: /* @__PURE__ */ jsx(FaUsers, {})
  }
];
const AdminDashboardPage = () => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("header", { className: "mb-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold text-gray-900 mb-3", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-lg max-w-2xl mx-auto", children: [
        "Centralized platform to manage all aspects of your ",
        COURSE_NAME
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8", children: dashboardCards.map((card, idx) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "\r\n        bg-white \r\n        rounded-3xl \r\n        p-8 \r\n        shadow-lg \r\n        hover:shadow-2xl \r\n        transition-all \r\n        duration-500 \r\n        transform \r\n        hover:scale-[1.04] \r\n        ease-in-out \r\n        cursor-pointer \r\n        group\r\n      ",
        style: { animationDelay: `${idx * 100}ms` },
        "data-aos": "fade-up",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 mb-6", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `${card.iconBg} 
            rounded-2xl 
            p-5 
            shadow-md 
            text-4xl 
            flex items-center justify-center 
            transition-transform duration-300 
            group-hover:scale-110`,
                children: card.icon
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300", children: card.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8 leading-relaxed text-[15px]", children: card.desc }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: card.link,
              className: "\r\n          inline-block \r\n          px-6 py-3 \r\n          bg-gradient-to-r from-indigo-600 to-purple-600 \r\n          hover:from-indigo-700 hover:to-purple-700 \r\n          text-white font-semibold \r\n          rounded-lg \r\n          shadow-lg \r\n          transition duration-300 \r\n          ease-in-out\r\n        ",
              children: [
                "View ",
                card.title
              ]
            }
          )
        ]
      },
      idx
    )) })
  ] }) });
};
export {
  AdminDashboardPage as default
};
