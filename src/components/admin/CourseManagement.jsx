import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCourse,
  deleteCourse,
  fetchCourses,
  updateCourse,
} from "../../api/courses.js";
// import { fetchBranches } from "../../api/branches.js";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import apiClient from "../../api/axiosConfig.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  // const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingCourseData, setEditingCourseData] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  const getCourseInitialValues = () => {
    if (!editingCourseData) return initialValues;

    return {
      ...initialValues, // fallbacks
      ...editingCourseData,
      duration: editingCourseData.duration || "",
      rating: editingCourseData.rating || 0,
      enrolledCount: editingCourseData.enrolledCount || 0,
      overview: editingCourseData.overview || "",
      learningOutcomes: editingCourseData.learningOutcomes || [""],
      benefits: editingCourseData.benefits || [""],
      features: editingCourseData.features || {
        certificate: false,
        codingExercises: false,
        recordedLectures: false,
      },
      isActive: editingCourseData.isActive ?? true,
      keyFeatures:
        editingCourseData.keyFeatures?.length > 0
          ? editingCourseData.keyFeatures
          : [
              {
                title: "",
                description: "",
                subPoints: [""],
              },
            ],
      branchId: editingCourseData.branch?._id || "",
      instructor: editingCourseData.instructor || "",
    };
  };

  const loadCoursesAndBranches = async () => {
    setIsLoading(true);
    setError("");
    try {
      const coursesData = await fetchCourses();
      // const branchesData = await fetchBranches();
      setCourses(coursesData || []);
      // setBranches(branchesData || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to load data."
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) loadCoursesAndBranches();
  }, [token]);

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

    // branchId: '',
    instructor: "",
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
        description: Yup.string().notRequired(),
        subPoints: Yup.array()
          .of(Yup.string().required("Sub-point required"))
          .notRequired(),
      })
    ),

    isActive: Yup.boolean(),
    // branchId: Yup.string().required('Branch is required'),
    instructor: Yup.string(),
  });

  const startEditing = async (course) => {
    setIsEditing(true);
    setEditId(course._id);
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get(`/api/courses/${course._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // setEditingCourseData(response.data);
      setEditingCourseData(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch course details.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-12">
          Course Management
        </h1>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-100 text-red-800 border border-red-400 rounded-lg shadow">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 bg-green-100 text-green-800 border border-green-400 rounded-lg shadow">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
              {isEditing ? "Edit Course" : "Create New Course"}
            </h2>

            <Formik
              enableReinitialize
              initialValues={
                isEditing && editingCourseData
                  ? getCourseInitialValues()
                  : initialValues
              }
              validationSchema={CourseSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setError("");
                setSuccess("");
                setIsLoading(true);
                try {
                  if (isEditing) {
                    await updateCourse(editId, values, token);
                    setSuccess("Course updated successfully!");
                  } else {
                    await createCourse(values, token);
                    setSuccess("Course created successfully!");
                  }
                  loadCoursesAndBranches();
                  resetForm();
                  setIsEditing(false);
                  setEditId(null);
                } catch (err) {
                  console.error(err);
                  setError(
                    err.response?.data?.message ||
                      err.message ||
                      "Operation failed."
                  );
                }
                setIsLoading(false);
                setSubmitting(false);
              }}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Field Layout Principles: using grid & spacing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="title"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="duration"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <ErrorMessage
                        name="duration"
                        component="div"
                        className="text-xs text-red-500 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="rating"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <ErrorMessage
                        name="enrolledCount"
                        component="div"
                        className="text-xs text-red-500 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overview <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="overview"
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="overview"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  {/* Learning Outcomes & Benefits with structured spacing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Learning Outcomes
                    </label>
                    <FieldArray name="learningOutcomes">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.learningOutcomes.map((_, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Field
                                name={`learningOutcomes[${idx}]`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder={`Outcome ${idx + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => remove(idx)}
                                disabled={values.learningOutcomes.length === 1}
                                className="px-3 bg-red-500 hover:bg-red-600 text-white rounded-md"
                              >
                                –
                              </button>
                              <button
                                type="button"
                                onClick={() => push("")}
                                className="px-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
                              >
                                +
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Benefits
                    </label>
                    <FieldArray name="benefits">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.benefits.map((_, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Field
                                name={`benefits[${idx}]`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder={`Benefit ${idx + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => remove(idx)}
                                disabled={values.benefits.length === 1}
                                className="px-3 bg-red-500 hover:bg-red-600 text-white rounded-md"
                              >
                                –
                              </button>
                              <button
                                type="button"
                                onClick={() => push("")}
                                className="px-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
                              >
                                +
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Features */}
                  <fieldset className="border border-gray-200 p-4 rounded-md">
                    <legend className="text-sm font-medium text-gray-700 mb-2">
                      Features
                    </legend>
                    <div className="flex flex-wrap gap-4">
                      {[
                        "certificate",
                        "codingExercises",
                        "recordedLectures",
                      ].map((feat) => (
                        <label key={feat} className="inline-flex items-center">
                          <Field
                            type="checkbox"
                            name={`features.${feat}`}
                            className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="ml-2 text-gray-700">
                            {feat.replace(/([A-Z])/g, " $1")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Key Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Features
                    </label>
                    <FieldArray name="keyFeatures">
                      {({ push, remove }) => (
                        <div className="space-y-6">
                          {/* {values.keyFeatures.map((feature, index) => ( */}
                          {(values.keyFeatures || []).map((feature, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 p-4 rounded-md bg-gray-50"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-md font-semibold text-indigo-600">
                                  Feature {index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  disabled={values.keyFeatures.length === 1}
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Title <span className="text-red-500">*</span>
                                </label>
                                <Field
                                  name={`keyFeatures[${index}].title`}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <ErrorMessage
                                  name={`keyFeatures[${index}].title`}
                                  component="div"
                                  className="text-xs text-red-500 mt-1"
                                />
                              </div>

                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <Field
                                  as="textarea"
                                  rows="2"
                                  name={`keyFeatures[${index}].description`}
                                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                              </div>

                              {/* SubPoints */}
                              <FieldArray
                                name={`keyFeatures[${index}].subPoints`}
                              >
                                {({ push: pushSub, remove: removeSub }) => (
                                  <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Sub Points
                                    </label>
                                    {feature.subPoints?.map((_, subIdx) => (
                                      <div
                                        key={subIdx}
                                        className="flex gap-2 items-center mt-1"
                                      >
                                        <Field
                                          name={`keyFeatures[${index}].subPoints[${subIdx}]`}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeSub(subIdx)}
                                          className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                          –
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => pushSub("")}
                                          className="text-green-500 hover:text-green-700 text-sm"
                                        >
                                          +
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                title: "",
                                description: "",
                                subPoints: [""],
                              })
                            }
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            + Add Feature
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Active */}
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="isActive"
                      className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </div>

                  {/* Branch */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
                    <Field as="select" name="branchId" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">-- Select Branch --</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="branchId" component="div" className="text-xs text-red-500 mt-1" />
                  </div> */}

                  {/* Instructor */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor (Optional)
                    </label>
                    <Field
                      name="instructor"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="instructor"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div> */}

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {isEditing
                        ? isSubmitting
                          ? "Updating..."
                          : "Update Course"
                        : isSubmitting
                        ? "Saving..."
                        : "Create Course"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditId(null);
                        }}
                        disabled={isSubmitting || isLoading}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Courses Table */}
          <div className="bg-white shadow-md rounded-lg p-6 overflow-auto max-h-[600px]">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Existing Courses
            </h2>
            {isLoading && courses.length === 0 && (
              <p className="text-gray-500">Loading courses...</p>
            )}
            {!isLoading && courses.length === 0 && (
              <p className="text-gray-500">No courses found.</p>
            )}

            {courses.length > 0 && (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Title
                    </th>
                    {/* <th className="p-3 text-left font-medium text-gray-700">
                      Branch
                    </th> */}
                    <th className="p-3 text-left font-medium text-gray-700">
                      Instructor
                    </th>
                    <th className="p-3 text-center font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="p-3">{course.title}</td>
                      {/* <td className="p-3">{course.branch?.name || "N/A"}</td> */}
                      <td className="p-3">{course.instructor || "N/A"}</td>
                      <td className="p-3 flex justify-center space-x-2">
                        <button
                          onClick={() => startEditing(course)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Edit
                        </button>
                        <button
                          //   onClick={() => {
                          //     if (window.confirm(`Delete "${course.title}"?`))
                          //       deleteCourse(course._id, token)
                          //         .then(() => {
                          //           loadCoursesAndBranches();
                          //           setSuccess("Course deleted.");
                          //         })
                          //         .catch((err) => setError(err.message));
                          //   }}
                          //   className="text-red-600 hover:text-red-800"
                          // >

                          onClick={() => {
                            if (
                              typeof window !== "undefined" &&
                              window.confirm(`Delete "${course.title}"?`)
                            ) {
                              deleteCourse(course._id, token)
                                .then(() => {
                                  loadCoursesAndBranches();
                                  setSuccess("Course deleted.");
                                })
                                .catch((err) => setError(err.message));
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/course/${course._id}/content`)
                          }
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;

// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
// import { Link, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import {
//   FiPlus,
//   FiTrash2,
//   FiEdit,
//   FiSettings,
//   FiBook,
//   FiCheckSquare,
//   FiAward,
//   FiVideo,
//   FiFileText,
//   FiX,
//   FiCheck,
//   FiArrowLeft
// } from "react-icons/fi";

// // Validation Schema
// const CourseSchema = Yup.object().shape({
//   title: Yup.string().required("Title is required"),
//   description: Yup.string().required("Description is required"),
//   duration: Yup.string().required("Duration is required"),
//   rating: Yup.number().min(0).max(5).required("Rating is required"),
//   enrolledCount: Yup.number().min(0).required("Enrolled count is required"),
//   overview: Yup.string().required("Overview is required"),
// });

// // Alert Component
// const Alert = ({ type, message, onClose }) => {
//   const bgColor = type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700";
//   const icon = type === "error" ? <FiX className="w-5 h-5" /> : <FiCheck className="w-5 h-5" />;

//   return (
//     <div className={`mb-6 p-4 border rounded-lg flex items-center justify-between ${bgColor}`}>
//       <div className="flex items-center">
//         <span className="mr-3">{icon}</span>
//         <span>{message}</span>
//       </div>
//       {onClose && (
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           <FiX className="w-5 h-5" />
//         </button>
//       )}
//     </div>
//   );
// };

// // Action Button Component
// const ActionButton = ({ icon, label, onClick, variant = "primary", disabled = false }) => {
//   const variants = {
//     primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
//     secondary: "bg-gray-500 hover:bg-gray-600 text-white",
//     danger: "bg-red-600 hover:bg-red-700 text-white",
//     success: "bg-green-600 hover:bg-green-700 text-white",
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//     >
//       {icon && <span className="mr-2">{icon}</span>}
//       {label}
//     </button>
//   );
// };

// // Course Management Component
// const CourseManagement = () => {
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [editingCourseData, setEditingCourseData] = useState(null);
//   const navigate = useNavigate();

//   // Initial values for the form
//   const initialValues = {
//     title: "",
//     description: "",
//     duration: "",
//     rating: 0,
//     enrolledCount: 0,
//     overview: "",
//     learningOutcomes: [""],
//     benefits: [""],
//     features: {
//       certificate: false,
//       codingExercises: false,
//       recordedLectures: false,
//     },
//     keyFeatures: [
//       {
//         title: "",
//         description: "",
//         subPoints: [""],
//       },
//     ],
//     isActive: true,
//   };

//   // Function to get initial values when editing
//   const getCourseInitialValues = () => {
//     if (!editingCourseData) return initialValues;

//     return {
//       title: editingCourseData.title || "",
//       description: editingCourseData.description || "",
//       duration: editingCourseData.duration || "",
//       rating: editingCourseData.rating || 0,
//       enrolledCount: editingCourseData.enrolledCount || 0,
//       overview: editingCourseData.overview || "",
//       learningOutcomes: editingCourseData.learningOutcomes || [""],
//       benefits: editingCourseData.benefits || [""],
//       features: {
//         certificate: editingCourseData.features?.certificate || false,
//         codingExercises: editingCourseData.features?.codingExercises || false,
//         recordedLectures: editingCourseData.features?.recordedLectures || false,
//       },
//       keyFeatures: editingCourseData.keyFeatures || [
//         {
//           title: "",
//           description: "",
//           subPoints: [""],
//         },
//       ],
//       isActive: editingCourseData.isActive !== undefined ? editingCourseData.isActive : true,
//     };
//   };

//   // Function to start editing a course
//   const startEditing = (course) => {
//     setEditingCourseData(course);
//     setIsEditing(true);
//     setEditId(course._id);
//   };

//   // Function to load courses (mock implementation)
//   const loadCoursesAndBranches = () => {
//     // This would typically be an API call
//     setIsLoading(true);
//     setTimeout(() => {
//       setCourses([
//         {
//           _id: "1",
//           title: "Web Development Fundamentals",
//           instructor: "John Doe",
//           duration: "8 weeks",
//           rating: 4.5,
//         },
//         {
//           _id: "2",
//           title: "Advanced React Patterns",
//           instructor: "Jane Smith",
//           duration: "6 weeks",
//           rating: 4.8,
//         },
//       ]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   // Mock API functions
//   const createCourse = async (values, token) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true, data: values });
//       }, 1000);
//     });
//   };

//   const updateCourse = async (id, values, token) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true, data: values });
//       }, 1000);
//     });
//   };

//   const deleteCourse = async (id, token) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true });
//       }, 1000);
//     });
//   };

//   // Load courses on component mount
//   useEffect(() => {
//     loadCoursesAndBranches();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <Link to="/admin/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
//             <FiArrowLeft className="mr-2" /> Back to Dashboard
//           </Link>
//           <h1 className="text-3xl font-bold text-indigo-800 mb-2">Course Management</h1>
//           <p className="text-gray-600">Create and manage your course offerings</p>
//         </div>

//         {/* Alert Messages */}
//         {error && <Alert type="error" message={error} onClose={() => setError("")} />}
//         {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center mb-6">
//               <div className="p-2 bg-indigo-100 rounded-lg mr-3">
//                 <FiBook className="w-6 h-6 text-indigo-600" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {isEditing ? "Edit Course" : "Create New Course"}
//               </h2>
//             </div>

//             <Formik
//               enableReinitialize
//               initialValues={isEditing && editingCourseData ? getCourseInitialValues() : initialValues}
//               validationSchema={CourseSchema}
//               onSubmit={async (values, { setSubmitting, resetForm }) => {
//                 setError("");
//                 setSuccess("");
//                 setIsLoading(true);
//                 try {
//                   if (isEditing) {
//                     await updateCourse(editId, values, "token");
//                     setSuccess("Course updated successfully!");
//                   } else {
//                     await createCourse(values, "token");
//                     setSuccess("Course created successfully!");
//                   }
//                   loadCoursesAndBranches();
//                   resetForm();
//                   setIsEditing(false);
//                   setEditId(null);
//                 } catch (err) {
//                   console.error(err);
//                   setError(
//                     err.response?.data?.message ||
//                       err.message ||
//                       "Operation failed."
//                   );
//                 }
//                 setIsLoading(false);
//                 setSubmitting(false);
//               }}
//             >
//               {({ values, isSubmitting }) => (
//                 <Form className="space-y-6">
//                   {/* Basic Information */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <Field
//                       name="title"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <ErrorMessage
//                       name="title"
//                       component="div"
//                       className="text-sm text-red-600 mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <Field
//                       as="textarea"
//                       name="description"
//                       rows="3"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="div"
//                       className="text-sm text-red-600 mt-1"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Duration <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         name="duration"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <ErrorMessage
//                         name="duration"
//                         component="div"
//                         className="text-sm text-red-600 mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Rating <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         type="number"
//                         name="rating"
//                         min="0"
//                         max="5"
//                         step="0.1"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <ErrorMessage
//                         name="rating"
//                         component="div"
//                         className="text-sm text-red-600 mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Enrolled Count <span className="text-red-500">*</span>
//                       </label>
//                       <Field
//                         type="number"
//                         name="enrolledCount"
//                         min="0"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <ErrorMessage
//                         name="enrolledCount"
//                         component="div"
//                         className="text-sm text-red-600 mt-1"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Overview <span className="text-red-500">*</span>
//                     </label>
//                     <Field
//                       as="textarea"
//                       name="overview"
//                       rows="3"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                     <ErrorMessage
//                       name="overview"
//                       component="div"
//                       className="text-sm text-red-600 mt-1"
//                     />
//                   </div>

//                   {/* Learning Outcomes */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Learning Outcomes
//                     </label>
//                     <FieldArray name="learningOutcomes">
//                       {({ push, remove }) => (
//                         <div className="space-y-3">
//                           {values.learningOutcomes.map((_, idx) => (
//                             <div key={idx} className="flex gap-2">
//                               <Field
//                                 name={`learningOutcomes[${idx}]`}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                 placeholder={`Learning outcome ${idx + 1}`}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => remove(idx)}
//                                 disabled={values.learningOutcomes.length === 1}
//                                 className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                               >
//                                 <FiTrash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           ))}
//                           <button
//                             type="button"
//                             onClick={() => push("")}
//                             className="flex items-center text-indigo-600 hover:text-indigo-800 mt-2"
//                           >
//                             <FiPlus className="w-4 h-4 mr-1" /> Add Outcome
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   </div>

//                   {/* Benefits */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Benefits
//                     </label>
//                     <FieldArray name="benefits">
//                       {({ push, remove }) => (
//                         <div className="space-y-3">
//                           {values.benefits.map((_, idx) => (
//                             <div key={idx} className="flex gap-2">
//                               <Field
//                                 name={`benefits[${idx}]`}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                 placeholder={`Benefit ${idx + 1}`}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => remove(idx)}
//                                 disabled={values.benefits.length === 1}
//                                 className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                               >
//                                 <FiTrash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           ))}
//                           <button
//                             type="button"
//                             onClick={() => push("")}
//                             className="flex items-center text-indigo-600 hover:text-indigo-800 mt-2"
//                           >
//                             <FiPlus className="w-4 h-4 mr-1" /> Add Benefit
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   </div>

//                   {/* Features */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Features
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {[
//                         { key: "certificate", label: "Certificate", icon: <FiAward className="w-4 h-4 mr-2" /> },
//                         { key: "codingExercises", label: "Coding Exercises", icon: <FiSettings className="w-4 h-4 mr-2" /> },
//                         { key: "recordedLectures", label: "Recorded Lectures", icon: <FiVideo className="w-4 h-4 mr-2" /> },
//                       ].map((feat) => (
//                         <label key={feat.key} className="flex items-center">
//                           <Field
//                             type="checkbox"
//                             name={`features.${feat.key}`}
//                             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
//                           />
//                           <span className="ml-2 text-gray-700 flex items-center">
//                             {feat.icon} {feat.label}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Key Features */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Key Features
//                     </label>
//                     <FieldArray name="keyFeatures">
//                       {({ push, remove }) => (
//                         <div className="space-y-4">
//                           {values.keyFeatures.map((feature, index) => (
//                             <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
//                               <div className="flex justify-between items-center mb-3">
//                                 <h4 className="text-md font-semibold text-indigo-600">
//                                   Feature {index + 1}
//                                 </h4>
//                                 <button
//                                   type="button"
//                                   onClick={() => remove(index)}
//                                   disabled={values.keyFeatures.length === 1}
//                                   className="text-red-500 hover:text-red-700 text-sm"
//                                 >
//                                   <FiTrash2 className="w-4 h-4" />
//                                 </button>
//                               </div>

//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Title <span className="text-red-500">*</span>
//                                 </label>
//                                 <Field
//                                   name={`keyFeatures[${index}].title`}
//                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                                 <ErrorMessage
//                                   name={`keyFeatures[${index}].title`}
//                                   component="div"
//                                   className="text-sm text-red-600 mt-1"
//                                 />
//                               </div>

//                               <div className="mb-3">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Description
//                                 </label>
//                                 <Field
//                                   as="textarea"
//                                   rows="2"
//                                   name={`keyFeatures[${index}].description`}
//                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                 />
//                               </div>

//                               {/* SubPoints */}
//                               <FieldArray name={`keyFeatures[${index}].subPoints`}>
//                                 {({ push: pushSub, remove: removeSub }) => (
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                       Sub Points
//                                     </label>
//                                     {feature.subPoints?.map((_, subIdx) => (
//                                       <div key={subIdx} className="flex gap-2 items-center mb-2">
//                                         <Field
//                                           name={`keyFeatures[${index}].subPoints[${subIdx}]`}
//                                           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                           placeholder={`Sub point ${subIdx + 1}`}
//                                         />
//                                         <button
//                                           type="button"
//                                           onClick={() => removeSub(subIdx)}
//                                           className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                                         >
//                                           <FiTrash2 className="w-4 h-4" />
//                                         </button>
//                                       </div>
//                                     ))}
//                                     <button
//                                       type="button"
//                                       onClick={() => pushSub("")}
//                                       className="flex items-center text-indigo-600 hover:text-indigo-800 mt-2"
//                                     >
//                                       <FiPlus className="w-4 h-4 mr-1" /> Add Sub Point
//                                     </button>
//                                   </div>
//                                 )}
//                               </FieldArray>
//                             </div>
//                           ))}
//                           <button
//                             type="button"
//                             onClick={() => push({ title: "", description: "", subPoints: [""] })}
//                             className="flex items-center text-indigo-600 hover:text-indigo-800"
//                           >
//                             <FiPlus className="w-4 h-4 mr-1" /> Add Key Feature
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   </div>

//                   {/* Active Status */}
//                   <div className="flex items-center">
//                     <Field
//                       type="checkbox"
//                       name="isActive"
//                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
//                     />
//                     <span className="ml-2 text-gray-700">Active Course</span>
//                   </div>

//                   {/* Form Actions */}
//                   <div className="flex flex-wrap gap-3 pt-4">
//                     <ActionButton
//                       icon={isEditing ? <FiEdit className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
//                       label={isEditing ? (isSubmitting ? "Updating..." : "Update Course") : (isSubmitting ? "Creating..." : "Create Course")}
//                       onClick={() => {}} // Handled by form submit
//                       type="submit"
//                       disabled={isSubmitting || isLoading}
//                     />
//                     {isEditing && (
//                       <ActionButton
//                         icon={<FiX className="w-4 h-4" />}
//                         label="Cancel"
//                         onClick={() => {
//                           setIsEditing(false);
//                           setEditId(null);
//                         }}
//                         variant="secondary"
//                         disabled={isSubmitting || isLoading}
//                       />
//                     )}
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>

//           {/* Courses List Section */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <div className="p-2 bg-indigo-100 rounded-lg mr-3">
//                   <FiBook className="w-6 h-6 text-indigo-600" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-800">Existing Courses</h2>
//               </div>
//               <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
//                 {courses.length} courses
//               </span>
//             </div>

//             {isLoading && courses.length === 0 && (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                 <p className="text-gray-500 mt-3">Loading courses...</p>
//               </div>
//             )}

//             {!isLoading && courses.length === 0 && (
//               <div className="text-center py-8">
//                 <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">No courses found.</p>
//                 <p className="text-gray-400 text-sm mt-1">Create your first course to get started.</p>
//               </div>
//             )}

//             {courses.length > 0 && (
//               <div className="overflow-hidden border border-gray-200 rounded-lg">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Course
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Instructor
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Duration
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Rating
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {courses.map((course) => (
//                       <tr key={course._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{course.title}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{course.instructor || "N/A"}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{course.duration}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <span className="text-sm text-gray-500 mr-1">{course.rating}</span>
//                             <div className="text-yellow-500">★</div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={() => startEditing(course)}
//                               className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                               title="Edit course"
//                             >
//                               <FiEdit className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
//                                   deleteCourse(course._id, "token")
//                                     .then(() => {
//                                       loadCoursesAndBranches();
//                                       setSuccess("Course deleted successfully.");
//                                     })
//                                     .catch((err) => setError(err.message));
//                                 }
//                               }}
//                               className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                               title="Delete course"
//                             >
//                               <FiTrash2 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => navigate(`/admin/course/${course._id}/content`)}
//                               className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                               title="Manage content"
//                             >
//                               <FiSettings className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseManagement;
