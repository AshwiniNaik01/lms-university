import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi.js";
// import Select from "react-select"; // ✅ We'll use react-select for multi-select

const CourseForm = () => {
  const [editCourseData, setEditCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [trainers, setTrainers] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // 🟡 If present, we're editing

  const initialValues = {
    title: "",
    description: "",
    duration: "",
    rating: 0,
    enrolledCount: 0,
    overview: "",
    learningOutcomes: [""],
    benefits: [""],
    features: {
      certificate: false,
      codingExercises: false,
      recordedLectures: false,
    },
    isActive: true,
    keyFeatures: [
      {
        title: "",
        description: "",
        subPoints: [""],
      },
    ],
    // instructor: "",
    //    features: {

    //   certificate: false,

    //   codingExercises: false,

    //   recordedLectures: false,

    // },

    // fees: "",

    // trainer: [], // store trainer IDs

    // isActive: true,
  };

  const getInitialValues = () => {
    if (!editCourseData) return initialValues;
    return {
      ...initialValues,
      ...editCourseData,
      duration: editCourseData.duration || "",
      rating: editCourseData.rating || 0,
      enrolledCount: editCourseData.enrolledCount || 0,
      overview: editCourseData.overview || "",
      learningOutcomes: editCourseData.learningOutcomes || [""],
      benefits: editCourseData.benefits || [""],
      features: editCourseData.features || {
        certificate: false,
        codingExercises: false,
        recordedLectures: false,
      },
      isActive: editCourseData.isActive ?? true,
      keyFeatures:
        editCourseData.keyFeatures?.length > 0
          ? editCourseData.keyFeatures
          : [
              {
                title: "",
                description: "",
                subPoints: [""],
              },
            ],
      instructor: editCourseData.instructor || "",

      // trainer: editCourseData.trainer || [],
    };
  };

  const CourseSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.string().required("Duration is required"),
    rating: Yup.number().min(0).max(5).required("Rating is required"),
    enrolledCount: Yup.number().min(0).required("Enrolled count is required"),
    overview: Yup.string().required("Overview is required"),
    learningOutcomes: Yup.array().of(Yup.string().required("Required")),
    benefits: Yup.array().of(Yup.string().required("Required")),
    features: Yup.object({
      certificate: Yup.boolean(),
      codingExercises: Yup.boolean(),
      recordedLectures: Yup.boolean(),
    }),
    keyFeatures: Yup.array().of(
      Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string(),
        subPoints: Yup.array().of(Yup.string().required("Sub-point required")),
      })
    ),
    isActive: Yup.boolean(),
    instructor: Yup.string(),
    // fees: Yup.string().required("Fees are required"),
    // trainer: Yup.array().min(1, "Please select at least one trainer"),
  });

  // 🟢 Fetch Trainers

  useEffect(() => {
    const getTrainers = async () => {
      try {
        const data = await fetchAllTrainers();
        setTrainers(data);
      } catch (err) {
        console.error("Failed to fetch trainers:", err);
      }
    };
    getTrainers();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (id && editCourseData) {
        //     const payload = {

        // ...values,

        // trainer: values.trainer, // trainer IDs array

        // };
        // Update
        await apiClient.put(`/api/courses/${id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Course updated successfully!");
      } else {
        // Create
        await apiClient.post("/api/courses", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Course created successfully!");
      }

      resetForm();
      navigate("/admin/manage-courses"); // Redirect to course list
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Operation failed."
      );
    }

    setIsLoading(false);
    setSubmitting(false);
  };

  // 🟢 Fetch course if editing
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const res = await apiClient.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditCourseData(res.data.data);
      } catch (err) {
        setError("Failed to load course for editing.");
        console.error(err);
      }
    };

    fetchCourse();
  }, [id, token]);

  return (
  <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-xl border-2 border-blue-700 border-opacity-80">
    <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {id ? "Edit Course" : "Create New Course"}
      </h2>
      <button
        type="button"
        onClick={() => navigate("/admin/courses")}
        className="px-5 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition"
      >
        Cancel
      </button>
    </div>

    {error && (
      <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
        {error}
      </div>
    )}

    {success && (
      <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-400 rounded-lg">
        {success}
      </div>
    )}

    <Formik
      enableReinitialize
      initialValues={getInitialValues()}
      validationSchema={CourseSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form className="space-y-10">
          {/* BASIC INFO */}
          <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Field
                  name="title"
                  className="block w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <Field
                  name="duration"
                  className="block w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="description"
                rows="4"
                className="w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </section>

          {/* DETAILS */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Course Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="rating"
                  className="w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrolled Count <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="enrolledCount"
                  className="w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300"
                />
                <ErrorMessage
                  name="enrolledCount"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div className="flex items-center mt-6">
                <Field
                  type="checkbox"
                  name="isActive"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overview <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="overview"
                rows="4"
                className="w-full px-3 py-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-300"
              />
              <ErrorMessage
                name="overview"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </section>

          {/* LEARNING OUTCOMES */}
          <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Learning Outcomes
            </h3>
            <FieldArray name="learningOutcomes">
              {({ push, remove }) => (
                <div className="space-y-2">
                  {values.learningOutcomes.map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Field
                        name={`learningOutcomes[${idx}]`}
                        className="flex-1 px-3 py-2 border border-blue-400 rounded-md"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => remove(idx)}
                        disabled={values.learningOutcomes.length === 1}
                      >
                        -
                      </button>
                      {idx === values.learningOutcomes.length - 1 && (
                        <button
                          type="button"
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => push("")}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </section>

          {/* BENEFITS */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Benefits
            </h3>
            <FieldArray name="benefits">
              {({ push, remove }) => (
                <div className="space-y-2">
                  {values.benefits.map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Field
                        name={`benefits[${idx}]`}
                        className="flex-1 px-3 py-2 border border-blue-400 rounded-md"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => remove(idx)}
                        disabled={values.benefits.length === 1}
                      >
                        -
                      </button>
                      {idx === values.benefits.length - 1 && (
                        <button
                          type="button"
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => push("")}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </section>

          {/* FEATURES */}
          <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Features
            </h3>
            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center">
                <Field type="checkbox" name="features.certificate" />
                <span className="ml-2 text-gray-700">Certificate</span>
              </label>
              <label className="inline-flex items-center">
                <Field type="checkbox" name="features.codingExercises" />
                <span className="ml-2 text-gray-700">Coding Exercises</span>
              </label>
              <label className="inline-flex items-center">
                <Field type="checkbox" name="features.recordedLectures" />
                <span className="ml-2 text-gray-700">Recorded Lectures</span>
              </label>
            </div>
          </section>

          {/* KEY FEATURES */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Key Features
            </h3>
            <FieldArray name="keyFeatures">
              {({ push, remove }) => (
                <div className="space-y-6">
                  {values.keyFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-5 border border-blue-400 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-blue-700">
                          Feature {idx + 1}
                        </h4>
                        <button
                          type="button"
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => remove(idx)}
                          disabled={values.keyFeatures.length === 1}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <Field
                          name={`keyFeatures[${idx}].title`}
                          className="w-full px-3 py-2 border border-blue-400 rounded-md"
                        />
                        <ErrorMessage
                          name={`keyFeatures[${idx}].title`}
                          component="div"
                          className="text-xs text-red-500 mt-1"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          name={`keyFeatures[${idx}].description`}
                          rows="2"
                          className="w-full px-3 py-2 border border-blue-400 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-medium text-gray-700">
                          Sub Points
                        </label>
                        <FieldArray name={`keyFeatures[${idx}].subPoints`}>
                          {({ push: pushSP, remove: removeSP }) => (
                            <div className="space-y-2">
                              {feature.subPoints?.map((_, spIdx) => (
                                <div key={spIdx} className="flex gap-2">
                                  <Field
                                    name={`keyFeatures[${idx}].subPoints[${spIdx}]`}
                                    className="flex-1 px-3 py-2 border border-blue-400 rounded-md"
                                  />
                                  <button
                                    type="button"
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => removeSP(spIdx)}
                                    disabled={feature.subPoints.length === 1}
                                  >
                                    -
                                  </button>
                                  {spIdx === feature.subPoints.length - 1 && (
                                    <button
                                      type="button"
                                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                      onClick={() => pushSP("")}
                                    >
                                      +
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={() =>
                      push({
                        title: "",
                        description: "",
                        subPoints: [""],
                      })
                    }
                  >
                    Add Key Feature
                  </button>
                </div>
              )}
            </FieldArray>
          </section>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
            >
              {editCourseData ? "Update Course" : "Create Course"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

};

export default CourseForm;


