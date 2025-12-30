import { jsx, jsxs } from "react/jsx-runtime";
import { useFormik, FormikProvider } from "formik";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { j as apiClient, e as canPerformAction, I as InputField, D as Dropdown, C as COURSE_NAME, T as TextAreaField, g as getAllCourses, l as fetchBatchesByCourseId, d as DIR } from "../entry-server.js";
import { g as getChaptersByCourse } from "./chapters-BlOwZpdE.js";
import { P as PDFUploadField } from "./PDFUploadField-CNV4w-Ms.js";
import { u as useCourseParam } from "./useCourseParam-D0IDp8wz.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
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
const createAssignment = async (formData) => {
  const res = await apiClient.post("/api/assignments/create", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};
const updateAssignment = async (assignmentId, formData) => {
  const res = await apiClient.put(
    `/api/assignments/${assignmentId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return res.data;
};
const getAssignmentById = async (assignmentId) => {
  const res = await apiClient.get(`/api/assignments/${assignmentId}`);
  return res.data;
};
function AddAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const rolePermissions = useSelector(
    (state) => state.permissions.rolePermissions
  );
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState("");
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(availableCourses);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        const uniqueCourses = Array.from(
          new Map(res.map((c) => [c._id, c])).values()
        );
        setAvailableCourses(uniqueCourses);
      } catch (err) {
        console.error(`Error fetching ${COURSE_NAME}:`, err);
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
      batches: "",
      // <-- multi-select for batches
      title: "",
      description: "",
      deadline: "",
      fileUrl: null
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Training Program is required"),
      // chapter: Yup.string().required("Chapter is required"),
      // title: Yup.string().required("Title is required"),
      // description: Yup.string().required("Description is required"),
      // deadline: Yup.string().required("Deadline is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "batches") {
            formData.append("batches", value);
          } else if (value) {
            formData.append(key, value);
          }
        });
        let res;
        if (assignmentId) {
          res = await updateAssignment(assignmentId, formData);
          Swal.fire({
            icon: "success",
            title: res.message || "Assignment updated successfully!",
            showConfirmButton: true
          });
        } else {
          res = await createAssignment(formData);
          Swal.fire({
            icon: "success",
            title: res.message || "Assignment created successfully!",
            showConfirmButton: true
          });
        }
        const hasReadPermission = canPerformAction(
          rolePermissions,
          "assignment",
          "read"
        );
        if (!hasReadPermission) {
          Swal.fire({
            icon: "warning",
            title: "Assignment created successfully, but you don't have permission to view assignments."
            // text: "You will stay on this page.",
          });
          resetForm();
          return;
        }
        resetForm();
        navigate("/manage-assignments");
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Submission failed!",
          text: err.response?.data?.message || err.message || "Please Try Again!"
        });
      }
    }
  });
  useEffect(() => {
    const loadBatches = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableBatches([]);
        return;
      }
      const batches = await fetchBatchesByCourseId(courseId);
      setAvailableBatches(batches);
    };
    loadBatches();
  }, [formik.values.course]);
  useEffect(() => {
    const fetchChapters = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }
      try {
        const res = await getChaptersByCourse(courseId);
        const uniqueChapters = Array.from(
          new Map(res.data.map((c) => [c._id, c])).values()
        );
        setAvailableChapters(uniqueChapters);
      } catch (err) {
        console.error(`Error fetching chapters for ${COURSE_NAME}:`, err);
        setAvailableChapters([]);
      }
    };
    fetchChapters();
  }, [formik.values.course]);
  useEffect(() => {
    if (!assignmentId) return;
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const res = await getAssignmentById(assignmentId);
        if (res.success && res.data) {
          const assignment = res.data;
          formik.setValues({
            course: assignment.chapter?.course?._id || assignment.course?._id || "",
            chapter: assignment.chapter?._id || "",
            batches: assignment.batches || [],
            // <-- fixed
            title: assignment.title || "",
            description: assignment.description || "",
            deadline: assignment.deadline?.split("T")[0] || "",
            fileUrl: null
          });
          if (assignment.fileUrl) {
            setExistingFile(DIR.ASSIGNMENT_FILES + assignment.fileUrl);
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: res.message || "Assignment not found",
            confirmButtonColor: "#0E55C8"
          });
          navigate("/manage-assignments");
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: err.response?.data?.message || "Failed to fetch assignment",
          confirmButtonColor: "#0E55C8"
        });
        navigate("/manage-assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);
  const courseOptions = availableCourses.map((c) => ({
    _id: c._id,
    title: c.title
  }));
  if (loading)
    return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading assignment..." });
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto space-y-6 border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6 text-blue-700 text-center underline", children: assignmentId ? "Edit Assignment" : "Add Assignment" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", type: "text", formik }),
          /* @__PURE__ */ jsx(
            InputField,
            {
              label: "Deadline*",
              name: "deadline",
              type: "date",
              formik
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "course",
              options: courseOptions,
              formik,
              value: formik.values.course,
              onChange: (value) => {
                formik.setFieldValue("course", value);
                setSelectedCourse(value);
              },
              disabled: isCoursePreselected
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Batch*",
              name: "batches",
              formik,
              options: availableBatches.map((b) => ({
                _id: b._id,
                title: `${b.batchName} (${b.mode} - ${b.status})`
              })),
              onChange: (value) => {
                formik.setFieldValue("batches", value);
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx(
              PDFUploadField,
              {
                label: "Assignment File (PDF)*",
                name: "fileUrl",
                formik
              }
            ),
            existingFile && /* @__PURE__ */ jsx(
              "a",
              {
                href: existingFile,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-600 underline mb-2 block",
                children: "View Existing File"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col md:col-span-2", children: /* @__PURE__ */ jsx(
            TextAreaField,
            {
              label: "Description (optional)",
              name: "description",
              formik,
              rows: 5
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center mt-4 flex justify-end gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => formik.resetForm(),
              className: "bg-gray-400 text-white px-8 py-3 rounded-lg hover:bg-gray-500 transition font-semibold",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting || loading,
              className: "bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50",
              children: formik.isSubmitting || loading ? assignmentId ? "Updating..." : "Creating..." : assignmentId ? "Update Assignment" : "Add Assignment"
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  AddAssignment as default
};
