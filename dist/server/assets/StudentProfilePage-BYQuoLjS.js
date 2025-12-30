import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { User, ImageIcon, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { g as getStudentById, b as updateStudentProfile } from "./profile-D_s45P6s.js";
import { Q as BASE_URL } from "../entry-server.js";
import "js-cookie";
import "react-dom/server";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "react-dom";
import "formik";
import "yup";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "react-hot-toast";
import "react-icons/fi";
const StudentProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    collegeName: "",
    selectedProgram: "",
    profilePhotoStudent: null
  });
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentById(id);
        if (res.success) {
          setStudent(res.data);
          setForm({
            fullName: res.data.fullName || "",
            email: res.data.email || "",
            collegeName: res.data.collegeName || "",
            selectedProgram: res.data.selectedProgram || "",
            profilePhotoStudent: null
          });
        }
      } catch (err) {
        console.error("Failed to fetch Participate", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, profilePhotoStudent: files[0] }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("collegeName", form.collegeName);
    formData.append("selectedProgram", form.selectedProgram);
    if (form.profilePhotoStudent) {
      formData.append("profilePhotoStudent", form.profilePhotoStudent);
    }
    try {
      const res = await updateStudentProfile(id, formData);
      if (res.success) {
        setStudent(res.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setForm((prev) => ({ ...prev, profilePhotoStudent: null }));
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "text-center mt-20", children: "Loading..." });
  if (!student) return /* @__PURE__ */ jsx("div", { className: "text-center mt-20", children: "Participate not found." });
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto my-10 p-6 rounded-xl space-y-8 bg-gradient-to-r from-[#9cc4d7] via-[#8f9fd6] to-[#d997a4] shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg p-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(User, { className: "w-6 h-6 text-blue-600" }),
        " Participate Profile"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsEditing(!isEditing),
          className: `px-4 py-2 rounded text-white shadow-md font-semibold ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"} transition`,
          children: isEditing ? "Cancel" : "Edit"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 flex flex-col items-center w-full md:w-1/3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800", children: [
          /* @__PURE__ */ jsx(ImageIcon, { className: "w-5 h-5 text-blue-500" }),
          " Profile Photo"
        ] }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: form.profilePhotoStudent ? URL.createObjectURL(form.profilePhotoStudent) : student.profilePhotoStudent ? `${BASE_URL}/uploads/student/student-profilephoto/${student.profilePhotoStudent}` : "https://tse4.mm.bing.net/th/id/OIP.s-AC9m7YziZg9lee5VvI-wHaF1?pid=Api&P=0&h=180",
            alt: "Profile",
            className: "w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md mb-4"
          }
        ),
        isEditing && /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            name: "profilePhotoStudent",
            accept: "image/*",
            onChange: handleFileChange,
            className: "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-2/3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2 text-blue-800 mb-4", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
          " Contact & Education Info"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Full Name",
              name: "fullName",
              value: form.fullName,
              onChange: handleInputChange
            }
          ),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Email",
              name: "email",
              value: form.email,
              onChange: handleInputChange
            }
          ),
          /* @__PURE__ */ jsx(ReadOnlyField, { label: "Mobile Number", value: student.mobileNo || "N/A" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ReadOnlyField, { label: "Full Name", value: student.fullName || "N/A" }),
          /* @__PURE__ */ jsx(ReadOnlyField, { label: "Email", value: student.email || "N/A" }),
          /* @__PURE__ */ jsx(ReadOnlyField, { label: "Mobile Number", value: student.mobileNo || "N/A" })
        ] }) })
      ] })
    ] }),
    isEditing && /* @__PURE__ */ jsx("div", { className: "text-end pt-4", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleUpdate,
        disabled: loading,
        className: "px-8 py-3 bg-green-600 hover:bg-green-700 border-2 border-black text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition",
        children: loading ? "Saving..." : "Save Changes"
      }
    ) })
  ] });
};
const ReadOnlyField = ({ label, value }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-600", children: label }),
  /* @__PURE__ */ jsx("div", { className: "mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 select-none", children: value })
] });
const InputField = ({ label, name, value, onChange }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("label", { htmlFor: name, className: "block text-sm font-medium text-gray-600", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      id: name,
      name,
      value,
      onChange,
      className: "mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full",
      type: "text"
    }
  )
] });
export {
  StudentProfilePage as default
};
