import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { W as fetchCourses, I as InputField, T as TextAreaField, a as DynamicInputFields } from "../entry-server.js";
import { R as RadioButtonGroup } from "./RadioButtonGroup-BQF-groJ.js";
import { M as MultiSelectDropdown } from "./MultiSelectDropdown-Cyo1WA1I.js";
import { C as CustomDaysSelector } from "./CustomDaysSelector-DkabVVF4.js";
import { F as FileInput } from "./FileInput-Dlxa0ArB.js";
import { P as PDFUploadField } from "./PDFUploadField-CNV4w-Ms.js";
import { FaPhone, FaTransgender } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { u as updateTrainer, a as fetchTrainerById } from "./trainerApi-uqZoQf46.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "react-dom";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const TrainerProfile = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);
  useEffect(() => {
    dispatch(fetchCourses());
    const fetchTrainerData = async () => {
      setLoading(true);
      try {
        const trainerId = Cookies.get("trainerId");
        if (!trainerId) return;
        const data = await fetchTrainerById(trainerId);
        setInitialValues({
          fullName: data.fullName || "",
          email: data.email || "",
          mobileNo: data.mobileNo || "",
          dob: data.dob?.split("T")[0] || "",
          // Format date to YYYY-MM-DD
          gender: data.gender || "",
          title: data.title || "",
          summary: data.summary || "",
          certifications: data.certifications || [],
          achievements: data.achievements || [],
          highestQualification: data.highestQualification || "",
          collegeName: data.collegeName || "",
          totalExperience: data.totalExperience || "",
          courses: data.courses || [],
          password: "",
          // Password is optional and intentionally left blank
          availableTiming: data.availableTiming || "",
          customBatchDays: [],
          // Will be populated only if user selects "custom"
          linkedinProfile: data.linkedinProfile || "",
          resume: null,
          idProofTrainer: null,
          profilePhotoTrainer: null,
          address: {
            add1: data.address?.add1 || "",
            add2: data.address?.add2 || "",
            taluka: data.address?.taluka || "",
            dist: data.address?.dist || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || ""
          }
        });
      } catch (err) {
        console.error("❌ Error fetching trainer data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainerData();
  }, [dispatch]);
  const formik = useFormik({
    // Reinitializes the form when `initialValues` changes
    enableReinitialize: true,
    // Pre-filled values loaded from backend using useEffect
    initialValues: initialValues || {},
    // Yup Validations
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNo: Yup.string().required("Mobile number is required"),
      dob: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Trainer summary is required"),
      highestQualification: Yup.string().required("Qualification is required"),
      totalExperience: Yup.number().required("Experience is required"),
      courses: Yup.array().min(1, "Select at least one course"),
      password: Yup.string().min(6).nullable(),
      availableTiming: Yup.string().required("Select availability")
    }),
    // Form submission handler
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      const finalValues = { ...values };
      if (finalValues.availableTiming === "custom") {
        finalValues.availableTiming = (finalValues.customBatchDays || []).join(
          "-"
        );
      }
      delete finalValues.customBatchDays;
      for (let key in finalValues) {
        const value = finalValues[key];
        if (key === "address" && typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== void 0 && value !== null) {
          formData.append(key, value);
        }
      }
      try {
        const trainerId = getCookie("trainerId");
        if (!trainerId) throw new Error("Trainer ID not found");
        const res = await updateTrainer(trainerId, formData);
        alert("Trainer updated successfully!");
      } catch (err) {
        console.error("❌ Error updating trainer", err);
        alert("Error updating trainer");
      } finally {
        setSubmitting(false);
      }
    }
  });
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading trainer info..." });
  if (!initialValues)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-red-500", children: "Trainer data not found." });
  return /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto p-6 rounded-xl bg-gradient-to-r from-[#53b8ec] via-[#485dac] to-[#e9577c] shadow-xl my-6", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "w-full bg-gradient-to-r from-[#e3eff5] via-[#e5e9f6] to-[#f8e9ec] rounded-xl p-6 space-y-8",
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Personal Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { name: "fullName", label: "Full Name", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "title",
                label: "Title",
                type: "text",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "email",
                label: "Email",
                type: "email",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "mobileNo",
                label: "Mobile Number",
                formik,
                icon: /* @__PURE__ */ jsx(FaPhone, {})
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "dob",
                label: "Date of Birth",
                type: "date",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              TextAreaField,
              {
                name: "summary",
                label: "Trainer Summary",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              RadioButtonGroup,
              {
                name: "gender",
                label: "Gender",
                formik,
                options: [
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" }
                ],
                icon: /* @__PURE__ */ jsx(FaTransgender, {})
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Address" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "address.add1",
                label: "Address Line 1",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "address.add2",
                label: "Address Line 2",
                formik
              }
            ),
            /* @__PURE__ */ jsx(InputField, { name: "address.taluka", label: "Taluka", formik }),
            /* @__PURE__ */ jsx(InputField, { name: "address.dist", label: "District", formik }),
            /* @__PURE__ */ jsx(InputField, { name: "address.state", label: "State", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "address.pincode",
                label: "Pincode",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Education" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "highestQualification",
                label: "Highest Qualification",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "collegeName",
                label: "College Name",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Experience" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "totalExperience",
                label: "Total Experience (years)",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              MultiSelectDropdown,
              {
                name: "courses",
                label: "Subject Experience",
                options: courses,
                formik,
                multiple: true,
                getOptionValue: (option) => option._id,
                getOptionLabel: (option) => option.title
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Other Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                formik,
                name: "certifications",
                label: "Certification"
              }
            ),
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                formik,
                name: "achievements",
                label: "Achievements"
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "linkedinProfile",
                label: "LinkedIn Profile Link",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "password",
                label: "Password",
                type: "password",
                formik
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx(
                RadioButtonGroup,
                {
                  name: "availableTiming",
                  label: "Available Days",
                  options: [
                    { label: "Weekdays (Mon-Fri)", value: "weekdays(mon-fri)" },
                    { label: "Weekends (Sat-Sun)", value: "weekends(sat-sun)" },
                    { label: "Custom", value: "custom" }
                  ],
                  formik
                }
              ),
              formik.values.availableTiming === "custom" && /* @__PURE__ */ jsx(CustomDaysSelector, { name: "customBatchDays", formik })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Upload Documents" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(FileInput, { name: "idProofTrainer", label: "ID Proof", formik }),
            /* @__PURE__ */ jsx(
              FileInput,
              {
                name: "profilePhotoTrainer",
                label: "Profile Photo",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              PDFUploadField,
              {
                name: "resume",
                label: "Upload Resume (PDF)",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-end pt-6", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition",
            disabled: formik.isSubmitting,
            children: formik.isSubmitting ? "Updating..." : "Update Trainer"
          }
        ) })
      ]
    }
  ) });
};
export {
  TrainerProfile as default
};
