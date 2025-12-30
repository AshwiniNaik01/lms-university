import { jsx, jsxs } from "react/jsx-runtime";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { a8 as clearSelectedCourseId, j as apiClient, a9 as setSelectedCourseId, C as COURSE_NAME, I as InputField, T as TextAreaField } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
function AddCurriculum() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const phaseId = searchParams.get("phaseId");
  const weekId = searchParams.get("weekId");
  const [step, setStep] = useState(1);
  const selectedCourseId = useSelector(
    (state) => state.curriculum.selectedCourseId
  );
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState("");
  const [availablePhases, setAvailablePhases] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    // Whether the popup is visible
    type: "",
    // Type of item created: "phase" | "week" | "chapter"
    data: null
    // Data related to the created item
  });
  const type = searchParams.get("type");
  const getBackendErrorMessage = (err) => {
    if (!err.response || !err.response.data)
      return err.message || "Please Try Again!";
    const data = err.response.data;
    return data.success || data.message || data.error || "Please Try Again!";
  };
  const showToast = (message, type2 = "success") => {
    setToast({ message, type: type2 });
    setTimeout(() => setToast(null), 3e3);
  };
  useEffect(() => {
    if (courseId) {
      console.log("Adding Schedules for Training ID:", courseId);
    } else if (phaseId) {
      console.log("Adding Module for Schedule ID:", phaseId);
    } else if (weekId) {
      console.log("Adding Course Content for Module ID:", weekId);
    }
  }, [courseId, phaseId, weekId]);
  useEffect(() => {
    if (type === "phase") {
      setStep(1);
    } else if (type === "week") {
      setStep(2);
    } else if (type === "chapter") {
      setStep(3);
    } else if (weekId) {
      setStep(3);
    } else if (phaseId) {
      setStep(2);
    } else if (courseId) {
      setStep(1);
    } else {
      setStep(1);
    }
  }, [type, courseId, phaseId, weekId]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiClient.get("/api/courses/all");
        setAvailableCourses(res.data?.data || []);
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    const fetchPhaseDetails = async () => {
      if (!phaseId) return;
      setLoading(true);
      try {
        const phaseResp = await apiClient.get(`/api/phases/${phaseId}`);
        const phaseData = phaseResp.data?.data || phaseResp.data;
        if (phaseData?._id) {
          setAvailablePhases([phaseData]);
          setSelectedPhase(phaseData._id);
          weeksFormik.setFieldValue("phase", phaseData._id);
        }
      } catch (err) {
        console.error("Error fetching phase details:", err);
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPhaseDetails();
  }, [phaseId]);
  useEffect(() => {
    if (!courseId) return;
    const fetchPhasesAndWeeks = async () => {
      setLoading(true);
      try {
        const phasesResp = await apiClient.get(`/api/phases/course/${courseId}`);
        setAvailablePhases(phasesResp.data?.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setAvailablePhases([]);
        } else {
          showToast("❌ " + getBackendErrorMessage(err), "error");
        }
      }
      try {
        const weeksResp = await apiClient.get(`/api/weeks/course/${courseId}`);
        setAvailableWeeks(weeksResp.data?.data || []);
      } catch (err) {
        console.log(getBackendErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchPhasesAndWeeks();
  }, [courseId]);
  useEffect(() => {
    if (phaseId && availablePhases.length > 0) {
      const matchedPhase = availablePhases.find((p) => p._id === phaseId);
      if (matchedPhase) {
        setSelectedPhase(matchedPhase._id);
        weeksFormik.setFieldValue("phase", matchedPhase._id);
      }
    }
  }, [phaseId, availablePhases]);
  useEffect(() => {
    return () => {
      dispatch(clearSelectedCourseId());
    };
  }, [dispatch]);
  useEffect(() => {
    weeksFormik.setFieldValue("phase", selectedPhase || "");
  }, [selectedPhase]);
  const phaseFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      title: "",
      description: ""
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // title: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course) {
        showToast(`Please select a ${COURSE_NAME} first`, "error");
        return;
      }
      setLoading(true);
      try {
        const response = await apiClient.post("/api/phases", [values]);
        const newPhase = response.data?.data[0];
        showToast("🎉 Schedule created successfully!", "success");
        resetForm();
        dispatch(setSelectedCourseId(newPhase.course));
        const phasesResp = await apiClient.get(
          `/api/phases/course/${newPhase.course}`
        );
        setAvailablePhases(phasesResp.data?.data || []);
        setSuccessPopup({
          show: true,
          type: "phase",
          data: newPhase
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    }
  });
  const weeksFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      phase: phaseId || selectedPhase || "",
      weeks: [{ weekNumber: 1, title: "" }]
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // phase: Yup.string().required("Phase is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course || !values.phase) {
        showToast(`Please select a ${COURSE_NAME} and phase first`, "error");
        return;
      }
      setLoading(true);
      try {
        const weekPayloads = values.weeks.map((week) => ({
          ...week,
          course: values.course,
          phase: values.phase
        }));
        const responses = await Promise.all(
          weekPayloads.map((week) => apiClient.post("/api/weeks", [week]))
        );
        const newWeeks = responses.map(
          (res) => res.data?.data[0] || res.data || res
        );
        showToast("🎉 Module created successfully!", "success");
        resetForm();
        const weeksResp = await apiClient.get(
          `/api/weeks/course/${values.course}`
        );
        setAvailableWeeks(weeksResp.data?.data || []);
        setSuccessPopup({
          show: true,
          type: "weeks",
          data: newWeeks
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    }
  });
  const chapterFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      week: weekId || "",
      title: "",
      points: [{ title: "", description: "" }]
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // week: Yup.string().required("Week is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course || !values.week) {
        showToast(`Please select a ${COURSE_NAME} and module first`, "error");
        return;
      }
      setLoading(true);
      try {
        const payload = { ...values, course: values.course, week: values.week };
        const response = await apiClient.post("/api/chapters", [payload]);
        const newChapter = response.data?.data[0] || response.data || response;
        showToast("🎉 Course Content created successfully!", "success");
        resetForm();
        dispatch(setSelectedCourseId(values.course));
        const weeksResp = await apiClient.get(
          `/api/weeks/course/${values.course}`
        );
        setAvailableWeeks(weeksResp.data?.data || []);
        setSuccessPopup({
          show: true,
          type: "chapter",
          data: newChapter
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    }
  });
  const handleSuccessAction = (action) => {
    switch (successPopup.type) {
      case "phase":
        if (action === "addMore") {
          phaseFormik.resetForm();
        } else if (action === "proceed") {
          setStep(2);
        }
        break;
      case "weeks":
        if (action === "addMore") {
          weeksFormik.resetForm();
        } else if (action === "proceed") {
          setStep(3);
        }
        break;
      case "chapter":
        if (action === "addMore") {
          chapterFormik.resetForm();
        } else if (action === "done") {
          setStep(1);
          phaseFormik.resetForm();
          weeksFormik.resetForm();
          chapterFormik.resetForm();
          dispatch(clearSelectedCourseId());
        }
        break;
    }
    setSuccessPopup({ show: false, type: "", data: null });
  };
  const SuccessPopup = () => {
    if (!successPopup.show) return null;
    const getPopupConfig = () => {
      switch (successPopup.type) {
        case "phase":
          return {
            title: "Schedule Created Successfully! 🎉",
            buttons: [
              {
                label: "Add More Schedules",
                action: "addMore",
                variant: "secondary"
              },
              {
                label: "Proceed to Modules",
                action: "proceed",
                variant: "primary"
              }
            ]
          };
        case "weeks":
          return {
            title: "Module Created Successfully!",
            buttons: [
              {
                label: "Add More Module",
                action: "addMore",
                variant: "secondary"
              },
              {
                label: "Proceed to Course Contents",
                action: "proceed",
                variant: "primary"
              }
            ]
          };
        case "chapter":
          return {
            title: "Course Content Created Successfully! 📚",
            buttons: [
              {
                label: "Add New Course Content",
                action: "addMore",
                variant: "secondary"
              },
              { label: "Done", action: "done", variant: "primary" }
            ]
          };
        default:
          return { title: "", message: "", buttons: [] };
      }
    };
    const config = getPopupConfig();
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "✅" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-2", children: config.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: config.message })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: config.buttons.map((button, index) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleSuccessAction(button.action),
          className: `w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${button.variant === "primary" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
          children: button.label
        },
        index
      )) })
    ] }) });
  };
  const Toast = ({ message, type: type2, onClose }) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 animate-slide-in ${type2 === "success" ? "bg-green-500" : "bg-red-500"}`,
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
  return /* @__PURE__ */ jsx("div", { className: "max-h-fit bg-gradient-to-br from-blue-50 via-white to-purple-50 py-2", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-start mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4", children: "🎯 Curriculum Builder" }),
      /* @__PURE__ */ jsx("hr", {})
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-8 text-center shadow-2xl", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-semibold", children: "Processing..." })
    ] }) }),
    step === 1 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg p-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-gray-800 mb-6 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🏗️" }),
        "Create New Schedule"
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: phaseFormik.handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: [
            "Select ",
            COURSE_NAME,
            "*"
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "course",
              value: phaseFormik.values.course,
              onChange: (e) => {
                const courseId2 = e.target.value;
                phaseFormik.setFieldValue("course", courseId2);
                dispatch(setSelectedCourseId(courseId2));
              },
              onBlur: phaseFormik.handleBlur,
              className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
              children: [
                /* @__PURE__ */ jsxs("option", { value: "", children: [
                  "Choose a ",
                  COURSE_NAME
                ] }),
                availableCourses.map((course) => /* @__PURE__ */ jsx("option", { value: course._id, children: course.title }, course._id))
              ]
            }
          ),
          phaseFormik.touched.course && phaseFormik.errors.course && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: phaseFormik.errors.course })
        ] }),
        /* @__PURE__ */ jsx(
          InputField,
          {
            label: "Schedule Name*",
            name: "title",
            formik: phaseFormik
          }
        ),
        /* @__PURE__ */ jsx(
          TextAreaField,
          {
            label: "Description (optional)",
            name: "description",
            formik: phaseFormik,
            rows: 4
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 pt-4 w-50 justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50",
            children: loading ? "Saving..." : "🚀 Save Schedule"
          }
        ) })
      ] })
    ] }),
    step === 2 && /* @__PURE__ */ jsx(FormikProvider, { value: weeksFormik, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "📅" }),
        "Add Module for Schedules"
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: weeksFormik.handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Select Schedule*" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "phase",
              value: weeksFormik.values.phase,
              onChange: weeksFormik.handleChange,
              onBlur: weeksFormik.handleBlur,
              className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Schedule" }),
                availablePhases.map((phase) => /* @__PURE__ */ jsx("option", { value: phase._id, children: phase.title }, phase._id))
              ]
            }
          ),
          weeksFormik.touched.phase && weeksFormik.errors.phase && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: weeksFormik.errors.phase })
        ] }),
        /* @__PURE__ */ jsx(FieldArray, { name: "weeks", children: ({ push, remove }) => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: "Module Details" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => push({
                  weekNumber: weeksFormik.values.weeks.length + 1,
                  title: ""
                }),
                className: "bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all",
                children: "➕ Add Modules"
              }
            )
          ] }),
          weeksFormik.values.weeks.map((week, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "border-2 border-gray-200 rounded-xl p-4 bg-gray-50",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-28", children: /* @__PURE__ */ jsx(
                    InputField,
                    {
                      label: "Module Number*",
                      name: `weeks.${index}.weekNumber`,
                      type: "number",
                      formik: weeksFormik
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                    InputField,
                    {
                      label: "Module Title*",
                      name: `weeks.${index}.title`,
                      formik: weeksFormik,
                      placeholder: "e.g., JavaScript Fundamentals"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => remove(index),
                      disabled: weeksFormik.values.weeks.length === 1,
                      className: "text-red-500 hover:text-red-700 disabled:text-gray-400 mt-6",
                      children: "🗑️"
                    }
                  )
                ] }),
                weeksFormik.errors.weeks?.[index] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: Object.values(
                  weeksFormik.errors.weeks[index]
                ).join(", ") })
              ]
            },
            index
          ))
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-4 pt-4 w-50", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50",
            children: loading ? "Saving..." : "🚀 Save Modules"
          }
        ) })
      ] })
    ] }) }),
    step === 3 && /* @__PURE__ */ jsx(FormikProvider, { value: chapterFormik, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "📚" }),
        "Build Course Content"
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: chapterFormik.handleSubmit,
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Select Module*" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  name: "week",
                  value: chapterFormik.values.week,
                  onChange: chapterFormik.handleChange,
                  onBlur: chapterFormik.handleBlur,
                  className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Choose a Module" }),
                    availableWeeks.map((week) => /* @__PURE__ */ jsxs("option", { value: week._id, children: [
                      "Module ",
                      week.weekNumber,
                      ": ",
                      week.title
                    ] }, week._id))
                  ]
                }
              ),
              chapterFormik.touched.week && chapterFormik.errors.week && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: chapterFormik.errors.week })
            ] }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Course Content Title*",
                name: "title",
                formik: chapterFormik,
                placeholder: "e.g., Introduction to React Components"
              }
            ),
            /* @__PURE__ */ jsx(FieldArray, { name: "points", children: ({ push, remove }) => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700", children: "Learning Points" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => push({ title: "", description: "" }),
                    className: "bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all",
                    children: "➕ Add Point"
                  }
                )
              ] }),
              chapterFormik.values.points.map((point, index) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "border-2 border-gray-200 rounded-xl p-4 bg-gray-50",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
                        /* @__PURE__ */ jsx(
                          InputField,
                          {
                            label: "Point Title (optional)",
                            name: `points.${index}.title`,
                            formik: chapterFormik,
                            placeholder: "e.g., Understanding JSX"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          TextAreaField,
                          {
                            label: "Description (optional)",
                            name: `points.${index}.description`,
                            formik: chapterFormik,
                            rows: 4
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => remove(index),
                          disabled: chapterFormik.values.points.length === 1,
                          className: "text-red-500 hover:text-red-700 disabled:text-gray-400",
                          children: "🗑️"
                        }
                      )
                    ] }),
                    chapterFormik.errors.points?.[index] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: Object.values(
                      chapterFormik.errors.points[index]
                    ).join(", ") })
                  ]
                },
                index
              ))
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-4 pt-4 w-50", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50",
                children: loading ? "Saving..." : "🚀 Save Course Content"
              }
            ) })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(SuccessPopup, {}),
    toast && /* @__PURE__ */ jsx(
      Toast,
      {
        message: toast.message,
        type: toast.type,
        onClose: () => setToast(null)
      }
    )
  ] }) });
}
export {
  AddCurriculum as default
};
