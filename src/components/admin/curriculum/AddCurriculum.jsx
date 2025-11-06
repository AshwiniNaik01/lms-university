import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import {
  clearSelectedCourseId,
  setSelectedCourseId,
} from "../../../features/curriculumSlice";
import InputField from "../../form/InputField";
import TextAreaField from "../../form/TextAreaField";

export default function AddCurriculum() {
  const [searchParams] = useSearchParams(); // Get query parameters from the URL
  const courseId = searchParams.get("courseId"); // Course ID from URL
  const phaseId = searchParams.get("phaseId"); // Phase ID from URL
  const weekId = searchParams.get("weekId"); // Week ID from URL
  const [step, setStep] = useState(1); // Step in the multi-step form (1 = initial step)
  // Selected course ID from Redux store
  const selectedCourseId = useSelector(
    (state) => state.curriculum.selectedCourseId
  );

  // Available options for dropdowns
  const [availableCourses, setAvailableCourses] = useState([]); // Courses fetched from API
  const [selectedPhase, setSelectedPhase] = useState(""); // stores dropdown selection for currently selected phase
  const [availablePhases, setAvailablePhases] = useState([]); // Phases for selected course
  const [availableWeeks, setAvailableWeeks] = useState([]); // Weeks for selected phase
  // Redux dispatcher
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const [toast, setToast] = useState(null); // Toast notifications for success/error messages
  const [successPopup, setSuccessPopup] = useState({
    show: false, // Whether the popup is visible
    type: "", // Type of item created: "phase" | "week" | "chapter"
    data: null, // Data related to the created item
  });

  // Type of the current form based on URL query params
  const type = searchParams.get("type"); // "phase" | "week" | "chapter"

  // Helper function to extract a error message from backend responses
  const getBackendErrorMessage = (err) => {
    if (!err.response || !err.response.data)
      return err.message || "Please Try Again!";

    const data = err.response.data;
    return data.success || data.message || data.error || "Please Try Again!";
  };

  // Show a toast notification with a message and optional type ('success' by default)
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    // Automatically hide the toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  // Log which type of curriculum item is being added based on URL query params
  useEffect(() => {
    if (courseId) {
      console.log("Adding Topics for Course ID:", courseId);
    } else if (phaseId) {
      console.log("Adding Sub-Topics for Topic ID:", phaseId);
    } else if (weekId) {
      console.log("Adding Chapter for Sub-Topic ID:", weekId);
    }
  }, [courseId, phaseId, weekId]);

  // 🔹 Set the current step based on which ID is present in the URL
  // Step 1: courseId present → Step 1
  // Step 2: phaseId present → Step 2
  // Step 3: weekId present → Step 3
  useEffect(() => {
    if (courseId) setStep(1);
    else if (phaseId) setStep(2);
    else if (weekId) setStep(3);
  }, [courseId, phaseId, weekId]);

  // Fetch all courses for course dropdown
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

  // 🔹 Fetch phase details when only phaseId is present in the URL
  // This effect:
  // 1. Sets loading state while fetching
  // 2. Fetches the phase by ID
  // 3. Pre-fills the phase dropdown with the fetched phase
  // 4. Selects the phase in Formik and component state
  useEffect(() => {
    const fetchPhaseDetails = async () => {
      if (!phaseId) return;

      setLoading(true);
      try {
        // Fetch the phase by ID
        const phaseResp = await apiClient.get(`/api/phases/p1/${phaseId}`);
        const phaseData = phaseResp.data?.data || phaseResp.data;

        if (phaseData?._id) {
          // Pre-fill the dropdown with this phase
          setAvailablePhases([phaseData]); // dropdown has one option — this phase
          setSelectedPhase(phaseData._id); // mark it as selected
          weeksFormik.setFieldValue("phase", phaseData._id); // prefill Formik
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

  // 🔹 Fetch phases and weeks only when a courseId is present in the URL
  // Steps:
  // 1. Check if courseId exists
  // 2. Fetch phases belonging to that course
  // 3. Fetch weeks belonging to that course
  // 4. Update component state with fetched data
  useEffect(() => {
    if (!courseId) return;

    const fetchPhasesAndWeeks = async () => {
      setLoading(true);
      try {
        // Fetch phases for the selected course
        const phasesResp = await apiClient.get(`/api/phases/${courseId}`);
        setAvailablePhases(phasesResp.data?.data || []);

        // Fetch weeks for the selected course
        const weeksResp = await apiClient.get(`/api/weeks/course/${courseId}`);
        setAvailableWeeks(weeksResp.data?.data || []);
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPhasesAndWeeks();
  }, [courseId]);

  // 🔹 Set the selected phase in component state and Formik when phaseId is present
  // This ensures that the dropdown and Formik are pre-filled when editing or navigating via URL
  useEffect(() => {
    if (phaseId && availablePhases.length > 0) {
      const matchedPhase = availablePhases.find((p) => p._id === phaseId);
      if (matchedPhase) {
        setSelectedPhase(matchedPhase._id);
        weeksFormik.setFieldValue("phase", matchedPhase._id);
      }
    }
  }, [phaseId, availablePhases]);

  // 🔹 Clear the selected course ID from global state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSelectedCourseId());
    };
  }, [dispatch]);

  // 🔹 Keep Formik's "phase" field in sync with selectedPhase state
  useEffect(() => {
    weeksFormik.setFieldValue("phase", selectedPhase || "");
  }, [selectedPhase]);

  // Phase Form Handling
  const phaseFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // title: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course) {
        showToast("Please select a course first", "error");
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.post("/api/phases", [values]);
        const newPhase = response.data?.data[0];

        showToast("🎉 Topic created successfully!", "success");
        resetForm();

        dispatch(setSelectedCourseId(newPhase.course));

        const phasesResp = await apiClient.get(
          `/api/phases/${newPhase.course}`
        );
        setAvailablePhases(phasesResp.data?.data || []);

        setSuccessPopup({
          show: true,
          type: "phase",
          data: newPhase,
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // Week Form Handling
  const weeksFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      phase: phaseId || selectedPhase || "",
      weeks: [{ weekNumber: 1, title: "" }],
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // phase: Yup.string().required("Phase is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course || !values.phase) {
        showToast("Please select a course and phase first", "error");
        return;
      }

      setLoading(true);
      try {
        const weekPayloads = values.weeks.map((week) => ({
          ...week,
          course: values.course,
          phase: values.phase,
        }));

        const responses = await Promise.all(
          weekPayloads.map((week) => apiClient.post("/api/weeks", [week]))
        );

        const newWeeks = responses.map(
          (res) => res.data?.data[0] || res.data || res
        );

        showToast("🎉 Sub-Topic created successfully!", "success");
        resetForm();

        const weeksResp = await apiClient.get(
          `/api/weeks/course/${values.course}`
        );
        setAvailableWeeks(weeksResp.data?.data || []);

        setSuccessPopup({
          show: true,
          type: "weeks",
          data: newWeeks,
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // Chapter Form Handling
  const chapterFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      course: courseId || selectedCourseId || "",
      week: weekId || "",
      title: "",
      points: [{ title: "", description: "" }],
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Course is required"),
      // week: Yup.string().required("Week is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.course || !values.week) {
        showToast("Please select a course and week first", "error");
        return;
      }

      setLoading(true);
      try {
        const payload = { ...values, course: values.course, week: values.week };
        const response = await apiClient.post("/api/chapters", [payload]);
        const newChapter = response.data?.data[0] || response.data || response;

        showToast("🎉 Chapter created successfully!", "success");
        resetForm();

        dispatch(setSelectedCourseId(values.course));

        const weeksResp = await apiClient.get(
          `/api/weeks/course/${values.course}`
        );
        setAvailableWeeks(weeksResp.data?.data || []);

        setSuccessPopup({
          show: true,
          type: "chapter",
          data: newChapter,
        });
      } catch (err) {
        showToast("❌ " + getBackendErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle success popup actions
  const handleSuccessAction = (action) => {
    switch (successPopup.type) {
      case "phase":
        if (action === "addMore") {
          // Reset form and stay on same step
          phaseFormik.resetForm();
        } else if (action === "proceed") {
          // Move to next step (weeks)
          setStep(2);
        }
        break;

      case "weeks":
        if (action === "addMore") {
          // Reset form and stay on same step
          weeksFormik.resetForm();
        } else if (action === "proceed") {
          // Move to next step (chapters)
          setStep(3);
        }
        break;

      case "chapter":
        if (action === "addMore") {
          // Reset form and stay on same step
          chapterFormik.resetForm();
        } else if (action === "done") {
          // Reset everything and go back to step 1
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

  // Success Popup Component
  const SuccessPopup = () => {
    if (!successPopup.show) return null;

    const getPopupConfig = () => {
      switch (successPopup.type) {
        case "phase":
          return {
            title: "Topic Created Successfully! 🎉",
            buttons: [
              {
                label: "Add More Topics",
                action: "addMore",
                variant: "secondary",
              },
              {
                label: "Proceed to Sub-topics",
                action: "proceed",
                variant: "primary",
              },
            ],
          };
        case "weeks":
          return {
            title: "Sub-Topic Created Successfully!",
            buttons: [
              {
                label: "Add More Sub-Topic",
                action: "addMore",
                variant: "secondary",
              },
              {
                label: "Proceed to Chapters",
                action: "proceed",
                variant: "primary",
              },
            ],
          };
        case "chapter":
          return {
            title: "Chapter Created Successfully! 📚",
            buttons: [
              {
                label: "Add New Chapter",
                action: "addMore",
                variant: "secondary",
              },
              { label: "Done", action: "done", variant: "primary" },
            ],
          };
        default:
          return { title: "", message: "", buttons: [] };
      }
    };

    const config = getPopupConfig();

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
          {/* Close Button */}
          {/* <button
            onClick={() => dispatch({ type: "HIDE_SUCCESS_POPUP" })} // Replace with your close logic
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button> */}

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-600">{config.message}</p>
          </div>

          <div className="flex flex-col gap-3">
            {config.buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleSuccessAction(button.action)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  button.variant === "primary"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Toast Component
  const Toast = ({ message, type, onClose }) => (
    <div
      className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold z-50 flex items-center gap-3 animate-slide-in ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-2">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-start mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎯 Curriculum Builder
          </h1>
          <hr />
          {/* <p className="text-gray-600 text-lg">
            Build your course curriculum step by step
          </p> */}
        </div>

        {/* Progress Steps */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            {[
              { label: '1. Add Topic', value: 1, icon: '🏗️' },
              { label: '2. Add Sub-Topics', value: 2, icon: '📅' },
              { label: '3. Build Chapters', value: 3, icon: '📚' },
            ].map(({ label, value, icon }) => (
              <div key={value} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setStep(value)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    step === value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="hidden sm:block">{label}</span>
                </button>
                <div className={`w-full h-1 mt-3 rounded-full ${
                  step >= value ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold">Processing...</p>
            </div>
          </div>
        )}

        {/* Phase Form */}
        {step === 1  && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏗️</span>
                Create New Topic
              </h2>
              <form onSubmit={phaseFormik.handleSubmit} className="space-y-6">
                {/* Course Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select
                    name="course"
                    value={phaseFormik.values.course}
                    onChange={(e) => {
                      const courseId = e.target.value;

                      // Update Formik
                      phaseFormik.setFieldValue("course", courseId);

                      // Update Redux
                      dispatch(setSelectedCourseId(courseId));
                    }}
                    onBlur={phaseFormik.handleBlur}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Choose a Course</option>
                    {availableCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>

                  {phaseFormik.touched.course && phaseFormik.errors.course && (
                    <p className="text-red-500 text-sm mt-1">
                      {phaseFormik.errors.course}
                    </p>
                  )}
                </div>

                {/* Topic Name using InputField */}
                <InputField
                  label="Topic Name"
                  name="title"
                  formik={phaseFormik}
                />

                {/* Description using a TextAreaField */}
                <TextAreaField
                  label="Description"
                  name="description"
                  formik={phaseFormik}
                  rows={4}
                />

                <div className="flex gap-4 pt-4 w-50 justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "🚀 Add Topic"}
                  </button>
                </div>
              </form>
            </div>
          )}

        {/* Weeks Form */}
        {/* Weeks Form */}
        {step === 2 
          && (
            <FormikProvider value={weeksFormik}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">📅</span>
                  Add Sub-Topic for Topics
                </h2>
                <form onSubmit={weeksFormik.handleSubmit} className="space-y-6">
                  {/* Topic/Phase Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Topic
                    </label>
                    <select
                      name="phase"
                      value={weeksFormik.values.phase}
                      onChange={weeksFormik.handleChange}
                      onBlur={weeksFormik.handleBlur}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">Select Phase</option>
                      {availablePhases.map((phase) => (
                        <option key={phase._id} value={phase._id}>
                          {phase.title}
                        </option>
                      ))}
                    </select>

                    {weeksFormik.touched.phase && weeksFormik.errors.phase && (
                      <p className="text-red-500 text-sm mt-1">
                        {weeksFormik.errors.phase}
                      </p>
                    )}
                  </div>

                  {/* FieldArray for Weeks/Sub-Topics */}
                  <FieldArray name="weeks">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-semibold text-gray-700">
                            Sub-topic Details
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                weekNumber: weeksFormik.values.weeks.length + 1,
                                title: "",
                              })
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                          >
                            ➕ Add Sub-Topics
                          </button>
                        </div>

                        {weeksFormik.values.weeks.map((week, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                          >
                            <div className="flex gap-4 items-start">
                              <div className="flex-1">
                                <InputField
                                  label="Sub-Topic Number"
                                  name={`weeks.${index}.weekNumber`}
                                  type="number"
                                  formik={weeksFormik}
                                />
                              </div>
                              <div className="flex-1">
                                <InputField
                                  label="Week Title"
                                  name={`weeks.${index}.title`}
                                  formik={weeksFormik}
                                  placeholder="e.g., JavaScript Fundamentals"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                disabled={weeksFormik.values.weeks.length === 1}
                                className="text-red-500 hover:text-red-700 disabled:text-gray-400 mt-6"
                              >
                                🗑️
                              </button>
                            </div>

                            {weeksFormik.errors.weeks?.[index] && (
                              <p className="text-red-500 text-sm mt-2">
                                {Object.values(
                                  weeksFormik.errors.weeks[index]
                                ).join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "🚀 Add Sub-Topics"}
                    </button>
                  </div>
                </form>
              </div>
            </FormikProvider>
          )}

        {/* Chapter Form */}
        {step === 3          && (
            <FormikProvider value={chapterFormik}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">📚</span>
                  Build Chapter Content
                </h2>
                <form
                  onSubmit={chapterFormik.handleSubmit}
                  className="space-y-6"
                >
                  {/* Select Sub-topic */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Sub-topic
                    </label>
                    <select
                      name="week"
                      value={chapterFormik.values.week}
                      onChange={chapterFormik.handleChange}
                      onBlur={chapterFormik.handleBlur}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">Choose a Sub-topic</option>
                      {availableWeeks.map((week) => (
                        <option key={week._id} value={week._id}>
                          Week {week.weekNumber}: {week.title}
                        </option>
                      ))}
                    </select>
                    {chapterFormik.touched.week &&
                      chapterFormik.errors.week && (
                        <p className="text-red-500 text-sm mt-1">
                          {chapterFormik.errors.week}
                        </p>
                      )}
                  </div>

                  {/* Chapter Title */}
                  <InputField
                    label="Chapter Title"
                    name="title"
                    formik={chapterFormik}
                    placeholder="e.g., Introduction to React Components"
                  />

                  {/* FieldArray for Learning Points */}
                  <FieldArray name="points">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-semibold text-gray-700">
                            Learning Points
                          </label>
                          <button
                            type="button"
                            onClick={() => push({ title: "", description: "" })}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                          >
                            ➕ Add Point
                          </button>
                        </div>

                        {chapterFormik.values.points.map((point, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                          >
                            <div className="flex gap-4">
                              <div className="flex-1 space-y-3">
                                {/* Point Title */}
                                <InputField
                                  label="Point Title"
                                  name={`points.${index}.title`}
                                  formik={chapterFormik}
                                  placeholder="e.g., Understanding JSX"
                                />

                                {/* Point Description */}
                                <TextAreaField
                                  label="Description"
                                  name={`points.${index}.description`}
                                  formik={chapterFormik}
                                  rows={4}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => remove(index)}
                                disabled={
                                  chapterFormik.values.points.length === 1
                                }
                                className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                              >
                                🗑️
                              </button>
                            </div>

                            {chapterFormik.errors.points?.[index] && (
                              <p className="text-red-500 text-sm mt-2">
                                {Object.values(
                                  chapterFormik.errors.points[index]
                                ).join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500   text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "🚀 Create Chapter"}
                    </button>
                  </div>
                </form>
              </div>
            </FormikProvider>
          )}

        {/* Success Popup */}
        <SuccessPopup />

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
