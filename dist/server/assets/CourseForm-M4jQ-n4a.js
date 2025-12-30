import { jsxs, jsx } from "react/jsx-runtime";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { FaUpload, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { u as useAuth, C as COURSE_NAME, I as InputField, D as Dropdown, T as TextAreaField, a as DynamicInputFields, f as fetchCourseById, b as updateCourse, c as createCourse, d as DIR } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const CourseForm = () => {
  const [editCourseData, setEditCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addTrainingPlan, setAddTrainingPlan] = useState(
    editCourseData?.trainingPlan ? true : false
  );
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [trainers, setTrainers] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialValues = {
    title: "",
    description: "",
    duration: "",
    rating: 0,
    enrolledCount: 0,
    overview: "",
    learningOutcomes: [],
    benefits: [],
    features: {
      certificate: false,
      codingExercises: false,
      recordedLectures: false
    },
    // isActive: true,
    keyFeatures: [
      {
        title: "",
        description: "",
        subPoints: [""]
      }
    ],
    fees: "",
    durationValue: "",
    durationUnit: "days",
    // trainer: "",
    // trainer: [],
    // startDate: "",
    // endDate: "",
    // cloudLabsLink: "",
    trainingPlan: null
  };
  const getInitialValues = () => {
    if (!editCourseData) return initialValues;
    const match = editCourseData.duration?.match(
      /^(\d+)\s*(days|weeks|months|years)$/i
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
      learningOutcomes: editCourseData.learningOutcomes?.length ? editCourseData.learningOutcomes : [""],
      benefits: editCourseData.benefits?.length ? editCourseData.benefits : [""],
      features: editCourseData.features || {
        certificate: false,
        codingExercises: false,
        recordedLectures: false
      },
      // isActive: editCourseData.isActive ?? true,
      keyFeatures: editCourseData.keyFeatures?.length ? editCourseData.keyFeatures : [
        {
          title: "",
          description: "",
          subPoints: [""]
        }
      ],
      instructor: editCourseData.instructor || "",
      fees: editCourseData.fees || "",
      // trainer: Array.isArray(editCourseData?.trainer)
      //   ? editCourseData.trainer.map((t) => t._id)
      //   : [],
      // cloudLabsLink: editCourseData.cloudLabsLink || "",
      trainingPlan: null,
      trainingPlanUrl: editCourseData.trainingPlan ? DIR.TRAINING_PLAN + editCourseData.trainingPlan.fileName : ""
      // startDate: editCourseData.startDate || "",
      // endDate: editCourseData.endDate || "",
    };
  };
  const CourseSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required")
  });
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const courseData = await fetchCourseById(id);
        setEditCourseData(courseData);
      } catch (err) {
        setError(`Failed to load ${COURSE_NAME} for editing.`);
        console.error(`Error fetching ${COURSE_NAME}:`, err);
      }
    };
    fetchCourse();
  }, [id]);
  const cleanStringArray = (arr) => arr?.filter((item) => item && item.trim() !== "") || [];
  const cleanKeyFeatures = (features) => features?.map((kf) => {
    const cleanedSubPoints = kf.subPoints?.filter(
      (sp) => sp && sp.trim() !== ""
    );
    if (kf.title && kf.title.trim() !== "" || kf.description && kf.description.trim() !== "" || cleanedSubPoints && cleanedSubPoints.length) {
      return {
        title: kf.title || "",
        description: kf.description || "",
        subPoints: cleanedSubPoints || []
      };
    }
    return null;
  }).filter((kf) => kf !== null);
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const formData = new FormData();
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
      formData.append("keyFeatures", JSON.stringify(cleanKeyFeatures(values.keyFeatures)));
      formData.append(
        "learningOutcomes",
        JSON.stringify(cleanStringArray(values.learningOutcomes))
      );
      formData.append("benefits", JSON.stringify(cleanStringArray(values.benefits)));
      if (addTrainingPlan && values.trainingPlan) {
        formData.append("trainingPlan", values.trainingPlan);
      } else if (!addTrainingPlan) {
        formData.append("trainingPlan", "");
      }
      let response;
      const isEdit = id && editCourseData;
      if (isEdit) {
        response = await updateCourse(id, formData);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `${COURSE_NAME} updated successfully!`
        });
        navigate("/manage-courses");
      } else {
        response = await createCourse(formData);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: `${COURSE_NAME} created successfully!`
        });
        const courseId = response?.data?._id;
        const result = await Swal.fire({
          title: `${COURSE_NAME} created successfully! What would you like to do next?`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Add New ${COURSE_NAME}`,
          denyButtonText: "Show List",
          cancelButtonText: "Add Batch"
        });
        let action;
        if (result.isConfirmed) action = "ADD_NEW";
        else if (result.isDenied) action = "SHOW_LIST";
        else if (result.isDismissed) action = "ADD_BATCH";
        switch (action) {
          case "ADD_NEW":
            navigate("/add-courses");
            break;
          case "SHOW_LIST":
            navigate("/manage-courses");
            break;
          case "ADD_BATCH":
            if (courseId) navigate(`/add-batch?courseId=${courseId}`);
            break;
          default:
            console.log("No action taken");
        }
      }
      resetForm();
    } catch (err) {
      const errorMsg = err?.message || err?.response?.data?.message || "Operation failed.";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg
      });
      console.error(`Error submitting ${COURSE_NAME}:`, err);
    }
    setIsLoading(false);
    setSubmitting(false);
  };
  useEffect(() => {
    if (editCourseData?.trainingPlan) {
      setAddTrainingPlan(true);
    }
  }, [editCourseData]);
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-xl border-2 border-blue-700 border-opacity-80", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-8 border-b border-gray-200 pb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: id ? `Edit ${COURSE_NAME}` : `Create New ${COURSE_NAME}` }) }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg", children: error }),
    success && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-green-100 text-green-700 border border-green-400 rounded-lg", children: success }),
    /* @__PURE__ */ jsx(
      Formik,
      {
        enableReinitialize: true,
        initialValues: getInitialValues(),
        validationSchema: CourseSchema,
        onSubmit: handleSubmit,
        children: (formik) => /* @__PURE__ */ jsxs(Form, { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("section", { className: "space-y-6 bg-blue-50 p-6 rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Basic Information" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", formik }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsx(
                  InputField,
                  {
                    label: "Duration Value*",
                    name: "durationValue",
                    type: "number",
                    formik
                  }
                ),
                /* @__PURE__ */ jsx(
                  Dropdown,
                  {
                    label: "Duration Unit*",
                    name: "durationUnit",
                    options: [
                      { _id: "days", title: "Days" },
                      { _id: "weeks", title: "Weeks" },
                      { _id: "months", title: "Months" },
                      { _id: "years", title: "Years" }
                    ],
                    formik
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              TextAreaField,
              {
                label: "Description*",
                name: "description",
                rows: 4,
                formik
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: [
              COURSE_NAME,
              " Details"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Rating (optional)",
                  name: "rating",
                  type: "number",
                  formik
                }
              ),
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Enrolled Count (optional)",
                  name: "enrolledCount",
                  type: "number",
                  formik
                }
              ),
              /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Fees (optional)",
                  name: "fees",
                  type: "number",
                  formik
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: "Do you want to add a training plan?" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
                  /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "addTrainingPlan",
                        value: "yes",
                        checked: addTrainingPlan === true,
                        onChange: () => setAddTrainingPlan(true)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Yes" })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "addTrainingPlan",
                        value: "no",
                        checked: addTrainingPlan === false,
                        onChange: () => setAddTrainingPlan(false)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "No" })
                  ] })
                ] })
              ] }),
              addTrainingPlan && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: "Training Plan (PDF / DOCX / XLSX) (optional)" }),
                /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "file",
                      name: "trainingPlan",
                      id: "trainingPlan",
                      accept: ".pdf,.docx,.xlsx",
                      onChange: (e) => formik.setFieldValue("trainingPlan", e.target.files[0]),
                      className: "absolute inset-0 opacity-0 cursor-pointer z-20"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                      /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-600" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium truncate max-w-[300px]", children: formik.values.trainingPlan ? formik.values.trainingPlan.name : "Choose a file..." })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 hidden md:block", children: "Max: 5MB" })
                  ] })
                ] }),
                formik.values.trainingPlanUrl && !formik.values.trainingPlan && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: formik.values.trainingPlanUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-blue-600 underline font-medium",
                    children: "View Existing Training Plan"
                  }
                ) }),
                formik.touched.trainingPlan && formik.errors.trainingPlan && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-1", children: formik.errors.trainingPlan })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              TextAreaField,
              {
                label: "Overview (optional)",
                name: "overview",
                rows: 4,
                formik
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-6 bg-blue-50 p-6 rounded-lg", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Learning Outcomes" }),
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                formik,
                name: "learningOutcomes",
                label: "Learning Outcomes (optional)"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-6 bg-blue-50 p-6 rounded-lg", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: [
              "Benefits (Why Take This ",
              COURSE_NAME,
              "?)"
            ] }),
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                formik,
                name: "benefits",
                label: "Benefits (optional)"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Prerequisite" }),
            /* @__PURE__ */ jsx(FieldArray, { name: "keyFeatures", children: ({ push, remove }) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              formik.values.keyFeatures.map((feature, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-5 border border-blue-400 rounded-lg bg-white shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
                      /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-blue-700", children: [
                        "Prerequisite ",
                        idx + 1
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600",
                          onClick: () => remove(idx),
                          disabled: formik.values.keyFeatures.length === 1,
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title (optional)" }),
                      /* @__PURE__ */ jsx(
                        Field,
                        {
                          name: `keyFeatures[${idx}].title`,
                          className: "w-full px-3 py-2 border border-blue-400 rounded-md",
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              push({
                                title: "",
                                description: "",
                                subPoints: [""]
                              });
                            }
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        ErrorMessage,
                        {
                          name: `keyFeatures[${idx}].title`,
                          component: "div",
                          className: "text-xs text-red-500 mt-1"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description (optional)" }),
                      /* @__PURE__ */ jsx(
                        Field,
                        {
                          as: "textarea",
                          name: `keyFeatures[${idx}].description`,
                          rows: "2",
                          className: "w-full px-3 py-2 border border-blue-400 rounded-md",
                          onKeyDown: (e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              push({
                                title: "",
                                description: "",
                                subPoints: [""]
                              });
                            }
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block mb-1 font-medium text-gray-700", children: "Sub Points (optional)" }),
                      /* @__PURE__ */ jsx(FieldArray, { name: `keyFeatures[${idx}].subPoints`, children: ({ push: pushSP, remove: removeSP }) => /* @__PURE__ */ jsx("div", { className: "space-y-2", children: feature.subPoints?.map((_, spIdx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsx(
                          Field,
                          {
                            name: `keyFeatures[${idx}].subPoints[${spIdx}]`,
                            className: "flex-1 px-3 py-2 border border-blue-400 rounded-md",
                            onKeyDown: (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                pushSP("");
                              }
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600",
                            onClick: () => removeSP(spIdx),
                            disabled: feature.subPoints.length === 1,
                            children: /* @__PURE__ */ jsx(FaMinus, {})
                          }
                        ),
                        spIdx === feature.subPoints.length - 1 && /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600",
                            onClick: () => pushSP(""),
                            children: /* @__PURE__ */ jsx(FaPlus, {})
                          }
                        )
                      ] }, spIdx)) }) })
                    ] })
                  ]
                },
                idx
              )),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
                  onClick: () => push({
                    title: "",
                    description: "",
                    subPoints: [""]
                  }),
                  children: "Add Prerequisite"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-4 pt-6 border-t border-gray-200", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting || isLoading,
              className: "px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50",
              children: formik.isSubmitting || isLoading ? editCourseData ? "Updating..." : "Creating..." : editCourseData ? `Update ${COURSE_NAME}` : `Create ${COURSE_NAME}`
            }
          ) })
        ] })
      }
    )
  ] });
};
export {
  CourseForm as default
};
