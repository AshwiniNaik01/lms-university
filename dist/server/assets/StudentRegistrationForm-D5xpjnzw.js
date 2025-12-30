import { jsxs, jsx } from "react/jsx-runtime";
import { useFormik } from "formik";
import pkg from "prelude-ls";
import { useEffect } from "react";
import { FaPhone, FaTransgender } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { W as fetchCourses, X as fetchBranches, j as apiClient, I as InputField, D as Dropdown } from "../entry-server.js";
import { F as FileInput } from "./FileInput-Dlxa0ArB.js";
import { M as MultiSelectDropdown } from "./MultiSelectDropdown-Cyo1WA1I.js";
import { R as RadioButtonGroup } from "./RadioButtonGroup-BQF-groJ.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
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
const CheckboxGroup = ({ label, name, options, formik }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target;
    const currentArray = formik.values[name] || [];
    if (checked) {
      formik.setFieldValue(name, [...currentArray, value]);
    } else {
      formik.setFieldValue(
        name,
        currentArray.filter((item) => item !== value)
      );
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-md p-6 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4", children: options.map((opt) => /* @__PURE__ */ jsxs(
        "label",
        {
          className: "flex items-center gap-2 bg-blue-50/2 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                name,
                value: opt.value,
                checked: (formik.values[name] || []).includes(opt.value),
                onChange: handleChange,
                className: "form-checkbox text-blue-600 h-4 w-4"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: opt.label })
          ]
        },
        opt.value
      )) }),
      formik.touched[name] && formik.errors[name] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: formik.errors[name] })
    ] })
  ] });
};
const { div } = pkg;
const StudentRegistrationForm = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);
  useSelector((state) => state.branches.data);
  const statusOptions = [
    { _id: "Studying", title: "Studying" },
    { _id: "Pursuing", title: "Pursuing" },
    { _id: "Working", title: "Working" },
    { _id: "Internship", title: "Internship" },
    { _id: "Completed", title: "Completed" },
    { _id: "Freelancing", title: "Freelancing" }
  ];
  const batchTimingOptions = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" }
  ];
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBranches());
  }, [dispatch]);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      mobileNo: "",
      dob: "",
      gender: "",
      address: {
        add1: "",
        add2: "",
        taluka: "",
        dist: "",
        state: "",
        pincode: ""
      },
      currentEducation: "",
      status: "",
      boardUniversityCollege: "",
      preferredBatchTiming: "",
      customBatchDays: [],
      preferredMode: "",
      password: "",
      // branch: "",
      enrolledCourses: [],
      idProofStudent: null,
      profilePhotoStudent: null
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      mobileNo: Yup.string().required("Required"),
      dob: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.object({
        add1: Yup.string().required("Required"),
        add2: Yup.string().required("Required"),
        taluka: Yup.string().required("Required"),
        dist: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        pincode: Yup.string().required("Required")
      }),
      currentEducation: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      boardUniversityCollege: Yup.string().required("Required"),
      // preferredBatchTiming: Yup.string().required("Required"),
      preferredMode: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      // branch: Yup.string().required("Required"),
      enrolledCourses: Yup.array().min(1, "Select at least one course"),
      idProofStudent: Yup.mixed().required("Required"),
      profilePhotoStudent: Yup.mixed().required("Required")
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      const finalValues = { ...values };
      for (let key in finalValues) {
        if (key === "address") {
          Object.entries(finalValues.address).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else if (Array.isArray(finalValues[key])) {
          finalValues[key].forEach((val) => formData.append(key, val));
        } else if (finalValues[key] instanceof File) {
          formData.append(key, finalValues[key]);
        } else {
          formData.append(key, finalValues[key]);
        }
      }
      try {
        const res = await apiClient.post("/api/student/register", formData);
        console.log("✅ Success:", res.data);
      } catch (err) {
        console.error("❌ Error submitting form", err);
      }
    }
  });
  const handleFileChange = (e, field) => {
    formik.setFieldValue(field, e.currentTarget.files[0]);
  };
  return /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto p-[4px] rounded-xl bg-gradient-to-r from-[#53b8ec] via-[#485dac] to-[#e9577c] shadow-xl my-6", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "w-full bg-gradient-to-r from-[#e3eff5] via-[#e5e9f6] to-[#f8e9ec]  rounded-xl p-6 space-y-8",
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Personal Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { name: "fullName", label: "Full Name", formik }),
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
                name: "dob",
                label: "Date of Birth",
                type: "date",
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
              RadioButtonGroup,
              {
                name: "gender",
                label: "Gender",
                formik,
                options: [
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" }
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
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Education Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "currentEducation",
                label: "Current Education",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                name: "status",
                label: "Status",
                options: statusOptions,
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                name: "boardUniversityCollege",
                label: "College/University Name",
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
            /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
              CheckboxGroup,
              {
                name: "preferredBatchTiming",
                label: "Preferred Batch Timing",
                options: batchTimingOptions,
                formik
              }
            ) }),
            /* @__PURE__ */ jsx(
              RadioButtonGroup,
              {
                name: "preferredMode",
                label: "Preferred Mode",
                formik,
                options: [
                  { label: "Online", value: "Online" },
                  { label: "Offline", value: "Offline" },
                  { label: "Hybrid", value: "Hybrid" }
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Enrollment" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: /* @__PURE__ */ jsx(
            MultiSelectDropdown,
            {
              name: "enrolledCourses",
              label: "Courses",
              options: courses,
              formik,
              multiple: true,
              getOptionValue: (option) => option._id,
              getOptionLabel: (option) => option.title
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-800 mb-4", children: "Documents" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              FileInput,
              {
                name: "idProofStudent",
                label: "ID Proof",
                formik,
                onChange: handleFileChange
              }
            ),
            /* @__PURE__ */ jsx(
              FileInput,
              {
                name: "profilePhotoStudent",
                label: "Profile Photo",
                formik,
                onChange: handleFileChange
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center pt-6", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3  cursor-pointer rounded-full font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition",
            children: "Submit"
          }
        ) })
      ]
    }
  ) });
};
export {
  StudentRegistrationForm as default
};
