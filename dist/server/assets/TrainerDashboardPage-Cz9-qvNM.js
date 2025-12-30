import { jsx, jsxs } from "react/jsx-runtime";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { FaUser, FaAward, FaChalkboardTeacher, FaUsers, FaBriefcase, FaStar, FaEnvelope, FaPhone, FaEdit, FaCalendarAlt, FaGraduationCap, FaLinkedin, FaCertificate, FaMapMarkerAlt, FaFilePdf, FaIdCard, FaClipboardList, FaBookOpen, FaChartLine } from "react-icons/fa";
import { C as COURSE_NAME, d as DIR } from "../entry-server.js";
import { a as fetchTrainerById } from "./trainerApi-uqZoQf46.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
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
const cleanValue = (value) => {
  if (value === "NA" || value === "" || value === "null" || value === null || value === void 0) {
    return "";
  }
  return value;
};
const cleanArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (v) => v && v !== "NA" && v !== "null" && v !== ""
  );
};
const normalizeTrainer = (data) => ({
  ...data,
  fullName: cleanValue(data.fullName),
  title: cleanValue(data.title),
  email: cleanValue(data.email),
  mobileNo: cleanValue(data.mobileNo),
  dob: cleanValue(data.dob),
  gender: cleanValue(data.gender),
  highestQualification: cleanValue(data.highestQualification),
  totalExperience: cleanValue(data.totalExperience),
  resume: cleanValue(data.resume),
  availableTiming: cleanValue(data.availableTiming),
  linkedinProfile: cleanValue(data.linkedinProfile),
  summary: cleanValue(data.summary),
  collegeName: cleanValue(data.collegeName),
  profilePhotoTrainer: cleanValue(data.profilePhotoTrainer),
  idProofTrainer: cleanValue(data.idProofTrainer),
  address: {
    add1: cleanValue(data.address?.add1),
    add2: cleanValue(data.address?.add2),
    taluka: cleanValue(data.address?.taluka),
    dist: cleanValue(data.address?.dist),
    state: cleanValue(data.address?.state),
    pincode: cleanValue(data.address?.pincode)
  },
  certifications: cleanArray(data.certifications),
  achievements: cleanArray(data.achievements),
  skills: cleanArray(data.skills),
  courses: cleanArray(data.courses),
  batches: cleanArray(data.batches)
});
const TrainerDashboardPage = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const trainerId = Cookies.get("trainerId");
        if (!trainerId) return;
        const response = await fetchTrainerById(trainerId);
        const normalizedTrainer = normalizeTrainer(response.data || response);
        setTrainer(normalizedTrainer);
      } catch (error) {
        console.error("❌ Failed to fetch trainer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg font-medium text-gray-600", children: "Loading Trainer Profile..." })
    ] }) });
  }
  if (!trainer) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(FaUser, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-700", children: "Trainer Not Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-2", children: "We couldn't find your trainer profile." })
    ] }) });
  }
  const ProfileHeader = () => /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg mb-8 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 opacity-10", children: /* @__PURE__ */ jsx("svg", { width: "200", height: "200", viewBox: "0 0 200 200", children: /* @__PURE__ */ jsx(
      "path",
      {
        fill: "currentColor",
        d: "M45,-78.3C58.5,-69.8,69.4,-57.1,78.1,-42.4C86.8,-27.6,93.4,-10.9,92.9,5.9C92.4,22.6,84.8,39.4,73.1,52.2C61.4,65,45.6,73.9,29.1,78.7C12.6,83.5,-4.6,84.2,-20.8,80.1C-37,76,-52.2,67.1,-63.6,54.5C-75,41.9,-82.6,25.6,-83.9,8.7C-85.2,-8.2,-80.2,-25.6,-70.7,-39.6C-61.2,-53.6,-47.2,-64.2,-32.2,-72.1C-17.2,-80,-1.1,-85.2,14.2,-83.8C29.5,-82.4,44,-74.4,45,-78.3Z",
        transform: "translate(100 100)"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-28 h-28 bg-white/20 rounded-full flex items-center justify-center shadow-lg", children: trainer.profilePhotoTrainer ? /* @__PURE__ */ jsx(
          "img",
          {
            src: `${DIR.TRAINER_PROFILE_PHOTO}${trainer.profilePhotoTrainer}`,
            alt: "Trainer Profile",
            className: "w-24 h-24 rounded-full object-cover border-4 border-white/30"
          }
        ) : /* @__PURE__ */ jsx(FaUser, { className: "w-12 h-12 text-white/70" }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${trainer.isActive ? "bg-green-400" : "bg-gray-400"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold mb-1", children: trainer.fullName }),
        /* @__PURE__ */ jsx("p", { className: "text-indigo-100 mb-3", children: trainer.title || "Professional Trainer" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-4", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-3 py-1 rounded-full text-sm font-medium ${trainer.isApproved ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`,
              children: trainer.approvalStatus
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full", children: [
            /* @__PURE__ */ jsx(FaStar, { className: "text-yellow-400" }),
            /* @__PURE__ */ jsx("span", { children: "4.8 Rating" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full", children: [
            /* @__PURE__ */ jsx(FaUsers, { className: "text-indigo-300" }),
            /* @__PURE__ */ jsx("span", { children: "250+ Participate" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: "bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md", children: /* @__PURE__ */ jsx(FaEnvelope, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("button", { className: "bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md", children: /* @__PURE__ */ jsx(FaPhone, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("button", { className: "bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full shadow-md", children: /* @__PURE__ */ jsx(FaEdit, { className: "w-5 h-5" }) })
      ] })
    ] })
  ] });
  const InfoCard = ({ title, icon, children, className = "", action }) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md ${className}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg text-indigo-600", children: icon }),
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800", children: title })
          ] }),
          action && /* @__PURE__ */ jsx("button", { className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium", children: action })
        ] }),
        children
      ]
    }
  );
  const DetailItem = ({ icon, label, value, link }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 py-2 border-b border-gray-100 last:border-b-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-indigo-500 mt-1 bg-indigo-50 p-1 rounded-md", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wide", children: label }),
      link ? /* @__PURE__ */ jsx(
        "a",
        {
          href: link,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-indigo-600 hover:underline font-medium text-sm",
          children: value
        }
      ) : /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 text-sm", children: value || "Not provided" })
    ] })
  ] });
  const TabButton = ({ name, icon, isActive }) => /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => setActiveTab(name.toLowerCase()),
      className: `flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"}`,
      children: [
        icon,
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: name })
      ]
    }
  );
  const OverviewTab = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Personal Information",
          icon: /* @__PURE__ */ jsx(FaUser, { className: "w-5 h-5" }),
          action: "Edit",
          children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaEnvelope, { className: "w-3 h-3" }),
                label: "Email",
                value: trainer.email,
                link: `mailto:${trainer.email}`
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaPhone, { className: "w-3 h-3" }),
                label: "Mobile",
                value: trainer.mobileNo,
                link: `tel:${trainer.mobileNo}`
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaCalendarAlt, { className: "w-3 h-3" }),
                label: "Date of Birth",
                value: trainer.dob || "Not provided"
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaUser, { className: "w-3 h-3" }),
                label: "Gender",
                value: trainer.gender
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaGraduationCap, { className: "w-3 h-3" }),
                label: "Highest Qualification",
                value: trainer.highestQualification
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaBriefcase, { className: "w-3 h-3" }),
                label: "Total Experience",
                value: `${trainer.totalExperience} years`
              }
            ),
            trainer.collegeName && /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaGraduationCap, { className: "w-3 h-3" }),
                label: "College",
                value: trainer.collegeName
              }
            ),
            /* @__PURE__ */ jsx(
              DetailItem,
              {
                icon: /* @__PURE__ */ jsx(FaLinkedin, { className: "w-3 h-3" }),
                label: "LinkedIn",
                value: trainer.linkedinProfile,
                link: trainer.linkedinProfile
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Certifications",
          icon: /* @__PURE__ */ jsx(FaCertificate, { className: "w-5 h-5" }),
          action: "Add",
          children: trainer.certifications.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: trainer.certifications.map((cert, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100",
              children: [
                /* @__PURE__ */ jsx(FaCertificate, { className: "w-4 h-4 text-green-500 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800 truncate", children: cert })
              ]
            },
            idx
          )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-gray-500 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsx(FaCertificate, { className: "w-10 h-10 text-gray-300 mx-auto mb-2" }),
            /* @__PURE__ */ jsx("p", { children: "No certifications added" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Address",
          icon: /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "w-5 h-5" }),
          action: "Update",
          children: /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 text-sm", children: trainer.address.add1 }),
              trainer.address.add2 && /* @__PURE__ */ jsx("p", { className: "text-gray-800 text-sm", children: trainer.address.add2 }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
                trainer.address.taluka,
                ", ",
                trainer.address.dist
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
                trainer.address.state,
                " - ",
                trainer.address.pincode
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 pt-3 border-t border-indigo-100", children: /* @__PURE__ */ jsx("button", { className: "w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors", children: "View on Map" }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Documents",
          icon: /* @__PURE__ */ jsx(FaFilePdf, { className: "w-5 h-5" }),
          action: "Upload",
          children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-100 rounded-md", children: /* @__PURE__ */ jsx(FaFilePdf, { className: "w-4 h-4 text-red-500" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-sm block", children: "Resume" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "PDF Document" })
                ] })
              ] }),
              trainer.resume && /* @__PURE__ */ jsx(
                "a",
                {
                  href: `${DIR.TRAINER_RESUME}${trainer.resume}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-white py-1 px-3 rounded-md border border-indigo-100 shadow-sm",
                  children: "View"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-100 rounded-md", children: /* @__PURE__ */ jsx(FaIdCard, { className: "w-4 h-4 text-blue-500" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-sm block", children: "ID Proof" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Identification" })
                ] })
              ] }),
              trainer.idProofTrainer && /* @__PURE__ */ jsx(
                "a",
                {
                  href: `${DIR.ID_PROOF_TRAINER}${trainer.idProofTrainer}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-white py-1 px-3 rounded-md border border-indigo-100 shadow-sm",
                  children: "View"
                }
              )
            ] })
          ] })
        }
      )
    ] })
  ] });
  const AchievementsTab = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsx(
      InfoCard,
      {
        title: "Achievements",
        icon: /* @__PURE__ */ jsx(FaAward, { className: "w-5 h-5" }),
        action: "Add New",
        children: trainer.achievements.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: trainer.achievements.map((ach, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-amber-100",
            children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-100 rounded-md mt-1", children: /* @__PURE__ */ jsx(FaAward, { className: "w-4 h-4 text-yellow-600" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-800 text-sm", children: ach })
            ]
          },
          idx
        )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500 bg-amber-50 rounded-lg border border-amber-100", children: [
          /* @__PURE__ */ jsx(FaAward, { className: "w-12 h-12 text-amber-200 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { children: "No achievements added yet" }),
          /* @__PURE__ */ jsx("button", { className: "mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium", children: "Add your first achievement" })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsx(
      InfoCard,
      {
        title: "Professional Summary",
        icon: /* @__PURE__ */ jsx(FaClipboardList, { className: "w-5 h-5" }),
        action: "Edit",
        children: /* @__PURE__ */ jsx("div", { className: "p-4 bg-gray-50 rounded-lg border border-gray-100", children: /* @__PURE__ */ jsx("p", { className: "text-gray-800 leading-relaxed text-sm", children: trainer.summary || "No professional summary provided. Add a summary to highlight your expertise and teaching philosophy." }) })
      }
    )
  ] });
  const TeachingTab = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsx(
      InfoCard,
      {
        title: "Course Portfolio",
        icon: /* @__PURE__ */ jsx(FaBookOpen, { className: "w-5 h-5" }),
        children: /* @__PURE__ */ jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative inline-block mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(FaChalkboardTeacher, { className: "w-8 h-8 text-indigo-600" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold", children: trainer.courses.length })
          ] }),
          /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-gray-800 mb-1", children: [
            trainer.courses.length,
            " ",
            COURSE_NAME
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Assigned to teach" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
            trainer.courses.slice(0, 3).map((course, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-indigo-600 rounded-full" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-800 truncate", children: course })
                ]
              },
              idx
            )),
            trainer.courses.length > 3 && /* @__PURE__ */ jsxs("p", { className: "text-indigo-600 text-sm font-medium", children: [
              "+",
              trainer.courses.length - 3,
              " more ",
              COURSE_NAME
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Batch Statistics",
          icon: /* @__PURE__ */ jsx(FaChartLine, { className: "w-5 h-5" }),
          children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-emerald-100", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaUsers, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: "5" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Active Batches" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaAward, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: "12" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Completed Batches" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-violet-100", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaUser, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: "250+" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Total Participates" })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        InfoCard,
        {
          title: "Upcoming Sessions",
          icon: /* @__PURE__ */ jsx(FaCalendarAlt, { className: "w-5 h-5" }),
          children: /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100", children: [
            /* @__PURE__ */ jsx(FaCalendarAlt, { className: "w-10 h-10 text-gray-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("p", { children: "No upcoming sessions" }),
            /* @__PURE__ */ jsx("button", { className: "mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium", children: "View Calendar" })
          ] })
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-8xl mx-auto", children: [
    /* @__PURE__ */ jsx(ProfileHeader, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100", children: [
      /* @__PURE__ */ jsx(
        TabButton,
        {
          name: "Overview",
          icon: /* @__PURE__ */ jsx(FaUser, { className: "w-4 h-4" }),
          isActive: activeTab === "overview"
        }
      ),
      /* @__PURE__ */ jsx(
        TabButton,
        {
          name: "Achievements",
          icon: /* @__PURE__ */ jsx(FaAward, { className: "w-4 h-4" }),
          isActive: activeTab === "achievements"
        }
      ),
      /* @__PURE__ */ jsx(
        TabButton,
        {
          name: "Teaching",
          icon: /* @__PURE__ */ jsx(FaChalkboardTeacher, { className: "w-4 h-4" }),
          isActive: activeTab === "teaching"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      activeTab === "overview" && /* @__PURE__ */ jsx(OverviewTab, {}),
      activeTab === "achievements" && /* @__PURE__ */ jsx(AchievementsTab, {}),
      activeTab === "teaching" && /* @__PURE__ */ jsx(TeachingTab, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaChalkboardTeacher, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: trainer.courses.length }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: COURSE_NAME })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaUsers, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: "250+" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Participates" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaAward, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: trainer.certifications.length }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Certifications" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(FaBriefcase, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-800", children: trainer.totalExperience }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Years Experience" })
      ] })
    ] })
  ] }) });
};
export {
  TrainerDashboardPage as default
};
