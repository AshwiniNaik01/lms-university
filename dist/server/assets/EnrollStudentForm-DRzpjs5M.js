import { jsx, jsxs } from "react/jsx-runtime";
import { useFormik, FormikProvider } from "formik";
import { useState, useRef, useEffect } from "react";
import { FaUpload, FaEyeSlash, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { j as apiClient, e as canPerformAction, I as InputField, g as getAllCourses, C as COURSE_NAME, d as DIR } from "../entry-server.js";
import { M as MultiSelectDropdown } from "./MultiSelectDropdown-Cyo1WA1I.js";
import { u as usePassword } from "./usePassword-CcEJjiKI.js";
import "react-dom/server";
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
const EnrollStudentForm = () => {
  const { enrollmentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const fileInputRef = useRef(null);
  const { password, setPassword, generate } = usePassword();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error(`Error fetching ${COURSE_NAME}:`, error);
      }
    };
    fetchCourses();
  }, []);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNo: "",
      email: "",
      enrolledCourses: [],
      enrolledBatches: []
      //  password: "", // ✅ add password here
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required")
      // mobileNo: Yup.string()
      //   .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      //   .required("Mobile number is required"),
      // email: Yup.string().email("Invalid email").required("Email is required"),
      // designation: Yup.string().required("Designation is required"),
      // collegeName: Yup.string().required("College name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        values.password = password;
        values.enrolledBatches = [
          ...values.enrolledBatches,
          ...values.enrolledCourses
        ];
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === "enrolledCourses") {
            formData.append(key, values[key]);
          } else if (key === "enrolledBatches") {
            formData.append(key, values[key].join(","));
          } else if (key === "profilePhotoStudent") {
            if (values.profilePhotoStudent) {
              formData.append(
                "profilePhotoStudent",
                values.profilePhotoStudent
              );
            }
          } else {
            formData.append(key, values[key]);
          }
        });
        let res;
        if (enrollmentId) {
          res = await apiClient.put(
            `/api/enrollments/${enrollmentId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          res = await apiClient.post(
            `/api/enrollments/admin/enroll`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
        if (res.data.success) {
          Swal.fire("✅ Success", res.data.message, "success").then(() => {
            if (canPerformAction(rolePermissions, "enrollment", "read")) {
              navigate("/enrolled-student-list");
            }
          });
          resetForm();
          setFilteredBatches([]);
          setProfilePhotoPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          Swal.fire(
            "⚠️ Warning",
            res.data.message || "Operation failed",
            "warning"
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Warning",
          err.response?.data?.message || "Please Try Again!",
          "warning"
        );
      } finally {
        setLoading(false);
      }
    }
  });
  const isBusy = loading || formik.isSubmitting;
  useEffect(() => {
    if (!enrollmentId) return;
    const fetchEnrollment = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/enrollments/${enrollmentId}`);
        if (res.data.success && res.data.data) {
          const enrollment = res.data.data;
          formik.setValues({
            fullName: enrollment.fullName || "",
            mobileNo: enrollment.mobileNo || "",
            email: enrollment.email || "",
            designation: enrollment.designation || "",
            collegeName: enrollment.collegeName || "",
            // enrolledCourses: enrollment.enrolledCourses || [],
            // ✅ FIX HERE
            enrolledCourses: enrollment.enrolledCourses?.map((c) => c._id) || [],
            enrolledBatches: enrollment.enrolledBatches?.map((b) => b._id) || [],
            profilePhotoStudent: null
            // File input cannot be prefilled
          });
          if (enrollment.profilePhotoStudent) {
            setProfilePhotoPreview(
              DIR.STUDENT_PHOTO + enrollment.profilePhotoStudent
            );
          }
          const batchesFromCourses = enrollment.enrolledCourses.flatMap(
            (course) => {
              const foundCourse = courses.find((c) => c._id === course._id);
              return foundCourse?.batches || [];
            }
          );
          setFilteredBatches(batchesFromCourses);
          setFilteredBatches(batchesFromCourses);
        } else {
          Swal.fire(
            "⚠️ Warning",
            res.data.message || "Enrollment not found",
            "warning"
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "⚠️ Error",
          err.response?.data?.message || "Failed to fetch enrollment",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [enrollmentId, courses]);
  useEffect(() => {
    const selectedCourses = formik.values.enrolledCourses;
    if (selectedCourses.length > 0) {
      const allBatches = selectedCourses.flatMap((id) => {
        const course = courses.find((c) => c._id === id);
        return course?.batches || [];
      });
      const uniqueBatches = Array.from(
        new Map(allBatches.map((batch) => [batch._id, batch])).values()
      );
      setFilteredBatches(uniqueBatches);
    } else {
      setFilteredBatches([]);
    }
  }, [formik.values.enrolledCourses, courses]);
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-10 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center", children: enrollmentId ? "Update Enrollment" : "Enroll Participate" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Full Name*", name: "fullName", formik }),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Mobile Number (optional)",
              name: "mobileNo",
              type: "tel",
              formik
            }
          ),
          /* @__PURE__ */ jsx(InputField, { label: "Email*", name: "email", type: "email", formik }),
          /* @__PURE__ */ jsx(
            MultiSelectDropdown,
            {
              label: "Training Interested*",
              name: "enrolledCourses",
              options: courses,
              formik,
              getOptionValue: (option) => option._id,
              getOptionLabel: (option) => option.title
            }
          ),
          /* @__PURE__ */ jsx(
            MultiSelectDropdown,
            {
              label: "Select Batches*",
              name: "enrolledBatches",
              options: filteredBatches,
              formik,
              getOptionValue: (batch) => batch._id,
              getOptionLabel: (batch) => `${batch.batchName} (${batch.mode} - ${batch.status})`
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Designation (optional)",
              name: "designation",
              formik
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Organization Name (optional)",
              name: "collegeName",
              formik
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Profile Photo (optional)" }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "border border-gray-300 rounded-lg w-full px-4 py-2 mt-1 bg-white flex justify-between items-center cursor-pointer hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-blue-400",
                onClick: () => document.getElementById("profilePhotoInput").click(),
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-gray-800 truncate w-[90%]", children: formik.values.profilePhotoStudent ? formik.values.profilePhotoStudent.name : "Choose a file" }),
                  /* @__PURE__ */ jsx(FaUpload, { className: "text-gray-500" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "profilePhotoInput",
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => {
                  const file = e.target.files[0];
                  formik.setFieldValue("profilePhotoStudent", file);
                  if (file) {
                    setProfilePhotoPreview(URL.createObjectURL(file));
                  }
                }
              }
            ),
            formik.errors.profilePhotoStudent && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1 font-medium", children: formik.errors.profilePhotoStudent }),
            (formik.values.profilePhotoStudent || profilePhotoPreview) && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: formik.values.profilePhotoStudent ? URL.createObjectURL(formik.values.profilePhotoStudent) : profilePhotoPreview,
                  alt: "Profile Preview",
                  className: "w-20 h-20 rounded-lg object-cover border border-gray-300"
                }
              ),
              formik.values.profilePhotoStudent && /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: formik.values.profilePhotoStudent.name })
            ] })
          ] }),
          !enrollmentId && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password*" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: showPassword ? "text" : "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400",
                placeholder: "Password"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500",
                onClick: () => setShowPassword(!showPassword),
                children: showPassword ? /* @__PURE__ */ jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsx(FaEye, {})
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => generate(6),
                className: "mt-2 text-sm text-blue-600 hover:underline",
                children: "Generate Password"
              }
            ),
            formik.errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: formik.errors.password })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 flex flex-col md:flex-row md:justify-end items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isBusy,
              className: `w-full md:w-auto px-10 py-3 rounded-xl shadow-lg text-white font-semibold transition duration-300 ${isBusy ? "bg-gray-400 cursor-not-allowed" : "bg-[rgba(14,85,200,0.83)] hover:bg-[rgba(14,85,200,1)]"}`,
              children: isBusy ? enrollmentId ? "Updating..." : "Enrolling..." : enrollmentId ? "Update Enrollment" : "Add Participate"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: isBusy,
              onClick: () => navigate("/enrollments/upload-excel"),
              className: `w-full md:w-auto px-6 py-3 rounded-lg shadow transition font-semibold ${isBusy ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`,
              children: "Upload Participates via Excel/CSV"
            }
          )
        ] })
      ]
    }
  ) });
};
export {
  EnrollStudentForm as default
};
