import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaTransgender, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaLinkedin, FaCertificate, FaTrophy, FaCode, FaCalendar, FaFileAlt, FaUpload, FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import * as Yup from "yup";
import { C as CustomDaysSelector } from "./CustomDaysSelector-DkabVVF4.js";
import { a2 as fetchAllCourses, I as InputField, T as TextAreaField, a as DynamicInputFields, C as COURSE_NAME, d as DIR } from "../entry-server.js";
import { R as RadioButtonGroup } from "./RadioButtonGroup-BQF-groJ.js";
import Swal from "sweetalert2";
import { u as updateTrainer, r as registerTrainer, a as fetchTrainerById } from "./trainerApi-uqZoQf46.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
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
const TrainerRegistrationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: courses, loading: coursesLoading } = useSelector(
    (state) => state.allCourses
  );
  const [trainerData, setTrainerData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);
  useEffect(() => {
    if (!id) return;
    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const data = await fetchTrainerById(id);
        setTrainerData(data);
      } catch (err) {
        setFetchError("Error fetching trainer data");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [id]);
  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: {
    //   fullName: trainerData?.fullName || "",
    //   email: trainerData?.email || "",
    //   mobileNo: trainerData?.mobileNo || "",
    //   dob: trainerData?.dob ? trainerData.dob.split("T")[0] : "",
    //   gender: trainerData?.gender || "",
    //   title: trainerData?.title || "",
    //   summary: trainerData?.summary || "",
    //   certifications: trainerData?.certifications || [],
    //   achievements: trainerData?.achievements || [],
    //   highestQualification: trainerData?.highestQualification || "",
    //   collegeName: trainerData?.collegeName || "",
    //   totalExperience: trainerData?.totalExperience || "",
    //   courses: trainerData?.courses?.map((c) => c._id) || [],
    //   password: "",
    //   availableTiming: trainerData?.availableTiming || "",
    //   customBatchDays: trainerData?.customBatchDays || [],
    //   linkedinProfile: trainerData?.linkedinProfile || "",
    //   resume: null,
    //   idProofTrainer: null,
    //   profilePhotoTrainer: null,
    //   skills: trainerData?.skills || [""],
    //   address: {
    //     add1: trainerData?.address?.add1 || "",
    //     add2: trainerData?.address?.add2 || "",
    //     taluka: trainerData?.address?.taluka || "",
    //     dist: trainerData?.address?.dist || "",
    //     state: trainerData?.address?.state || "",
    //     pincode: trainerData?.address?.pincode || "",
    //   },
    // },
    initialValues: {
      fullName: trainerData?.fullName || "",
      email: trainerData?.email || "",
      mobileNo: trainerData?.mobileNo || "",
      dob: trainerData?.dob ? trainerData.dob.split("T")[0] : "",
      gender: trainerData?.gender || "",
      title: trainerData?.title || "",
      summary: trainerData?.summary || "",
      certifications: trainerData?.certifications || [],
      achievements: trainerData?.achievements || [],
      highestQualification: trainerData?.highestQualification || "",
      collegeName: trainerData?.collegeName || "",
      totalExperience: trainerData?.totalExperience || "",
      // courses: trainerData?.courses?.map((c) => c._id) || [],
      courses: trainerData?.courses ? Array.isArray(trainerData.courses) ? trainerData.courses.map((c) => c.title || c) : [trainerData.courses] : [""],
      // password: "", // always empty on edit
      password: !id ? "" : void 0,
      availableTiming: trainerData?.availableTiming?.includes(",") ? "custom" : trainerData?.availableTiming || "",
      customBatchDays: trainerData?.availableTiming?.includes(",") ? trainerData.availableTiming.split(",") : [],
      linkedinProfile: trainerData?.linkedinProfile || "",
      resume: trainerData?.resume && trainerData.resume !== "null" ? trainerData.resume : null,
      idProofTrainer: trainerData?.idProofTrainer && trainerData.idProofTrainer !== "null" ? trainerData.idProofTrainer : null,
      profilePhotoTrainer: trainerData?.profilePhotoTrainer && trainerData.profilePhotoTrainer !== "null" ? trainerData.profilePhotoTrainer : null,
      skills: trainerData?.skills || [""],
      address: {
        add1: trainerData?.address?.add1 || "",
        add2: trainerData?.address?.add2 || "",
        taluka: trainerData?.address?.taluka || "",
        dist: trainerData?.address?.dist || "",
        state: trainerData?.address?.state || "",
        pincode: trainerData?.address?.pincode || ""
      }
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: !id ? Yup.string().required("Password is required").min(4, "Password must be at least 4 characters") : Yup.string(),
      confirmPassword: !id ? Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm Password is required") : Yup.string()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      values.availableTiming === "custom" ? values.customBatchDays : values.availableTiming;
      for (let key in values) {
        let value = values[key];
        if (key === "availableTiming") {
          if (values.availableTiming === "custom") {
            value = values.customBatchDays.join(",");
          }
        }
        if (key === "address") {
          Object.entries(value).forEach(
            ([k, v]) => formData.append(`address[${k}]`, v)
          );
        } else if (Array.isArray(value) && key !== "availableTiming") {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (key === "password") {
          if (!id) formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
      try {
        if (id) {
          await updateTrainer(id, formData);
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Trainer updated successfully",
            timer: 2e3,
            showConfirmButton: false
          });
        } else {
          await registerTrainer(formData);
          Swal.fire({
            icon: "success",
            title: "Registered!",
            text: "Trainer registered successfully",
            timer: 2e3,
            showConfirmButton: false
          });
        }
        navigate(-1);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Error saving trainer"
        });
      } finally {
        setSubmitting(false);
      }
    }
  });
  if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading trainer data..." });
  if (fetchError) return /* @__PURE__ */ jsx("div", { className: "text-red-500", children: fetchError });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto my-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3", children: id ? "Update Trainer Profile" : "Register New Trainer" }),
      /* @__PURE__ */ jsx("div", { className: "w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-white to-blue-50 rounded-lg  border-4 border-sky-800 shadow-2xl  overflow-hidden", children: /* @__PURE__ */ jsxs("form", { onSubmit: formik.handleSubmit, className: "space-y-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaUser, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Personal Information" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Basic details about the trainer" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "fullName",
              label: "Full Name*",
              formik,
              icon: /* @__PURE__ */ jsx(FaUser, { className: "text-blue-500" }),
              placeholder: "Enter full name"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "title",
              label: "Professional Title*",
              type: "text",
              formik,
              placeholder: "e.g., Senior Developer, Data Scientist"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "email",
              label: "Email Address*",
              type: "email",
              formik,
              placeholder: "trainer@example.com"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "mobileNo",
              label: "Mobile Number*",
              formik,
              icon: /* @__PURE__ */ jsx(FaPhone, { className: "text-blue-500" }),
              placeholder: "+91 9876543210"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "dob",
              label: "Date of Birth (optional)",
              type: "date",
              formik
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2 lg:col-span-1", children: /* @__PURE__ */ jsx(
            RadioButtonGroup,
            {
              name: "gender",
              label: "Gender*",
              formik,
              options: [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" }
              ],
              icon: /* @__PURE__ */ jsx(FaTransgender, { className: "text-blue-500" })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
          TextAreaField,
          {
            name: "summary",
            label: "Professional Summary (optional)",
            formik,
            rows: 4,
            placeholder: "Brief summary about teaching experience and expertise..."
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-blue-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaMapMarkerAlt, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Address Information" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Current residential address" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "address.add1",
              label: "Address Line 1*",
              formik,
              placeholder: "Street address, P.O. Box"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "address.add2",
              label: "Address Line 2*",
              formik,
              placeholder: "Apartment, suite, unit, building, floor"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "address.taluka",
              label: "Taluka*",
              formik
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "address.dist",
              label: "District*",
              formik
            }
          ),
          /* @__PURE__ */ jsx(InputField, { name: "address.state", label: "State*", formik }),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "address.pincode",
              label: "Pincode*",
              formik
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-blue-100 bg-gradient-to-r from-purple-50 to-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaGraduationCap, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Education" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Academic qualifications" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsx(
          InputField,
          {
            name: "highestQualification",
            label: "Highest Qualification*",
            formik,
            placeholder: "e.g., M.Tech, B.E., Ph.D."
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-blue-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaBriefcase, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Professional Experience" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Training and industry experience" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-4", children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "totalExperience",
              label: "Total Experience (Years)*",
              formik,
              type: "number",
              min: "0",
              max: "50",
              step: "0.5",
              placeholder: "e.g., 5.5"
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              name: "linkedinProfile",
              label: "LinkedIn Profile Link (optional)",
              formik,
              icon: /* @__PURE__ */ jsx(FaLinkedin, { className: "text-blue-600" }),
              placeholder: "https://linkedin.com/in/username"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          DynamicInputFields,
          {
            formik,
            name: "courses",
            label: `${COURSE_NAME}s*`,
            placeholder: `Add ${COURSE_NAME} (e.g., React.js)`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8 border-b border-blue-100 bg-gradient-to-r from-emerald-50 to-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaCertificate, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Skills & Achievements" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Professional certifications and skills" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 mt-6", children: [
          /* @__PURE__ */ jsx(
            DynamicInputFields,
            {
              formik,
              name: "certifications",
              label: "Certifications (optional)",
              icon: /* @__PURE__ */ jsx(FaCertificate, { className: "text-emerald-500" }),
              placeholder: "Add certification (e.g., AWS Certified)"
            }
          ),
          /* @__PURE__ */ jsx(
            DynamicInputFields,
            {
              formik,
              name: "achievements",
              label: "Achievements (optional)",
              icon: /* @__PURE__ */ jsx(FaTrophy, { className: "text-amber-500" }),
              placeholder: "Add achievement (e.g., Best Trainer Award 2023)"
            }
          ),
          /* @__PURE__ */ jsx(
            DynamicInputFields,
            {
              formik,
              name: "skills",
              label: "Technical Skills (optional)",
              icon: /* @__PURE__ */ jsx(FaCode, { className: "text-blue-500" }),
              placeholder: "Add skill (e.g., React, Python, ML)"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx(FaCalendar, { className: "text-blue-500 text-xl" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Availability Schedule" })
            ] }),
            /* @__PURE__ */ jsx(
              RadioButtonGroup,
              {
                name: "availableTiming",
                label: "Preferred Training Days*",
                options: [
                  {
                    label: "Weekdays (Mon-Fri)",
                    value: "weekdays(mon-fri)"
                  },
                  {
                    label: "Weekends (Sat-Sun)",
                    value: "weekends(sat-sun)"
                  },
                  { label: "Custom Schedule", value: "custom" }
                ],
                formik
              }
            ),
            formik.values.availableTiming === "custom" && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-white rounded-lg border border-blue-100", children: /* @__PURE__ */ jsx(
              CustomDaysSelector,
              {
                name: "customBatchDays",
                formik
              }
            ) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(FaFileAlt, { className: "text-white text-xl" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Document Upload" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Upload required documents (Max 5MB each)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white to-red-50 rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaFileAlt, { className: "text-red-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "ID Proof*" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Aadhar, PAN, Passport, etc." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  name: "idProofTrainer",
                  accept: "application/pdf,image/*",
                  onChange: (e) => formik.setFieldValue(
                    "idProofTrainer",
                    e.currentTarget.files[0]
                  ),
                  className: "absolute inset-0 opacity-0 cursor-pointer z-20"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-red-300 bg-white px-4 py-6 rounded-lg hover:border-red-400 transition-all duration-300 text-center", children: [
                /* @__PURE__ */ jsx(FaUpload, { className: "text-red-500 text-2xl mx-auto mb-3" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium mb-1", children: formik.values.idProofTrainer ? formik.values.idProofTrainer.name : "Click to upload" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "PDF, JPG, PNG (Max 5MB)" })
              ] })
            ] }),
            trainerData?.idProofTrainer && !(formik.values.idProofTrainer instanceof File) && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `${DIR.ID_PROOF_TRAINER}${trainerData.idProofTrainer}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm",
                children: [
                  /* @__PURE__ */ jsx(FaFileAlt, {}),
                  " View Existing ID Proof"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white to-blue-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaFileAlt, { className: "text-blue-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Resume (PDF)*" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Professional resume" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  name: "resume",
                  accept: "application/pdf",
                  onChange: (e) => formik.setFieldValue("resume", e.currentTarget.files[0]),
                  className: "absolute inset-0 opacity-0 cursor-pointer z-20"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-blue-300 bg-white px-4 py-6 rounded-lg hover:border-blue-400 transition-all duration-300 text-center", children: [
                /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-500 text-2xl mx-auto mb-3" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium mb-1", children: formik.values.resume ? formik.values.resume.name : "Click to upload" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "PDF only (Max 5MB)" })
              ] })
            ] }),
            trainerData?.resume && !(formik.values.resume instanceof File) && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `${DIR.TRAINER_RESUME}${trainerData.resume}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm",
                children: [
                  /* @__PURE__ */ jsx(FaFileAlt, {}),
                  " View Existing Resume"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white to-purple-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FaUser, { className: "text-purple-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-800", children: "Profile Photo (optional)" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Professional headshot" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  name: "profilePhotoTrainer",
                  accept: "image/*",
                  onChange: (e) => formik.setFieldValue(
                    "profilePhotoTrainer",
                    e.currentTarget.files[0]
                  ),
                  className: "absolute inset-0 opacity-0 cursor-pointer z-20"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-purple-300 bg-white px-4 py-6 rounded-lg hover:border-purple-400 transition-all duration-300 text-center", children: [
                /* @__PURE__ */ jsx(FaUpload, { className: "text-purple-500 text-2xl mx-auto mb-3" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium mb-1", children: formik.values.profilePhotoTrainer ? formik.values.profilePhotoTrainer.name : "Click to upload" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "JPG, PNG (Max 5MB)" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-4", children: formik.values.profilePhotoTrainer instanceof File ? /* @__PURE__ */ jsx(
              "img",
              {
                src: URL.createObjectURL(
                  formik.values.profilePhotoTrainer
                ),
                alt: "Preview",
                className: "w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              }
            ) : trainerData?.profilePhotoTrainer && trainerData.profilePhotoTrainer !== "null" ? /* @__PURE__ */ jsx(
              "img",
              {
                src: `${DIR.TRAINER_PROFILE_PHOTO}${trainerData.profilePhotoTrainer}`,
                alt: "Profile",
                className: "w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg", children: /* @__PURE__ */ jsx(FaUser, { className: "text-purple-400 text-3xl" }) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mx-5", children: !id && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              name: "password",
              placeholder: "Create a secure password",
              value: formik.values.password,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
              className: "w-full border border-blue-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2",
              onClick: () => setShowPassword(!showPassword),
              children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
            }
          ),
          formik.touched.password && formik.errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: formik.errors.password })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm Password*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showConfirmPassword ? "text" : "password",
              name: "confirmPassword",
              placeholder: "Re-enter your password",
              value: formik.values.confirmPassword,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
              className: "w-full border border-blue-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2",
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              children: showConfirmPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
            }
          ),
          formik.touched.confirmPassword && formik.errors.confirmPassword && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: formik.errors.confirmPassword })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "p-8 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800", children: id ? "Update Trainer Profile" : "Register Trainer" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: id ? "Review and update the trainer information" : "Complete the registration to add new trainer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => window.history.back(),
              className: "px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting,
              className: "px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
              children: formik.isSubmitting ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                id ? "Updating..." : "Registering..."
              ] }) : id ? "Update Trainer" : "Register Trainer"
            }
          )
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" })
  ] });
};
export {
  TrainerRegistrationForm as default
};
