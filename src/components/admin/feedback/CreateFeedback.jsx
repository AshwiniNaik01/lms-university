import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import Dropdown from "../../form/Dropdown";
import DynamicInputFields from "../../form/DynamicInputFields";

export default function Create() {
  const navigate = useNavigate();
  const { feedbackId } = useParams();
  const [showPreview, setShowPreview] = useState(false);

  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get query params
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
      questions: [""],
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
          questions: values.questions.map((q) => ({ question: q })),
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
    },
  });

  // Fetch courses
  useEffect(() => {
    (async () => {
      try {
        const courses = await getAllCourses();
        console.log("DEBUG: Fetched courses:", courses);
        // setAvailableCourses(courses || []);
        // Remove duplicates by _id
        const uniqueCourses = Array.from(
          new Map((courses || []).map((c) => [c._id, c])).values()
        );
        setAvailableCourses(uniqueCourses);
      } catch (err) {
        console.error("DEBUG: Failed to fetch courses:", err);
      }
    })();
  }, []);

  // Fetch batches whenever courseId changes or prefill/edit scenario
  // Fetch batches whenever courseId changes (user selects a course)
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

        // Set batchId only if not already set
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

        // Set initial form values
        formik.setValues({
          title: fb.title || "",
          courseId,
          batchId: "", // temporarily blank; will set after batches load
          questions: fb.questions?.map((q) => q.question) || [""],
        });

        if (courseId) {
          const batchRes = await apiClient.get(
            `/api/batches/course/${courseId}`
          );

          const uniqueBatches = Array.from(
            new Map(
              batchRes.data.data.map((b) => [
                b._id,
                { ...b, name: b.batchName },
              ])
            ).values()
          );
          setAvailableBatches(uniqueBatches);

          // Set batchId after batches loaded
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
    return (
      <p className="text-center mt-10 text-lg font-semibold">Loading...</p>
    );

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-[rgba(14,85,200,0.83)]"
      >
        <div className="text-center mb-6">
          <input
            type="text"
            name="title"
            placeholder={
              feedbackId
                ? "Edit Feedback Form Title"
                : "Create Feedback Form Title"
            }
            value={formik.values.title}
            onChange={formik.handleChange}
            className="text-4xl font-bold text-blue-600 text-center w-full bg-transparent border-b-2 border-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dropdown
            label="Training Program"
            name="courseId"
            options={availableCourses}
            formik={formik}
            disabled={!!prefillCourseId} // disable if prefilled
          />
          <Dropdown
            label="Batch"
            name="batchId"
            options={availableBatches}
            formik={formik}
            disabled={!formik.values.courseId || !!prefillBatchId}
          />
        </div>

        <DynamicInputFields
          formik={formik}
          name="questions"
          label="Feedback Question"
        />

        <div className="text-center flex justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="bg-gray-600 text-white px-6 py-2 rounded-xl shadow hover:bg-gray-700 transition duration-300"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={loading} // replace with your form's submitting state
            className="bg-blue-600 text-white px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? feedbackId
                ? "Updating..."
                : "Submitting..."
              : feedbackId
              ? "Update Feedback"
              : "Submit Feedback"}
          </button>
        </div>

        {/* ----------------- Preview Modal ----------------- */}
        {showPreview && (
          // <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black/70 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          //   <div className="bg-gradient-to-br from-white to-blue-50 w-11/12 lg:w-4/5 xl:w-3/4 max-h-[80vh] overflow-y-auto rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-6 md:p-8 relative border border-blue-100">
          //     {/* Close button - Elegant */}

          <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/70 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
            <div className="bg-white w-full h-full overflow-y-auto p-6 md:p-8 relative">
              {/* Close button - Elegant */}
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10 border border-gray-200"
                aria-label="Close preview"
              >
                <span className="text-2xl font-light leading-none">×</span>
              </button>

              {/* Header with gradient */}
              <div className="text-center mb-10 pt-4">
                <div className="inline-block">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formik.values.title || "Feedback Form Preview"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Live Preview • All changes are reflected instantly
                  </p>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
                </div>
              </div>

              {/* Feedback Questions - Enhanced */}
              <div className="space-y-3 mb-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    ?
                  </span>
                  Feedback Questions ({formik.values.questions.length})
                </h3>

                {formik.values.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-5 shadow-lg border-3 border-sky-800 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          {q}
                        </p>
                      </div>
                    </div>

                    {/* Unique Rating Scale - Emoji Based */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Strongly Agree",
                          color: "from-emerald-400 to-emerald-500",
                          emoji: "😊",
                          bg: "bg-emerald-50",
                          text: "text-emerald-700",
                        },
                        {
                          label: "Agree",
                          color: "from-blue-400 to-blue-500",
                          emoji: "👍",
                          bg: "bg-blue-50",
                          text: "text-blue-700",
                        },
                        {
                          label: "Can't Say",
                          color: "from-amber-400 to-amber-500",
                          emoji: "😐",
                          bg: "bg-amber-50",
                          text: "text-amber-700",
                        },
                        {
                          label: "Disagree",
                          color: "from-red-400 to-red-500",
                          emoji: "👎",
                          bg: "bg-red-50",
                          text: "text-red-700",
                        },
                      ].map((option, oIdx) => (
                        <div
                          key={oIdx}
                          className={`${
                            option.bg
                          } rounded-xl p-2 border border-transparent hover:border-${
                            option.color.split("-")[1]
                          }-300 transition-all duration-300 transform hover:scale-[1.03] cursor-not-allowed`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-5 h-5 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}
                            >
                              {option.emoji}
                            </div>
                            <span className={`font-semibold ${option.text}`}>
                              {option.label}
                            </span>
                            <div className="mt-2 w-8 h-2 bg-gradient-to-r ${option.color} rounded-full opacity-60"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* NPS Question - Unique Design */}
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-xl border border-indigo-100">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Net Promoter Score
                    </h3>
                    <p className="text-gray-600">
                      Your honest feedback helps us improve
                    </p>
                  </div>
                </div>

                <p className="text-lg font-semibold text-gray-800 mb-8 mt-4">
                  How likely are you to recommend this learning program to your
                  colleagues?
                </p>

                {/* Unique NPS Scale - Gradient Colors */}
                <div className="relative">
                  {/* Scale background */}
                  <div className="h-3 bg-gradient-to-r from-rose-400 via-yellow-400 to-emerald-400 rounded-full mb-12"></div>

                  {/* Numbered scale with unique indicators */}
                  <div className="flex justify-between relative">
                    {[...Array(11).keys()].map((num) => {
                      let color = "bg-gray-300";
                      let textColor = "text-gray-600";

                      if (num <= 6) {
                        color = "bg-gradient-to-b from-rose-500 to-rose-600";
                        textColor = "text-red-600";
                      } else if (num <= 8) {
                        color =
                          "bg-gradient-to-b from-yellow-500 to-yellow-600";
                        textColor = "text-yellow-600";
                      } else {
                        color =
                          "bg-gradient-to-b from-emerald-500 to-emerald-600";
                        textColor = "text-emerald-600";
                      }

                      return (
                        <div
                          key={num}
                          className="flex flex-col items-center relative group"
                        >
                          {/* Connecting line */}
                          {num < 10 && (
                            <div className="absolute top-4 left-8 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                          )}

                          {/* Clickable circle */}
                          <div
                            className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl cursor-not-allowed relative z-10`}
                          >
                            {num}
                          </div>

                          {/* Label */}
                          <div className="text-center">
                            <span
                              className={`text-sm font-semibold ${textColor}`}
                            >
                              {num}
                            </span>
                            {num === 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Not likely
                              </div>
                            )}
                            {num === 5 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Neutral
                              </div>
                            )}
                            {num === 10 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Extremely likely
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="mt-12
 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 
             text-white font-bold rounded-lg shadow-md hover:shadow-xl 
             transition-all duration-300 hover:scale-105"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </FormikProvider>
  );
}
