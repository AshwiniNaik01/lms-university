import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useMemo, createContext, useContext, useCallback, memo, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate, useSearchParams, useLocation, NavLink, Outlet, Link, Navigate, Routes, Route, StaticRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle, FaClock, FaArrowUp, FaArrowDown, FaTimes, FaCheck, FaPlus, FaUpload, FaEyeSlash, FaEye, FaUserCog, FaUserTie, FaRegFileAlt, FaFolderOpen, FaGraduationCap, FaLayerGroup, FaBookOpen, FaTasks, FaFileAlt, FaVideo, FaStickyNote, FaCalendarAlt, FaClipboardList, FaChevronUp, FaChevronDown, FaLock, FaComments, FaPaperPlane, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineQuiz, MdOutlineDashboard, MdOutlineClass, MdOutlineMeetingRoom } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import ReactDOM from "react-dom";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch, Provider } from "react-redux";
import { motion } from "framer-motion";
import { createSlice, createAsyncThunk, configureStore } from "@reduxjs/toolkit";
import { RiFolderSettingsLine, RiBook2Line } from "react-icons/ri";
import { FcAlarmClock } from "react-icons/fc";
import { ArrowLeft, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast as toast$1 } from "react-hot-toast";
import { FiEyeOff, FiEye } from "react-icons/fi";
const BASE_URL$1 = "https://api.amtuniversity.codedrift.co";
const apiClient = axios.create({
  baseURL: BASE_URL$1
});
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const BatchTests = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await apiClient.get(`/api/tests/batch/${batchId}`);
        if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setTests(response.data.data);
        } else {
          setTests([]);
          Swal.fire({
            icon: "info",
            title: "No tests available",
            text: response.data.message || "No tests found for this batch"
          });
        }
      } catch (error) {
        console.error(
          "Error fetching tests",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch tests. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [batchId]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "p-6", children: "Loading tests..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8 text-gray-800", children: "🎓 Batch Assessments" }),
    tests.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-gray-500 text-lg", children: "No tests available for this batch." }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: tests.map((test) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-lg border-3 border-sky-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-100", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-blue-700 truncate", children: test.title }),
            /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: [
              test.testDuration?.minutes || 0,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 space-y-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-gray-600 text-sm", children: [
              /* @__PURE__ */ jsx(MdOutlineQuiz, { className: "text-blue-500 w-5 h-5" }),
              "Level: ",
              test.testLevel
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-gray-600 text-sm", children: [
              /* @__PURE__ */ jsx(FaCheckCircle, { className: "text-green-500 w-5 h-5" }),
              "Questions: ",
              test.totalQuestions
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-gray-600 text-sm", children: [
              /* @__PURE__ */ jsx(FaClock, { className: "text-yellow-500 w-5 h-5" }),
              "Passing Marks: ",
              test.passingMarks
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => navigate(`/tests/${test._id}/students`),
              className: "w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(VscOrganization, {}),
                "View ParticipateS"
              ]
            }
          ) })
        ]
      },
      test._id
    )) })
  ] });
};
const ScrollableTable = ({
  columns = [],
  data = [],
  maxHeight = "600px",
  emptyMessage = "No data available"
}) => {
  const [sortOrder, setSortOrder] = useState("top");
  const sortedData = useMemo(() => {
    return sortOrder === "top" ? data : [...data].reverse();
  }, [data, sortOrder]);
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100",
      style: { maxHeight },
      children: /* @__PURE__ */ jsxs("table", { className: "min-w-full border-collapse text-sm text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "sticky top-0 bg-indigo-50 z-10 shadow-md", children: /* @__PURE__ */ jsx("tr", { children: columns.map((col, index) => /* @__PURE__ */ jsx(
          "th",
          {
            className: "px-4 py-4 font-semibold text-indigo-900 text-sm uppercase tracking-wider border-b border-indigo-200 whitespace-nowrap",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx("span", { children: col.header }),
              index === 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSortOrder(sortOrder === "top" ? "bottom" : "top"),
                  className: "text-indigo-600 hover:text-indigo-900 transition-colors font-extrabold",
                  title: sortOrder === "top" ? "Show Bottom First" : "Show Top First",
                  children: sortOrder === "top" ? /* @__PURE__ */ jsx(FaArrowUp, { size: 16 }) : /* @__PURE__ */ jsx(FaArrowDown, { size: 14 })
                }
              )
            ] })
          },
          index
        )) }) }),
        /* @__PURE__ */ jsx("tbody", { children: sortedData.length > 0 ? sortedData.map((row, rowIndex) => /* @__PURE__ */ jsx(
          "tr",
          {
            className: `transition-all duration-300 ${rowIndex % 2 === 0 ? "bg-white" : "bg-indigo-50"} hover:bg-indigo-100`,
            children: columns.map((col, colIndex) => /* @__PURE__ */ jsx(
              "td",
              {
                className: `px-6 py-4 whitespace-nowrap ${colIndex === 0 ? "font-semibold text-indigo-900" : "font-normal"}`,
                children: typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]
              },
              colIndex
            ))
          },
          rowIndex
        )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: columns.length,
            className: "px-6 py-8 text-center text-indigo-400 italic",
            children: emptyMessage
          }
        ) }) })
      ] })
    }
  ) });
};
const Modal = ({
  isOpen,
  onClose,
  header = "",
  children,
  footer = null,
  showCancel = true,
  primaryAction = null
}) => {
  if (!isOpen) return null;
  const modalRoot = document.getElementById("modal-root") || document.body;
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return ReactDOM.createPortal(
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 animate-fadeIn", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-white rounded-2xl shadow-xl border border-gray-200\r\n                   w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-blue-900", children: header }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-gray-500 hover:text-red-600 text-2xl font-bold transition",
                  "aria-label": "Close modal",
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-6 py-4 overflow-y-auto flex-grow text-gray-800 leading-relaxed", children }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-3 px-6 py-4 border-t bg-gray-50", children: [
              showCancel && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: onClose,
                  className: "flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition",
                  children: [
                    /* @__PURE__ */ jsx(FaTimes, { className: "w-4 h-4 text-gray-500" }),
                    "Cancel"
                  ]
                }
              ),
              primaryAction && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: !primaryAction.loading ? primaryAction.onClick : void 0,
                  disabled: primaryAction.loading,
                  className: `flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md shadow-sm transition
      ${primaryAction.loading ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`,
                  children: primaryAction.loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { className: "loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                    "Processing..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(FaCheck, { className: "w-4 h-4 text-white" }),
                    primaryAction.label
                  ] })
                }
              ),
              footer
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
          .loader {
  display: inline-block;
}

      ` })
    ] }),
    modalRoot
  );
};
const ResultModal = ({ isOpen, onClose, result }) => {
  if (!result) return null;
  const percentage = (result.marks / result.totalMarks * 100).toFixed(1);
  const isPassed = result.marks >= result.passingMarks;
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      isOpen,
      onClose,
      header: "Test Result",
      showCancel: false,
      primaryAction: {
        label: "Close",
        onClick: onClose
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6 mt-2", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold
            ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
            children: [
              result.marks,
              "/",
              result.totalMarks
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-center mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-3 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Correct" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-green-600", children: result.correct })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-red-50 p-3 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Wrong" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-red-600", children: result.wrong })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Percentage" }),
            /* @__PURE__ */ jsxs("span", { children: [
              percentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 h-2 rounded-full", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-2 rounded-full ${isPassed ? "bg-green-500" : "bg-red-500"}`,
              style: { width: `${percentage}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `text-center font-semibold mb-4
          ${isPassed ? "text-green-700" : "text-red-600"}`,
            children: isPassed ? "🎉 Congratulations! You Passed" : "📚 Keep Practicing!"
          }
        )
      ]
    }
  );
};
const ResultQPPopup = ({ isOpen, onClose, result }) => {
  if (!result) return null;
  const {
    title,
    questions = [],
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    marksGained,
    totalMarks
  } = result;
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      isOpen,
      onClose,
      header: `Question Paper – ${title}`,
      showCancel: true,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-3 rounded-lg text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-blue-700", children: "Questions" }),
            /* @__PURE__ */ jsx("p", { children: totalQuestions })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-3 rounded-lg text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-green-700", children: "Correct" }),
            /* @__PURE__ */ jsx("p", { children: correctAnswers })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-red-50 p-3 rounded-lg text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-red-700", children: "Wrong" }),
            /* @__PURE__ */ jsx("p", { children: wrongAnswers })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-indigo-50 p-3 rounded-lg text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-indigo-700", children: "Score" }),
            /* @__PURE__ */ jsxs("p", { children: [
              marksGained,
              " / ",
              totalMarks
            ] })
          ] })
        ] }),
        questions.length > 0 ? questions.map((q, index) => {
          const selected = q.selectedOption;
          const correct = q.correctAns;
          return /* @__PURE__ */ jsxs("div", { className: "mb-6 border-b pb-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-semibold mb-2", children: [
              index + 1,
              ". ",
              q.question
            ] }),
            ["A", "B", "C", "D"].map((opt) => {
              const value = q[`option${opt}`];
              const isCorrect = opt === correct;
              const isSelected = opt === selected;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `p-2 rounded-lg border mb-1 flex justify-between items-center
                      ${isCorrect ? "bg-green-50 border-green-500" : ""}
                      ${isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
                    `,
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold mr-2", children: [
                        opt,
                        "."
                      ] }),
                      value
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold", children: [
                      isCorrect && /* @__PURE__ */ jsx("span", { className: "text-green-600", children: "✔ Correct" }),
                      isSelected && !isCorrect && /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "✖ Your Answer" })
                    ] })
                  ]
                },
                opt
              );
            })
          ] }, q._id);
        }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500", children: "No questions available" })
      ]
    }
  );
};
const StudentsListForTest = () => {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedQP, setSelectedQP] = useState(null);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await apiClient.get(`/api/iqtest/${testId}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch IQ test results",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [testId]);
  const columns = [
    {
      header: "Participate Name",
      accessor: (row) => row.student.fullName
    },
    // {
    //   header: "Email",
    //   accessor: (row) => row.student.email,
    // },
    {
      header: "Marks",
      accessor: (row) => row.status === -1 ? "Not Attempted" : `${row.marksGained}/${row.totalMarks}`
    },
    {
      header: "Correct",
      accessor: (row) => row.status === -1 ? "-" : row.correctAnswers
    },
    {
      header: "Wrong",
      accessor: (row) => row.status === -1 ? "-" : row.wrongAnswers
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: row.status === -1 ? /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs", children: "No Result" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedResult({
              marks: row.marksGained,
              totalMarks: row.totalMarks,
              correct: row.correctAnswers,
              wrong: row.wrongAnswers,
              passingMarks: row.passingMarks || 0
            }),
            className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs",
            children: "View Result"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedQP(row),
            className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs",
            children: "View QP"
          }
        )
      ] }) })
    }
  ];
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "p-6", children: "Loading participates..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: "Participate Results" }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: results,
        emptyMessage: "No participates found"
      }
    ),
    selectedQP && /* @__PURE__ */ jsx(
      ResultQPPopup,
      {
        isOpen: !!selectedQP,
        onClose: () => setSelectedQP(null),
        result: selectedQP
      }
    ),
    selectedResult && /* @__PURE__ */ jsx(
      ResultModal,
      {
        isOpen: !!selectedResult,
        onClose: () => setSelectedResult(null),
        result: selectedResult
      }
    )
  ] });
};
const BASE_URL = "https://api.amtuniversity.codedrift.co";
const env = "production";
console.log("Current environment:", env);
const STUDENT_PORTAL_URL = (() => {
  switch (env) {
    case "development":
      return "http://localhost:6021/";
    case "uat":
      return "https://uat.codedrift.co/";
    case "prod":
    case "production":
      return "https://codedrift.co/";
    default:
      return "/";
  }
})();
const DIR = {
  // 👤 Student
  STUDENT_PHOTO: BASE_URL + "/uploads/student/student-profilephoto/",
  ID_PROOF_STUDENT: BASE_URL + "/uploads/student/student-idproof/",
  // 👨‍🏫 Trainer
  TRAINER_PROFILE_PHOTO: BASE_URL + "/uploads/trainer/trainer-profilephoto/",
  ID_PROOF_TRAINER: BASE_URL + "/uploads/trainer/trainer-idproof/",
  TRAINER_RESUME: BASE_URL + "/uploads/trainer/trainer-resume/",
  // 📘 Course Materials
  COURSE_NOTES: BASE_URL + "/uploads/course-notes/",
  ASSIGNMENT_FILES: BASE_URL + "/uploads/assignments/",
  ASSIGNMENT_SUBMISSIONS: BASE_URL + "/uploads/assignment-submissions/initial/",
  MISTAKE_PHOTOS: BASE_URL + "/uploads/assignment-submissions/mistakes/",
  // ✅ Added
  ASSIGNMENT_RESUBMISSIONS: BASE_URL + "/uploads/assignment-submissions/resubmit/",
  // ✅ NEW
  // 📊 Test Materials
  TEST_EXCEL: BASE_URL + "/uploads/test-excel/",
  // 🎓 Lecture Videos
  LECTURE_CONTENT: BASE_URL + "/uploads/lectures/",
  // 🗂 Training Program Plan (📄 NEW)
  TRAINING_PLAN: BASE_URL + "/uploads/course/training-plan/",
  // 📅 Events
  EVENT_BANNER: BASE_URL + "/uploads/events/banner/",
  EVENT_GALLERY_IMAGE: BASE_URL + "/uploads/events/gallery/",
  EVENT_SPEAKER_PHOTO: BASE_URL + "/uploads/events/speakers/",
  // 📣 Webinars
  WEBINAR_SPEAKER_PHOTO: BASE_URL + "/uploads/webinar/speakers/",
  // 💬 Feedback
  FEEDBACK_PROFILE: BASE_URL + "/uploads/feedback/profiles/",
  // 🏢 Sponsorship
  SPONSOR_LOGO: BASE_URL + "/uploads/sponsorship/logo/",
  // Logo
  LOGO: BASE_URL + "/uploads/contact/company-logo/",
  // 🧩 Prerequisite Materials
  PREREQUISITE_MATERIALS: BASE_URL + "/uploads/prerequisite/materials/",
  // ☁️ Cloud Labs
  CLOUD_LABS: BASE_URL + "/uploads/cloudLabs/"
};
const COURSE_NAME = "Training Program";
function EvaluateAssignment() {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    remarks: "",
    score: "",
    mistakePhotos: []
  });
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("marks");
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignmentId) return;
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/assignments/${assignmentId}`);
        if (res.data.success && res.data.data) {
          setAssignment(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch assignment");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);
  const handleOpenModal = (submission) => {
    setSelectedSubmission(submission);
    setMode("marks");
    setFormData({
      status: "submitted",
      remarks: "",
      score: "",
      mistakePhotos: []
    });
    setModalOpen(true);
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, mistakePhotos: Array.from(e.target.files) });
  };
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (!selectedSubmission) return;
    if (selectedMode === "marks") {
      setFormData({
        status: "submitted",
        remarks: "",
        score: "",
        mistakePhotos: []
      });
    } else {
      setFormData({
        status: "unsubmitted",
        remarks: "",
        score: "",
        mistakePhotos: []
      });
    }
  };
  const handleSubmit = async () => {
    if (!selectedSubmission) return;
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("assignmentId", assignmentId);
      payload.append("submissionId", selectedSubmission._id);
      payload.append("status", formData.status);
      payload.append("remarks", formData.remarks);
      if (mode === "marks") payload.append("score", formData.score);
      if (mode === "mistake") {
        formData.mistakePhotos.forEach(
          (file) => payload.append("mistakePhotos", file)
        );
      }
      const res = await apiClient.post(`/api/assignments/grade`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Submission updated successfully."
        });
        setModalOpen(false);
        const updatedAssignment = await apiClient.get(
          `/api/assignments/${assignmentId}`
        );
        if (updatedAssignment.data.success && updatedAssignment.data.data) {
          setAssignment(updatedAssignment.data.data);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res.data.message || "Failed to update submission."
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message
      });
    } finally {
      setSaving(false);
    }
  };
  const getStatus = (submission) => {
    if (submission.status === "submitted" && submission.score) {
      return { text: `Graded (${submission.score})`, disabled: true };
    }
    if (submission.status === "unsubmitted" && submission.mistakePhotos?.length) {
      return { text: "Resubmission Requested", disabled: true };
    }
    if (submission.status === "check" && submission.mistakePhotos?.length) {
      return { text: "Resubmitted", disabled: false };
    }
    if (submission.status === "check") {
      return { text: "Submitted", disabled: false };
    }
    return { text: submission.status || "-", disabled: false };
  };
  const columns = [
    // {
    //   header: "Student Name",
    //   accessor: (row) => row.student.fullName || "Unknown",
    // },
    {
      header: "Participate Name",
      accessor: (row) => row.student ? row.student.fullName : "Unknown"
    },
    {
      header: "Submitted File(s)",
      accessor: (row) => row.files && row.files.length > 0 ? /* @__PURE__ */ jsxs(
        "button",
        {
          className: "text-blue-600 hover:underline text-sm",
          onClick: () => {
            setSelectedFiles(row.files);
            setSelectedStudent(row.student && row.student.fullName ? row.student.fullName : "Unknown");
            setSelectedSubmission(row);
            setFileModalOpen(true);
          },
          children: [
            row.files.length,
            " file",
            row.files.length > 1 ? "s" : ""
          ]
        }
      ) : "No files"
    },
    {
      header: "Status",
      accessor: (row) => getStatus(row).text
    },
    {
      header: "Actions",
      accessor: (row) => {
        const { disabled, text } = getStatus(row);
        return disabled ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: true,
            className: "px-3 py-1 rounded-md bg-gray-400 text-white text-sm cursor-not-allowed",
            children: text
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleOpenModal(row),
            className: "px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm",
            children: "Evaluate"
          }
        );
      }
    }
  ];
  if (loading) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  if (!assignment)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Assignment not found." });
  return /* @__PURE__ */ jsxs("div", { className: "p-8 font-sans bg-white max-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-semibold text-gray-800", children: [
        assignment.title,
        " - Submissions"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate(-1),
          className: "bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition",
          children: "Back to Assignments"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: assignment.submissions || [],
        maxHeight: "600px",
        emptyMessage: "No submissions found for this assignment."
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: fileModalOpen,
        onClose: () => setFileModalOpen(false),
        header: `Files submitted by: ${selectedStudent}`,
        primaryAction: null,
        children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: selectedFiles && selectedFiles.length > 0 ? selectedFiles.map((file, index) => {
          let fileUrl;
          if (file.startsWith("http://") || file.startsWith("https://")) {
            fileUrl = file;
          } else if (file.startsWith("submissionFile")) {
            fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
          } else if (file.startsWith("files")) {
            fileUrl = `${DIR.ASSIGNMENT_RESUBMISSIONS}${file}`;
          } else {
            fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
          }
          return /* @__PURE__ */ jsx(
            "a",
            {
              href: fileUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 hover:underline",
              children: file
            },
            index
          );
        }) : /* @__PURE__ */ jsx("p", { children: "No files submitted" }) })
      }
    ),
    /* @__PURE__ */ jsxs(
      Modal,
      {
        isOpen: modalOpen,
        onClose: () => setModalOpen(false),
        header: `Evaluate Submission: ${selectedSubmission?.student?.fullName || ""}`,
        primaryAction: {
          label: mode === "marks" ? "Submit Marks" : "Submit Mistakes",
          onClick: handleSubmit,
          loading: saving
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `px-4 py-2 rounded-md text-white ${mode === "marks" ? "bg-blue-600" : "bg-gray-400"}`,
                onClick: () => handleModeChange("marks"),
                children: "Give Marks"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `px-4 py-2 rounded-md text-white ${mode === "mistake" ? "bg-blue-600" : "bg-gray-400"}`,
                onClick: () => handleModeChange("mistake"),
                children: "Re-Upload Request to Studnet"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-semibold text-gray-700", children: "Remarks" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: formData.remarks,
                  onChange: (e) => setFormData({ ...formData, remarks: e.target.value }),
                  className: "w-full p-2 border rounded-md border-gray-300",
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-semibold text-gray-700 mb-2", children: "Rating" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4", children: [
                "unsatisfied",
                "good",
                "better",
                "average",
                "best",
                "error"
              ].map((option) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer px-3 py-1 border rounded-full hover:bg-gray-100",
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "rating",
                        value: option,
                        checked: formData.rating === option,
                        onChange: (e) => setFormData({ ...formData, rating: e.target.value }),
                        className: "accent-blue-600 w-4 h-4"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "capitalize", children: option })
                  ]
                },
                option
              )) })
            ] }),
            mode === "marks" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-semibold text-gray-700", children: "Score" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: formData.score,
                  onChange: (e) => setFormData({ ...formData, score: e.target.value }),
                  className: "w-full p-2 border rounded-md border-gray-300"
                }
              )
            ] }),
            mode === "mistake" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-semibold text-gray-700", children: "Mistake Photos" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  multiple: true,
                  onChange: handleFileChange,
                  className: "w-full p-2 border rounded-md border-gray-300"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
const fetchCourses$1 = async (branchId) => {
  try {
    let url = "/api/courses/all";
    if (branchId) {
      url += `?branchId=${branchId}`;
    }
    const response = await apiClient.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const fetchCourseById = async (id) => {
  try {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const createCourse = async (courseData) => {
  try {
    const response = await apiClient.post("/api/courses", courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const updateCourse = async (id, courseData) => {
  try {
    const response = await apiClient.put(`/api/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const deleteCourse = async (id) => {
  try {
    const response = await apiClient.delete(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const getAllCourses = async () => {
  const res = await apiClient.get("/api/courses/all");
  return res.data.data;
};
const cloneCourse = async (id) => {
  try {
    const response = await apiClient.post(`/api/courses/${id}/clone`, {});
    return response.data;
  } catch (error) {
    console.error(`Error cloning course ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const addVideoToCourse = async (courseId, videoData) => {
  try {
    const response = await apiClient.post(`/api/videos`, videoData);
    return response.data;
  } catch (error) {
    console.error(`Error adding video to course ${courseId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const addNoteToCourse = async (courseId, formData, token) => {
  try {
    formData.append("course", courseId);
    const response = await apiClient.post("/api/notes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding note to course ${courseId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
const Dropdown = ({
  label,
  name,
  options,
  formik,
  multiple = false,
  disabled = false,
  onChange
  // ✅ added support
}) => {
  const error = formik.touched[name] && formik.errors[name];
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-1", children: [
    label && /* @__PURE__ */ jsx(
      "label",
      {
        htmlFor: name,
        className: "block text-sm font-medium text-gray-700",
        children: label
      }
    ),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id: name,
        name,
        multiple,
        value: multiple ? formik.values[name] || [] : Array.isArray(formik.values[name]) ? formik.values[name][0] || "" : formik.values[name] || "",
        onBlur: formik.handleBlur,
        onChange: (e) => {
          const selected = multiple ? Array.from(e.target.selectedOptions).map((opt) => opt.value) : e.target.value;
          formik.setFieldValue(name, selected);
          if (typeof onChange === "function") {
            onChange(selected);
          }
        },
        disabled,
        className: `w-full px-4 py-2 rounded-lg border transition duration-300 outline-none
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `,
        children: [
          !multiple && /* @__PURE__ */ jsxs("option", { value: "", disabled: true, children: [
            "Select ",
            label
          ] }),
          options.map((option, index) => /* @__PURE__ */ jsx(
            "option",
            {
              value: option._id,
              children: option.title || option.name
            },
            `${name}-${option._id}-${index}`
          ))
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs font-medium", children: formik.errors[name] })
  ] });
};
const DynamicInputFields = ({ formik, name, label }) => {
  const values = formik.values[name] ?? [];
  useEffect(() => {
    if (!values || values.length === 0) {
      formik.setFieldValue(name, [""]);
    }
  }, [formik, name, values]);
  const addInput = () => {
    formik.setFieldValue(name, [...values, ""]);
  };
  const removeInput = (index) => {
    const updated = values.filter((_, i) => i !== index);
    formik.setFieldValue(name, updated.length > 0 ? updated : [""]);
  };
  const handleInputChange = (index, value) => {
    const updated = [...values];
    updated[index] = value;
    formik.setFieldValue(name, updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }),
    values.map((val, index) => {
      const error = formik.touched[name]?.[index] && formik.errors[name]?.[index];
      const isLast = index === values.length - 1;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center gap-2 ${index === 0 ? "" : "pl-6"}`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                name: `${name}[${index}]`,
                value: val,
                onChange: (e) => handleInputChange(index, e.target.value),
                onBlur: formik.handleBlur,
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInput();
                  }
                },
                placeholder: `Enter ${label.toLowerCase()} ${index + 1}`,
                className: `flex-1 px-4 py-2 rounded-lg border transition duration-300 outline-none bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-blue-400 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `
              }
            ),
            isLast && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: addInput,
                className: "px-3 py-2 text-white bg-sky-600 rounded hover:bg-sky-500",
                children: /* @__PURE__ */ jsx(FaPlus, {})
              }
            ),
            values.length > 1 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removeInput(index),
                className: "px-3 py-2 text-white bg-rose-500 rounded hover:bg-rose-400",
                children: /* @__PURE__ */ jsx(FaTimes, {})
              }
            )
          ]
        },
        index
      );
    })
  ] });
};
function Create() {
  const navigate = useNavigate();
  const { feedbackId } = useParams();
  const [showPreview, setShowPreview] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const prefillCourseId = queryParams.get("courseId") || "";
  const prefillBatchId = queryParams.get("batchId") || "";
  console.log("DEBUG: feedbackId from params:", feedbackId);
  const formik = useFormik({
    initialValues: {
      title: "",
      courseId: prefillCourseId,
      batchId: prefillBatchId,
      questions: [""]
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      //   title: Yup.string().required("Title is required"),
      //   courseId: Yup.string().required("Course is required"),
      //   batchId: Yup.string().required("Batch is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      console.log("DEBUG: Form values on submit:", values);
      try {
        const payload = {
          ...values,
          questions: values.questions.map((q) => ({ question: q }))
        };
        if (feedbackId) {
          console.log("DEBUG: Updating feedback with ID:", feedbackId);
          await apiClient.put(`/api/feedback-questions/${feedbackId}`, payload);
          Swal.fire("Success", "Feedback updated successfully!", "success");
        } else {
          console.log("DEBUG: Creating new feedback");
          await apiClient.post("/api/feedback-questions", payload);
          Swal.fire("Success", "Feedback created successfully!", "success");
        }
        navigate("/manage-feedback");
      } catch (err) {
        console.error("DEBUG: Submit error:", err);
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  });
  useEffect(() => {
    (async () => {
      try {
        const courses = await getAllCourses();
        console.log("DEBUG: Fetched courses:", courses);
        const uniqueCourses = Array.from(
          new Map((courses || []).map((c) => [c._id, c])).values()
        );
        setAvailableCourses(uniqueCourses);
      } catch (err) {
        console.error("DEBUG: Failed to fetch courses:", err);
      }
    })();
  }, []);
  useEffect(() => {
    const courseId = formik.values.courseId;
    if (!courseId) {
      setAvailableBatches([]);
      formik.setFieldValue("batchId", "");
      return;
    }
    (async () => {
      try {
        const res = await apiClient.get(`/api/batches/course/${courseId}`);
        const uniqueBatches = Array.from(
          new Map(
            res.data.data.map((b) => [b._id, { ...b, name: b.batchName }])
          ).values()
        );
        setAvailableBatches(uniqueBatches);
        if (!formik.values.batchId && uniqueBatches.length > 0) {
          formik.setFieldValue("batchId", uniqueBatches[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch batches:", err);
        setAvailableBatches([]);
        formik.setFieldValue("batchId", "");
      }
    })();
  }, [formik.values.courseId]);
  useEffect(() => {
    if (!feedbackId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(
          `/api/feedback-questions/${feedbackId}`
        );
        const fb = res.data.data;
        const courseId = fb.course?._id || fb.course || "";
        const batchId = fb.batch?._id || fb.batch || "";
        formik.setValues({
          title: fb.title || "",
          courseId,
          batchId: "",
          // temporarily blank; will set after batches load
          questions: fb.questions?.map((q) => q.question) || [""]
        });
        if (courseId) {
          const batchRes = await apiClient.get(
            `/api/batches/course/${courseId}`
          );
          const uniqueBatches = Array.from(
            new Map(
              batchRes.data.data.map((b) => [
                b._id,
                { ...b, name: b.batchName }
              ])
            ).values()
          );
          setAvailableBatches(uniqueBatches);
          if (uniqueBatches.some((b) => b._id === batchId)) {
            formik.setFieldValue("batchId", batchId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [feedbackId]);
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-lg font-semibold", children: "Loading..." });
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-center mb-6", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            placeholder: feedbackId ? "Edit Feedback Form Title*" : "Create Feedback Form Title*",
            value: formik.values.title,
            onChange: formik.handleChange,
            className: "text-4xl font-bold text-blue-600 text-center w-full bg-transparent border-b-2 border-blue-400"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "courseId",
              options: availableCourses,
              formik,
              disabled: !!prefillCourseId
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Batch*",
              name: "batchId",
              options: availableBatches,
              formik,
              disabled: !formik.values.courseId || !!prefillBatchId
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          DynamicInputFields,
          {
            formik,
            name: "questions",
            label: "Feedback Question*"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-center flex justify-center gap-4 mt-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPreview(true),
              className: "bg-gray-600 text-white px-6 py-2 rounded-xl shadow hover:bg-gray-700 transition duration-300",
              children: "Preview"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "bg-blue-600 text-white px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              children: loading ? feedbackId ? "Updating..." : "Submitting..." : feedbackId ? "Update Feedback" : "Submit Feedback"
            }
          )
        ] }),
        showPreview && // <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black/70 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
        //   <div className="bg-gradient-to-br from-white to-blue-50 w-11/12 lg:w-4/5 xl:w-3/4 max-h-[80vh] overflow-y-auto rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-6 md:p-8 relative border border-blue-100">
        //     {/* Close button - Elegant */}
        /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex justify-center items-start bg-black/70 backdrop-blur-sm transition-all duration-300 animate-fadeIn", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full h-full overflow-y-auto p-6 md:p-8 relative", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowPreview(false),
              className: "absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10 border border-gray-200",
              "aria-label": "Close preview",
              children: /* @__PURE__ */ jsx("span", { className: "text-2xl font-light leading-none", children: "×" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-center mb-10 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "inline-block", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: formik.values.title || "Feedback Form Preview" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Live Preview • All changes are reflected instantly" }),
            /* @__PURE__ */ jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-5", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center", children: "?" }),
              "Feedback Questions (",
              formik.values.questions.length,
              ")"
            ] }),
            formik.values.questions.map((q, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white rounded-lg p-5 shadow-lg border-3 border-sky-800 hover:shadow-xl transition-shadow duration-300",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md", children: idx + 1 }),
                    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-800 mb-1", children: q }) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                    {
                      label: "Strongly Agree",
                      color: "from-emerald-400 to-emerald-500",
                      emoji: "😊",
                      bg: "bg-emerald-50",
                      text: "text-emerald-700"
                    },
                    {
                      label: "Agree",
                      color: "from-blue-400 to-blue-500",
                      emoji: "👍",
                      bg: "bg-blue-50",
                      text: "text-blue-700"
                    },
                    {
                      label: "Can't Say",
                      color: "from-amber-400 to-amber-500",
                      emoji: "😐",
                      bg: "bg-amber-50",
                      text: "text-amber-700"
                    },
                    {
                      label: "Disagree",
                      color: "from-red-400 to-red-500",
                      emoji: "👎",
                      bg: "bg-red-50",
                      text: "text-red-700"
                    }
                  ].map((option, oIdx) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `${option.bg} rounded-xl p-2 border border-transparent hover:border-${option.color.split("-")[1]}-300 transition-all duration-300 transform hover:scale-[1.03] cursor-not-allowed`,
                      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `w-5 h-5 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl mb-3 shadow-lg`,
                            children: option.emoji
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: `font-semibold ${option.text}`, children: option.label }),
                        /* @__PURE__ */ jsx("div", { className: "mt-2 w-8 h-2 bg-gradient-to-r ${option.color} rounded-full opacity-60" })
                      ] })
                    },
                    oIdx
                  )) })
                ]
              },
              idx
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-xl border border-indigo-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⭐" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-800", children: "Net Promoter Score" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Your honest feedback helps us improve" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-800 mb-8 mt-4", children: "How likely are you to recommend this learning program to your colleagues?" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "h-3 bg-gradient-to-r from-rose-400 via-yellow-400 to-emerald-400 rounded-full mb-12" }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-between relative", children: [...Array(11).keys()].map((num) => {
                let color = "bg-gray-300";
                let textColor = "text-gray-600";
                if (num <= 6) {
                  color = "bg-gradient-to-b from-rose-500 to-rose-600";
                  textColor = "text-red-600";
                } else if (num <= 8) {
                  color = "bg-gradient-to-b from-yellow-500 to-yellow-600";
                  textColor = "text-yellow-600";
                } else {
                  color = "bg-gradient-to-b from-emerald-500 to-emerald-600";
                  textColor = "text-emerald-600";
                }
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center relative group",
                    children: [
                      num < 10 && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-8 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300" }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `w-12 h-12 ${color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl cursor-not-allowed relative z-10`,
                          children: num
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-sm font-semibold ${textColor}`,
                            children: num
                          }
                        ),
                        num === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Not likely" }),
                        num === 5 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Neutral" }),
                        num === 10 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Extremely likely" })
                      ] })
                    ]
                  },
                  num
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowPreview(false),
              className: "mt-12\r\n px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 \r\n             text-white font-bold rounded-lg shadow-md hover:shadow-xl \r\n             transition-all duration-300 hover:scale-105",
              children: "Close Preview"
            }
          ) })
        ] }) })
      ]
    }
  ) });
}
const getAllFeedback = async () => {
  const response = await apiClient.get("/api/feedback-questions");
  return response.data;
};
const deleteFeedback = async (id) => {
  const response = await apiClient.delete(`/api/feedback-questions/${id}`);
  return response.data;
};
const canAccessModule = (rolePermissions, module) => {
  if (!module) return false;
  return !!rolePermissions[module] || !!rolePermissions["*"];
};
const canPerformAction = (rolePermissions, module, action) => {
  if (!module || !action) return false;
  return rolePermissions["*"]?.includes(action) || rolePermissions[module]?.includes(action);
};
const ManageFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("b_id");
  const courseId = searchParams.get("courseId");
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const fetchFeedback = async () => {
    try {
      const res = await getAllFeedback();
      const data = res?.data || [];
      let filtered = data;
      if (batchId) {
        filtered = filtered.filter((fb) => fb.batch?._id === batchId);
      }
      if (courseId) {
        filtered = filtered.filter((fb) => fb.course?._id === courseId);
      }
      setFeedbackList(filtered);
      setNoDataMessage(data.length === 0 ? "No feedback forms found" : "");
    } catch (err) {
      setNoDataMessage("Failed to fetch feedback");
      Swal.fire({
        icon: "error",
        title: "Error Fetching Feedback",
        text: err.response?.data?.message || err.message
      });
    }
  };
  useEffect(() => {
    fetchFeedback();
  }, []);
  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback form will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (!confirmation.isConfirmed) return;
    try {
      await deleteFeedback(id);
      fetchFeedback();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Feedback deleted successfully."
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err.response?.data?.message || err.message
      });
    }
  };
  const columns = [
    { header: "Title", accessor: (row) => row.title || "-" },
    {
      header: "Batch",
      accessor: (row) => row.batch?.batchName || "-"
    },
    {
      header: "Questions Count",
      accessor: (row) => row.questions?.length || 0
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleView(row),
            className: "px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm",
            children: "View"
          }
        ),
        canPerformAction(rolePermissions, "feedback", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate(`/edit-feedback/${row._id}`),
            className: "px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "feedback", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(row._id),
            className: "px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm",
            children: "Delete"
          }
        )
      ] })
    }
  ];
  const renderModalContent = () => {
    if (!selectedFeedback) return /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Loading..." });
    return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          COURSE_NAME,
          ":"
        ] }),
        " ",
        selectedFeedback.course.title
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Batch:" }),
        " ",
        selectedFeedback.batch?.batchName
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Questions:" }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 mt-1", children: selectedFeedback.questions?.map((q, index) => /* @__PURE__ */ jsx("li", { children: q.question }, index)) })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white max-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800", children: "Manage Feedback" }),
      canPerformAction(rolePermissions, "feedback", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            let url = "/create-feedback";
            const params = new URLSearchParams();
            if (batchId) params.set("batchId", batchId);
            if (courseId) params.set("courseId", courseId);
            if ([...params].length > 0) {
              url += `?${params.toString()}`;
            }
            navigate(url);
          },
          className: "px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition",
          children: "Create Feedback"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: feedbackList,
        maxHeight: "800px",
        emptyMessage: noDataMessage || "No feedback available"
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: selectedFeedback?.title || "Feedback Form Details",
        children: renderModalContent()
      }
    )
  ] });
};
const fetchAllBatches = async () => {
  try {
    const res = await apiClient.get("/api/batches/all");
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching batches:", err);
    const errorMessage = err.response?.data?.message || "Failed to fetch batches";
    throw new Error(errorMessage);
  }
};
const fetchBatchById = async (id) => {
  if (!id) throw new Error("Batch ID is required");
  try {
    const res = await apiClient.get(`/api/batches/batches/${id}`);
    const batch = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
    return batch;
  } catch (error) {
    console.error(
      `Error fetching batch ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
const createBatch = async (batchData) => {
  try {
    const response = await apiClient.post("/api/batches", batchData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating batch:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
const updateBatch = async (id, batchData) => {
  try {
    const response = await apiClient.put(`/api/batches/${id}`, batchData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating batch ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
const fetchBatchesByCourseId = async (courseId) => {
  try {
    const res = await apiClient.get(`/api/batches/course/${courseId}`);
    if (res.data && res.data.success) {
      return res.data.data || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching batches by course ID:", err);
    const errorMessage = err.response?.data?.message || "Failed to fetch batches for this course";
    throw new Error(errorMessage);
  }
};
const deleteBatch = async (id) => {
  const res = await apiClient.delete(`/api/batches/${id}`);
  return res.data;
};
const fetchActiveBatchById = async (batchId) => {
  const res = await apiClient.get(`/api/batches/batches/${batchId}`);
  const batch = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
  return batch;
};
const handleApiError = (err) => {
  if (!err.response) {
    return "Network error. Please check your connection.";
  }
  const { data, status } = err.response;
  if (data?.message) {
    return data.message;
  }
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors[0].msg || "Validation error";
  }
  return `Unexpected error (status ${status})`;
};
const InputField = ({ label, name, type = "text", formik }) => {
  const getNestedValue = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);
  const error = getNestedValue(formik.touched, name) && getNestedValue(formik.errors, name);
  const handleChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue(name, value);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-1", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        id: name,
        name,
        type,
        onChange: handleChange,
        onBlur: formik.handleBlur,
        value: getNestedValue(formik.values, name) || "",
        placeholder: label,
        className: `w-full px-4 py-2 rounded-lg border transition duration-300 outline-none bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-blue-400 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `
      }
    ),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs font-medium", children: getNestedValue(formik.errors, name) })
  ] });
};
const MultiPDFFileUpload = ({ name, formik, label, multiple = true }) => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    setFiles(formik.values[name] || []);
  }, [formik.values[name], name]);
  useEffect(() => {
    const unsubscribe = formik.registerField(name, {
      value: formik.values[name],
      onReset: () => {
        setFiles([]);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [formik, name]);
  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const validFiles = selected.filter((f) => allowedTypes.includes(f.type));
    const invalidFiles = selected.filter((f) => !allowedTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      formik.setFieldError(name, "Only PDF/DOC/DOCX files are allowed");
    } else {
      formik.setFieldError(name, "");
    }
    const updatedFiles = multiple ? [...formik.values[name] || [], ...validFiles] : validFiles.slice(0, 1);
    formik.setFieldValue(name, updatedFiles);
    setFiles(updatedFiles);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          name,
          accept: ".pdf,.doc,.docx",
          multiple,
          onChange: handleChange,
          className: "absolute inset-0 opacity-0 cursor-pointer z-20"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10", children: [
        /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-600" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium truncate", children: multiple ? files.length > 0 ? files.map((f) => f.name).join(", ") : "Choose PDF/DOC files..." : files[0]?.name || "Choose a PDF/DOC file..." })
      ] })
    ] }),
    formik.touched[name] && formik.errors[name] && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-1", children: formik.errors[name] }),
    files.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-1", children: files.map((file, idx) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex items-center justify-between border px-3 py-1 rounded bg-gray-50",
        children: /* @__PURE__ */ jsx("span", { className: "truncate", children: file.name })
      },
      idx
    )) })
  ] });
};
const TextAreaField = ({ label, name, formik, rows = 4 }) => {
  const error = formik.touched[name] && formik.errors[name];
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-1", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        id: name,
        name,
        rows,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        value: formik.values[name],
        placeholder: label,
        className: `w-full px-4 py-2 rounded-lg border transition duration-300 outline-none resize-y bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-blue-400 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `
      }
    ),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs font-medium", children: formik.errors[name] })
  ] });
};
function AddPrerequisite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState({});
  const [inputKey, setInputKey] = useState(Date.now());
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCourses();
        setCourses(res || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    })();
  }, []);
  const formik = useFormik({
    initialValues: {
      courseId: "",
      batchId: "",
      title: "",
      description: "",
      topics: [
        {
          name: "",
          videoLinks: "",
          materialFiles: []
        }
      ]
    },
    validationSchema: Yup.object({
      courseId: Yup.string().required(`${COURSE_NAME} is required`)
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("courseId", values.courseId);
        formData.append("batchId", values.batchId);
        formData.append("title", values.title);
        formData.append("description", values.description);
        const topicsPayload = values.topics.map((topic, idx) => {
          const existing = existingFiles[idx] || [];
          const newFiles = topic.materialFiles?.filter((f) => f instanceof File).map((f) => f.name) || [];
          const finalFiles = [...existing, ...newFiles];
          return {
            name: topic.name,
            videoLinks: topic.videoLinks || "",
            materialFiles: finalFiles.length > 0 ? finalFiles : void 0
          };
        });
        formData.append("topics", JSON.stringify(topicsPayload));
        values.topics.forEach((topic) => {
          if (topic.materialFiles?.length) {
            topic.materialFiles.forEach((file) => {
              if (file instanceof File) {
                formData.append("materialFiles", file);
              }
            });
          }
        });
        const response = id ? await apiClient.put(`/api/prerequisite/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }) : await apiClient.post(`/api/prerequisite`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.data.success) {
          if (!id) {
            Swal.fire({
              title: "Success",
              text: response.data.message,
              icon: "success",
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "Add New Prerequisite",
              denyButtonText: "Manage Prerequisite"
            }).then((result) => {
              if (result.isConfirmed) {
                const emptyTopic = {
                  name: "",
                  videoLinks: "",
                  materialFiles: []
                };
                resetForm({
                  values: {
                    courseId: values.courseId,
                    batchId: values.batchId,
                    title: "",
                    description: "",
                    topics: [emptyTopic]
                  }
                });
                setExistingFiles({});
                setInputKey(Date.now());
              } else if (result.isDenied) {
                navigate("/manage-prerequisite");
              }
            });
          } else {
            Swal.fire("Success", response.data.message, "success").then(() => {
              navigate("/manage-prerequisite");
            });
          }
        } else {
          Swal.fire(
            "Warning",
            response.data.message || "Try again!",
            "warning"
          );
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    }
  });
  useEffect(() => {
    const fetchBatches = async () => {
      const courseId = formik.values.courseId;
      if (!courseId) {
        setBatches([]);
        formik.setFieldValue("batchId", "");
        return;
      }
      try {
        const data = await fetchBatchesByCourseId(courseId);
        setBatches(data.map((b) => ({ _id: b._id, name: b.batchName })));
        if (!id) formik.setFieldValue("batchId", "");
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      }
    };
    fetchBatches();
  }, [formik.values.courseId, id]);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await apiClient.get(`/api/prerequisite/${id}`);
        const data = res.data.data;
        const topics = data.topics?.map((t, idx) => {
          setExistingFiles((prev) => ({
            ...prev,
            [idx]: t.materialFiles || []
          }));
          return {
            name: t.name || "",
            videoLinks: t.videoLinks || "",
            materialFiles: []
            // keep empty; user can add new files
          };
        }) || [{ name: "", videoLinks: "", materialFiles: [] }];
        formik.setValues({
          courseId: data.courseId?._id || data.courseId || "",
          batchId: data.batchId?._id || data.batchId || "",
          title: data.title || "",
          description: data.description || "",
          topics
        });
      } catch (err) {
        Swal.fire(
          "Error",
          handleApiError(err) || "Failed to load prerequisite details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-blue-700 font-medium", children: "Loading prerequisite..." });
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-blue-600",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-blue-700 text-center", children: id ? "Edit Prerequisite" : "Add Prerequisite" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", type: "text", formik }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "courseId",
              options: courses,
              formik
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Batch*",
              name: "batchId",
              options: batches,
              formik
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          TextAreaField,
          {
            label: "Description (optional)",
            name: "description",
            rows: 4,
            formik
          }
        ),
        /* @__PURE__ */ jsx(
          FieldArray,
          {
            name: "topics",
            render: (topicHelpers) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: "Topics*" }),
              formik.values.topics.map((topic, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "border border-blue-500 p-6 rounded-xl space-y-5 shadow-md bg-white",
                  children: [
                    /* @__PURE__ */ jsx(
                      InputField,
                      {
                        label: "Topic Name*",
                        name: `topics.${idx}.name`,
                        formik
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      InputField,
                      {
                        label: "Video Link*",
                        name: `topics.${idx}.videoLinks`,
                        formik,
                        type: "text",
                        placeholder: "https://youtube.com/..."
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      MultiPDFFileUpload,
                      {
                        label: "Upload Topic Files*",
                        name: `topics.${idx}.materialFiles`,
                        formik,
                        multiple: true
                      },
                      inputKey + idx
                    ),
                    existingFiles[idx]?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-3 rounded border", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-blue-700 mb-1", children: "Existing Files" }),
                      /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: existingFiles[idx].map((file, fIdx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: DIR.PREREQUISITE_MATERIALS + file,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "text-blue-600 underline",
                          children: file.split("/").pop()
                        }
                      ) }, fIdx)) })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => topicHelpers.remove(idx),
                        className: "bg-red-600 text-white px-4 py-2 rounded mt-3",
                        children: "Remove Topic"
                      }
                    )
                  ]
                },
                idx
              )),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => topicHelpers.push({
                    name: "",
                    videoLinks: "",
                    materialFiles: []
                  }),
                  className: "bg-blue-600 text-white px-5 py-2 rounded",
                  children: "+ Add Topic"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: formik.isSubmitting || loading,
            className: "bg-blue-700 text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-800 disabled:opacity-50",
            children: formik.isSubmitting || loading ? id ? "Updating..." : "Adding..." : id ? "Update Prerequisite" : "Add Prerequisite"
          }
        ) })
      ]
    }
  ) });
}
const ManagePrerequisites = () => {
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get("b_id");
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const loadPrerequisites = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/prerequisite");
      let data = response.data.data || [];
      if (batchIdParam) {
        data = data.filter((p) => p.batchId === batchIdParam);
      }
      setPrerequisites(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPrerequisites();
  }, [batchIdParam]);
  const handleEdit = (id) => navigate(`/edit-prerequisite/${id}`);
  const handleAdd = () => navigate("/add-prerequisite");
  const handleView = (prerequisite) => {
    setSelectedPrerequisite(prerequisite);
    setIsModalOpen(true);
  };
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won’t be able to recover "${title}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e55c8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      await apiClient.delete(`/api/prerequisite/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${title}" deleted successfully!`
      });
      loadPrerequisites();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete prerequisite."
      });
    }
  };
  const columns = [
    { header: "Title", accessor: "title" },
    // { header: "Course ID", accessor: "courseId" },
    // { header: "Batch ID", accessor: "batchId" },
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
        canPerformAction(rolePermissions, "prerequisite", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleEdit(row._id),
            className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
            children: "Edit"
          }
        ),
        canPerformAction(rolePermissions, "prerequisite", "delete") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleDelete(row._id, row.title),
            className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition",
            children: "Delete"
          }
        )
      ] })
    }
  ];
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading prerequisites..." });
  if (error) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: error });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-h-screen bg-white font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-8 py-2 bg-white shadow-md z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-700", children: "Manage Prerequisites" }),
      !batchIdParam && canPerformAction(rolePermissions, "prerequisite", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleAdd,
          className: "px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition",
          children: "+ Add Prerequisite"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: prerequisites,
        maxHeight: "440px"
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: selectedPrerequisite?.title || "Prerequisite Details",
        children: selectedPrerequisite && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Title" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedPrerequisite.title })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Active" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedPrerequisite.isActive ? "Yes" : "No" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Description" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: selectedPrerequisite.description || "-" })
          ] })
        ] }) })
      }
    )
  ] });
};
const register = async (formData) => {
  try {
    const response = await apiClient.post(`/api/auth/register`, formData, {
      headers: {
        "Content-Type": "application/json"
        // ✅ Correct for JSON
      }
    });
    return response.data;
  } catch (error) {
    console.error("API Register Error:", error.response?.data || error.message);
    throw error.response?.data || {
      success: false,
      message: "Server error during registration."
    };
  }
};
const login = async (email, password, role) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, {
      email,
      password,
      role
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      success: false,
      message: "Server error during login."
    };
  }
};
const verifyEmail = async (token) => {
  try {
    const response = await apiClient.get(`/api/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error(
      "API Verify Email Error:",
      error.response?.data || error.message
    );
    throw error.response?.data || {
      success: false,
      message: "Server error during email verification."
    };
  }
};
const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    rolePermissions: {}
    // permissions for current user role
  },
  reducers: {
    setPermissions: (state, action) => {
      state.rolePermissions = action.payload;
    },
    clearPermissions: (state) => {
      state.rolePermissions = {};
    }
  }
});
const { setPermissions, clearPermissions } = permissionsSlice.actions;
const permissionsReducer = permissionsSlice.reducer;
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const fetchRolePermissions = useCallback(async (role) => {
    try {
      const saved = localStorage.getItem("permissions");
      if (saved) {
        dispatch(setPermissions(JSON.parse(saved)));
        return;
      }
      const res = await apiClient.get("/api/role");
      const roles = res?.data?.message || [];
      const matchedRole = roles.find((r) => r.role === role);
      let permMap = {};
      if (matchedRole) {
        matchedRole.permissions.forEach((p) => {
          permMap[p.module] = p.actions;
        });
      }
      dispatch(setPermissions(permMap));
      localStorage.setItem("permissions", JSON.stringify(permMap));
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    }
  }, [dispatch]);
  useEffect(() => {
    const token = Cookies.get("token");
    const userCookie = Cookies.get("user");
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    let parsedUser = null;
    if (userCookie) {
      try {
        parsedUser = JSON.parse(userCookie);
      } catch {
        Cookies.remove("user");
      }
    }
    if (!parsedUser) {
      try {
        const base64Payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        parsedUser = JSON.parse(atob(base64Payload));
      } catch (err) {
        console.error("Failed to decode token payload", err);
        setCurrentUser(null);
        setLoading(false);
        return;
      }
    }
    setCurrentUser({ token, user: parsedUser });
    if (!localStorage.getItem("permissions") && parsedUser.role) {
      fetchRolePermissions(parsedUser.role);
    } else if (localStorage.getItem("permissions")) {
      dispatch(setPermissions(JSON.parse(localStorage.getItem("permissions"))));
    }
    setLoading(false);
  }, [fetchRolePermissions, dispatch]);
  const login$1 = async (email, password, role) => {
    const response = await login(email, password, role);
    if (response.success && response.data?.token && response.data?.user) {
      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      Cookies.set("role", user.role, { expires: 1 });
      Cookies.set("userId", user._id, { expires: 1 });
      Cookies.set("email", user.email, { expires: 1 });
      if (user.role === "student") {
        Cookies.set(
          "studentId",
          user.studentId || user._id,
          // ⭐ FIX
          { expires: 1 }
        );
      } else if (user.role === "trainer") {
        Cookies.set("trainerId", user._id, { expires: 1 });
      }
      setCurrentUser({ token, user });
      localStorage.removeItem("permissions");
      fetchRolePermissions(user.role);
      return { success: true, user };
    }
    return { success: false, message: response.message };
  };
  const otpLogin = ({ studentId, mobileNo, courseId, role, token, email }) => {
    Cookies.set("token", token, { expires: 1 });
    Cookies.set("role", role, { expires: 1 });
    Cookies.set("mobileNo", mobileNo, { expires: 1 });
    Cookies.set("studentId", studentId);
    Cookies.set("courseId", courseId);
    if (email) {
      Cookies.set("email", email, { expires: 1 });
    }
    const user = { studentId, mobileNo, courseId, role, email };
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    setCurrentUser({ token, user });
    fetchRolePermissions(role);
  };
  const logout2 = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("studentId");
    Cookies.remove("trainerId");
    Cookies.remove("userId");
    Cookies.remove("email");
    localStorage.removeItem("permissions");
    setCurrentUser(null);
    dispatch(setPermissions({}));
  };
  const updateUserContext = (updatedUser) => {
    const token = Cookies.get("token");
    setCurrentUser({ token, user: updatedUser });
    Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
  };
  const value = {
    currentUser,
    loading,
    register,
    login: login$1,
    otpLogin,
    // ✅ Add this
    logout: logout2,
    updateUserContext,
    isAuthenticated: !!currentUser?.token,
    isAdmin: currentUser?.user?.role === "admin",
    isTrainer: currentUser?.user?.role === "trainer",
    token: currentUser?.token || null
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children: !loading && children });
};
function StudentLoginForm() {
  const [mode, setMode] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState(null);
  const { login: login2, otpLogin } = useAuth();
  const emailFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      // email: Yup.string().email("Invalid email").required("Required"),
      // password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await login2(values.email, values.password, "student");
        if (result.success && result.user) {
          toast.success("Login successful!");
          setTimeout(() => {
            window.location.href = "/student/dashboard";
          }, 100);
        } else {
          toast.error(result.message || "Login failed.");
        }
      } catch (err) {
        toast.error(err.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    }
  });
  const sendOtpFormik = useFormik({
    initialValues: { mobileNo: "" },
    validationSchema: Yup.object({
      mobileNo: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required")
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await apiClient.post("/api/otp/send", {
          mobileNo: values.mobileNo
        });
        const data = res.data;
        if (data.success) {
          setReferenceId(data.data.reference_id);
          toast.success("OTP sent successfully!");
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to send OTP"
        );
      } finally {
        setLoading(false);
      }
    }
  });
  const verifyOtpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().matches(/^[0-9]{6}$/, "Must be 6 digits").required("Required")
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await apiClient.post("/api/otp/verify", {
          reference_id: referenceId,
          otp: values.otp
        });
        if (res.data.success && res.data.data) {
          const { studentId, mobileNo, courseId, role, token, email } = res.data.data;
          otpLogin({ studentId, mobileNo, courseId, role, token, email });
          toast.success("Login successful!");
          setTimeout(() => {
            window.location.href = "/student/dashboard";
          }, 100);
        } else {
          toast.error(res.data.message || "Invalid OTP");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to verify OTP"
        );
      } finally {
        setLoading(false);
      }
    }
  });
  useEffect(() => {
    setReferenceId(null);
    sendOtpFormik.resetForm();
    verifyOtpFormik.resetForm();
  }, [mode]);
  return /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-[#e0ecfc] via-[#f5f7fa] to-[#e2e2e2] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "flex flex-col md:flex-row w-full max-w-5xl backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 p-10 bg-white/10 text-gray-800 flex flex-col items-center justify-center backdrop-blur-md", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold mb-4 text-center", children: "Welcome back, Participate! 👋" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg mb-8 text-center max-w-sm", children: "Login to access your participate dashboard and manage your account." }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-3875.jpg",
              alt: "Login Illustration",
              className: "w-full max-w-xs rounded-xl shadow-lg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 bg-white px-10 py-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Login" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Choose Email login to access your account." }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-4", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMode("email"),
                className: `px-4 py-2 rounded-xl font-medium ${mode === "email" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`,
                children: "Email"
              }
            ) })
          ] }),
          mode === "email" ? /* @__PURE__ */ jsxs("form", { onSubmit: emailFormik.handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                placeholder: "Email",
                ...emailFormik.getFieldProps("email")
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                  placeholder: "Password",
                  ...emailFormik.getFieldProps("password")
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg",
                  children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: `w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"}`,
                children: loading ? "Logging in..." : "Login"
              }
            )
          ] }) : !referenceId ? /* @__PURE__ */ jsxs("form", { onSubmit: sendOtpFormik.handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                placeholder: "Mobile Number",
                ...sendOtpFormik.getFieldProps("mobileNo"),
                maxLength: 10
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: `w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"}`,
                children: loading ? "Sending OTP..." : "Send OTP"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: verifyOtpFormik.handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed focus:outline-none",
                value: sendOtpFormik.values.mobileNo,
                readOnly: true
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all",
                placeholder: "Enter OTP",
                ...verifyOtpFormik.getFieldProps("otp"),
                maxLength: 6
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: `w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"}`,
                children: loading ? "Verifying..." : "Login with OTP"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: /* @__PURE__ */ jsx(MdOutlineDashboard, {}),
    module: "*",
    adminOnly: true
  },
  {
    label: "User Management",
    path: "/users",
    icon: /* @__PURE__ */ jsx(FaUserCog, {}),
    module: "user",
    action: "read",
    adminOnly: true
  },
  {
    label: "Trainer Management",
    path: "/trainer-management",
    icon: /* @__PURE__ */ jsx(FaUserTie, {}),
    module: "trainer",
    action: "read",
    adminOnly: true
  },
  {
    label: "Role Based Permissions",
    path: "/role-permission",
    icon: /* @__PURE__ */ jsx(FaUserCog, {}),
    module: "role",
    adminOnly: true
  },
  // Hidden For now 
  // {
  //   label: "Sessions - Upskilling",
  //   path: "/book-session",
  //   icon: <FaChalkboardTeacher />,
  //   module: "session",
  //   action: "read",
  // },
  {
    label: "Training Management",
    icon: /* @__PURE__ */ jsx(RiBook2Line, {}),
    module: "course",
    children: [
      {
        label: `${COURSE_NAME} Management`,
        icon: /* @__PURE__ */ jsx(FaFolderOpen, {}),
        module: "course",
        children: [
          {
            label: `Add ${COURSE_NAME}`,
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/add-courses",
            action: "create",
            module: "course"
          },
          {
            label: `Manage ${COURSE_NAME}`,
            icon: /* @__PURE__ */ jsx(RiFolderSettingsLine, {}),
            path: "/manage-courses",
            action: "read",
            module: "course"
          }
        ]
      },
      // BATCHES
      {
        label: "Batches",
        icon: /* @__PURE__ */ jsx(MdOutlineClass, {}),
        module: "batch",
        children: [
          {
            label: "Create Batch",
            icon: /* @__PURE__ */ jsx(FaGraduationCap, {}),
            path: "/add-batch",
            action: "create",
            module: "batch"
          },
          {
            label: "Manage Batches",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-batches",
            action: "read",
            module: "batch"
          }
        ]
      },
      // CURRICULUM
      {
        label: "Curriculum",
        icon: /* @__PURE__ */ jsx(FaBookOpen, {}),
        module: "curriculum",
        children: [
          {
            label: "Add Curriculum",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/add-curriculum",
            action: "create",
            module: "curriculum"
          },
          {
            label: "Manage Curriculum",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-curriculum",
            action: "read",
            module: "curriculum"
          }
        ]
      },
      {
        label: "Prerequisite",
        icon: /* @__PURE__ */ jsx(FaTasks, {}),
        module: "prerequisite",
        children: [
          {
            label: "Add Prerequisite",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/add-prerequisite",
            action: "create",
            module: "prerequisite"
          },
          {
            label: "Manage Prerequisite",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-prerequisite",
            action: "read",
            module: "prerequisite"
          }
        ]
      },
      // LECTURE
      {
        label: "Recordings",
        icon: /* @__PURE__ */ jsx(FaVideo, {}),
        module: "lecture",
        children: [
          {
            label: "Add Recording",
            icon: /* @__PURE__ */ jsx(FaFileAlt, {}),
            path: "/add-course-videos",
            action: "create",
            module: "lecture"
          },
          {
            label: "Manage Recording",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-course-videos",
            action: "read",
            module: "lecture"
          }
        ]
      },
      // NOTES
      {
        label: "Reference Materials Repository",
        icon: /* @__PURE__ */ jsx(FaStickyNote, {}),
        module: "note",
        children: [
          {
            label: "Add Reference Material Repository",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/add-notes",
            action: "create",
            module: "note"
          },
          {
            label: "Manage Reference Material Repository",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-notes",
            action: "read",
            module: "note"
          }
        ]
      },
      // MEETING
      {
        label: "Session Management",
        icon: /* @__PURE__ */ jsx(MdOutlineMeetingRoom, {}),
        module: "meeting",
        children: [
          {
            label: "Add Session",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/add-meeting",
            action: "create",
            module: "meeting"
          },
          {
            label: "Manage Session",
            icon: /* @__PURE__ */ jsx(FaCalendarAlt, {}),
            path: "/manage-meeting",
            action: "read",
            module: "meeting"
          }
        ]
      },
      // ASSIGNMENT
      {
        label: "Assignment Management",
        icon: /* @__PURE__ */ jsx(FaTasks, {}),
        module: "assignment",
        children: [
          {
            label: "Add Assignment",
            icon: /* @__PURE__ */ jsx(FaFileAlt, {}),
            path: "/add-assignment",
            action: "create",
            module: "assignment"
          },
          {
            label: "Manage Assignments",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-assignments",
            action: "read",
            module: "assignment"
          }
        ]
      },
      // STUDENTS
      {
        label: "Enroll Participate",
        icon: /* @__PURE__ */ jsx(FaClipboardList, {}),
        module: "enrollment",
        children: [
          {
            label: "Enroll Participate",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/enroll-student",
            action: "create",
            module: "enrollment"
          },
          {
            label: "Enrolled Participate List",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/enrolled-student-list",
            action: "read",
            module: "enrollment"
          }
        ]
      },
      // Feedback
      {
        label: "Feedback",
        icon: /* @__PURE__ */ jsx(FaStickyNote, {}),
        module: "feedback",
        children: [
          {
            label: "Add Feedback Questions",
            icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
            path: "/create-feedback",
            action: "create",
            module: "feedback"
          },
          {
            label: "Manage Feedback Questions",
            icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
            path: "/manage-feedback",
            action: "read",
            module: "feedback"
          }
        ]
      }
    ]
  },
  // TESTS
  {
    label: "Assessment Tests",
    icon: /* @__PURE__ */ jsx(FaTasks, {}),
    module: "test",
    children: [
      {
        label: "Add Test",
        icon: /* @__PURE__ */ jsx(FaRegFileAlt, {}),
        path: "/add-test",
        action: "create",
        module: "test"
      },
      {
        label: "Manage Test",
        icon: /* @__PURE__ */ jsx(FaLayerGroup, {}),
        path: "/manage-test",
        action: "read",
        module: "test"
      }
    ]
  }
  // TRAINER
];
const AdminSidebar = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.role;
  const dispatch = useDispatch();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (!userRole) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get("/api/role");
        const roles = res?.data?.message || [];
        const matchedRole = roles.find((r) => r.role === userRole);
        if (!matchedRole) {
          dispatch(setPermissions({}));
        } else {
          const permMap = {};
          matchedRole.permissions.forEach((p) => {
            permMap[p.module] = p.actions;
          });
          dispatch(setPermissions(permMap));
        }
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
        dispatch(setPermissions({}));
      } finally {
        setLoading(false);
      }
    };
    fetchRolePermissions();
  }, [userRole, dispatch]);
  const toggleSubmenu = (label) => {
    setExpandedMenus(
      (prev) => prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };
  if (!userRole || loading || Object.keys(rolePermissions).length === 0) {
    return /* @__PURE__ */ jsx("div", { children: "Loading sidebar..." });
  }
  return /* @__PURE__ */ jsxs("aside", { className: "fixed left-0 w-72 h-screen bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 shadow-md flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b bg-white sticky top-0 z-10 shadow-sm", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-extrabold text-indigo-600 tracking-tight", children: "Management Panel" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
        "Role: ",
        userRole
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 mb-20", children: menuItems.map((item, idx) => /* @__PURE__ */ jsx(
      SidebarItem,
      {
        item,
        expandedMenus,
        toggleSubmenu,
        rolePermissions
      },
      idx
    )) })
  ] });
};
const SidebarItem = ({
  item,
  expandedMenus,
  toggleSubmenu,
  rolePermissions,
  level = 0
}) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.role;
  if (item.adminOnly && userRole !== "admin") {
    return null;
  }
  const isExpanded = expandedMenus.includes(item.label);
  if (item.children) {
    const hasAccessibleChild = item.children.some((child) => {
      if (child.children) {
        return child.children.some(
          (nested) => nested.action ? canPerformAction(rolePermissions, nested.module, nested.action) : true
        );
      }
      return child.action ? canPerformAction(rolePermissions, child.module, child.action) : true;
    });
    if (!hasAccessibleChild) return null;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleSubmenu(item.label),
          style: { paddingLeft: "12px" },
          className: `w-full flex items-center justify-between py-2.5 px-3 rounded-lg font-medium transition-all duration-200
            ${isExpanded ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-indigo-50"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg", style: { minWidth: "24px" }, children: item.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-left", children: item.label })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: isExpanded ? /* @__PURE__ */ jsx(FaChevronUp, {}) : /* @__PURE__ */ jsx(FaChevronDown, {}) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-fit mt-1" : "max-h-0"}`,
          children: item.children.map((child, idx) => /* @__PURE__ */ jsx(
            SidebarItem,
            {
              item: child,
              expandedMenus,
              toggleSubmenu,
              rolePermissions,
              level: level + 1
            },
            idx
          ))
        }
      )
    ] });
  }
  if (!canAccessModule(rolePermissions, item.module)) return null;
  if (item.action && !canPerformAction(rolePermissions, item.module, item.action))
    return null;
  return /* @__PURE__ */ jsxs(
    NavLink,
    {
      to: item.path,
      className: ({ isActive }) => `flex items-center justify-start gap-2 py-2.5 rounded-lg font-medium transition-all duration-200
      ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-indigo-50"}`,
      style: { paddingLeft: "12px" },
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", style: { minWidth: "24px" }, children: item.icon }),
        /* @__PURE__ */ jsx("span", { className: "text-left", children: item.label })
      ]
    }
  );
};
const AdminLayout = () => {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full overflow-hidden", children: [
    /* @__PURE__ */ jsx("aside", { className: "w-64 bg-white border-r shadow-md fixed h-full left-0 z-20", children: /* @__PURE__ */ jsx(AdminSidebar, {}) }),
    /* @__PURE__ */ jsx(
      "main",
      {
        className: "flex-1 ml-67 bg-blue-50  max-h-screen overflow-y-auto p-4 transition-all duration-300",
        children: /* @__PURE__ */ jsx(Outlet, {})
      }
    )
  ] });
};
const Navbar = () => {
  const { currentUser, logout: logout2, isAdmin, isTrainer } = useAuth();
  const navigate = useNavigate();
  const studentId = Cookies.get("studentId");
  const trainerId = Cookies.get("trainerId");
  const [contactInfo, setContactInfo] = useState(null);
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await apiClient.get("/api/contactinfo");
        const data = res.data?.data?.[0];
        if (data) setContactInfo(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }
    };
    fetchContactInfo();
  }, []);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        logout2();
        if (currentUser?.user?.role === "student") {
          navigate("/student-login");
        } else {
          navigate("/login");
        }
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        );
      }
    });
  };
  return /* @__PURE__ */ jsxs("nav", { className: "relative w-full h-16 shadow-md overflow-hidden font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute bg-white top-0 left-0 w-[70%] h-full z-10 flex items-center space-x-6 px-6 py-2", children: [
      contactInfo?.logo && /* @__PURE__ */ jsx(
        "img",
        {
          src: `${DIR.LOGO}${contactInfo.logo}`,
          alt: contactInfo?.companyName || "",
          className: "h-13 w-auto object-contain"
        }
      ),
      /* @__PURE__ */ jsx(Link, { className: "text-2xl font-bold bg-clip-text text-transparent bg-indigo-900", children: contactInfo?.companyName || "" })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-0 right-0 w-[50%] h-full text-white flex items-center justify-end pr-6 space-x-4 z-20",
        style: {
          clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          background: "linear-gradient(to right, #53B8EC, #485DAC, #E9577C)"
        },
        children: currentUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
          isAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "hover:underline text-white", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsx(Link, { to: "/profile", className: "hover:underline text-white", children: "Admin Profile" })
          ] }),
          isTrainer && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/trainer/dashboard",
                className: "hover:underline text-white",
                children: "Trainer Dashboard"
              }
            ),
            trainerId && /* @__PURE__ */ jsx(
              Link,
              {
                to: `/trainers/update/${trainerId}`,
                className: "hover:underline text-white",
                children: "Trainer Profile"
              }
            )
          ] }),
          !isAdmin && !isTrainer && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/student/dashboard",
                className: "hover:underline text-white",
                children: "My Dashboard"
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/student-profile/${studentId}`,
                className: "hover:underline text-white",
                children: "My Profile"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleLogout,
              className: "ml-2 px-3 py-1 bg-white text-[#E9577C] rounded hover:bg-gray-100 transition",
              children: "Logout"
            }
          )
        ] }) : /* @__PURE__ */ jsx(Fragment, {})
      }
    )
  ] });
};
function NoAccessPage() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-[80vh] text-center px-6", children: [
    /* @__PURE__ */ jsx(FaLock, { className: "text-6xl text-red-500 mb-4" }),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "Access Denied" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-md mb-6", children: "You do not have the required permissions to access this page. Please contact your administrator if you believe this is a mistake." })
  ] });
}
const PrivateRoute = ({
  roles = [],
  requiredModule = null,
  requiredAction = null,
  adminOnly = false
  // <<< NEW
}) => {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const rolePermissions = useSelector((state) => state.permissions.rolePermissions);
  if (authLoading) return /* @__PURE__ */ jsx("div", { children: "Loading..." });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  }
  const userRole = currentUser?.user?.role?.toLowerCase();
  if (adminOnly && userRole !== "admin") {
    return /* @__PURE__ */ jsx(NoAccessPage, {});
  }
  if (roles.length > 0 && !roles.includes(userRole)) {
    return /* @__PURE__ */ jsx(NoAccessPage, {});
  }
  if (requiredModule && requiredAction) {
    const canAccess = canPerformAction(
      rolePermissions || {},
      requiredModule.toLowerCase(),
      requiredAction.toLowerCase()
    );
    if (!canAccess) {
      return /* @__PURE__ */ jsx(NoAccessPage, {});
    }
  }
  return /* @__PURE__ */ jsx(Outlet, {});
};
const PublicRoute = () => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    const role = currentUser?.user?.role?.toLowerCase();
    if (role === "trainer") {
      return /* @__PURE__ */ jsx(Navigate, { to: "/trainer/dashboard", replace: true });
    }
    if (role === "student") {
      return /* @__PURE__ */ jsx(Navigate, { to: "/student/dashboard", replace: true });
    }
    return /* @__PURE__ */ jsx(Navigate, { to: "/dashboard", replace: true });
  }
  return /* @__PURE__ */ jsx(Outlet, {});
};
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const scrollableDiv = document.getElementById("main-scroll-container");
    if (scrollableDiv) {
      scrollableDiv.scrollTo({
        top: 0,
        behavior: "smooth"
        // or "auto" if you want instant scroll
      });
    }
  }, [pathname]);
  return null;
}
const initialState$2 = {
  batchId: null,
  batchName: "",
  assignments: []
};
const assignmentSlice = createSlice({
  name: "assignments",
  initialState: initialState$2,
  reducers: {
    // Set batch info (id + name)
    setBatchInfo: (state, action) => {
      const { batchId, batchName } = action.payload;
      state.batchId = batchId;
      state.batchName = batchName;
      console.log("Redux batchId:", batchId);
      console.log("Redux batchName:", batchName);
    },
    // Set all assignments for the batch
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    // Update a specific assignment (like after submission)
    updateAssignment: (state, action) => {
      const updatedAssignment = action.payload;
      const index = state.assignments.findIndex(
        (a) => a._id === updatedAssignment._id
      );
      if (index !== -1) {
        state.assignments[index] = updatedAssignment;
      }
    },
    // Clear assignments (like when switching batches)
    clearAssignmentsState: () => initialState$2
  }
});
const {
  setBatchInfo: setBatchInfo$1,
  setAssignments,
  updateAssignment,
  clearAssignmentsState
} = assignmentSlice.actions;
const assignmentReducer = assignmentSlice.reducer;
const SubmittedAssignments = ({ studentId, setViewModal }) => {
  const { assignments } = useSelector((state) => state.assignments);
  const getSubmission = (assignment) => assignment.submissions?.find((s) => s.student === studentId) || null;
  const submitted = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = getSubmission(assignment);
      return submission && submission.status === "check";
    });
  }, [assignments, studentId]);
  if (!submitted.length)
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "No submitted assignments yet." });
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 p-4", children: submitted.map((assignment) => {
    const submission = getSubmission(assignment);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative p-6 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg border-3 border-sky-700 hover:shadow-2xl transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx("span", { className: "absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md", children: "Under Review" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: assignment.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 line-clamp-3", children: assignment.description }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-colors duration-300",
              onClick: () => setViewModal({ assignment, submission }),
              children: "View"
            }
          )
        ]
      },
      assignment._id
    );
  }) });
};
const UnsubmittedAssignments = ({ studentId, setSubmitModal }) => {
  const { assignments } = useSelector((state) => state.assignments);
  const unsubmitted = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = assignment.submissions?.find(
        (s) => s.student === studentId
      );
      if (!submission) return true;
      if (submission.status === "unsubmitted") return true;
      return false;
    });
  }, [assignments, studentId]);
  if (!unsubmitted.length)
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "No unsubmitted assignments." });
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 p-4", children: unsubmitted.map((assignment) => {
    const overdue = new Date(assignment.deadline) < /* @__PURE__ */ new Date();
    const isDisabled = overdue;
    const statusTag = overdue ? { text: "Overdue", bg: "bg-red-500" } : { text: "Not Started", bg: "bg-purple-500" };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative p-6 rounded-lg shadow-lg transition-all border-3 border-sky-800 duration-300 ${isDisabled ? "bg-gray-200 opacity-70 cursor-not-allowed" : "bg-white hover:shadow-2xl"}`,
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide shadow-md ${statusTag.bg}`,
              children: statusTag.text
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: assignment.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 line-clamp-3", children: assignment.description }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-4", children: [
            "Deadline: ",
            new Date(assignment.deadline).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `px-5 py-2 rounded-xl font-semibold text-white shadow-md transition-colors duration-300 ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`,
              disabled: isDisabled,
              onClick: () => !isDisabled && setSubmitModal(assignment),
              children: isDisabled ? "Deadline Passed" : "Submit"
            }
          )
        ]
      },
      assignment._id
    );
  }) });
};
const GradedAssignments = ({ studentId, setViewModal }) => {
  const { assignments } = useSelector((state) => state.assignments);
  const gradedAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) => assignment.submissions?.some(
        (s) => s.student === studentId && s.status === "submitted" && s.score != null
      )
    );
  }, [assignments, studentId]);
  if (gradedAssignments.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "No graded assignments yet." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4", children: gradedAssignments.map((assignment) => {
    const submission = assignment.submissions.find(
      (s) => s.student === studentId && s.status === "submitted" && s.score != null
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative bg-white rounded-lg border-3 border-sky-800 shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer",
        onClick: () => setViewModal({ assignment, submission }),
        children: [
          /* @__PURE__ */ jsx("span", { className: "absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase shadow-md", children: "Graded" }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-2", children: assignment.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 line-clamp-3", children: assignment.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-green-600 font-semibold text-lg", children: [
              "Score: ",
              submission?.score ?? "N/A"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
              "Remarks: ",
              submission?.remarks ?? "No remarks provided"
            ] })
          ] })
        ]
      },
      assignment._id
    );
  }) });
};
const ResubmitAssignments = ({ studentId, setViewModal }) => {
  const { assignments } = useSelector((state) => state.assignments);
  const resubmitAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = assignment.submissions?.find(
        (s) => s.student === studentId && s.mistakePhotos?.length > 0 && s.status === "unsubmitted"
      );
      return submission;
    });
  }, [assignments, studentId]);
  if (!resubmitAssignments.length) {
    return /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "No assignments to resubmit." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4", children: resubmitAssignments.map((assignment) => {
    const submission = assignment.submissions.find(
      (s) => s.student === studentId && s.mistakePhotos?.length > 0 && s.status === "unsubmitted"
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative bg-white rounded-lg border-3 border-sky-800 shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between",
        children: [
          /* @__PURE__ */ jsx("span", { className: "absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase shadow-md", children: "Rejected" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-2", children: assignment.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 line-clamp-3", children: assignment.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-red-600 font-semibold text-lg", children: [
                "Mistakes Found: ",
                submission?.mistakePhotos.length ?? 0
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
                "Remarks: ",
                submission?.remarks ?? "No remarks provided"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => setViewModal({ assignment, submission }),
              className: "mt-6 cursor-pointer bg-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-rose-600 hover:shadow-lg transition-all duration-300 text-center text-lg",
              children: "Resubmit Assignment"
            }
          )
        ]
      },
      assignment._id
    );
  }) });
};
const ViewSubmissionModal = ({ assignment, submission, onClose }) => {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors",
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: [
      assignment.title,
      " – Submission Details"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-2", children: assignment.description }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-500 mb-4", children: [
      "Submitted At: ",
      new Date(submission.submittedAt).toLocaleString()
    ] }),
    submission.files?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Files / Links:" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: submission.files.map((file, idx) => {
        const isLink = /^https?:\/\//i.test(file);
        const href = isLink ? file : DIR.ASSIGNMENT_SUBMISSIONS + file;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline hover:text-blue-600",
            children: file
          }
        ) }, idx);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-1", children: "Remarks:" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: submission.remarks || "No remarks provided" })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition-colors",
        children: "Close"
      }
    )
  ] }) });
};
const SubmitAssignmentModal = ({ assignment, studentId, onClose }) => {
  const dispatch = useDispatch();
  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [comments, setComments] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("studentId", studentId);
      formData.append("status", "check");
      formData.append("remarks", comments);
      if (submissionType === "file") formData.append("submissionFile", file);
      else if (submissionType === "github") formData.append("githubLink", githubLink);
      else formData.append("githubLink", otherLink);
      const response = await apiClient.post("/api/assignments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Assignment submitted successfully"
        });
        if (response.data.data) {
          dispatch(updateAssignment(response.data.data));
        }
        setSubmissionType("");
        setFile(null);
        setGithubLink("");
        setOtherLink("");
        setComments("");
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to submit assignment"
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Something went wrong"
      });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors",
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Submit Assignment" }),
    assignment?.fileUrl && /* @__PURE__ */ jsx("div", { className: "mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg", children: /* @__PURE__ */ jsx(
      "a",
      {
        href: `${DIR.ASSIGNMENT_FILES}${assignment.fileUrl}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-500 underline hover:text-blue-600",
        children: "View Assignment File"
      }
    ) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ["file", "github", "link"].map((type) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setSubmissionType(type),
          className: `px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${submissionType === type ? "bg-blue-50 border-blue-400 text-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`,
          children: type.toUpperCase()
        },
        type
      )) }),
      submissionType === "file" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        file && /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 border border-gray-300 p-2 rounded-md text-gray-700 text-sm", children: [
          "Selected File: ",
          file.name || file
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            onChange: (e) => setFile(e.target.files[0]),
            className: "w-full border px-3 py-2 rounded-lg"
          }
        )
      ] }),
      submissionType === "github" && /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          placeholder: "GitHub Repository URL",
          value: githubLink,
          onChange: (e) => setGithubLink(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      submissionType === "link" && /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          placeholder: "Project URL",
          value: otherLink,
          onChange: (e) => setOtherLink(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Additional notes",
          value: comments,
          onChange: (e) => setComments(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: !submissionType || submissionType === "file" && !file || submissionType === "github" && !githubLink || submissionType === "link" && !otherLink,
          className: "bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50 transition-all duration-300",
          children: "Submit Assignment"
        }
      )
    ] })
  ] }) });
};
const GradedAssignmentModal = ({ assignment, submission, onClose }) => {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold transition-colors",
        children: "×"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: assignment.title }) }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-2", children: assignment.description }),
    /* @__PURE__ */ jsxs("p", { className: "text-gray-500 mb-4 text-sm", children: [
      "Submitted At: ",
      new Date(submission.submittedAt).toLocaleString()
    ] }),
    submission.files?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700 mb-2", children: "Files / Links:" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: submission.files.map((file, idx) => {
        const isLink = /^https?:\/\//i.test(file);
        const href = isLink ? file : DIR.ASSIGNMENT_SUBMISSIONS + file;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline hover:text-blue-600",
            children: file
          }
        ) }, idx);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-2", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-green-600 font-semibold text-lg", children: [
        "Score: ",
        submission.score
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: submission.remarks })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300",
        children: "Close"
      }
    ) })
  ] }) });
};
const ResubmitAssignmentModal = ({ assignment, submission, onClose }) => {
  const dispatch = useDispatch();
  const { batchId } = useSelector((state) => state.assignments);
  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [comments, setComments] = useState("");
  const [resubmitting, setResubmitting] = useState(false);
  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!submissionType || submissionType === "file" && !file || submissionType === "github" && !githubLink || submissionType === "link" && !otherLink) {
      return Swal.fire({
        icon: "warning",
        title: "Incomplete",
        text: "Please provide your resubmission"
      });
    }
    try {
      setResubmitting(true);
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("submissionId", submission._id);
      formData.append("status", "check");
      formData.append(
        "remarks",
        comments || "Completed all tasks and resubmitted on time"
      );
      if (submissionType === "file") formData.append("files", file);
      else if (submissionType === "github") formData.append("githubLink", githubLink);
      else formData.append("githubLink", otherLink);
      const response = await apiClient.post("/api/assignments/resubmit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Assignment resubmitted successfully"
        });
        if (response.data.data) {
          dispatch(updateAssignment(response.data.data));
        }
        if (batchId) {
          const { data } = await apiClient.get(`/api/batches/batches/${batchId}`);
          dispatch(setAssignments(data.data.assignments || []));
        }
        setSubmissionType("");
        setFile(null);
        setGithubLink("");
        setOtherLink("");
        setComments("");
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to resubmit assignment"
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Something went wrong"
      });
    } finally {
      setResubmitting(false);
    }
  };
  const getAssignmentFileUrl = (file2) => {
    if (!file2) return "#";
    if (file2.startsWith("http://") || file2.startsWith("https://")) {
      return file2;
    } else if (file2.startsWith("submissionFile")) {
      return `${DIR.ASSIGNMENT_SUBMISSIONS}${file2}`;
    } else if (file2.startsWith("files")) {
      return `${DIR.ASSIGNMENT_RESUBMISSIONS}${file2}`;
    } else {
      return `${DIR.ASSIGNMENT_SUBMISSIONS}${file2}`;
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors",
        children: "✕"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: assignment.title }) }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: assignment.description }),
    assignment.fileUrl && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700 mb-2", children: "Assignment File:" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: DIR.ASSIGNMENT_FILES + assignment.fileUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-blue-500 underline hover:text-blue-600",
          children: assignment.fileUrl
        }
      )
    ] }),
    submission?.mistakePhotos?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold mb-3", children: "Mistakes found. Please review and resubmit:" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4", children: submission.mistakePhotos.map((fileName, idx) => {
        const fileUrl = `${DIR.MISTAKE_PHOTOS}${fileName}`;
        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
        return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          isImage ? /* @__PURE__ */ jsx("a", { href: fileUrl, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: fileUrl,
              alt: `Mistake ${idx + 1}`,
              className: "w-28 h-28 object-cover border rounded-lg hover:scale-105 transition-transform duration-200"
            }
          ) }) : /* @__PURE__ */ jsxs(
            "a",
            {
              href: fileUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 underline hover:text-blue-700",
              children: [
                "📄 Open Mistake File ",
                idx + 1
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs mt-1 text-gray-600", children: [
            "Mistake ",
            idx + 1
          ] })
        ] }, idx);
      }) })
    ] }),
    submission?.files?.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-700 mb-2", children: "Previous Submission:" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1", children: submission.files.map((file2, idx) => {
        const href = getAssignmentFileUrl(file2);
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 underline hover:text-blue-600",
            children: file2
          }
        ) }, idx);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleResubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-3 mb-2", children: ["file", "github", "link"].map((type) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setSubmissionType(type),
          className: `px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${submissionType === type ? "bg-blue-50 border-blue-400 text-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`,
          children: type.toUpperCase()
        },
        type
      )) }),
      submissionType === "file" && /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          onChange: (e) => setFile(e.target.files[0]),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      submissionType === "github" && /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          placeholder: "GitHub Repository URL",
          value: githubLink,
          onChange: (e) => setGithubLink(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      submissionType === "link" && /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          placeholder: "Project URL",
          value: otherLink,
          onChange: (e) => setOtherLink(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "Additional notes",
          value: comments,
          onChange: (e) => setComments(e.target.value),
          className: "w-full border px-3 py-2 rounded-lg"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: resubmitting || !submissionType || submissionType === "file" && !file || submissionType === "github" && !githubLink || submissionType === "link" && !otherLink,
          className: "bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50 transition-all duration-300",
          children: resubmitting ? "Resubmitting..." : "Resubmit Assignment"
        }
      )
    ] })
  ] }) });
};
const AssignmentsPage = () => {
  const dispatch = useDispatch();
  const { batchId: paramBatchId } = useParams();
  const [loading, setLoading] = useState(true);
  const { batchId, batchName } = useSelector((state) => state.assignments);
  const [viewModal, setViewModal] = useState(null);
  const [submitModal, setSubmitModal] = useState(null);
  const [resubmitModal, setResubmitModal] = useState(null);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const studentId = Cookies.get("studentId");
  useEffect(() => {
    const loadBatch = async () => {
      try {
        setLoading(true);
        if (!batchId || batchId !== paramBatchId) {
          const { data } = await apiClient.get(
            `/api/batches/batches/${paramBatchId}`
          );
          const batchData = data.data;
          dispatch(
            setBatchInfo$1({ batchId: batchData._id, batchName: batchData.batchName })
          );
          dispatch(setAssignments(batchData.assignments || []));
        }
      } catch (err) {
        console.error("Failed to fetch batch:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBatch();
  }, [batchId, paramBatchId, dispatch]);
  if (loading || !batchId) return /* @__PURE__ */ jsx("div", { children: "Loading batch…" });
  return /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-6", children: [
      "Assignments — ",
      batchName
    ] }),
    filter === "submitted" && /* @__PURE__ */ jsx(SubmittedAssignments, { studentId, setViewModal }),
    filter === "unsubmitted" && /* @__PURE__ */ jsx(UnsubmittedAssignments, { studentId, setSubmitModal }),
    filter === "graded" && /* @__PURE__ */ jsx(GradedAssignments, { studentId, setViewModal }),
    filter === "resubmit" && /* @__PURE__ */ jsx(
      ResubmitAssignments,
      {
        studentId,
        setViewModal: ({ assignment, submission }) => setResubmitModal({ assignment, submission })
      }
    ),
    !filter && /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Please select a filter from the Assignments tab." }),
    submitModal && /* @__PURE__ */ jsx(
      SubmitAssignmentModal,
      {
        assignment: submitModal,
        studentId,
        onClose: () => setSubmitModal(null)
      }
    ),
    viewModal && (() => {
      const { submission, assignment } = viewModal;
      if (submission.score != null && submission.status === "submitted") {
        return /* @__PURE__ */ jsx(
          GradedAssignmentModal,
          {
            assignment,
            submission,
            studentId,
            onClose: () => setViewModal(null)
          }
        );
      }
      return /* @__PURE__ */ jsx(
        ViewSubmissionModal,
        {
          assignment,
          submission,
          studentId,
          onClose: () => setViewModal(null)
        }
      );
    })(),
    resubmitModal && /* @__PURE__ */ jsx(
      ResubmitAssignmentModal,
      {
        assignment: resubmitModal.assignment,
        submission: resubmitModal.submission,
        onClose: () => setResubmitModal(null)
      }
    )
  ] });
};
const FeedbackTab = () => {
  const location = useLocation();
  const { batch, feedback } = location.state || {};
  const navigate = useNavigate();
  const feedbackForm = feedback || batch?.feedbacks?.[0];
  const questions = feedbackForm?.questions.map((q) => q.question) || [];
  const npsQuestion = feedbackForm?.nps?.question;
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const emojiToValue = {
    "Strongly Agree": 5,
    Agree: 4,
    "Can't Say": 3,
    Disagree: 1
  };
  const emojiToEnum = {
    "Strongly Agree": "strongly_agree",
    Agree: "agree",
    "Can't Say": "cant_say",
    Disagree: "disagree"
  };
  useEffect(() => {
    setStudentId(Cookies.get("studentId") || Cookies.get("userId"));
    setCourseId(Cookies.get("courseId") || batch?.courseId);
  }, [batch]);
  const handleEmojiRate = (question, label) => {
    const numeric = emojiToValue[label];
    setResponses((prev) => ({ ...prev, [question]: numeric }));
  };
  const handleNumericRate = (question, value) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };
  const totalQuestions = questions.length + (npsQuestion ? 1 : 0);
  const answeredCount = Object.keys(responses).length;
  const submitFeedback = async () => {
    if (!feedbackForm || !studentId || !courseId) return;
    setError("");
    const formattedQuestions = feedbackForm.questions.map((q) => {
      const selectedValue = Object.keys(emojiToValue).find(
        (key) => emojiToValue[key] === responses[q.question]
      );
      return {
        question: q.question,
        answer: emojiToEnum[selectedValue] || "cant_say"
      };
    });
    const npsScore = responses[npsQuestion] ?? null;
    const payload = {
      courseId,
      batchId: batch._id,
      studentId,
      feedbackQuestionId: feedbackForm._id,
      // <-- send the feedback form _id here
      questions: formattedQuestions,
      npsScore
    };
    try {
      await apiClient.post(`/api/feedback`, payload);
      setSubmitted(true);
      Swal.fire({
        icon: "success",
        title: "Thank You! 🎉",
        text: "Your feedback has been submitted successfully.",
        confirmButtonText: "OK"
      }).then(() => {
        navigate(-1);
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border p-6 mb-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate(-1),
          className: "flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition mb-4",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg", children: /* @__PURE__ */ jsx(FaComments, { className: "w-7 h-7" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Batch Feedback" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-lg mt-1", children: [
            "Share your experience for ",
            /* @__PURE__ */ jsx("strong", { children: batch?.batchName })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b bg-gradient-to-r from-blue-50 to-purple-100", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Your Feedback" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
          "Answer ",
          totalQuestions,
          " questions"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
        questions.length > 0 ? questions.map((q, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border p-5 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all",
            children: [
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900 mb-3", children: [
                index + 1,
                ". ",
                q
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
                {
                  label: "Strongly Agree",
                  color: "from-emerald-400 to-emerald-500",
                  emoji: "😊",
                  bg: "bg-emerald-50",
                  text: "text-emerald-700"
                },
                {
                  label: "Agree",
                  color: "from-blue-400 to-blue-500",
                  emoji: "👍",
                  bg: "bg-blue-50",
                  text: "text-blue-700"
                },
                {
                  label: "Can't Say",
                  color: "from-amber-400 to-amber-500",
                  emoji: "😐",
                  bg: "bg-amber-50",
                  text: "text-amber-700"
                },
                {
                  label: "Disagree",
                  color: "from-red-400 to-red-500",
                  emoji: "👎",
                  bg: "bg-red-50",
                  text: "text-red-700"
                }
              ].map((option, oIdx) => /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => handleEmojiRate(q, option.label),
                  className: `${option.bg} rounded-xl p-2 border transition-all duration-300 transform hover:scale-[1.03] cursor-pointer ${responses[q] === emojiToValue[option.label] ? "border-2 border-blue-600 shadow-lg" : "border-transparent"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl mb-2 shadow-lg`,
                        children: option.emoji
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: `font-semibold ${option.text}`, children: option.label })
                  ] })
                },
                oIdx
              )) })
            ]
          },
          index
        )) : /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(FaComments, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-700", children: "No Feedback Questions Available" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Instructor will update the feedback form soon." })
        ] }),
        npsQuestion && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-xl border border-indigo-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⭐" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-800", children: "Net Promoter Score" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Your honest feedback helps us improve" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-800 mb-6 mt-4", children: "How likely are you to recommend this learning program to your colleagues?" }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-between relative", children: [...Array(11).keys()].map((num) => {
            const isFilled = responses[npsQuestion] >= num;
            const bgColor = isFilled ? num <= 6 ? "bg-gradient-to-b from-rose-500 to-rose-600" : num <= 8 ? "bg-gradient-to-b from-yellow-500 to-yellow-600" : "bg-gradient-to-b from-emerald-500 to-emerald-600" : "bg-gray-300";
            const textColor = isFilled ? num <= 6 ? "text-red-600" : num <= 8 ? "text-yellow-600" : "text-emerald-600" : "text-gray-400";
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-col items-center relative",
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => handleNumericRate(npsQuestion, num),
                      className: `w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transition-all duration-300 cursor-pointer`,
                      children: num
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: `text-sm font-semibold ${textColor}`, children: num }),
                    num === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Not likely" }),
                    num === 5 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Neutral" }),
                    num === 10 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Extremely likely" })
                  ] })
                ]
              },
              num
            );
          }) })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-600 text-center mt-4", children: error }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        disabled: submitted || !npsQuestion && questions.length === 0,
        onClick: submitFeedback,
        className: `px-8 py-3 rounded-xl text-white text-lg font-semibold transition-all shadow-lg flex items-center gap-2 mx-auto ${submitted ? "bg-green-600 cursor-default" : answeredCount === totalQuestions ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`,
        children: submitted ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-5 h-5" }),
          " Feedback Submitted"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(FaPaperPlane, { className: "w-5 h-5" }),
          " Submit Feedback"
        ] })
      }
    ) })
  ] });
};
const ResultPopup = ({ result, onClose }) => {
  const navigate = useNavigate();
  if (!result) return null;
  const percentage = (result.marks / result.totalMarks * 100).toFixed(1);
  const isPassed = result.marks >= result.passingMarks;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-700", children: "Test Result" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Summary of your performance" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: `w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold
              ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
            `,
        children: [
          result.marks,
          "/",
          result.totalMarks
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-center mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Correct" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-green-600", children: result.correct })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-red-50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Wrong" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-red-600", children: result.wrong })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [
        /* @__PURE__ */ jsx("span", { children: "Percentage" }),
        /* @__PURE__ */ jsxs("span", { children: [
          percentage,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 h-2 rounded-full", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `h-2 rounded-full ${isPassed ? "bg-green-500" : "bg-red-500"}`,
          style: { width: `${percentage}%` }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `text-center font-semibold mb-4
            ${isPassed ? "text-green-700" : "text-red-600"}
          `,
        children: isPassed ? "🎉 Congratulations! You Passed" : "📚 Keep Practicing!"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100",
        children: "Back to Tests"
      }
    ) })
  ] }) });
};
function TestClock({ testDuration, timeLeft, setTimeLeft, handleSubmit, title }) {
  const hasSubmittedRef = useRef(false);
  useEffect(() => {
    if (hasSubmittedRef.current) return;
    if (timeLeft <= 0) {
      hasSubmittedRef.current = true;
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1e3);
    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft, handleSubmit]);
  const totalDuration = (testDuration?.minutes || 0) * 60 + (testDuration?.seconds || 0);
  const progressWidth = totalDuration ? timeLeft / totalDuration * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col justify-start", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-lg sm:text-xl md:text-xl font-bold mb-1 sm:mb-2", children: title || "N/A" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute transition-all duration-300 z-10",
          style: {
            left: `${progressWidth}%`,
            transform: `translate(-50%, 0)`,
            top: "2.5rem"
          },
          children: /* @__PURE__ */ jsx(FcAlarmClock, { className: "text-2xl mt-2 sm:mt-6 md:mt-3 sm:text-3xl" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-300 rounded-full h-3 sm:h-4 overflow-hidden mt-6 relative", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-500",
          style: {
            width: `${progressWidth}%`,
            background: "linear-gradient(to right, red 0%, yellow 50%, green 100%)"
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-base sm:text-lg md:text-xl font-semibold mt-2 sm:mt-0 whitespace-nowrap", children: [
      "Time: ",
      String(Math.floor(timeLeft / 60)).padStart(2, "0"),
      ":",
      String(timeLeft % 60).padStart(2, "0")
    ] })
  ] });
}
const TestClock$1 = memo(TestClock);
const OPTIONS = ["A", "B", "C", "D"];
const TestDetail = ({ onBack = () => window.history.back(), baseurl }) => {
  const { testID } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [connectionLost, setConnectionLost] = useState(false);
  useRef(null);
  const studentId = Cookies.get("studentId");
  test?.testDuration ? test.testDuration.minutes * 60 + test.testDuration.seconds : 0;
  const secondsToDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };
  useEffect(() => {
    if (!studentId) return;
    const fetchQuestions = async () => {
      if (!testID) return;
      try {
        const response = await apiClient.post(`/api/iqtest/questions`, {
          testID,
          studentId
        });
        if (response.data.success) {
          const data = response.data.data;
          setTest(data);
          const restoredAnswers = data.questions.map(
            (q) => q.selectedOption || ""
          );
          setAnswers(restoredAnswers);
          const firstUnansweredIndex = data.questions.findIndex(
            (q) => !q.selectedOption
          );
          setCurrentQuestion(
            firstUnansweredIndex !== -1 ? firstUnansweredIndex : data.questions.length - 1
          );
          const duration = (data.testDuration?.minutes || 0) * 60 + (data.testDuration?.seconds || 0);
          setTimeLeft(duration);
        }
      } catch (err) {
        console.error("Error fetching test questions:", err);
      }
    };
    fetchQuestions();
  }, [studentId, testID, baseurl]);
  useEffect(() => {
    console.log("studentId:", studentId, "testID:", testID);
  }, [studentId, testID]);
  const handleOptionSelect = async (option) => {
    if (submitted || !test || connectionLost) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
    const currentQ2 = test.questions[currentQuestion];
    try {
      await apiClient.put(`/api/iqtest/update-answer`, {
        iqTestId: test._id,
        studentId,
        testID: test.testID,
        questionId: currentQ2._id,
        selectedOption: option,
        status: 1,
        // testDuration: test.testDuration,
        testDuration: secondsToDuration(timeLeft)
        // ✅ latest time
      });
    } catch (err) {
      console.error("Error updating answer:", err);
      setConnectionLost(true);
    }
  };
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, test.questions.length - 1));
  };
  const handlePrevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };
  const submitTest = async () => {
    if (!test) return;
    setSubmitted(true);
    exitFullscreen();
    try {
      const response = await apiClient.post(`/api/iqtest/submit`, {
        testID: test.testID,
        studentId,
        // testDuration: test.testDuration,
        testDuration: secondsToDuration(timeLeft)
        // ✅ latest time
      });
      if (response.data?.success) {
        setSubmitResult(response.data.data);
        setShowResultPopup(true);
      }
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      submitTest();
    }
  }, [timeLeft, submitted]);
  useEffect(() => {
    if (connectionLost) {
      exitFullscreen();
      Swal.fire({
        icon: "error",
        title: "Connection Lost!",
        text: "Your connection to the server has been lost. The test will be closed.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Close Test"
      }).then(() => {
        onBack();
      });
    }
  }, [connectionLost]);
  if (!test) return /* @__PURE__ */ jsx("p", { children: "Loading test..." });
  const currentQ = test.questions[currentQuestion];
  return (
    // <div className="flex flex-col w-full max-w-7xl mx-auto p-4 space-y-4">
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex flex-col w-screen min-h-screen p-4 space-y-4 bg-gray-100  ${connectionLost ? "pointer-events-none opacity-50" : ""}`,
        children: [
          !submitted && /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 p-3 md:p-4 shadow-lg rounded-xl mb-4 flex justify-between items-center", children: /* @__PURE__ */ jsx(
            TestClock$1,
            {
              testDuration: test.testDuration,
              timeLeft,
              setTimeLeft,
              title: test.title,
              handleSubmit: submitTest
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mb-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-[#2C4167] text-white w-10 h-10 flex items-center justify-center text-xl font-bold rounded-sm", children: currentQuestion + 1 }),
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: currentQ.chapterName || "Chapter: N/A" })
                ] }),
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-[#2C4167]", children: currentQ.question })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: OPTIONS.map((opt) => {
                const optionText = currentQ[`option${opt}`];
                if (!optionText) return null;
                const selected = answers[currentQuestion] === opt;
                const isCorrect = submitted && answers[currentQuestion] === currentQ.correctAns;
                return /* @__PURE__ */ jsxs(
                  "label",
                  {
                    className: `flex items-center gap-2 p-2 border rounded cursor-pointer
                      ${selected ? "bg-blue-50 border-blue-500" : "bg-gray-50"}
                      ${submitted && (isCorrect ? "bg-green-100 border-green-500" : selected ? "bg-red-100 border-red-500" : "")}
                    `,
                    children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "radio",
                          name: `question-${currentQ._id}`,
                          value: opt,
                          checked: selected,
                          disabled: submitted,
                          onChange: () => handleOptionSelect(opt)
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { children: [
                        opt,
                        ". ",
                        optionText
                      ] })
                    ]
                  },
                  opt
                );
              }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-6", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handlePrevQuestion,
                    className: "flex items-center bg-white border border-[#2C4167] text-[#2C4167] px-4 py-2 rounded hover:bg-gray-50 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(FaArrowLeft, { className: "mr-2" }),
                      " Previous"
                    ]
                  }
                ),
                currentQuestion < test.questions.length - 1 ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: handleNextQuestion,
                    className: `flex items-center px-4 py-2 rounded transition-colors
                    ${answers[currentQuestion] ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
                  `,
                    disabled: !answers[currentQuestion],
                    children: [
                      "Save & Next ",
                      /* @__PURE__ */ jsx(FaArrowRight, { className: "ml-2" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: submitTest,
                    className: `flex items-center px-4 py-2 rounded transition-colors
                    ${answers[currentQuestion] ? "bg-[#F7941D] text-white hover:bg-[#E88C19]" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
                  `,
                    disabled: !answers[currentQuestion],
                    children: [
                      "Submit ",
                      /* @__PURE__ */ jsx(FaCheckCircle, { className: "ml-2" })
                    ]
                  }
                )
              ] }),
              submitted && /* @__PURE__ */ jsx("p", { className: "mt-4 text-blue-700 font-semibold", children: "Test submitted! Closing shortly..." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/3 xl:w-1/4 bg-white p-4 rounded-lg shadow-md", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-4", children: "Questions" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: test.questions.map((q, idx) => {
                const attempted = answers[idx] !== "";
                const isCurrent = idx === currentQuestion;
                return /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setCurrentQuestion(idx),
                    className: `w-8 h-8 flex items-center justify-center border-2 rounded transition-all
                      ${isCurrent ? "bg-blue-500 text-white border-blue-700" : attempted ? "bg-cyan-800 text-white border-cyan-900" : "bg-amber-400 text-black border-amber-600"}
                    `,
                    children: idx + 1
                  },
                  q._id
                );
              }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-[#2C4167] mb-2", children: "Legend" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-[#2C4167] mr-2" }),
                    /* @__PURE__ */ jsx("span", { children: "Attempted" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-[#3498DB] mr-2" }),
                    /* @__PURE__ */ jsx("span", { children: "Current" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-[#E67E22] mr-2" }),
                    /* @__PURE__ */ jsx("span", { children: "Unattempted" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          showResultPopup && submitResult && /* @__PURE__ */ jsx(
            ResultPopup,
            {
              result: submitResult,
              onClose: () => {
                setShowResultPopup(false);
                onBack();
              }
            }
          )
        ]
      }
    )
  );
};
const ENDPOINT = "/api/session-category";
const getSessionCategories = async () => {
  const response = await apiClient.get(ENDPOINT);
  return response.data?.data || [];
};
const createSessionCategory = async (data) => {
  const response = await apiClient.post(ENDPOINT, data);
  return response.data;
};
const updateSessionCategory = async (id, data) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};
const deleteSessionCategory = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};
const getAllEvents = async () => {
  const response = await apiClient.get("/api/event");
  return response.data?.data || [];
};
const getEventById = (id) => apiClient.get(`/api/event/${id}`);
const createEvent = (formData) => apiClient.post("/api/event", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
const updateEvent = (id, formData) => apiClient.put(`/api/event/${id}`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
const deleteEvent = async (id) => {
  const response = await apiClient.delete(`/api/event/${id}`);
  return response.data;
};
const getAllWebinars = async () => {
  const response = await apiClient.get("/api/webinars");
  return response.data?.data || [];
};
const getWebinarById = (webinarId) => {
  return apiClient.get(`/api/webinars/${webinarId}`);
};
const updateWebinar = (webinarId, formData) => {
  return apiClient.put(`/api/webinars/${webinarId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
const createWebinar = (formData) => {
  return apiClient.post("/api/webinars", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
const deleteWebinar = async (webinarId) => {
  const response = await apiClient.delete(`/api/webinars/${webinarId}`);
  return response.data;
};
const WORKSHOP_BASE_URL = "/api/workshops";
const getAllWorkshops = async () => {
  const response = await apiClient.get(WORKSHOP_BASE_URL);
  return response.data?.data || [];
};
const fetchWorkshopById = async (id) => {
  const response = await apiClient.get(`${WORKSHOP_BASE_URL}/${id}`);
  return response.data?.data || null;
};
const createWorkshop = async (payload) => {
  const response = await apiClient.post(WORKSHOP_BASE_URL, payload);
  return response.data;
};
const updateWorkshop = async (id, payload) => {
  const response = await apiClient.put(`${WORKSHOP_BASE_URL}/${id}`, payload);
  return response.data;
};
const deleteWorkshop = async (id) => {
  const response = await apiClient.delete(`${WORKSHOP_BASE_URL}/${id}`);
  return response.data;
};
const INTERNSHIP_BASE_URL = "/api/internship-sessions";
const getAllInternshipSessions = async () => {
  const response = await apiClient.get(INTERNSHIP_BASE_URL);
  return response.data?.data || [];
};
const getInternshipSessionById = async (id) => {
  const response = await apiClient.get(`${INTERNSHIP_BASE_URL}/${id}`);
  return response.data?.data || null;
};
const createInternshipSession = async (payload) => {
  const response = await apiClient.post(INTERNSHIP_BASE_URL, payload);
  return response.data;
};
const updateInternshipSession = async (id, payload) => {
  const response = await apiClient.put(`${INTERNSHIP_BASE_URL}/${id}`, payload);
  return response.data;
};
const deleteInternshipSession = async (id) => {
  const response = await apiClient.delete(`${INTERNSHIP_BASE_URL}/${id}`);
  return response.data;
};
const SessionCategoryList = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let responseData = [];
      switch (slug) {
        case "event":
          responseData = await getAllEvents();
          break;
        case "webinar":
          responseData = await getAllWebinars();
          break;
        case "workshop":
          responseData = await getAllWorkshops();
          break;
        case "session-category":
          responseData = await getSessionCategories();
          break;
        case "internship-session":
          responseData = await getAllInternshipSessions();
          break;
        default:
          throw new Error("Unknown type");
      }
      setData(responseData || []);
      const sessionCategories = await getSessionCategories();
      setCategories(sessionCategories || []);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete this ${slug}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      switch (slug) {
        case "event":
          await deleteEvent(id);
          break;
        case "webinar":
          await deleteWebinar(id);
          break;
        case "workshop":
          await deleteWorkshop(id);
          break;
        case "session-category":
          await deleteSessionCategory(id);
          break;
        case "internship-session":
          await deleteInternshipSession(id);
          break;
        default:
          throw new Error("Unknown type");
      }
      toast$1.success(`${slug} deleted successfully!`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast$1.error(`Failed to delete ${slug}.`);
    }
  };
  const handleEdit = (item) => {
    const category = categories.find((cat) => cat.slug === slug);
    if (!category) {
      toast$1.error("Category not found!");
      return;
    }
    navigate(
      `/session-category/${category.slug}/${category._id}/manage?type=edit&id=${item._id}`
    );
  };
  const hiddenFields = [
    "__v",
    "_id",
    "createdAt",
    "description",
    "updatedAt",
    "slug",
    "image",
    "banner",
    "thumbnail"
  ];
  const isDisplayable = (value, key) => {
    if (value === null || value === void 0) return false;
    if (typeof value === "object") return false;
    if (Array.isArray(value)) return false;
    if (typeof value === "string" && value.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return false;
    if (hiddenFields.includes(key)) return false;
    return true;
  };
  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return value ? /* @__PURE__ */ jsxs("span", { className: "flex items-center text-green-600 font-medium", children: [
        /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "mr-1" }),
        " Active"
      ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center text-red-500 font-medium", children: [
        /* @__PURE__ */ jsx(XCircle, { size: 16, className: "mr-1" }),
        " Inactive"
      ] });
    }
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("createdat")) {
      return /* @__PURE__ */ jsxs("span", { className: "flex items-center text-blue-600", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 16, className: "mr-1" }),
        new Date(value).toLocaleDateString(void 0, {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      ] });
    }
    return /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: String(value) });
  };
  const renderDetails = (item) => {
    if (!item) {
      return /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic text-center", children: "No details available." });
    }
    const filteredEntries = Object.entries(item).filter(
      ([key, value]) => isDisplayable(value, key)
    );
    if (filteredEntries.length === 0) {
      return /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic text-center", children: "No readable text fields available." });
    }
    return /* @__PURE__ */ jsx("div", { className: "relative bg-white overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "p-6 space-y-4 max-h-[420px] overflow-y-auto", children: filteredEntries.length > 0 ? /* @__PURE__ */ jsx("dl", { className: "divide-y divide-gray-100", children: filteredEntries.map(([key, value]) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "py-3 grid grid-cols-3 items-start hover:bg-gray-50 rounded-lg px-2 transition-all",
        children: [
          /* @__PURE__ */ jsx("dt", { className: "col-span-1 text-sm font-medium text-gray-500 capitalize", children: key.replace(/([A-Z])/g, " $1") }),
          /* @__PURE__ */ jsx(
            "dd",
            {
              className: `col-span-2 text-sm text-gray-900 ${key.toLowerCase().includes("description") ? "line-clamp-3 hover:line-clamp-none cursor-pointer transition-all" : ""}`,
              title: key.toLowerCase().includes("description") ? String(value) : void 0,
              children: formatValue(key, value)
            }
          )
        ]
      },
      key
    )) }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center italic", children: "No details available." }) }) });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-gradient-to-r from-gray-100 to-gray-50 min-h-screen", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate(-1),
          className: "flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "mr-2" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 capitalize", children: slug.replace("-", " ") })
    ] }),
    loading ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center text-lg animate-pulse", children: "Loading..." }) : error ? /* @__PURE__ */ jsx("p", { className: "text-red-500 text-center text-lg", children: error }) : data.length === 0 ? /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-center text-lg", children: [
      "No ",
      slug,
      " found."
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: data.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 h-[220px]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between p-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2 line-clamp-1", children: item.title || item.name }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-gray-700 text-sm mb-4 line-clamp-3",
                  title: item.description,
                  children: item.description || "No description provided."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex justify-between space-x-3 pt-4 border-t border-gray-100", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  },
                  className: "flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md font-semibold",
                  children: [
                    /* @__PURE__ */ jsx(Calendar, { size: 18 }),
                    " View"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleEdit(item),
                  className: "flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-md font-semibold",
                  children: [
                    /* @__PURE__ */ jsx(CheckCircle, { size: 18 }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleDelete(item._id),
                  className: "flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow-md font-semibold",
                  children: [
                    /* @__PURE__ */ jsx(XCircle, { size: 18 }),
                    " Delete"
                  ]
                }
              )
            ] })
          ] })
        ]
      },
      item._id
    )) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: selectedItem ? selectedItem.title || selectedItem.name : "",
        children: renderDetails(selectedItem)
      }
    )
  ] });
};
const NotFoundPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full flex flex-col items-center justify-center px-4 py-5 bg-gray-50 text-gray-800", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://static.vecteezy.com/system/resources/previews/053/162/047/non_2x/concept-of-404-error-page-not-found-security-service-warning-message-studying-question-mark-inside-text-404-with-magnifying-glass-examining-the-cause-of-web-page-crash-illustration-vector.jpg",
        alt: "Page Not Found Illustration",
        className: "w-94 h-64 mb-8 rounded-xl",
        loading: "lazy"
      }
    ),
    /* @__PURE__ */ jsx("h1", { className: "text-5xl font-extrabold mb-4", children: "404 - Page Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg max-w-md text-center", children: "Oops! The page you are looking for does not exist." })
  ] });
};
function TestInstructions() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchTest() {
      try {
        const res = await apiClient.get(`/api/tests/${testId}`);
        setTest(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    }
    if (testId) fetchTest();
  }, [testId]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Loading instructions..." }) });
  }
  if (!test) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-red-500", children: "Failed to load test data." }) });
  }
  const duration = test.testDuration?.minutes ?? "—";
  const questions = test.totalQuestions ?? "—";
  return /* @__PURE__ */ jsxs("div", { className: "relative max-h-screen flex justify-center py-4 px-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-cover bg-center filter blur-sm",
        style: {
          backgroundImage: "url('https://png.pngtree.com/background/20230520/original/pngtree-students-test-out-exam-materials-picture-image_2670982.jpg')"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-3xl bg-white/90 shadow-2xl rounded-lg p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center mb-6", children: /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: [
        test.title,
        " — Instructions"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-100 border border-blue-300 p-5 rounded-lg mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-blue-900 mb-3", children: "📌 General Guidelines" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2 text-blue-800 text-sm", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            "Total duration: ",
            /* @__PURE__ */ jsxs("b", { children: [
              duration,
              " minutes"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "Total questions: ",
            /* @__PURE__ */ jsx("b", { children: questions })
          ] }),
          /* @__PURE__ */ jsx("li", { children: "Each question carries equal marks" }),
          /* @__PURE__ */ jsx("li", { children: "No negative marking" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-yellow-100 border border-yellow-300 p-5 rounded-lg mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold text-yellow-900 mb-3", children: "⏱ During the Test" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-6 space-y-2 text-yellow-800 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: "Select the correct option for each question" }),
          /* @__PURE__ */ jsx("li", { children: "You may change answers before submission" }),
          /* @__PURE__ */ jsx("li", { className: "font-semibold text-yellow-900", children: "Do not refresh or close the browser" }),
          /* @__PURE__ */ jsx("li", { children: "Timer starts immediately after you begin" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start mb-8", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "agree",
            className: "w-5 h-5 mt-1 mr-3 cursor-pointer accent-green-600",
            checked: agreed,
            onChange: (e) => setAgreed(e.target.checked)
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "agree", className: "text-gray-900 text-sm cursor-pointer", children: "I have read and understood all the instructions" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-between", children: /* @__PURE__ */ jsx(
        "button",
        {
          disabled: !agreed,
          onClick: () => navigate(`/test/${test._id}`),
          className: `px-8 py-2 rounded-lg text-white font-medium transition
        ${agreed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-300 cursor-not-allowed"}`,
          children: "▶️ Start Test"
        }
      ) })
    ] })
  ] });
}
function StudentEmailLogin({ redirectTestId }) {
  const { login: login2 } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      try {
        const res = await login2(values.email, values.password, "student");
        if (res.success) {
          await Swal.fire({
            icon: "success",
            title: "Login Successful!",
            // text: "Redirecting to the test...",
            timer: 1e3,
            showConfirmButton: false
          });
          window.location.href = `/start-test/${redirectTestId}`;
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: err.message || "Please try again.",
          confirmButtonColor: "#3085d6"
        });
      }
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "min-h-screen flex items-center justify-center bg-cover bg-center relative",
      style: {
        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/011/635/825/non_2x/abstract-square-interface-modern-background-concept-fingerprint-digital-scanning-visual-security-system-authentication-login-vector.jpg')"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60" }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: formik.handleSubmit,
            className: "relative z-10 w-full max-w-lg bg-white/20 backdrop-blur-md p-8 rounded-lg shadow-2xl flex flex-col border border-white/30",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-8 text-white text-center", children: "Participate Login" }),
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-6 flex flex-col", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-white font-medium mb-2", children: "Email" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    id: "email",
                    ...formik.getFieldProps("email"),
                    required: true,
                    className: "w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                    placeholder: "Enter your email"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full mb-6 flex flex-col relative", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "text-white font-medium mb-2", children: "Password" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPassword ? "text" : "password",
                    id: "password",
                    ...formik.getFieldProps("password"),
                    required: true,
                    className: "w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition",
                    placeholder: "Enter your password"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword(!showPassword),
                    className: "absolute right-3 top-12 text-white hover:text-white focus:outline-none",
                    children: showPassword ? /* @__PURE__ */ jsx(FiEyeOff, { size: 20 }) : /* @__PURE__ */ jsx(FiEye, { size: 20 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition",
                  children: "Login"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const getStudentAuthFromCookies = () => {
  return {
    studentId: Cookies.get("studentId"),
    token: Cookies.get("token"),
    role: Cookies.get("role"),
    email: Cookies.get("email")
    // ✅
  };
};
function StartTestGate() {
  const { testId } = useParams();
  const { studentId, token, role } = getStudentAuthFromCookies();
  const isAuthenticated = studentId && token && role === "student";
  return isAuthenticated ? /* @__PURE__ */ jsx(TestInstructions, { testId }) : /* @__PURE__ */ jsx(StudentEmailLogin, { redirectTestId: testId });
}
const CourseForm = lazy(
  () => import("./assets/CourseForm-M4jQ-n4a.js")
);
const CourseTable = lazy(
  () => import("./assets/CourseTable-4VsOZKXo.js")
);
const EnrolledCoursesPage = lazy(
  () => import("./assets/EnrolledCoursesPage-N1bm3l1v.js")
);
const EnrollmentDetails = lazy(
  () => import("./assets/EnrollmentDetails-vke2jLFK.js")
);
const UploadEnrollmentExcel = lazy(
  () => import("./assets/UploadEnrollmentExcel-GzseAhcE.js")
);
const RolePermissionManager = lazy(
  () => import("./assets/RolePermissionManager-l9q3maTN.js")
);
const AddTest = lazy(() => import("./assets/AddTest-XPi2Jj_M.js"));
const ManageTest = lazy(() => import("./assets/ManageTest-DHtErfEd.js"));
const ViewTestQuestions = lazy(
  () => import("./assets/ViewTestQuestions-B107MkHB.js")
);
const VideoPlayerPage = lazy(
  () => import("./assets/VideoPlayerPage-urY2q7jJ.js")
);
const ManageSessionCategory = lazy(
  () => import("./assets/ManageSessionCategory-Ce9t2VT8.js")
);
const SessionCategoryForm = lazy(
  () => import("./assets/SessionCategoryForm-BM7qqmqv.js")
);
const AddMeetingForm = lazy(
  () => import("./assets/AddMeetingForm-KjjJo12-.js")
);
const ManageMeeting = lazy(
  () => import("./assets/ManageMeeting-BI7vKVUx.js")
);
const Attendance = lazy(
  () => import("./assets/Attendance-DHWE9fem.js")
);
const EnrollStudentForm = lazy(
  () => import("./assets/EnrollStudentForm-DRzpjs5M.js")
);
const EnrolledStudentList = lazy(
  () => import("./assets/EnrolledStudentList-CT815lCf.js")
);
const BranchListPage = lazy(() => import("./assets/BranchListPage-DuTXipUF.js"));
const CourseListPage = lazy(() => import("./assets/CourseListPage-CKi0K2gC.js"));
const HomePage = lazy(() => import("./assets/HomePage-DjyUqkhx.js"));
const LoginPage = lazy(() => import("./assets/LoginPage-C4ueBGpg.js"));
const ResultDetailPage = lazy(() => import("./assets/ResultDetailPage-HJsP8s1F.js"));
const VerifyEmailPage = lazy(() => import("./assets/VerifyEmailPage-CgWnHFsg.js"));
const AdminAllResultsPage = lazy(
  () => import("./assets/AdminAllResultsPage-BFvATcSg.js")
);
lazy(
  () => import("./assets/AdminBranchManagementPage-D7NZVUnE.js")
);
const AdminDashboardPage = lazy(
  () => import("./assets/AdminDashboardPage-CudkhFFJ.js")
);
const AdminEnrollmentManagementPage = lazy(
  () => import("./assets/AdminEnrollmentManagementPage-DN_iu8-l.js")
);
const AdminUserManagementPage = lazy(
  () => import("./assets/AdminUserManagementPage-BXoKFk4O.js")
);
const CourseContentManagementPage = lazy(
  () => import("./assets/CourseContentManagementPage-BA_tJ9ci.js")
);
const CreateTestPage = lazy(() => import("./assets/CreateTestPage-ccF0qaZZ.js"));
const EventTablePage = lazy(() => import("./assets/EventTablePage-D9jJTsui.js"));
const ProfilePage = lazy(() => import("./assets/ProfilePage-CuOiBNdY.js"));
const RegisterPage = lazy(() => import("./assets/RegisterPage-BFaMNljO.js"));
const TestManagementPage = lazy(
  () => import("./assets/TestManagementPage-CkuKW64A.js")
);
const TrainerTable = lazy(
  () => import("./assets/TrainerTable-B7Cd0Ua_.js")
);
const AvailableTests = lazy(() => import("./assets/AvailableTests-BBxp-qFV.js"));
const CourseDetailPage = lazy(
  () => import("./assets/CourseDetailPage-DVwQFA_T.js")
);
const MyCoursesPage = lazy(() => import("./assets/MyCoursesPage-V3kRyGks.js"));
const MyResultsPage = lazy(() => import("./assets/MyResultsPage-8xJqc_GM.js"));
const StudentDashboardPage = lazy(
  () => import("./assets/StudentDashboardPage-DkY4MbHH.js")
);
const StudentProfilePage = lazy(
  () => import("./assets/StudentProfilePage-BYQuoLjS.js")
);
const StudentRegistrationForm = lazy(
  () => import("./assets/StudentRegistrationForm-D5xpjnzw.js")
);
const StudyCoursePage = lazy(
  () => import("./assets/StudyCoursePage-dgQhwEqx.js")
);
const TestAttemptPage = lazy(
  () => import("./assets/TestAttemptPage-DtkBtPQ-.js")
);
const TrainerCourseDetailsPage = lazy(
  () => import("./assets/TrainerCoursesDetailsPage-Dva9rFiX.js")
);
const TrainerCoursesPage = lazy(
  () => import("./assets/TrainerCoursesPage-C98sTI_e.js")
);
const TrainerDashboardPage = lazy(
  () => import("./assets/TrainerDashboardPage-Cz9-qvNM.js")
);
const TrainerProfile = lazy(() => import("./assets/TrainerProfile-BV-GaHWR.js"));
const TrainerRegistrationForm = lazy(
  () => import("./assets/TrainerRegistrationForm-DhSQWgoN.js")
);
const AddBatch = lazy(() => import("./assets/AddBatch-CmFhGFYn.js"));
const ManageBatch = lazy(
  () => import("./assets/ManageBatch-BaMmjUw2.js")
);
const AddAssignment = lazy(
  () => import("./assets/AddAssignment-DipaEi3Q.js")
);
const ManageAssignments = lazy(
  () => import("./assets/ManageAssignments-BBv6jNh6.js")
);
const AddLectures = lazy(
  () => import("./assets/AddLectures-BIA3JxYA.js")
);
const ManageLectures = lazy(
  () => import("./assets/ManageLectures-DsiH5gPB.js")
);
const AddNotes = lazy(
  () => import("./assets/AddNotes-OLJ1gyGT.js")
);
const ManageNotes = lazy(
  () => import("./assets/ManageNotes-BPVk51AM.js")
);
const AddCurriculum = lazy(
  () => import("./assets/AddCurriculum-i2hOOCs9.js")
);
const ManageCurriculum = lazy(
  () => import("./assets/ManageCurriculum-a7FYHs6Y.js")
);
function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isTestFullscreen = location.pathname.startsWith("/test/");
  if (loading) {
    return /* @__PURE__ */ jsx("div", { children: "Loading ..." });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen", children: [
      /* @__PURE__ */ jsx(ScrollToTop, {}),
      !isTestFullscreen && /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 right-0 z-50", children: /* @__PURE__ */ jsx(Navbar, {}) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          id: "main-scroll-container",
          className: `flex-1 overflow-auto bg-blue-50 ${isTestFullscreen ? "" : "pt-[64px]"}`,
          children: [
            " ",
            /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading Page..." }), children: /* @__PURE__ */ jsxs(Routes, { children: [
              /* @__PURE__ */ jsx(Route, { path: "/home", element: /* @__PURE__ */ jsx(HomePage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "/register", element: /* @__PURE__ */ jsx(RegisterPage, {}) }),
              /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(PublicRoute, {}), children: [
                /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
                /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
                /* @__PURE__ */ jsx(Route, { path: "/student-login", element: /* @__PURE__ */ jsx(StudentLoginForm, {}) })
              ] }),
              /* @__PURE__ */ jsx(Route, { path: "/branches", element: /* @__PURE__ */ jsx(BranchListPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "/courses", element: /* @__PURE__ */ jsx(CourseListPage, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "/courses/:courseId", element: /* @__PURE__ */ jsx(CourseDetailPage, {}) }),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "/verify-email/:token",
                  element: /* @__PURE__ */ jsx(VerifyEmailPage, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "/student-register",
                  element: /* @__PURE__ */ jsx(StudentRegistrationForm, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "/trainer-register",
                  element: /* @__PURE__ */ jsx(TrainerRegistrationForm, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  element: /* @__PURE__ */ jsx(
                    PrivateRoute,
                    {
                      requiredModule: "trainer",
                      requiredAction: "update"
                    }
                  ),
                  children: /* @__PURE__ */ jsx(
                    Route,
                    {
                      path: "/trainers/update/:id",
                      element: /* @__PURE__ */ jsx(TrainerRegistrationForm, {})
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(PrivateRoute, {}), children: /* @__PURE__ */ jsx(
                Route,
                {
                  path: "/results/:resultId",
                  element: /* @__PURE__ */ jsx(ResultDetailPage, {})
                }
              ) }),
              /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(PrivateRoute, {}), children: [
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/student/dashboard",
                    element: /* @__PURE__ */ jsx(StudentDashboardPage, {})
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "/my-courses", element: /* @__PURE__ */ jsx(MyCoursesPage, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/batch/:batchId/assignments",
                    element: /* @__PURE__ */ jsx(AssignmentsPage, {})
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "/test/:testID", element: /* @__PURE__ */ jsx(TestDetail, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/courses/:courseId/study/feedback/:feedbackId",
                    element: /* @__PURE__ */ jsx(FeedbackTab, {})
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "/start-test/:testId", element: /* @__PURE__ */ jsx(StartTestGate, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/courses/:courseId/study",
                    element: /* @__PURE__ */ jsx(StudyCoursePage, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/course/:courseId/tests",
                    element: /* @__PURE__ */ jsx(AvailableTests, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/test/:testId/attempt",
                    element: /* @__PURE__ */ jsx(TestAttemptPage, {})
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "/my-results", element: /* @__PURE__ */ jsx(MyResultsPage, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/student-profile/:id",
                    element: /* @__PURE__ */ jsx(StudentProfilePage, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/batch/:batchId/video/:videoId",
                    element: /* @__PURE__ */ jsx(VideoPlayerPage, {})
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(PrivateRoute, {}), children: /* @__PURE__ */ jsxs(Route, { path: "/", element: /* @__PURE__ */ jsx(AdminLayout, {}), children: [
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "dashboard",
                    element: /* @__PURE__ */ jsx(PrivateRoute, { adminOnly: true }),
                    children: /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(AdminDashboardPage, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "users",
                    element: /* @__PURE__ */ jsx(PrivateRoute, { adminOnly: true }),
                    children: /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(AdminUserManagementPage, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "role-permission",
                    element: /* @__PURE__ */ jsx(PrivateRoute, { adminOnly: true }),
                    children: /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(RolePermissionManager, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "course",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "manage-courses", element: /* @__PURE__ */ jsx(CourseTable, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "course",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-courses", element: /* @__PURE__ */ jsx(CourseForm, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "course",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "courses/edit/:id", element: /* @__PURE__ */ jsx(CourseForm, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "test",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "/view-tests/batch/:batchId",
                        element: /* @__PURE__ */ jsx(BatchTests, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "feedback",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "create-feedback",
                        element: /* @__PURE__ */ jsx(Create, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "feedback",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "edit-feedback/:feedbackId",
                        element: /* @__PURE__ */ jsx(Create, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "feedback",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "/manage-feedback",
                        element: /* @__PURE__ */ jsx(ManageFeedback, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "course/:courseId/content",
                    element: /* @__PURE__ */ jsx(CourseContentManagementPage, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "enrollments",
                    element: /* @__PURE__ */ jsx(AdminEnrollmentManagementPage, {})
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "tests", element: /* @__PURE__ */ jsx(TestManagementPage, {}) }),
                /* @__PURE__ */ jsx(Route, { path: "tests/create", element: /* @__PURE__ */ jsx(CreateTestPage, {}) }),
                /* @__PURE__ */ jsx(Route, { path: "results", element: /* @__PURE__ */ jsx(AdminAllResultsPage, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "session",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "book-session",
                        element: /* @__PURE__ */ jsx(SessionCategoryForm, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "session",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "/session-category/:slug/:id/list",
                        element: /* @__PURE__ */ jsx(SessionCategoryList, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "trainer-management",
                    element: /* @__PURE__ */ jsx(PrivateRoute, { adminOnly: true }),
                    children: /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(TrainerTable, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "prerequisite",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "add-prerequisite",
                        element: /* @__PURE__ */ jsx(AddPrerequisite, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "prerequisite",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "edit-prerequisite/:id",
                        element: /* @__PURE__ */ jsx(AddPrerequisite, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "prerequisite",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "manage-prerequisite",
                        element: /* @__PURE__ */ jsx(ManagePrerequisites, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "session",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "session-category/:slug/:id/manage",
                        element: /* @__PURE__ */ jsx(ManageSessionCategory, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "session",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "session-category/:id/manage/event",
                        element: /* @__PURE__ */ jsx(EventTablePage, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "lecture",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-course-videos", element: /* @__PURE__ */ jsx(AddLectures, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "lecture",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "edit-lecture/:lectureId",
                        element: /* @__PURE__ */ jsx(AddLectures, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "lecture",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "manage-course-videos",
                        element: /* @__PURE__ */ jsx(ManageLectures, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "curriculum",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-curriculum", element: /* @__PURE__ */ jsx(AddCurriculum, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(ProfilePage, {}) }),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "curriculum",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "manage-curriculum",
                        element: /* @__PURE__ */ jsx(ManageCurriculum, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/tests/:testId/students",
                    element: /* @__PURE__ */ jsx(StudentsListForTest, {})
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "batch",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "manage-batches", element: /* @__PURE__ */ jsx(ManageBatch, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "batch",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-batch", element: /* @__PURE__ */ jsx(AddBatch, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "batch",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-batch/:id", element: /* @__PURE__ */ jsx(AddBatch, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "assignment",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-assignment", element: /* @__PURE__ */ jsx(AddAssignment, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "assignment",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "edit-assignment/:assignmentId",
                        element: /* @__PURE__ */ jsx(AddAssignment, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "assignment",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "manage-assignments",
                        element: /* @__PURE__ */ jsx(ManageAssignments, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "assignment",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "/evaluate-assignment",
                        element: /* @__PURE__ */ jsx(EvaluateAssignment, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "meeting",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-meeting", element: /* @__PURE__ */ jsx(AddMeetingForm, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "meeting",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "manage-meeting", element: /* @__PURE__ */ jsx(ManageMeeting, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "attendance",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "attendance/:meetingId",
                        element: /* @__PURE__ */ jsx(Attendance, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "note",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-notes", element: /* @__PURE__ */ jsx(AddNotes, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "note",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "edit-note/:noteId", element: /* @__PURE__ */ jsx(AddNotes, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "note",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "manage-notes", element: /* @__PURE__ */ jsx(ManageNotes, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "test",
                        requiredAction: "create"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "add-test", element: /* @__PURE__ */ jsx(AddTest, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "test",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(Route, { path: "manage-test", element: /* @__PURE__ */ jsx(ManageTest, {}) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "test",
                        requiredAction: "read"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "view-excel/:testId",
                        element: /* @__PURE__ */ jsx(ViewTestQuestions, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "enrollment",
                        requiredAction: "create"
                      }
                    ),
                    children: [
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "enroll-student",
                          element: /* @__PURE__ */ jsx(EnrollStudentForm, {})
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "enroll-student/:enrollmentId",
                          element: /* @__PURE__ */ jsx(EnrollStudentForm, {})
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "/enrollments/upload-excel",
                          element: /* @__PURE__ */ jsx(UploadEnrollmentExcel, {})
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "enrollment",
                        requiredAction: "update"
                      }
                    ),
                    children: /* @__PURE__ */ jsx(
                      Route,
                      {
                        path: "enroll-student/:enrollmentId",
                        element: /* @__PURE__ */ jsx(EnrollStudentForm, {})
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  Route,
                  {
                    path: "/trainer/dashboard",
                    element: /* @__PURE__ */ jsx(TrainerDashboardPage, {})
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Route,
                  {
                    element: /* @__PURE__ */ jsx(
                      PrivateRoute,
                      {
                        requiredModule: "enrollment",
                        requiredAction: "read"
                      }
                    ),
                    children: [
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "enrolled-student-list",
                          element: /* @__PURE__ */ jsx(EnrolledStudentList, {})
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "enrollments/:enrollmentId/courses",
                          element: /* @__PURE__ */ jsx(EnrolledCoursesPage, {})
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Route,
                        {
                          path: "enrollments/:id",
                          element: /* @__PURE__ */ jsx(EnrollmentDetails, {})
                        }
                      )
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(Route, { path: "/trainer-courses", element: /* @__PURE__ */ jsx(TrainerCoursesPage, {}) }),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "/trainer-courses/:courseId",
                  element: /* @__PURE__ */ jsx(TrainerCourseDetailsPage, {})
                }
              ),
              /* @__PURE__ */ jsx(Route, { path: "/trainer-profile", element: /* @__PURE__ */ jsx(TrainerProfile, {}) }),
              /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(PrivateRoute, { roles: ["trainer"] }) }),
              /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ToastContainer,
      {
        position: "top-right",
        autoClose: 3e3,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true
      }
    )
  ] });
}
const initialState$1 = {
  token: Cookies.get("accessToken") || null,
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState$1,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      Cookies.set("accessToken", token);
      Cookies.set("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("accessToken");
      Cookies.remove("user");
    }
  }
});
const { setCredentials, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
const roleSlice = createSlice({
  name: "role",
  initialState: {
    selectedRole: ""
  },
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    clearRole: (state) => {
      state.selectedRole = "";
    }
  }
});
const { setRole, clearRole } = roleSlice.actions;
const roleReducer = roleSlice.reducer;
const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    const data = await getAllCourses();
    return data;
  }
);
const coursesSlice = createSlice({
  name: "courses",
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    }).addCase(fetchCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});
const coursesReducer = coursesSlice.reducer;
const fetchBranches$1 = async () => {
  try {
    const url = "/api/branches";
    const response = await apiClient.get(url);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching branches:", error.response?.data || error.message);
    throw error;
  }
};
const createBranch = async (branchData) => {
  const response = await apiClient.post("/api/branches", branchData);
  return response.data;
};
const updateBranch = async (id, branchData) => {
  const response = await apiClient.put(`/api/branches/${id}`, branchData);
  return response.data;
};
const deleteBranch = async (id) => {
  const response = await apiClient.delete(`/api/branches/${id}`);
  return response.data;
};
const getAllBranches = async () => {
  const response = await apiClient.get("/api/branches");
  return response.data.data;
};
const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async () => {
    const data = await getAllBranches();
    return data;
  }
);
const branchesSlice = createSlice({
  name: "branches",
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder.addCase(fetchBranches.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchBranches.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    }).addCase(fetchBranches.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});
const branchesReducer = branchesSlice.reducer;
const initialState = {
  batchId: null,
  batchName: "",
  chapterTitle: "",
  allLectures: [],
  selectedVideo: null
};
const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setBatchInfo: (state, action) => {
      const { batchId, batchName } = action.payload;
      state.batchId = batchId;
      state.batchName = batchName;
    },
    setAllLectures: (state, action) => {
      state.allLectures = action.payload;
    },
    setSelectedVideo: (state, action) => {
      const video = action.payload;
      state.selectedVideo = video;
      state.chapterTitle = video.chapterTitle;
    },
    clearVideoState: () => initialState
  }
});
const {
  setBatchInfo,
  setAllLectures,
  setSelectedVideo,
  clearVideoState
} = videoSlice.actions;
const videoReducer = videoSlice.reducer;
const getInitialCourseId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedCourseId") || "";
  }
  return "";
};
const curriculumSlice = createSlice({
  name: "curriculum",
  initialState: {
    selectedCourseId: getInitialCourseId()
    // Use the safe function
  },
  reducers: {
    setSelectedCourseId: (state, action) => {
      state.selectedCourseId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCourseId", action.payload);
      }
    },
    clearSelectedCourseId: (state) => {
      state.selectedCourseId = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("selectedCourseId");
      }
    }
  }
});
const { setSelectedCourseId, clearSelectedCourseId } = curriculumSlice.actions;
const curriculumReducer = curriculumSlice.reducer;
const fetchAllCourses = createAsyncThunk(
  "allCourses/fetchAllCourses",
  async () => {
    const res = await apiClient.get("/api/courses/all-course");
    return res.data.data;
  }
);
const allCoursesSlice = createSlice({
  name: "allCourses",
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCourses.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchAllCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    }).addCase(fetchAllCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  }
});
const allCoursesReducer = allCoursesSlice.reducer;
const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    courses: coursesReducer,
    branches: branchesReducer,
    videos: videoReducer,
    curriculum: curriculumReducer,
    permissions: permissionsReducer,
    assignments: assignmentReducer,
    // <-- add it here
    allCourses: allCoursesReducer
    // ✅ new, no overwrite
  }
});
function render(_url, options) {
  return renderToPipeableStream(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(StaticRouter, { location: _url, children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(App, {}) }) }) }),
      /* @__PURE__ */ jsx("vite-streaming-end", {})
    ] }),
    options
  );
}
export {
  TestDetail as $,
  getSessionCategories as A,
  updateSessionCategory as B,
  COURSE_NAME as C,
  Dropdown as D,
  createSessionCategory as E,
  fetchActiveBatchById as F,
  fetchBranches$1 as G,
  fetchCourses$1 as H,
  InputField as I,
  setRole as J,
  AuthContext as K,
  verifyEmail as L,
  Modal as M,
  updateBranch as N,
  createBranch as O,
  deleteBranch as P,
  BASE_URL as Q,
  addVideoToCourse as R,
  ScrollableTable as S,
  TextAreaField as T,
  addNoteToCourse as U,
  STUDENT_PORTAL_URL as V,
  fetchCourses as W,
  fetchBranches as X,
  setBatchInfo$1 as Y,
  setAssignments as Z,
  ResultModal as _,
  DynamicInputFields as a,
  setBatchInfo as a0,
  setAllLectures as a1,
  fetchAllCourses as a2,
  updateBatch as a3,
  createBatch as a4,
  fetchBatchById as a5,
  fetchAllBatches as a6,
  deleteBatch as a7,
  clearSelectedCourseId as a8,
  setSelectedCourseId as a9,
  updateCourse as b,
  createCourse as c,
  DIR as d,
  canPerformAction as e,
  fetchCourseById as f,
  getAllCourses as g,
  cloneCourse as h,
  deleteCourse as i,
  apiClient as j,
  handleApiError as k,
  fetchBatchesByCourseId as l,
  updateEvent as m,
  createEvent as n,
  getEventById as o,
  updateInternshipSession as p,
  createInternshipSession as q,
  getInternshipSessionById as r,
  render,
  setSelectedVideo as s,
  updateWebinar as t,
  useAuth as u,
  createWebinar as v,
  getWebinarById as w,
  updateWorkshop as x,
  createWorkshop as y,
  fetchWorkshopById as z
};
