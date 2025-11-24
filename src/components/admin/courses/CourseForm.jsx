import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  createCourse,
  fetchCourseById,
  updateCourse,
} from "../../../api/courses.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchAllTrainerProfiles } from "../../../pages/admin/trainer-management/trainerApi.js";
import { DIR } from "../../../utils/constants.js";
import Dropdown from "../../form/Dropdown.jsx";
import DynamicInputFields from "../../form/DynamicInputFields.jsx";
import InputField from "../../form/InputField.jsx";
import MultiSelectDropdown from "../../form/MultiSelectDropdown.jsx";
import TextAreaField from "../../form/TextAreaField.jsx";
import ToggleSwitch from "../../form/ToggleSwitch.jsx";
import { FaUpload } from "react-icons/fa";

const CourseForm = () => {
  const [editCourseData, setEditCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [trainers, setTrainers] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Initial Form Values
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
    fees: "",
    durationValue: "",
    durationUnit: "days",
    // trainer: "",
    trainer: [],
    startDate: "",
    endDate: "",
    cloudLabsLink: "",
    trainingPlan: null,
  };

  // Compute initial form values based on editCourseData
  const getInitialValues = () => {
    if (!editCourseData) return initialValues;

    // Extract number and unit from backend duration (e.g., "20 months" or "20days")
    const match = editCourseData.duration?.match(
      /^(\d+)\s*(days|months|years)$/i
    );
    const durationValue = match ? match[1] : "";
    const durationUnit = match ? match[2].toLowerCase() : "days";

    return {
      ...initialValues,
      ...editCourseData,
      durationValue,
      durationUnit,
      rating: editCourseData.rating || 0,
      enrolledCount: editCourseData.enrolledCount || 0,
      overview: editCourseData.overview || "",
      learningOutcomes: editCourseData.learningOutcomes?.length
        ? editCourseData.learningOutcomes
        : [""],
      benefits: editCourseData.benefits?.length
        ? editCourseData.benefits
        : [""],
      features: editCourseData.features || {
        certificate: false,
        codingExercises: false,
        recordedLectures: false,
      },
      isActive: editCourseData.isActive ?? true,
      keyFeatures: editCourseData.keyFeatures?.length
        ? editCourseData.keyFeatures
        : [
            {
              title: "",
              description: "",
              subPoints: [""],
            },
          ],
      instructor: editCourseData.instructor || "",
      fees: editCourseData.fees || "",
      trainer: Array.isArray(editCourseData?.trainer)
        ? editCourseData.trainer.map((t) => t._id)
        : [],

      cloudLabsLink: editCourseData.cloudLabsLink || "",
      trainingPlan: null,
      trainingPlanUrl: editCourseData.trainingPlan
        ? DIR.TRAINING_PLAN + editCourseData.trainingPlan.fileName
        : "",
      startDate: editCourseData.startDate || "",
      endDate: editCourseData.endDate || "",
    };
  };

  // Yup validation schema
  const CourseSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    rating: Yup.number().min(0).max(5).required("Rating is required"),
    enrolledCount: Yup.number().min(0).required("Enrolled count is required"),
    overview: Yup.string().required("Overview is required"),
    // learningOutcomes: Yup.array().of(Yup.string().required("Required")),
    // benefits: Yup.array().of(Yup.string().required("Required")),
    // features: Yup.object({
    //   certificate: Yup.boolean(),
    //   codingExercises: Yup.boolean(),
    //   recordedLectures: Yup.boolean(),
    // }),
    // keyFeatures: Yup.array().of(
    //   Yup.object({
    //     title: Yup.string().required("Title is required"),
    //     description: Yup.string(),
    //     subPoints: Yup.array().of(Yup.string().required("Sub-point required")),
    //   })
    // ),
    isActive: Yup.boolean(),
    // trainer: Yup.string().required("Trainer is required"),
    cloudLabsLink: Yup.string()
      .url("Must be a valid link")
      .required("Cloud Labs Link is required"),
    // trainingPlan: Yup.mixed()
    //   .required("Training plan file is required")
    //   .test("fileType", "Only PDF, DOCX, XLSX allowed", (value) => {
    //     if (!value) return false;
    //     const allowed = ["application/pdf",
    //                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    //     return allowed.includes(value.type);
    //   }),

    // instructor: Yup.string(),
    //     startDate: Yup.date().required("Start Date is required"),
    // endDate: Yup.date()
    //   .min(
    //     Yup.ref("startDate"),
    //     "End date cannot be earlier than start date"
    //   )
    //   .required("End Date is required"),
  });

  // Fetch all trainers
  useEffect(() => {
    const getTrainers = async () => {
      try {
        const trainerOptions = await fetchAllTrainerProfiles();
        setTrainers(trainerOptions);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingTrainers(false);
      }
    };

    getTrainers();
  }, []);

  // Fetch course data if editing
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        const courseData = await fetchCourseById(id); // use the API helper
        setEditCourseData(courseData);
      } catch (err) {
        setError("Failed to load training program for editing.");
        console.error("Error fetching training program:", err);
      }
    };

    fetchCourse();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append(
        "duration",
        `${values.durationValue} ${values.durationUnit}`
      );
      formData.append("rating", values.rating);
      formData.append("enrolledCount", values.enrolledCount);
      formData.append("overview", values.overview);
      formData.append("fees", values.fees);
      formData.append("cloudLabsLink", values.cloudLabsLink || "");
      formData.append("isActive", values.isActive);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);

      // Arrays of strings
      formData.append("keyFeatures", JSON.stringify(values.keyFeatures));
      formData.append("features", JSON.stringify(values.features));
      formData.append(
        "learningOutcomes",
        JSON.stringify(values.learningOutcomes)
      );
      formData.append("benefits", JSON.stringify(values.benefits));

      // File upload (trainingPlan)
      if (values.trainingPlan) {
        formData.append("trainingPlan", values.trainingPlan);
      }

      if (values.trainer) {
        formData.append("trainer", JSON.stringify(values.trainer));
      }

      // Call API
      if (id && editCourseData) {
        await updateCourse(id, formData);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Course updated successfully!",
        });
      } else {
        await createCourse(formData);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Training Program created successfully!",
        });
      }

      resetForm();
      navigate("/admin/manage-courses");
    } catch (err) {
      const errorMsg =
        err?.message || err?.response?.data?.message || "Operation failed.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
      });
      console.error("Error submitting Training Program:", err);
    }

    setIsLoading(false);
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-xl border-2 border-blue-700 border-opacity-80">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {id ? "Edit Training Program" : "Create New Training Program"}
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Sucsess Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-400 rounded-lg">
          {success}
        </div>
      )}

      {/* Formik Form */}
      <Formik
        enableReinitialize
        initialValues={getInitialValues()}
        validationSchema={CourseSchema}
        onSubmit={handleSubmit}
      >
        {(
          formik // ✅ Added formik parameter here
        ) => (
          <Form className="space-y-10">
            {/* ================= BASIC INFORMATION ================= */}
            <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <InputField label="Title" name="title" formik={formik} />

                <div className="grid grid-cols-2 gap-2">
                  {/* Duration Value */}
                  <InputField
                    label="Duration Value  "
                    name="durationValue"
                    type="number"
                    formik={formik}
                  />

                  {/* Duration Unit */}
                  <Dropdown
                    label="Duration Unit  "
                    name="durationUnit"
                    options={[
                      { _id: "days", title: "Days" },
                      { _id: "months", title: "Months" },
                      { _id: "years", title: "Years" },
                    ]}
                    formik={formik}
                  />
                </div>
              </div>

              {/* Description */}
              <TextAreaField
                label="Description"
                name="description"
                rows={4}
                formik={formik}
              />
            </section>

            {/* ================= TRAINING PROGRAM DETAILS ================= */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Training Program Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Rating */}
                <InputField
                  label="Rating  "
                  name="rating"
                  type="number"
                  formik={formik}
                />

                {/* Enrolled Count */}
                <InputField
                  label="Enrolled Count  "
                  name="enrolledCount"
                  type="number"
                  formik={formik}
                />

                {/* Fees */}
                <InputField
                  label="Fees ($)  "
                  name="fees"
                  type="number"
                  formik={formik}
                />

                {/* Start Date */}
                <InputField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  formik={formik}
                />

                {/* End Date */}
                <InputField
                  label="End Date"
                  name="endDate"
                  type="date"
                  formik={formik}
                />

                {/* Cloud Labs Link */}
                <InputField
                  label="Cloud Labs Link"
                  name="cloudLabsLink"
                  type="text"
                  formik={formik}
                />

                {/* Trainers Multi-Select */}
                <MultiSelectDropdown
                  label="Trainer"
                  name="trainer"
                  options={trainers}
                  formik={formik}
                  getOptionValue={(opt) => opt.value}
                  getOptionLabel={(opt) => opt.label}
                />

                {/* Training Plan File Upload */}
             <div className="mb-6">
  <label className="block text-sm font-semibold text-gray-800 mb-2">
    Training Plan (PDF / DOCX / XLSX)
  </label>

  <div className="relative w-full">
    <input
      type="file"
      name="trainingPlan"
      id="trainingPlan"
      accept=".pdf,.docx,.xlsx"
      onChange={(e) => formik.setFieldValue("trainingPlan", e.target.files[0])}
      className="absolute inset-0 opacity-0 cursor-pointer z-20"
    />

    <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
      <div className="flex items-center space-x-3">
        <FaUpload className="text-blue-600" />
        <span className="text-gray-700 font-medium truncate max-w-[300px]">
          {formik.values.trainingPlan
            ? formik.values.trainingPlan.name
            : "Choose a file..."}
        </span>
      </div>

      <span className="text-sm text-gray-500 hidden md:block">
        Max: 5MB
      </span>
    </div>
  </div>

  {/* Show existing file link (edit mode) */}
  {formik.values.trainingPlanUrl && !formik.values.trainingPlan && (
    <div className="mt-3">
      <a
        href={formik.values.trainingPlanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline font-medium"
      >
        View Existing Training Plan
      </a>
    </div>
  )}

  {/* Error Message */}
  {formik.touched.trainingPlan && formik.errors.trainingPlan && (
    <div className="text-red-500 text-sm font-medium mt-1">
      {formik.errors.trainingPlan}
    </div>
  )}
</div>


                {/* Active Toggle */}
                <div className="mt-6">
                  <Field name="isActive">
                    {({ field, form }) => (
                      <ToggleSwitch
                        label="Is this training program active"
                        name={field.name}
                        checked={field.value}
                        onChange={() =>
                          form.setFieldValue(field.name, !field.value)
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Overview */}
              <TextAreaField
                label="Overview"
                name="overview"
                rows={4}
                formik={formik}
              />
            </section>

            {/* ================= LEARNING OUTCOMES ================= */}
            <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Learning Outcomes
              </h3>

              <DynamicInputFields
                formik={formik}
                name="learningOutcomes"
                label="Learning Outcomes"
              />
            </section>

            {/* ================= BENEFITS ================= */}
            <section className="space-y-6 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Benefits
              </h3>

              <DynamicInputFields
                formik={formik}
                name="benefits"
                label="Benefits"
              />
            </section>

            {/* ================= FEATURES ================= */}
            <section className="space-y-6 bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                Features
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Certificate */}
                <label className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <Field
                    type="checkbox"
                    name="features.certificate"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-700">
                    Certificate
                  </span>
                </label>

                {/* Coding Exercises */}
                <label className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <Field
                    type="checkbox"
                    name="features.codingExercises"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-700">
                    Coding Exercises
                  </span>
                </label>

                {/* Recorded Lectures */}
                <label className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200">
                  <Field
                    type="checkbox"
                    name="features.recordedLectures"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-700">
                    Recorded Lectures
                  </span>
                </label>
              </div>
            </section>

            {/* ================= KEY FEATURES ================= */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Key Features
              </h3>

              <FieldArray name="keyFeatures">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {formik.values.keyFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-5 border border-blue-400 rounded-lg bg-white shadow-sm"
                      >
                        {/* Feature Header */}
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-blue-700">
                            Feature {idx + 1}
                          </h4>
                          <button
                            type="button"
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => remove(idx)}
                            disabled={formik.values.keyFeatures.length === 1}
                          >
                            Remove
                          </button>
                        </div>

                        {/* Feature Title */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <Field
                            name={`keyFeatures[${idx}].title`}
                            className="w-full px-3 py-2 border border-blue-400 rounded-md"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                // Add a new feature when pressing Enter on title
                                push({
                                  title: "",
                                  description: "",
                                  subPoints: [""],
                                });
                              }
                            }}
                          />
                          <ErrorMessage
                            name={`keyFeatures[${idx}].title`}
                            component="div"
                            className="text-xs text-red-500 mt-1"
                          />
                        </div>

                        {/* Feature Description */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <Field
                            as="textarea"
                            name={`keyFeatures[${idx}].description`}
                            rows="2"
                            className="w-full px-3 py-2 border border-blue-400 rounded-md"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                // Add a new feature when pressing Enter in description
                                push({
                                  title: "",
                                  description: "",
                                  subPoints: [""],
                                });
                              }
                            }}
                          />
                        </div>

                        {/* Sub Points */}
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
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          // Add new subpoint on Enter
                                          pushSP("");
                                        }
                                      }}
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

                    {/* Add New Key Feature Button */}
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

            {/* ================= SUBMIT BUTTON ================= */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={formik.isSubmitting || isLoading}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
              >
                {editCourseData
                  ? "Update Training Program"
                  : "Create Training Program"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CourseForm;
