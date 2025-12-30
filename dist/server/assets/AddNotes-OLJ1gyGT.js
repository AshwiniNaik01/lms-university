import { jsx, jsxs } from "react/jsx-runtime";
import { useFormik, FormikProvider } from "formik";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { e as canPerformAction, I as InputField, D as Dropdown, C as COURSE_NAME, d as DIR, T as TextAreaField, g as getAllCourses, j as apiClient } from "../entry-server.js";
import { u as updateNote, c as createNote, f as fetchNoteById } from "./notes-CrravVGs.js";
import { FaUpload } from "react-icons/fa";
import { u as useCourseParam } from "./useCourseParam-D0IDp8wz.js";
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
function AddNotes() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(availableCourses);
  const { rolePermissions } = useSelector((state) => state.permissions);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCourses();
        setAvailableCourses(courses);
      } catch (err) {
        console.error(`Failed to load ${COURSE_NAME}:`, err);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    if (selectedCourseFromParam && availableCourses.length > 0) {
      setSelectedCourse(selectedCourseFromParam);
      formik.setFieldValue("course", selectedCourseFromParam);
    }
  }, [selectedCourseFromParam, availableCourses]);
  const formik = useFormik({
    initialValues: {
      course: "",
      chapter: "",
      title: "",
      content: "",
      type: "",
      file: null,
      batches: ""
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Training Program is required"),
      // chapter: Yup.string().required("Chapter is required"),
      // title: Yup.string().required("Title is required"),
      // content: Yup.string().required("Content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (!value) return;
          if (key === "batches") {
            formData.append("batches", value);
          } else {
            formData.append(key, value);
          }
        });
        if (noteId) {
          await updateNote(noteId, formData);
          Swal.fire("Success", "Note updated successfully!", "success");
        } else {
          await createNote(formData);
          Swal.fire("Success", "Note created successfully!", "success");
        }
        resetForm();
        if (canPerformAction(rolePermissions, "note", "read")) {
          navigate("/manage-notes");
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || error.message || "Failed to submit note",
          "error"
        );
      }
    }
  });
  useEffect(() => {
    const fetchChaptersByCourse = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }
      try {
        const res = await apiClient.get(`/api/chapters/course/${courseId}`);
        setAvailableChapters(res.data?.data || []);
      } catch (err) {
        console.error(`Failed to load chapters for ${COURSE_NAME}:`, err);
        setAvailableChapters([]);
      }
    };
    fetchChaptersByCourse();
  }, [formik.values.course]);
  useEffect(() => {
    const fetchBatches = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableBatches([]);
        return;
      }
      try {
        const res = await apiClient.get(`/api/batches/course/${courseId}`);
        setAvailableBatches(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
        setAvailableBatches([]);
      }
    };
    fetchBatches();
  }, [formik.values.course]);
  useEffect(() => {
    if (!noteId || availableCourses.length === 0) return;
    const fetchNote = async () => {
      setLoading(true);
      try {
        const res = await fetchNoteById(noteId);
        const note = res?.data || res;
        if (!note) return;
        const courseId = note.course || note.chapter?.courseDetails?._id || "";
        const batchId = note.batches?.[0] || "";
        setSelectedCourse(courseId);
        formik.setValues({
          course: courseId,
          batches: batchId,
          title: note.title || "",
          content: note.content || "",
          type: note.type || "",
          file: null
        });
        if (note.file) setExistingFile(note.file);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId, availableCourses]);
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10 text-blue-700 font-medium", children: "Loading note details..." });
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center", children: noteId ? "Edit Reference Material" : "Add Reference Material" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", formik }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "course",
              options: availableCourses,
              formik,
              value: selectedCourse,
              onChange: (e) => {
                const value = e.target.value;
                setSelectedCourse(value);
                formik.setFieldValue("course", value);
              },
              disabled: isCoursePreselected
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Batch*",
              name: "batches",
              options: availableBatches.map((b) => ({
                _id: b._id,
                title: `${b.batchName} (${b.mode} - ${b.status})`
              })),
              formik,
              onChange: (value) => {
                formik.setFieldValue("batches", value);
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 mb-6", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: "Upload File*" }),
            /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  name: "file",
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      formik.setFieldValue("file", file);
                    }
                  },
                  className: "absolute inset-0 opacity-0 cursor-pointer z-20"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-600" }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium truncate max-w-[300px]", children: formik.values.file ? formik.values.file.name : "Choose a file..." })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 hidden md:block", children: "All file types allowed" })
              ] })
            ] }),
            existingFile && !formik.values.file && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-blue-700", children: [
              "Existing file:",
              " ",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: `${DIR.COURSE_NOTES}${existingFile}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "underline font-medium",
                  children: existingFile
                }
              )
            ] }),
            formik.touched.file && formik.errors.file && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-1", children: formik.errors.file })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
            TextAreaField,
            {
              label: "Description (optional)",
              name: "content",
              formik,
              rows: 4
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: formik.isSubmitting || loading,
            className: "bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50",
            children: formik.isSubmitting || loading ? noteId ? "Updating..." : "Creating..." : noteId ? "Update Reference Material" : "Add Reference Material"
          }
        ) })
      ]
    }
  ) });
}
export {
  AddNotes as default
};
