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



// import { useState } from "react";
// import CourseForm from "./courses/CourseForm";
// import CourseTable from "./courses/CourseTable";
// // import CourseTable from "./CourseTable";
// // import CourseForm from "./CourseForm";

// const CourseManagement = () => {
//   const [editCourse, setEditCourse] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0); // for forcing reload

//   const onEdit = (course) => {
//     setEditCourse(course);
//   };

//   const onSuccess = () => {
//     setEditCourse(null);
//     setRefreshKey((k) => k + 1); // to reload courses in table if needed
//   };

//   const onCancel = () => {
//     setEditCourse(null);
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       <CourseForm
//         key={editCourse?._id || "new"}
//         editCourseData={editCourse}
//         onSuccess={onSuccess}
//         onCancel={onCancel}
//       />

//       <CourseTable key={refreshKey} onEdit={onEdit} />
//     </div>
//   );
// };

// export default CourseManagement;
