import { jsxs, jsx } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import "react";
import { motion } from "framer-motion";
import { C as COURSE_NAME } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "react-redux";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const Cards = ({
  title,
  description,
  actionButtons = [],
  className = "",
  variant = "default",
  // default, gradient, glass, minimal, elevated
  icon,
  // Optional icon component
  badge,
  // Optional badge text
  image,
  // Optional image URL
  footer,
  // Optional footer content
  stats,
  // Optional stats array: [{label: "Students", value: "150"}]
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-600",
  hoverEffect = true
}) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg",
    gradient: `bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`,
    glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
    minimal: "bg-transparent border-2 border-gray-300 shadow-sm",
    elevated: "bg-white border border-gray-100 shadow-2xl"
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: hoverEffect ? {
      scale: 1.03,
      y: -5,
      transition: { duration: 0.2 }
    } : {},
    tap: { scale: 0.98 }
  };
  const isDarkVariant = variant === "gradient" || variant === "glass";
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: `
        rounded-2xl p-6 flex flex-col justify-between 
        transition-all duration-300 relative overflow-hidden
        group cursor-pointer
        ${variants[variant]} ${className}
      `,
      variants: cardVariants,
      initial: "hidden",
      animate: "visible",
      whileHover: "hover",
      whileTap: "tap",
      children: [
        (variant === "minimal" || variant === "default") && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" }),
        badge && /* @__PURE__ */ jsx("div", { className: `
          absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold
          ${isDarkVariant ? "bg-white/20 text-white backdrop-blur-sm" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"}
        `, children: badge }),
        image && /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl mb-4 overflow-hidden shadow-md", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: title,
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
            icon && /* @__PURE__ */ jsx("div", { className: `
              p-2 rounded-lg flex-shrink-0
              ${isDarkVariant ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}
            `, children: icon }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("h2", { className: `
              text-xl font-bold leading-tight
              ${isDarkVariant ? "text-white" : "text-gray-800"}
            `, children: title }) })
          ] }),
          description && /* @__PURE__ */ jsx("p", { className: `
            text-sm leading-relaxed mt-2
            ${isDarkVariant ? "text-white/80" : "text-gray-600"}
          `, children: description }),
          stats && stats.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex gap-4 mt-4 pt-4 border-t border-gray-200/50", children: stats.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: `
                  text-lg font-bold
                  ${isDarkVariant ? "text-white" : "text-gray-800"}
                `, children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: `
                  text-xs
                  ${isDarkVariant ? "text-white/70" : "text-gray-500"}
                `, children: stat.label })
          ] }, index)) })
        ] }),
        actionButtons.length > 0 && /* @__PURE__ */ jsx("div", { className: `
          flex flex-wrap gap-2 mt-4 pt-4 relative z-10
          ${stats || description ? "border-t border-gray-200/50" : ""}
        `, children: actionButtons.map((button, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "flex-1 min-w-[120px]",
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: button
          },
          index
        )) }),
        footer && /* @__PURE__ */ jsx("div", { className: `
          mt-4 pt-4 border-t text-xs
          ${isDarkVariant ? "text-white/60 border-white/20" : "text-gray-500 border-gray-200"}
        `, children: footer }),
        /* @__PURE__ */ jsx("div", { className: `
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 pointer-events-none
        ${variant === "gradient" ? "bg-white/5" : variant === "glass" ? "bg-white/10" : "bg-black/5"}
      ` })
      ]
    }
  );
};
const EnrolledCoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courses = location.state?.enrolledCourses || [];
  return /* @__PURE__ */ jsxs("div", { className: "p-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition",
        children: "← Back"
      }
    ),
    /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-6", children: [
      "Enrolled ",
      COURSE_NAME
    ] }),
    courses.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No Training enrolled." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: courses.map((course, i) => /* @__PURE__ */ jsx(
      Cards,
      {
        title: course.title || course,
        variant: "elevated",
        badge: course.tag
      },
      i
    )) })
  ] });
};
export {
  EnrolledCoursesPage as default
};
