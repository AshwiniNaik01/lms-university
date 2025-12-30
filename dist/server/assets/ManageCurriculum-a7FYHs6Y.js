import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { f as fetchCourseById, C as COURSE_NAME, e as canPerformAction, g as getAllCourses, j as apiClient } from "../entry-server.js";
import { u as useCourseParam } from "./useCourseParam-D0IDp8wz.js";
import { useSelector } from "react-redux";
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
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const Modal = ({ title, values, onSave, onClose, type = "edit" }) => {
  const [formData, setFormData] = useState(values);
  const handleChange = (key, val) => setFormData({ ...formData, [key]: val });
  const handlePointChange = (index, key, val) => {
    const updatedPoints = [...formData.points || []];
    updatedPoints[index][key] = val;
    setFormData({ ...formData, points: updatedPoints });
  };
  const handleAddPoint = () => {
    setFormData({
      ...formData,
      points: [...formData.points || [], { title: "", description: "" }]
    });
  };
  const handleRemovePoint = (index) => {
    const updatedPoints = formData.points.filter((_, i) => i !== index);
    setFormData({ ...formData, points: updatedPoints });
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-[600px] shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2", children: [
      type === "delete" ? "🗑️" : "✏️",
      " ",
      title
    ] }),
    type === "delete" ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-lg mb-2", children: "Are you sure you want to delete this?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "This action cannot be undone." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "text-gray-700 text-sm font-semibold mb-2 block", children: "Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: formData.title || "",
            onChange: (e) => handleChange("title", e.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
            placeholder: "Enter title..."
          }
        )
      ] }),
      formData.description !== void 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "text-gray-700 text-sm font-semibold mb-2 block", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: formData.description || "",
            onChange: (e) => handleChange("description", e.target.value),
            rows: "3",
            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none",
            placeholder: "Enter description..."
          }
        )
      ] }),
      formData.weekNumber !== void 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "text-gray-700 text-sm font-semibold mb-2 block", children: "Module's Number" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: formData.weekNumber || "",
            onChange: (e) => handleChange("weekNumber", parseInt(e.target.value)),
            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
            min: "1"
          }
        )
      ] }),
      formData.points !== void 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-gray-700 text-sm font-semibold", children: "Learning Points" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleAddPoint,
              className: "bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-all",
              children: "➕ Add Point"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-60 overflow-y-auto", children: (formData.points || []).map((point, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-2 border-gray-200 rounded-xl p-4 bg-gray-50",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-sm font-semibold text-gray-700", children: [
                  "Point ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleRemovePoint(index),
                    className: "text-red-500 hover:text-red-700 text-sm font-medium",
                    children: "🗑️ Remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Point Title",
                  value: point.title,
                  onChange: (e) => handlePointChange(index, "title", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-200"
                }
              ),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  placeholder: "Description",
                  value: point.description,
                  onChange: (e) => handlePointChange(
                    index,
                    "description",
                    e.target.value
                  ),
                  rows: "2",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 resize-none"
                }
              )
            ]
          },
          index
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onSave(formData),
          className: `px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all ${type === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`,
          children: type === "delete" ? "🗑️ Delete" : "💾 Save Changes"
        }
      )
    ] })
  ] }) });
};
const Toast = ({ message, type, onClose }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 animate-slide-in ${type === "success" ? "bg-green-500" : "bg-red-500"}`,
    children: [
      /* @__PURE__ */ jsx("span", { children: message }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-white hover:text-gray-200 font-bold",
          children: "✕"
        }
      )
    ]
  }
);
const ManageCurriculum = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [phases, setPhases] = useState([]);
  const [openPhase, setOpenPhase] = useState(null);
  const [openWeek, setOpenWeek] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(courses);
  const isValidText = (value) => value?.trim()?.length > 0;
  const getValidPoints = (points = []) => points.filter((p) => isValidText(p.title) || isValidText(p.description));
  const getValidChapters = (chapters = []) => chapters.filter(
    (c) => isValidText(c.title) || getValidPoints(c.points).length > 0 || c.lectures?.length > 0 || c.assignments?.length > 0
  );
  const getValidWeeks = (weeks = []) => weeks.filter(
    (w) => isValidText(w.title) || getValidChapters(w.chapters).length > 0
  );
  const getValidPhases = (phases2 = []) => phases2.filter(
    (p) => isValidText(p.title) || getValidWeeks(p.weeks).length > 0
  );
  const validPhases = getValidPhases(phases);
  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3e3);
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData || []);
      } catch (error) {
        showToast(`❌ Failed to load ${COURSE_NAME}`, "error");
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    if (selectedCourseFromParam && courses.length > 0) {
      setSelectedCourse(selectedCourseFromParam);
      fetchPhases(selectedCourseFromParam);
    }
  }, [selectedCourseFromParam, courses]);
  const fetchPhases = async (courseId) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const course = await fetchCourseById(courseId);
      setPhases(course?.phases || []);
    } catch (error) {
      showToast("❌ Failed to load curriculum", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleCourseChange = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setOpenPhase(null);
    setOpenWeek(null);
    if (id) fetchPhases(id);
  };
  const updateEntity = async (url, payload, successMsg) => {
    setLoading(true);
    try {
      await apiClient.put(url, payload);
      showToast(`✅ ${successMsg}`, "success");
      fetchPhases(selectedCourse);
    } catch (err) {
      showToast(
        `❌ Failed to update: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const deleteEntity = async (url, successMsg) => {
    setLoading(true);
    try {
      await apiClient.delete(url);
      showToast(`✅ ${successMsg}`, "success");
      fetchPhases(selectedCourse);
    } catch (err) {
      showToast(
        `❌ Failed to delete: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleEditPhase = (phase) => {
    setModal({
      title: "Edit Phase",
      values: {
        title: phase.title,
        description: phase.description,
        course: selectedCourse
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/phases/${phase._id}`,
          data,
          "Schedule updated successfully!"
        );
      }
    });
  };
  const handleDeletePhase = (phase) => {
    setModal({
      title: "Delete Schedule",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(`/api/phases/${phase._id}`, "Schedule deleted successfully!");
      },
      type: "delete"
    });
  };
  const handleEditWeek = (week) => {
    setModal({
      title: "Edit Module",
      values: {
        title: week.title,
        weekNumber: week.weekNumber,
        phase: week.phase
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/weeks/${week._id}`,
          data,
          "Module updated successfully!"
        );
      }
    });
  };
  const handleDeleteWeek = (week) => {
    setModal({
      title: "Delete Module",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(
          `/api/weeks/${week._id}`,
          "Module deleted successfully!"
        );
      },
      type: "delete"
    });
  };
  const handleEditChapter = (chapter) => {
    setModal({
      title: "Edit Course Content",
      values: {
        title: chapter.title || "",
        points: chapter.points || [],
        week: chapter.week
      },
      onSave: (data) => {
        setModal(null);
        updateEntity(
          `/api/chapters/${chapter._id}`,
          data,
          "Course Content updated successfully!"
        );
      }
    });
  };
  const handleDeleteChapter = (chapter) => {
    setModal({
      title: "Delete Course Content",
      values: {},
      onSave: () => {
        setModal(null);
        deleteEntity(
          `/api/chapters/${chapter._id}`,
          "Course Content deleted successfully!"
        );
      },
      type: "delete"
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "max-h-fit bg-gradient-to-br from-blue-50 via-white to-purple-50 py-2", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-start mb-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4", children: "📚 Manage Curriculum" }),
      /* @__PURE__ */ jsx("hr", {})
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `bg-white rounded-lg shadow-lg p-6 mb-2 ${isCoursePreselected ? "opacity-50 pointer-events-none" : ""}`,
        children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-lg font-semibold text-gray-700 mb-3", children: [
            "🎯 Select ",
            COURSE_NAME
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedCourse,
              onChange: handleCourseChange,
              className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
              disabled: isCoursePreselected,
              children: [
                /* @__PURE__ */ jsxs("option", { value: "", children: [
                  "-- Choose a ",
                  COURSE_NAME,
                  " --"
                ] }),
                courses.map((course) => /* @__PURE__ */ jsx("option", { value: course._id, children: course.title }, `course-${course._id}`))
              ]
            }
          )
        ]
      }
    ),
    loading && /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 font-semibold", children: "Loading..." })
    ] }),
    !loading && validPhases.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      validPhases.map((phase, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => setOpenPhase(openPhase === phase._id ? null : phase._id),
                className: "flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl", children: index + 1 }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800", children: phase.title }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: phase.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    canPerformAction(rolePermissions, "curriculum", "update") && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          handleEditPhase(phase);
                        },
                        className: "w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all",
                        children: "✏️"
                      }
                    ),
                    canPerformAction(rolePermissions, "curriculum", "delete") && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDeletePhase(phase);
                        },
                        className: "w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all",
                        children: "🗑️"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-2xl text-blue-600", children: openPhase === phase._id ? "🔽" : "▶️" })
                  ] })
                ]
              }
            ),
            openPhase === phase._id && getValidWeeks(phase.weeks).length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-6 bg-gray-50 space-y-4", children: [
              getValidWeeks(phase.weeks).map((week) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white rounded-xl border-2 border-gray-200 overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        onClick: () => setOpenWeek(openWeek === week._id ? null : week._id),
                        className: "flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-all",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white", children: "📅" }),
                            /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-gray-800", children: [
                                "Week ",
                                week.weekNumber,
                                ": ",
                                week.title
                              ] }),
                              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                                getValidChapters(week.chapters).length || 0,
                                " Course Content"
                              ] })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            canPerformAction(rolePermissions, "curriculum", "update") && /* @__PURE__ */ jsx(
                              "button",
                              {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleEditWeek(week);
                                },
                                className: "w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all text-sm",
                                children: "✏️"
                              }
                            ),
                            canPerformAction(rolePermissions, "curriculum", "delete") && /* @__PURE__ */ jsx(
                              "button",
                              {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleDeleteWeek(week);
                                },
                                className: "w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all text-sm",
                                children: "🗑️"
                              }
                            ),
                            /* @__PURE__ */ jsx("span", { className: "text-2xl text-blue-600", children: openWeek === week._id ? "🔽" : "▶️" })
                          ] })
                        ]
                      }
                    ),
                    openWeek === week._id && /* @__PURE__ */ jsx("div", { className: "p-4 bg-white space-y-3", children: getValidChapters(week.chapters).length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      getValidChapters(week.chapters).map((chapter, index2) => /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 transition-all",
                          children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1", children: [
                              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm mt-1", children: "📚" }),
                              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                                /* @__PURE__ */ jsx("h5", { className: "font-semibold text-gray-800 mb-2", children: chapter.title || `Course Content ${index2 + 1}` }),
                                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: getValidPoints(chapter.points).map((point, pointIndex) => /* @__PURE__ */ jsxs(
                                  "div",
                                  {
                                    className: "flex items-start gap-2 text-sm",
                                    children: [
                                      /* @__PURE__ */ jsx("span", { className: "text-green-500 mt-1", children: "✅" }),
                                      /* @__PURE__ */ jsxs("div", { children: [
                                        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: point.title }),
                                        point.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs mt-1", children: point.description })
                                      ] })
                                    ]
                                  },
                                  point._id || pointIndex
                                )) })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                              canPerformAction(rolePermissions, "curriculum", "update") && /* @__PURE__ */ jsx(
                                "button",
                                {
                                  onClick: () => handleEditChapter(chapter),
                                  className: "w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all text-sm",
                                  children: "✏️"
                                }
                              ),
                              canPerformAction(rolePermissions, "curriculum", "delete") && /* @__PURE__ */ jsx(
                                "button",
                                {
                                  onClick: () => handleDeleteChapter(chapter),
                                  className: "w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all text-sm",
                                  children: "🗑️"
                                }
                              )
                            ] })
                          ] })
                        },
                        chapter._id
                      )),
                      /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-4", children: canPerformAction(rolePermissions, "curriculum", "create") && /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => navigate(`/add-curriculum?type=chapter&weekId=${week._id}&courseId=${selectedCourse}`),
                          className: "bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all flex items-center gap-2",
                          children: "📚 Add Course Content to this Module"
                        }
                      ) })
                    ] }) : (
                      /* Empty chapters state with add button */
                      /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-3", children: "📚" }),
                        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "No course contents yet in this module." }),
                        canPerformAction(rolePermissions, "curriculum", "create") && /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => navigate(`/add-curriculum?type=chapter&weekId=${week._id}&courseId=${selectedCourse}`),
                            className: "bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all flex items-center gap-2 mx-auto",
                            children: "📚 Add First Course Content"
                          }
                        )
                      ] })
                    ) })
                  ]
                },
                week._id
              )),
              /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-4", children: canPerformAction(rolePermissions, "curriculum", "create") && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigate(`/add-curriculum?type=week&phaseId=${phase._id}&courseId=${selectedCourse}`),
                  className: "bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2",
                  children: "➕ Add Module to this Schedule"
                }
              ) })
            ] })
          ]
        },
        phase._id
      )),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-6", children: canPerformAction(rolePermissions, "curriculum", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate(`/add-curriculum?type=phase&courseId=${selectedCourse}`),
          className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2 text-lg",
          children: "🏗️ Add New Schedule"
        }
      ) })
    ] }),
    !loading && selectedCourse && phases.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white rounded-2xl shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "📝" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: "No Curriculum Found" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-500 mb-6", children: [
        "This ",
        COURSE_NAME,
        " doesn't have any curriculum yet."
      ] }),
      canPerformAction(rolePermissions, "curriculum", "create") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate(`/add-curriculum?courseId=${selectedCourse}`),
          className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all",
          children: "🚀 Create Curriculum"
        }
      )
    ] }),
    !loading && !selectedCourse && /* @__PURE__ */ jsxs("div", { className: "text-center py-20 bg-white rounded-2xl shadow-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🎯" }),
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: [
        "Select a ",
        COURSE_NAME
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-500", children: [
        "Choose a ",
        COURSE_NAME,
        " from the dropdown above to manage its curriculum."
      ] })
    ] }),
    toast && /* @__PURE__ */ jsx(
      Toast,
      {
        message: toast.message,
        type: toast.type,
        onClose: () => setToast(null)
      }
    ),
    modal && /* @__PURE__ */ jsx(
      Modal,
      {
        title: modal.title,
        values: modal.values,
        onSave: modal.onSave,
        onClose: () => setModal(null),
        type: modal.type
      }
    )
  ] }) });
};
export {
  ManageCurriculum as default
};
