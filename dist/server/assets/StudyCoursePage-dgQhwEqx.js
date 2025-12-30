import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { FaCompress, FaExpand, FaTasks, FaExternalLinkAlt, FaUser, FaLock, FaBook, FaClock, FaChevronDown, FaCheckCircle, FaComments, FaFileAlt, FaEye, FaLightbulb, FaUsers, FaRocket, FaGraduationCap, FaCode, FaTrophy, FaStar, FaPlay, FaPlayCircle, FaVideo, FaArrowLeft, FaListAlt } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { Y as setBatchInfo, Z as setAssignments, C as COURSE_NAME, d as DIR, _ as ResultModal, $ as TestDetail, a0 as setBatchInfo$1, a1 as setAllLectures, s as setSelectedVideo, f as fetchCourseById, F as fetchActiveBatchById } from "../entry-server.js";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "formik";
import "yup";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const ViewQPPopup = ({ test = {}, onClose }) => {
  const attempted = test.attempted === 1;
  const questions = attempted ? test.iqtest?.questions || [] : test.questions || [];
  const popupRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const toggleFullscreen = () => {
    const elem = popupRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex justify-center items-center", children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: popupRef,
      className: `bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto transition-all`,
      style: isFullscreen ? { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", borderRadius: 0 } : {},
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800", children: [
            "Question Paper – ",
            test.title || "Test"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleFullscreen,
                className: "text-xl text-gray-700 hover:text-gray-900",
                title: isFullscreen ? "Exit Fullscreen" : "Maximize",
                children: isFullscreen ? /* @__PURE__ */ jsx(FaCompress, {}) : /* @__PURE__ */ jsx(FaExpand, {})
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-xl font-bold", children: "✕" })
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
                  className: `p-2 rounded-lg border mb-1
                        ${attempted && isCorrect ? "bg-green-50 border-green-500" : ""}
                        ${attempted && isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
                      `,
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold mr-2", children: [
                      opt,
                      "."
                    ] }),
                    value,
                    attempted && isCorrect && /* @__PURE__ */ jsx("span", { className: "ml-2 text-green-600 font-semibold", children: "✔ Correct" }),
                    attempted && isSelected && !isCorrect && /* @__PURE__ */ jsx("span", { className: "ml-2 text-red-600 font-semibold", children: "✖ Your Answer" })
                  ]
                },
                opt
              );
            })
          ] }, q._id);
        }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-500", children: "No questions available" })
      ]
    }
  ) });
};
const AssignmentsTab = ({ batch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const studentId = Cookies.get("studentId");
  const { assignments } = useSelector((state) => state.assignments);
  useEffect(() => {
    if (!batch?._id) return;
    dispatch(setBatchInfo({ batchId: batch._id, batchName: batch.batchName }));
    dispatch(setAssignments(batch.assignments || []));
  }, [batch, dispatch]);
  if (!batch) return /* @__PURE__ */ jsx("div", { children: "Loading batch..." });
  const getSubmissionForAssignment = (a) => a.submissions?.find((s) => s.student === studentId) || null;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border p-8 mb-6 max-h-fit", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 mb-6 bg-white p-6 rounded-2xl shadow-lg border", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaTasks, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-gray-900", children: "Batch Assignments" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1", children: [
          "Track and manage all assignments for",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: batch?.batchName })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-500 font-medium", children: "Total Assignments:" }),
          /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold text-orange-600", children: assignments?.length })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mt-6", children: [
      /* @__PURE__ */ jsx(
        StatCard,
        {
          count: assignments.filter((a) => {
            const s = getSubmissionForAssignment(a);
            return s && s.status === "check";
          }).length,
          label: "Submitted",
          color: "blue",
          onClick: () => navigate(`/batch/${batch._id}/assignments?filter=submitted`)
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          count: assignments.filter((a) => !getSubmissionForAssignment(a))?.length,
          label: "Unsubmitted",
          color: "red",
          onClick: () => navigate(`/batch/${batch._id}/assignments?filter=unsubmitted`)
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          count: assignments.filter((a) => {
            const submission = getSubmissionForAssignment(a);
            return submission && submission.score != null && submission.status === "submitted";
          }).length,
          label: "Graded",
          color: "green",
          onClick: () => navigate(`/batch/${batch._id}/assignments?filter=graded`)
        }
      ),
      /* @__PURE__ */ jsx(
        StatCard,
        {
          count: assignments.filter((a) => {
            const submission = a.submissions?.find(
              (s) => s.student === studentId
            );
            return submission && submission.status === "unsubmitted" && submission.mistakePhotos?.length > 0;
          }).length,
          label: "ReSubmit",
          color: "red",
          onClick: () => navigate(`/batch/${batch._id}/assignments?filter=resubmit`)
        }
      )
    ] })
  ] }) });
};
const StatCard = ({ count, label, color, onClick }) => /* @__PURE__ */ jsxs(
  "div",
  {
    onClick,
    className: `cursor-pointer bg-${color}-50 rounded-xl p-4 border hover:scale-105 transition-transform`,
    children: [
      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-${color}-600`, children: count || 0 }),
      /* @__PURE__ */ jsx("div", { className: `text-sm text-${color}-700`, children: label })
    ]
  }
);
const CloudLabTab = ({ cloudLabs }) => {
  if (!cloudLabs) return null;
  const { link, students = [] } = cloudLabs;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Cloud Lab Access" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Use the credentials below to access your assigned cloud lab" })
      ] }),
      link && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => window.open(link, "_blank", "noopener,noreferrer"),
          className: "inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all",
          children: [
            "Open Cloud Lab",
            /* @__PURE__ */ jsx(FaExternalLinkAlt, { className: "text-sm" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" }),
    students.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: students.map((student, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group relative rounded-2xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all",
        children: [
          /* @__PURE__ */ jsx("span", { className: "absolute -top-3 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full", children: "Credentials" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-50 text-blue-600 rounded-lg", children: /* @__PURE__ */ jsx(FaUser, {}) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Username" }),
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 break-all", children: student.username })
              ] })
            ] }),
            student.password && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-50 text-purple-600 rounded-lg", children: /* @__PURE__ */ jsx(FaLock, {}) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Password" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-gray-800 tracking-wide", children: student.password })
              ] })
            ] })
          ] })
        ]
      },
      index
    )) }) : (
      /* Empty State */
      /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-gray-50 rounded-2xl border", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 font-medium", children: "No cloud lab credentials assigned yet." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Please check back later or contact your trainer." })
      ] })
    )
  ] });
};
const CurriculumTab = ({ course, expandedWeeks, toggleWeek }) => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const isValidText = (value) => value?.trim()?.length > 0;
  const getValidPoints = (points = []) => points.filter((p) => isValidText(p.title) || isValidText(p.description));
  const getValidChapters = (chapters = []) => chapters.filter(
    (c) => isValidText(c.title) || getValidPoints(c.points).length > 0 || c.lectures?.length > 0 || c.assignments?.length > 0
  );
  const getValidWeeks = (weeks = []) => weeks.filter(
    (w) => isValidText(w.title) || getValidChapters(w.chapters).length > 0
  );
  const getValidPhases = (phases = []) => phases.filter(
    (p) => isValidText(p.title) || getValidWeeks(p.weeks).length > 0
  );
  const togglePhase = (phaseIndex) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex]
    }));
  };
  const getChapterStats = (chapter) => {
    const lectures = chapter.lectures?.length || 0;
    const assignments = chapter.assignments?.length || 0;
    const totalItems = lectures + assignments;
    return { lectures, assignments, totalItems };
  };
  const getWeekStats = (week) => {
    let totalLectures = 0;
    let totalAssignments = 0;
    let totalDuration = 0;
    week.chapters?.forEach((chapter) => {
      totalLectures += chapter.lectures?.length || 0;
      totalAssignments += chapter.assignments?.length || 0;
      totalDuration += (chapter.lectures?.length || 0) * 30;
    });
    return {
      lectures: totalLectures,
      assignments: totalAssignments,
      duration: Math.round(totalDuration / 60)
      // Convert to hours
    };
  };
  const getPhaseStats = (phase) => {
    let totalWeeks = phase.weeks.length;
    let totalChapters = 0;
    let totalLectures = 0;
    let totalAssignments = 0;
    phase.weeks.forEach((week) => {
      totalChapters += week.chapters.length;
      week.chapters.forEach((chapter) => {
        totalLectures += chapter.lectures?.length || 0;
        totalAssignments += chapter.assignments?.length || 0;
      });
    });
    return { totalWeeks, totalChapters, totalLectures, totalAssignments };
  };
  const handleDownloadTrainingPlan = () => {
    if (!course?.trainingPlan) return;
    const fileUrl = `${DIR.TRAINING_PLAN}${course.trainingPlan.fileName}`;
    window.open(fileUrl, "_blank");
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-8 border-b bg-gradient-to-r from-blue-50 to-purple-50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white shadow-lg", children: /* @__PURE__ */ jsx(FaBook, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-gray-900", children: [
              COURSE_NAME,
              " Curriculum"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1 text-lg", children: [
              "Master ",
              course.title,
              " through ",
              course.phases?.length || 0,
              " structured schedule"
            ] })
          ] })
        ] }),
        course?.trainingPlan?.fileName && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDownloadTrainingPlan,
            className: "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform",
            children: "⬇️ Download Training Plan"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white rounded-xl shadow-sm border", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-600", children: course.phases?.length || 0 }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Schedules" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white rounded-xl shadow-sm border", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: course.phases?.reduce(
            (total, phase) => total + phase.weeks.length,
            0
          ) || 0 }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Modules" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-4 bg-white rounded-xl shadow-sm border", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: course.phases?.reduce(
            (total, phase) => total + phase.weeks.reduce(
              (weekTotal, week) => weekTotal + week.chapters.length,
              0
            ),
            0
          ) || 0 }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Course Contents" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6 space-y-6", children: getValidPhases(course.phases).map((phase, phaseIndex) => {
      const isPhaseExpanded = expandedPhases[phaseIndex];
      const phaseStats = getPhaseStats(phase);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-300 bg-white",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => togglePhase(phaseIndex),
                className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-all duration-300 group",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300", children: phaseIndex + 1 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                      isValidText(phase.title) && /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors", children: phase.title }),
                      isValidText(phase.description) && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1", children: phase.description }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-2 text-sm text-gray-500", children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full", children: [
                          /* @__PURE__ */ jsx(FaClock, { className: "w-3 h-3" }),
                          phaseStats.totalWeeks,
                          " modules"
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full", children: [
                          /* @__PURE__ */ jsx(FaBook, { className: "w-3 h-3" }),
                          phaseStats.totalChapters,
                          " course contents"
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `transform transition-transform duration-300 ${isPhaseExpanded ? "rotate-180" : ""} text-gray-400 group-hover:text-purple-500`,
                      children: /* @__PURE__ */ jsx(FaChevronDown, { className: "w-5 h-5" })
                    }
                  )
                ]
              }
            ),
            isPhaseExpanded && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/30", children: /* @__PURE__ */ jsx("div", { className: "p-6 space-y-4", children: getValidWeeks(phase.weeks).map((week, weekIndex) => {
              const key = `${phaseIndex}-${weekIndex}`;
              const isWeekExpanded = expandedWeeks[key];
              getWeekStats(week);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => toggleWeek(phaseIndex, weekIndex),
                        className: "w-full flex items-center justify-between p-5 text-left hover:bg-blue-50/50 transition-colors group/week",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover/week:scale-110 transition-transform", children: week.weekNumber }),
                            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                              isValidText(week.title) && /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-900 group-hover/week:text-blue-700", children: week.title }),
                              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mt-1 text-sm text-gray-500", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                                /* @__PURE__ */ jsx(FaBook, { className: "w-3 h-3" }),
                                week.chapters.length,
                                " course contents"
                              ] }) })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `transform transition-transform duration-300 ${isWeekExpanded ? "rotate-180" : ""} text-gray-400 group-hover/week:text-blue-500`,
                              children: /* @__PURE__ */ jsx(FaChevronDown, { className: "w-4 h-4" })
                            }
                          )
                        ]
                      }
                    ),
                    isWeekExpanded && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 bg-gray-50/50", children: /* @__PURE__ */ jsx("div", { className: "p-5 space-y-4", children: getValidChapters(week.chapters).map(
                      (chapter, chapterIndex) => {
                        getChapterStats(chapter);
                        return /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group/chapter",
                            children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold", children: chapterIndex + 1 }),
                                isValidText(chapter.title) && /* @__PURE__ */ jsx("h5", { className: "text-lg font-semibold text-gray-900 group-hover/chapter:text-green-700", children: chapter.title })
                              ] }),
                              getValidPoints(chapter.points).length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: getValidPoints(
                                chapter.points
                              ).map((point, pointIndex) => /* @__PURE__ */ jsxs(
                                "li",
                                {
                                  className: "flex items-start gap-3 text-sm group/point animate-fade-in-up",
                                  style: {
                                    animationDelay: `${pointIndex * 100}ms`
                                  },
                                  children: [
                                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 group-hover/point:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-3 h-3 text-green-500" }) }),
                                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                                      isValidText(
                                        point.title
                                      ) && /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: point.title }),
                                      isValidText(
                                        point.description
                                      ) && /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs mt-1 bg-gray-50 p-2 rounded-lg", children: point.description })
                                    ] })
                                  ]
                                },
                                point._id
                              )) })
                            ] }) })
                          },
                          chapter._id
                        );
                      }
                    ) }) })
                  ]
                },
                week._id
              );
            }) }) })
          ]
        },
        phase._id
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "border-t bg-gradient-to-r from-green-50 to-blue-50 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: "Your Learning Journey" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Complete schedules to unlock your certificate" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: "0%" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Overall Progress" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-3", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000",
          style: { width: "0%" }
        }
      ) })
    ] })
  ] });
};
const FeedbackList = ({ batch }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-lg border p-6 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl", children: /* @__PURE__ */ jsx(FaComments, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Batch Feedback" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
          "Feedbacks for ",
          /* @__PURE__ */ jsx("strong", { children: batch?.batchName })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: batch?.feedbacks?.length > 0 ? batch.feedbacks.map((feedback) => {
      const isDisabled = feedback.status === 1;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => {
            if (!isDisabled) {
              navigate(
                `/courses/${courseId}/study/feedback/${feedback._id}`,
                { state: { batch, feedback } }
              );
            }
          },
          className: `p-6 rounded-2xl border shadow-lg transition-all
                  ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white cursor-pointer hover:shadow-2xl"}
                `,
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: feedback.title || "Feedback Form" }),
            /* @__PURE__ */ jsxs("p", { className: "mb-4", children: [
              feedback.questions?.length || 0,
              " Questions"
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex items-center gap-2 font-semibold ${isDisabled ? "text-gray-400" : "text-blue-600"}`,
                children: [
                  /* @__PURE__ */ jsx(FaComments, {}),
                  isDisabled ? "Feedback Submitted" : "Give Feedback"
                ]
              }
            )
          ]
        },
        feedback._id
      );
    }) : /* @__PURE__ */ jsxs("div", { className: "col-span-full text-center py-16", children: [
      /* @__PURE__ */ jsx(FaComments, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "No Feedback Available" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Instructor will update feedback forms soon." })
    ] }) })
  ] });
};
const MeetingsDropdown = ({ batch, onClose }) => {
  if (!batch) return null;
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          onClick: onClose,
          className: "fixed inset-0 bg-black/40 backdrop-blur-md z-40"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-6xl mt-7 bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 p-5 relative", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "Meetings & Attendance" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-5 max-h-[70vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-gray-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center", children: "🎯" }),
              "Scheduled Meetings"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full", children: [
              batch.meetings?.length || 0,
              " Total"
            ] })
          ] }),
          batch.meetings?.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-y-auto max-h-[55vh] pr-2", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: batch.meetings.map((meeting) => {
            const attendance = batch.attendance?.filter(
              (att) => att.meeting === meeting._id
            );
            const isMarked = attendance?.length > 0;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `relative rounded-xl border p-4 shadow-sm
                          ${isMarked ? "bg-gray-100 cursor-not-allowed opacity-80" : "bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"}`,
                children: [
                  isMarked && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-white/80 z-10 rounded-xl flex flex-col items-center justify-center gap-2 p-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Attendance" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-2", children: attendance.map(
                      (att) => att.student.map((stu) => /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: `px-3 py-1 rounded-full text-sm font-medium ${att.present ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
                          children: [
                            stu.fullName,
                            ":",
                            " ",
                            att.present ? "Present" : "Absent"
                          ]
                        },
                        stu._id
                      ))
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("h5", { className: "font-bold text-gray-800 line-clamp-2", children: meeting.title }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full", children: meeting.platform })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      "⏰",
                      " ",
                      new Date(meeting.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      }),
                      " ",
                      "→",
                      " ",
                      new Date(meeting.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      "📅",
                      " ",
                      new Date(meeting.startTime).toLocaleDateString()
                    ] }),
                    meeting.meetingPassword && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      "🔑 Password:",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800", children: meeting.meetingPassword })
                    ] })
                  ] }),
                  !isMarked && /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: meeting.meetingLink,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "block w-full text-center py-2.5 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300",
                      children: "Join Meeting"
                    }
                  )
                ]
              },
              meeting._id
            );
          }) }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-2xl text-gray-400", children: "📅" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "No meetings scheduled" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Meetings will appear here when scheduled" })
          ] })
        ] }) })
      ] })
    ] }),
    document.body
  );
};
const NotesTab = ({ batch }) => {
  const allNotes = batch?.notes || [];
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Notes" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1", children: [
        "View batch-specific ",
        COURSE_NAME,
        " materials"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: allNotes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: allNotes.map((note, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaFileAlt, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900", children: note.title || `Note ${index + 1}` }),
          note.content && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: note.content })
        ] })
      ] }),
      note.file && /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${DIR.COURSE_NOTES}${note.file}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",
          download: true,
          children: [
            /* @__PURE__ */ jsx(FaEye, { className: "w-4 h-4" }),
            "View"
          ]
        }
      )
    ] }, note._id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-gray-500", children: [
      /* @__PURE__ */ jsx(FaFileAlt, { className: "w-16 h-16 mx-auto mb-4 text-gray-300" }),
      /* @__PURE__ */ jsx("p", { children: "No notes available for this batch yet." })
    ] }) })
  ] });
};
const OutcomesTab = ({ course }) => {
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [progress, setProgress] = useState(0);
  const outcomesWithProgress = course.learningOutcomes?.map((outcome, index) => ({
    id: index,
    text: outcome,
    completed: Math.random() > 0.7,
    // Random completion for demo
    category: getOutcomeCategory(outcome),
    // skills: extractSkills(outcome),
    icon: getOutcomeIcon(outcome)
  })) || [];
  const completedCount = outcomesWithProgress.filter((outcome) => outcome.completed).length;
  const totalCount = outcomesWithProgress.length;
  const progressPercentage = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
  function getOutcomeCategory(outcome) {
    const lowerOutcome = outcome.toLowerCase();
    if (lowerOutcome.includes("build") || lowerOutcome.includes("develop") || lowerOutcome.includes("create"))
      return "development";
    if (lowerOutcome.includes("master") || lowerOutcome.includes("understand") || lowerOutcome.includes("learn"))
      return "mastery";
    if (lowerOutcome.includes("deploy") || lowerOutcome.includes("production") || lowerOutcome.includes("launch"))
      return "deployment";
    if (lowerOutcome.includes("crack") || lowerOutcome.includes("interview") || lowerOutcome.includes("job"))
      return "career";
    return "general";
  }
  function getOutcomeIcon(outcome) {
    const category = getOutcomeCategory(outcome);
    switch (category) {
      case "development":
        return FaCode;
      case "mastery":
        return FaGraduationCap;
      case "deployment":
        return FaRocket;
      case "career":
        return FaUsers;
      default:
        return FaLightbulb;
    }
  }
  const categoryColors = {
    development: { bg: "from-blue-500 to-cyan-500", text: "text-blue-600", light: "bg-blue-50" },
    mastery: { bg: "from-purple-500 to-pink-500", text: "text-purple-600", light: "bg-purple-50" },
    deployment: { bg: "from-green-500 to-emerald-500", text: "text-green-600", light: "bg-green-50" },
    career: { bg: "from-orange-500 to-red-500", text: "text-orange-600", light: "bg-orange-50" },
    general: { bg: "from-gray-500 to-gray-700", text: "text-gray-600", light: "bg-gray-50" }
  };
  const getCategoryLabel = (category) => {
    const labels = {
      development: "Development",
      mastery: "Mastery",
      deployment: "Deployment",
      career: "Career",
      general: "General"
    };
    return labels[category] || "Skill";
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border p-4 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg", children: /* @__PURE__ */ jsx(FaTrophy, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Learning Outcomes" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1 text-lg", children: [
            "Master these skills to become a proficient ",
            course.title,
            " developer"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-4 border shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-gray-700", children: "Your Learning Journey" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-green-600", children: [
            progressPercentage,
            "% Complete"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg",
            style: { width: `${progressPercentage}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-2", children: [
          /* @__PURE__ */ jsx("span", { children: "Beginner" }),
          /* @__PURE__ */ jsx("span", { children: "Intermediate" }),
          /* @__PURE__ */ jsx("span", { children: "Advanced" }),
          /* @__PURE__ */ jsx("span", { children: "Master" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b bg-gradient-to-r from-purple-50 to-blue-100", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(FaGraduationCap, { className: "text-purple-600" }),
          "What You'll Master"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1", children: [
          totalCount,
          " key skills and competencies you'll develop"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children: outcomesWithProgress.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6", children: outcomesWithProgress.map((outcome, index) => {
        const IconComponent = outcome.icon;
        const colors = categoryColors[outcome.category];
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${outcome.completed ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`,
            children: /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: `w-10 h-10 bg-gradient-to-r ${colors.bg} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(IconComponent, { className: "w-6 h-6" }) }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h3", { className: `text-xl font-semibold mb-2 group-hover:${colors.text} transition-colors ${outcome.completed ? "text-green-700" : "text-gray-900"}`, children: outcome.text }) }) }) })
            ] }) })
          },
          outcome.id
        );
      }) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(FaGraduationCap, { className: "w-10 h-10 text-gray-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-600 mb-2", children: "No Learning Outcomes Defined" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 max-w-md mx-auto", children: "Learning outcomes for this course will be added by the instructor soon." })
      ] }) })
    ] }),
    selectedOutcome && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `p-6 border-b bg-gradient-to-r ${categoryColors[selectedOutcome.category].bg} text-white`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(selectedOutcome.icon, { className: "w-6 h-6" }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold", children: "Learning Outcome" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "text-white hover:text-gray-200 transition-colors p-2",
            children: /* @__PURE__ */ jsx(FaTimes, { className: "w-5 h-5" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto max-h-[60vh]", children: /* @__PURE__ */ jsx("div", { className: "prose max-w-none", children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold text-gray-900 mb-4", children: selectedOutcome.text }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Category" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900", children: getCategoryLabel(selectedOutcome.category) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Status" }),
            /* @__PURE__ */ jsx("div", { className: `font-semibold ${selectedOutcome.completed ? "text-green-600" : "text-blue-600"}`, children: selectedOutcome.completed ? "Mastered" : "In Progress" })
          ] })
        ] }),
        selectedOutcome.skills.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h5", { className: "font-semibold text-gray-900 mb-3", children: "Key Skills Developed" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: selectedOutcome.skills.map((skill, index) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium",
              children: [
                /* @__PURE__ */ jsx(FaStar, { className: "w-4 h-4 text-yellow-500" }),
                skill
              ]
            },
            index
          )) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-t bg-gray-50 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
          "Outcome ",
          selectedOutcome.id + 1,
          " of ",
          totalCount
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
              children: "Close"
            }
          ),
          /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [
            /* @__PURE__ */ jsx(FaPlay, { className: "w-4 h-4" }),
            "Start Learning"
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const OverviewTab = ({ course, setActiveTab }) => {
  const stats = [
    // {
    //   icon: <FaClock className="w-5 h-5" />,
    //   label: "Duration",
    //   value: course.duration,
    //   color: "from-blue-500 to-blue-600",
    // },
    {
      icon: /* @__PURE__ */ jsx(FaUsers, { className: "w-5 h-5" }),
      label: "Enrolled",
      value: course.enrolledCount,
      color: "from-green-500 to-green-600"
    },
    {
      icon: /* @__PURE__ */ jsx(FaStar, { className: "w-5 h-5" }),
      label: "Rating",
      value: course.rating,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: /* @__PURE__ */ jsx(FaGraduationCap, { className: "w-5 h-5" }),
      label: "Certificate",
      value: "Included",
      color: "from-purple-500 to-purple-600"
    }
  ];
  return (
    // 🟢 Make content scrollable, assuming header is 64px tall
    /* @__PURE__ */ jsxs("div", { className: "p-8 h-[calc(100vh-64px)] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text", children: [
          "Welcome to ",
          course.title
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed", children: course.overview })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg`,
                children: stat.icon
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900 mb-1", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 font-medium", children: stat.label })
          ]
        },
        index
      )) }),
      course.benefits && course.benefits.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white shadow-lg", children: /* @__PURE__ */ jsx(FaTrophy, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-gray-900", children: [
            "Why Take This ",
            COURSE_NAME,
            "?"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: course.benefits.map((benefit, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mt-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-lg text-gray-800 font-medium", children: benefit })
            ]
          },
          index
        )) })
      ] }),
      course.keyFeatures && course.keyFeatures.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg", children: /* @__PURE__ */ jsx(FaLightbulb, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-900", children: "Prerequisite" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: course.keyFeatures.map((feature, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" }),
                feature.title
              ] }),
              feature.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 leading-relaxed", children: feature.description }),
              feature.subPoints && feature.subPoints.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: feature.subPoints.map((point, idx) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "flex items-start gap-2 text-gray-700",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-green-500 mt-1.5", children: "•" }),
                    /* @__PURE__ */ jsx("span", { className: "leading-relaxed", children: point })
                  ]
                },
                idx
              )) })
            ]
          },
          index
        )) })
      ] })
    ] })
  );
};
const getPlayableVideoUrl = (url) => {
  if (!url) return "";
  let finalUrl = url.trim();
  if (!finalUrl.startsWith("http")) {
    finalUrl = `https://${finalUrl}`;
  }
  if (finalUrl.includes("youtube.com/embed/")) {
    const videoId = finalUrl.split("/embed/")[1]?.split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  if (finalUrl.includes("youtu.be/")) {
    const videoId = finalUrl.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return finalUrl;
};
const PrerequisitesTab = ({ batch }) => {
  const prerequisites = batch?.prerequisites;
  if (!prerequisites || prerequisites.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-gray-600", children: [
      "No prerequisites available for this ",
      COURSE_NAME,
      "."
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Prerequisites" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-8", children: prerequisites.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white shadow-md rounded-xl border p-6 space-y-4",
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-blue-700", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: item.description }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: item.topics?.map((topic) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "border rounded-lg p-4 bg-gray-50 shadow-sm",
              children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-800 mb-3", children: topic.name }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  topic.videoLinks && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: getPlayableVideoUrl(topic.videoLinks),
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-2 text-red-600 font-semibold hover:underline p-4 bg-red-50 rounded-lg transition",
                      children: [
                        /* @__PURE__ */ jsx(FaPlayCircle, { className: "w-6 h-6" }),
                        "Watch video"
                      ]
                    }
                  ),
                  topic.materialFiles?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-700 mb-2", children: "Materials:" }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", children: topic.materialFiles.map((file, index) => /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: `${DIR.PREREQUISITE_MATERIALS}${file}`,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition",
                        children: [
                          /* @__PURE__ */ jsx(FaFileAlt, { className: "w-4 h-4" }),
                          "Open File ",
                          index + 1
                        ]
                      },
                      index
                    )) })
                  ] })
                ] })
              ]
            },
            topic._id
          )) })
        ]
      },
      item._id
    )) })
  ] });
};
const TestList = ({ tests }) => {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [showQP, setShowQP] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  if (!tests || tests.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-gray-500", children: "No tests available for this batch." });
  }
  const handleStartTest = (test) => {
    Swal.fire({
      title: `Start ${test.title}?`,
      html: `
        <div class="text-left max-h-[60vh] overflow-y-auto">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            <h3 class="text-lg font-bold">Test Instructions</h3>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-blue-800 mb-2">General Guidelines:</h4>
            <ul class="space-y-2 list-disc pl-5 text-blue-700">
              <li>Total duration: ${test?.testDuration?.minutes || "N/A"} minutes</li>
              <li>Total questions: ${test.totalQuestions}</li>
              <li>Each question carries equal marks</li>
              <li>No negative marking</li>
            </ul>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-yellow-800 mb-2">During the Test:</h4>
            <ul class="space-y-2 list-disc pl-5 text-yellow-700">
              <li>Select the correct option for each question</li>
              <li>You can change answers before submission</li>
              <li>Do not refresh or close the browser</li>
              <li>Timer starts immediately</li>
            </ul>
          </div>

          <div class="flex items-start mt-4">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              class="w-5 h-5 mt-1 mr-2 cursor-pointer"
            />
            <label for="agreeTerms" class="text-gray-700 cursor-pointer">
              I have read and understood the instructions
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `
        <span class="flex items-center gap-2">
          <VscDebugStart />
          Start Test
        </span>
      `,
      cancelButtonText: "Cancel",
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const checkbox = Swal.getPopup().querySelector("#agreeTerms");
        confirmBtn.disabled = true;
        checkbox.addEventListener("change", () => {
          confirmBtn.disabled = !checkbox.checked;
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(console.warn);
        }
        navigate(`/test/${test._id}`);
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Assessment Zone" }),
    tests.map((test) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "p-4 border rounded-lg shadow bg-white flex justify-between items-center",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-blue-700", children: test.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              "Level: ",
              test.testLevel,
              " • Questions: ",
              test.totalQuestions
            ] })
          ] }),
          test.attempted === 0 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleStartTest(test),
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
              children: "Start Test"
            }
          ),
          test.attempted === -1 && test.iqtest?.status === -1 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                  elem.requestFullscreen().catch(console.warn);
                }
                navigate(`/test/${test._id}`);
              },
              className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700",
              children: "Resume Test"
            }
          ),
          test.attempted === 1 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedTest(test);
                  setShowResult(true);
                },
                className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",
                children: "View Result"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedTest(test);
                  setShowQP(true);
                },
                className: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
                children: "View QP"
              }
            )
          ] })
        ]
      },
      test._id
    )),
    showResult && selectedTest && /* @__PURE__ */ jsx(
      ResultModal,
      {
        isOpen: showResult,
        onClose: () => setShowResult(false),
        result: {
          totalQuestions: selectedTest.iqtest.totalQuestions,
          correct: selectedTest.iqtest.correctAnswers,
          wrong: selectedTest.iqtest.wrongAnswers,
          totalMarks: selectedTest.iqtest.totalMarks,
          marks: selectedTest.iqtest.marksGained,
          passingMarks: selectedTest.iqtest.passingMarks
        }
      }
    ),
    showQP && /* @__PURE__ */ jsx(
      ViewQPPopup,
      {
        test: selectedTest,
        onClose: () => setShowQP(false)
      }
    )
  ] });
};
const TestsTab = ({ batch, studentId, baseurl }) => {
  const [selectedTestID, setSelectedTestID] = useState(null);
  const tests = batch?.tests || [];
  return selectedTestID ? /* @__PURE__ */ jsx(
    TestDetail,
    {
      testID: selectedTestID,
      studentId,
      baseurl,
      onBack: () => setSelectedTestID(null)
    }
  ) : /* @__PURE__ */ jsx(
    TestList,
    {
      tests,
      onSelectTest: (test) => setSelectedTestID(test._id)
    }
  );
};
const VideosTab = ({ batch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allLectures = useMemo(() => {
    return batch?.lectures?.map((lecture) => ({
      ...lecture,
      chapterTitle: lecture.chapter || "N/A",
      weekTitle: lecture.week || "N/A"
    })) || [];
  }, [batch]);
  useEffect(() => {
    if (!batch) return;
    dispatch(setBatchInfo$1({ batchId: batch._id, batchName: batch.batchName }));
    dispatch(setAllLectures(allLectures));
  }, [batch, allLectures, dispatch]);
  const handleVideoClick = (video) => {
    dispatch(setSelectedVideo(video));
    if (video.type === "youtube") {
      window.open(video.contentUrl, "_blank");
    } else {
      navigate(`/batch/${batch._id}/video/${video._id}`);
    }
  };
  if (!batch) {
    return /* @__PURE__ */ jsx("p", { className: "p-6 text-gray-500", children: "Loading batch videos..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white shadow-lg", children: /* @__PURE__ */ jsx(FaVideo, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-gray-900", children: "Video Lectures" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mt-1 text-lg", children: [
          allLectures.length,
          " lectures from expert instructors"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4", children: allLectures.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-6", children: allLectures.map((video) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white group cursor-pointer",
        onClick: () => handleVideoClick(video),
        children: [
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx(FaPlay, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FaVideo, { className: "w-2 h-2 text-white" }) }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2", children: video.title }),
                /* @__PURE__ */ jsx(FaExternalLinkAlt, { className: "w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2 mt-1" })
              ] }),
              video.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-3 line-clamp-2", children: video.description })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
        ]
      },
      video._id
    )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(FaVideo, { className: "w-10 h-10 text-gray-400" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-600 mb-2", children: "No Video Lectures Available" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 max-w-md mx-auto", children: "Video lectures will be added to this batch soon." })
    ] }) })
  ] });
};
const StudyCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [progress, setProgress] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const batchId = searchParams.get("batchId");
  const [batch, setBatch] = useState(null);
  const [showMeetings, setShowMeetings] = useState(false);
  const normalizeTab = (tab) => tab?.toLowerCase().replace(/\s+/g, "") || "overview";
  const [activeTab, setActiveTabState] = useState(
    normalizeTab(searchParams.get("activeTab"))
  );
  const handleSetActiveTab = (tabName) => {
    const params = Object.fromEntries([...searchParams]);
    const normalizedTab = normalizeTab(tabName);
    params.activeTab = normalizedTab;
    setActiveTabState(normalizedTab);
    setSearchParams(params);
  };
  useEffect(() => {
    if (!courseId) return;
    const loadCourseDetails = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
        setError("");
        calculateProgress(courseData);
      } catch (error2) {
        setError(error2.message || `Failed to load ${COURSE_NAME} content.`);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    loadCourseDetails();
  }, [courseId]);
  const selectedBatch = course?.batches?.find((batch2) => batch2._id === batchId);
  useEffect(() => {
    if (!batchId) return;
    const loadBatch = async () => {
      try {
        const batchData = await fetchActiveBatchById(batchId);
        setBatch(batchData);
      } catch (err) {
        console.error("Failed to fetch batch:", err);
        setBatch(null);
      }
    };
    loadBatch();
  }, [batchId]);
  const hasCloudLab = Array.isArray(batch?.cloudLabs?.students) && batch.cloudLabs.students.length > 0;
  const calculateProgress = (courseData) => {
    const totalItems = courseData.phases?.reduce(
      (total, phase) => total + phase.weeks.reduce(
        (weekTotal, week) => weekTotal + week.chapters.reduce(
          (chapterTotal, chapter) => chapterTotal + (chapter.lectures?.length || 0) + (chapter.assignments?.length || 0),
          0
        ),
        0
      ),
      0
    ) || 0;
    setProgress(totalItems > 0 ? 25 : 0);
  };
  const getLectureCount = (batch2) => {
    if (!batch2?.lectures) return 0;
    return batch2.lectures.length;
  };
  const getAssignmentCount = (batch2) => {
    if (!batch2?.assignments) return 0;
    return batch2.assignments.length;
  };
  const getNotesCount = (batch2) => {
    if (!batch2?.notes) return 0;
    return batch2.notes.length;
  };
  const getFeedbackCount = (batch2) => {
    if (!batch2?.feedbacks) return 0;
    return batch2.feedbacks.length;
  };
  const getOutcomesCount = (course2) => {
    if (!course2?.learningOutcomes) return 0;
    return course2.learningOutcomes.length;
  };
  const toggleWeek = (phaseIndex, weekIndex) => {
    const key = `${phaseIndex}-${weekIndex}`;
    setExpandedWeeks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const TabButton = ({ name, icon, isActive, count, color = "blue" }) => {
    const colorClasses = {
      blue: {
        active: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-blue-50 border-blue-200",
        count: "bg-blue-100 text-blue-600"
      },
      green: {
        active: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-green-50 border-green-200",
        count: "bg-green-100 text-green-600"
      },
      purple: {
        active: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-purple-50 border-purple-200",
        count: "bg-purple-100 text-purple-600"
      },
      orange: {
        active: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-orange-50 border-orange-200",
        count: "bg-orange-100 text-orange-600"
      }
    };
    const colors = colorClasses[color];
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => handleSetActiveTab(name.toLowerCase()),
        className: `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive ? `${colors.active} shadow-lg` : `${colors.inactive} border hover:shadow-md`}`,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-gray-100"}`,
              children: icon
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "font-semibold flex-1 text-left", children: name }),
          count > 0 && /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-2 py-1 rounded-full text-xs font-bold ${isActive ? "bg-white/20 text-white" : colors.count}`,
              children: count
            }
          )
        ]
      }
    );
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxs("p", { className: "text-lg font-medium text-gray-600 animate-pulse", children: [
        "Loading ",
        COURSE_NAME,
        " content..."
      ] })
    ] }) });
  }
  if (error || !course) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce", children: /* @__PURE__ */ jsx(FaBook, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-3", children: error ? `Error Loading ${COURSE_NAME}` : `${COURSE_NAME} Not Found` }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: error || `The requested ${COURSE_NAME} could not be found.` })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50", children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b", children: /* @__PURE__ */ jsx("div", { className: "max-w-8xl mx-auto px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/student/dashboard",
            className: "text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-3",
            children: [
              /* @__PURE__ */ jsx(FaArrowLeft, { className: "w-4 h-4" }),
              "Back to ",
              COURSE_NAME
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block h-6 w-px bg-gradient-to-b from-gray-300 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white", children: /* @__PURE__ */ jsx(FaBook, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text", children: [
            course.title,
            selectedBatch && /* @__PURE__ */ jsxs("span", { className: "text-gray-800 text-lg font-bold ml-3", children: [
              "— ",
              selectedBatch.batchName
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm font-semibold relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowMeetings((prev) => !prev),
              className: "w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all shadow-sm hover:shadow-md",
              children: [
                /* @__PURE__ */ jsx(FaClock, { className: "w-4 h-4" }),
                "View Sessions & Attendance"
              ]
            }
          ),
          showMeetings && /* @__PURE__ */ jsx(
            MeetingsDropdown,
            {
              batch,
              onClose: () => setShowMeetings(false)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full shadow-sm", children: [
          /* @__PURE__ */ jsx(FaStar, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            course.rating,
            " Rating"
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-8xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "lg:w-72 flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl border p-6 sticky top-28 space-y-6 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxs("nav", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Overview",
              icon: /* @__PURE__ */ jsx(FaListAlt, { className: "w-4 h-4" }),
              isActive: activeTab === "overview",
              count: 0,
              color: "blue"
            }
          ),
          hasCloudLab && /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Cloud Lab",
              icon: /* @__PURE__ */ jsx(FaVideo, { className: "w-4 h-4" }),
              isActive: activeTab === "cloudlab",
              color: "blue"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Outcomes",
              icon: /* @__PURE__ */ jsx(FaCheckCircle, { className: "w-4 h-4" }),
              isActive: activeTab === "outcomes",
              count: getOutcomesCount(course),
              color: "green"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Curriculum",
              icon: /* @__PURE__ */ jsx(FaBook, { className: "w-4 h-4" }),
              isActive: activeTab === "curriculum",
              color: "purple"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Prerequisites",
              icon: /* @__PURE__ */ jsx(FaBook, { className: "w-4 h-4" }),
              isActive: activeTab === "prerequisites",
              count: batch?.prerequisites?.length || 0,
              color: "purple"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Assignments",
              icon: /* @__PURE__ */ jsx(FaTasks, { className: "w-4 h-4" }),
              isActive: activeTab === "assignments",
              count: getAssignmentCount(batch),
              color: "orange"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Assessment",
              icon: /* @__PURE__ */ jsx(FaTasks, { className: "w-4 h-4" }),
              isActive: activeTab === "assessment",
              count: batch?.tests?.length || 0,
              color: "orange"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Recording",
              icon: /* @__PURE__ */ jsx(FaVideo, { className: "w-4 h-4" }),
              isActive: activeTab === "recording",
              count: getLectureCount(batch),
              color: "green"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Notes",
              icon: /* @__PURE__ */ jsx(FaFileAlt, { className: "w-4 h-4" }),
              isActive: activeTab === "notes",
              count: getNotesCount(batch),
              color: "blue"
            }
          ),
          /* @__PURE__ */ jsx(
            TabButton,
            {
              name: "Feedback",
              icon: /* @__PURE__ */ jsx(FaVideo, { className: "w-4 h-4" }),
              isActive: activeTab === "feedback",
              count: getFeedbackCount(batch),
              color: "green"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-gray-700", children: "Your Progress" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-blue-600", children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg",
              style: { width: `${progress}%` }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-2", children: [
            /* @__PURE__ */ jsx("span", { children: "Start Learning" }),
            /* @__PURE__ */ jsx("span", { children: "Complete" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg overflow-hidden min-h-[70vh]", children: [
        activeTab === "overview" && /* @__PURE__ */ jsx(OverviewTab, { course, setActiveTab: handleSetActiveTab }),
        activeTab === "cloudlab" && hasCloudLab && /* @__PURE__ */ jsx(CloudLabTab, { cloudLabs: batch.cloudLabs }),
        activeTab === "curriculum" && /* @__PURE__ */ jsx(
          CurriculumTab,
          {
            course,
            expandedWeeks,
            toggleWeek
          }
        ),
        activeTab === "notes" && /* @__PURE__ */ jsx(NotesTab, { batch }),
        activeTab === "prerequisites" && /* @__PURE__ */ jsx(PrerequisitesTab, { batch }),
        activeTab === "recording" && /* @__PURE__ */ jsx(VideosTab, { batch }),
        activeTab === "assessment" && /* @__PURE__ */ jsx(TestsTab, { batch }),
        activeTab === "assignments" && /* @__PURE__ */ jsx(AssignmentsTab, { batch }),
        activeTab === "feedback" && /* @__PURE__ */ jsx(FeedbackList, { batch }),
        activeTab === "outcomes" && /* @__PURE__ */ jsx(OutcomesTab, { course })
      ] }) })
    ] })
  ] });
};
export {
  StudyCoursePage as default
};
