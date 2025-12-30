import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { FaClock, FaStar, FaUser, FaLightbulb, FaBookOpen, FaEnvelope, FaPhone, FaEdit, FaArrowRight } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { C as COURSE_NAME, Q as BASE_URL } from "../entry-server.js";
import { a as fetchUserProfile } from "./profile-D_s45P6s.js";
import Modal from "react-modal";
import "react-dom/server";
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
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const BatchesComingSoon = ({ course }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        onClick: () => setModalOpen(true),
        className: "p-[4px] rounded-xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer",
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl h-full flex flex-col p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-2", children: course.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Batch details coming soon." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FaClock, { className: "w-4 h-4 text-yellow-500" }),
              /* @__PURE__ */ jsx("span", { children: course.duration || "N/A" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FaStar, { className: "w-4 h-4 text-yellow-500" }),
              /* @__PURE__ */ jsx("span", { children: course.rating || "No rating" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto pt-2 border-t border-gray-100 text-right text-yellow-700 font-medium", children: "🎉 Coming Soon!" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      Modal,
      {
        isOpen: modalOpen,
        onRequestClose: () => setModalOpen(false),
        className: "relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto z-50 animate-fadeIn overflow-hidden",
        overlayClassName: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none z-0", children: Array.from({ length: 25 }).map((_, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute w-2 h-2 bg-yellow-400 rounded-full animate-float",
              style: {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }
            },
            i
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-extrabold text-yellow-600 mb-3", children: "🎊 Exciting News!" }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700 text-base mb-6 leading-relaxed", children: [
              "The batch for ",
              /* @__PURE__ */ jsx("strong", { children: course.title }),
              " is launching soon. ",
              /* @__PURE__ */ jsx("br", {}),
              "Stay tuned — awesome things are on the way!"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setModalOpen(false),
                className: "px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg",
                children: "Got it! 🎯"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("style", { children: `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-200px) rotate(360deg);
      opacity: 0;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-float {
    animation: float linear infinite;
  }
` })
        ]
      }
    )
  ] });
};
const CourseCard = ({ course, onCourseClick }) => {
  useNavigate();
  const progress = course?.progress || 0;
  const getProgressColor = (percentage) => {
    if (percentage === 0) return "bg-gray-300";
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    if (percentage < 100) return "bg-blue-500";
    return "bg-green-500";
  };
  const getProgressText = (percentage) => {
    if (percentage === 0) return "Not started";
    if (percentage === 100) return "Completed";
    return `${percentage}% complete`;
  };
  const handleCourseClick = () => {
    onCourseClick(course);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: handleCourseClick,
      className: "p-[4px] rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-xl h-full flex flex-col p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2", children: course.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4 line-clamp-2", children: course.description }),
        /* @__PURE__ */ jsx("hr", { className: "my-2 h-[2px] border-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 rounded-full shadow-sm" }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm text-gray-600 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(FaStar, { className: "w-4 h-4 text-yellow-500" }),
          /* @__PURE__ */ jsx("span", { children: course.rating || "No rating" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "w-full h-2 rounded-full bg-gray-200 mb-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-full rounded-full ${getProgressColor(
              progress
            )} transition-all duration-700`,
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 italic text-right mb-3", children: getProgressText(progress) }),
        /* @__PURE__ */ jsx("div", { className: "flex-grow" }),
        /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-gray-100 flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-200", children: [
          "Continue Learning",
          /* @__PURE__ */ jsx(FaArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] })
    }
  );
};
const StudentDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBatchPopup, setShowBatchPopup] = useState(false);
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourseBatches, setSelectedCourseBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const fetchUserProfile$1 = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetchUserProfile();
      setUserData(resp.data);
      setError("");
      const allBatches = resp.data.enrolledCourses?.flatMap((c) => c.batches || [])?.filter((b) => b !== null);
      if (allBatches.length === 1) {
        setSelectedBatch(allBatches[0]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUserProfile$1();
  }, [fetchUserProfile$1]);
  useEffect(() => {
    const onFocus = () => fetchUserProfile$1();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUserProfile$1]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-gray-600", children: "Loading Dashboard..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 shadow-lg rounded-lg max-w-md text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3", children: "Error Loading Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchUserProfile$1,
          className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
          children: "Try Again"
        }
      )
    ] }) });
  }
  if (!userData) {
    return null;
  }
  const BatchSelectionPopup = () => /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden animate-scaleIn", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 p-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white", children: "Choose Your Batch" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-indigo-100", children: "Select a batch to start your learning journey" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5 space-y-4 max-h-[60vh] overflow-y-auto", children: selectedCourseBatches.map((batch) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setSelectedBatch(batch);
          setShowBatchPopup(false);
          navigate(
            `/courses/${selectedCourse._id}/study?batchId=${batch._id}`
          );
        },
        className: "group w-full p-4 border rounded-xl text-left transition-all\r\n                       hover:border-indigo-500 hover:bg-indigo-50\r\n                       hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 group-hover:text-indigo-600", children: batch.batchName }),
            /* @__PURE__ */ jsx("span", { className: "text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-gray-600 space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              "⏰ ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Time:" }),
              " ",
              batch.time.start,
              " – ",
              batch.time.end
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              "📅 ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Days:" }),
              " ",
              batch.days.join(", ")
            ] })
          ] })
        ]
      },
      batch._id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowBatchPopup(false),
        className: "w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200\r\n                     font-medium text-gray-700 transition",
        children: "Cancel"
      }
    ) })
  ] }) });
  const ProfileHeader = () => (
    // <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white rounded-2xl p- mb-10 relative overflow-hidden shadow-lg">
    //   <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
    //     {/* 👤 Profile Info Left */}
    //     <div className="flex items-center gap-6 w-full md:w-2/3">
    //       {userData.profilePhotoStudent ? (
    //         <img
    //           src={`${BASE_URL}/uploads/student/student-profilephoto/${userData.profilePhotoStudent}`}
    //           alt="Student"
    //           className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
    //         />
    //       ) : (
    //         <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-md">
    //           <FaUser className="w-10 h-10 text-white/70" />
    //         </div>
    //       )}
    //       <div>
    //         <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
    //           Welcome back, {userData.fullName}!
    //         </h1>
    //         <p className="text-indigo-100 text-sm md:text-base">
    //           Here's a look at your learning journey. Keep pushing forward! 🚀
    //         </p>
    //       </div>
    //     </div>
    //     {/* 🖼️ Image Right */}
    //     <div className="w-full md:w-1/3 flex justify-center md:justify-end">
    //       <img
    //         src="https://studyhub.vinnovateit.com/img/allnighter_img.svg"
    //         alt="Learning Illustration"
    //         className="w-35 md:w-35 lg:w-35"
    //       />
    //     </div>
    //   </div>
    //   {/* 🎨 Subtle background glow effect */}
    //   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
    //   {/* ✨ Animation */}
    //   <style>{`
    //     @keyframes fadeIn {
    //       from { opacity: 0; transform: translateY(20px); }
    //       to { opacity: 1; transform: translateY(0); }
    //     }
    //     .animate-fadeIn {
    //       animation: fadeIn 1s ease-out forwards;
    //     }
    //   `}</style>
    // </div>
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-800 text-white rounded-2xl px-4 md:px-4 flex flex-col md:flex-row items-center justify-between shadow-lg mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 w-full md:w-3/3", children: [
        userData.profilePhotoStudent ? /* @__PURE__ */ jsx(
          "img",
          {
            src: `${BASE_URL}/uploads/student/student-profilephoto/${userData.profilePhotoStudent}`,
            alt: "Participate",
            className: "w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsx(FaUser, { className: "w-10 h-10 text-white/70" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold mb-2", children: [
            "Welcome back, ",
            userData.fullName,
            "!"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-indigo-100 text-md font-mono leading-relaxed flex items-start gap-2", children: [
            "Your journey to mastery starts with showing up. Let’s make today a productive one!",
            /* @__PURE__ */ jsx(FaLightbulb, { className: "mt-1 text-yellow-300 w-5 h-5" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-indigo-100 text-md font-mono leading-relaxed flex items-start gap-2", children: [
            "You’ve got this — let today be another chapter in your growth story.",
            /* @__PURE__ */ jsx(FaBookOpen, { className: "mt-1 text-green-300 w-5 h-5" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-40 md:w-56 mt-6 md:mt-0", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/images/student_dashboard_img.svg",
          alt: "Learning",
          className: "w-full h-auto"
        }
      ) })
    ] })
  );
  const OverviewTab = () => {
    const coursesWithBatch = userData.enrolledCourses?.filter(
      (course) => course.batches && course.batches.length > 0
    );
    const coursesWithoutBatch = userData.enrolledCourses?.filter(
      (course) => !course.batches || course.batches.length === 0
    );
    return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800", children: [
          "My ",
          COURSE_NAME
        ] }) }),
        coursesWithBatch.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: coursesWithBatch.map((course) => (
          // <CourseCard key={course._id} course={course} />
          /* @__PURE__ */ jsx(
            CourseCard,
            {
              course,
              onCourseClick: (course2) => {
                setSelectedCourse(course2);
                setSelectedCourseBatches(course2.batches || []);
                setShowBatchPopup(true);
              }
            },
            course._id
          )
        )) }) : /* @__PURE__ */ jsxs("p", { className: "text-center text-gray-500", children: [
          "No active ",
          COURSE_NAME,
          " yet."
        ] })
      ] }),
      coursesWithoutBatch.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-yellow-700 mb-4", children: [
          COURSE_NAME,
          " You're Interested In"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: coursesWithoutBatch.map((course) => /* @__PURE__ */ jsx(BatchesComingSoon, { course }, course._id)) })
      ] })
    ] });
  };
  const ProfileTab = () => {
    const relativeImageUrl = "https://img.freepik.com/premium-vector/woman-sits-computer-screen-using-laptop-checking-off-tasks-checklist-screen-is-filled-with-lines-text-green-checkmark-signifying-completion_520881-7879.jpg";
    return /* @__PURE__ */ jsxs("div", { className: "max-w-8xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden md:flex", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "md:w-1/2 relative bg-cover bg-center flex items-center justify-center",
          style: { backgroundImage: `url(${relativeImageUrl})` },
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-10 text-center md:text-left max-w-md animate-slideInUp", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl", children: "Unlock Your Potential" }),
              /* @__PURE__ */ jsx("p", { className: "text-white text-lg mb-6 drop-shadow-md", children: "Your journey to excellence begins here. Discover your progress, embrace consistency, and evolve every day." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 p-10 flex flex-col justify-center bg-blue-50 animate-fadeIn", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-extrabold mb-8 text-indigo-600 relative inline-block pb-2 border-b-4 border-indigo-300", children: "Profile Information" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-inner rounded-xl p-6 border-3 border-dashed border-indigo-200 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-b from-transparent via-indigo-100 to-transparent bg-[length:100%_2.5rem] [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_39px,#e0e7ff_40px)] pointer-events-none rounded-xl" }),
          /* @__PURE__ */ jsx("div", { className: "relative z-10 grid grid-cols-1 gap-6", children: [
            {
              label: "Full Name",
              value: userData.fullName,
              icon: /* @__PURE__ */ jsx(FaUser, { className: "text-indigo-500 w-4 h-4" })
            },
            {
              label: "Email",
              value: userData.email,
              icon: /* @__PURE__ */ jsx(FaEnvelope, { className: "text-indigo-500 w-4 h-4" })
            },
            {
              label: "Mobile Number",
              value: userData.mobileNo,
              icon: /* @__PURE__ */ jsx(FaPhone, { className: "text-indigo-500 w-4 h-4" })
            }
          ].map(({ label, value, icon }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            icon,
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-indigo-500", children: label }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-800 text-lg font-medium", children: value || "Not provided" })
            ] })
          ] }, label)) })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => navigate(`/student-profile/${userData._id}`),
            className: "mt-10 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300",
            children: [
              "Edit Profile",
              /* @__PURE__ */ jsx(FaEdit, { className: "w-5 h-5" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      ` })
      ] }),
      /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      ` })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-h-fit bg-blue-100 py-6 px-4 sm:px-6 lg:px-6", children: [
    showBatchPopup && /* @__PURE__ */ jsx(BatchSelectionPopup, {}),
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "top-right",
        autoClose: 3e3,
        hideProgressBar: false
      }
    ),
    /* @__PURE__ */ jsx(ProfileHeader, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md mx-auto bg-white rounded-md p-2 shadow-xl flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute top-1 bottom-1 w-1/2 bg-blue-800 rounded-md transition-all duration-300 ${activeTab === "overview" ? "left-1" : "left-1/2"}`
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("overview"),
          className: `relative z-10 w-1/2 text-center py-2 rounded-full transition-all duration-300 font-semibold ${activeTab === "overview" ? "text-white" : "text-blue-800"}`,
          children: [
            /* @__PURE__ */ jsx(RiDashboardFill, { className: "inline-block mr-1" }),
            "My ",
            COURSE_NAME
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("profile"),
          className: `relative z-10 w-1/2 text-center py-2 rounded-full transition-all duration-300 font-semibold ${activeTab === "profile" ? "text-white" : "text-blue-800"}`,
          children: [
            /* @__PURE__ */ jsx(FaUser, { className: "inline-block mr-1" }),
            "Profile"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      activeTab === "overview" && /* @__PURE__ */ jsx(OverviewTab, {}),
      activeTab === "profile" && /* @__PURE__ */ jsx(ProfileTab, {})
    ] })
  ] });
};
export {
  StudentDashboardPage as default
};
