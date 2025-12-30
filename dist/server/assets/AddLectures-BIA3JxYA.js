import { jsxs, jsx } from "react/jsx-runtime";
import { useFormik, FormikProvider } from "formik";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { j as apiClient, C as COURSE_NAME, I as InputField, D as Dropdown, T as TextAreaField, g as getAllCourses, l as fetchBatchesByCourseId, d as DIR, k as handleApiError } from "../entry-server.js";
import { g as getChaptersByCourse } from "./chapters-BlOwZpdE.js";
import { f as fetchAllTrainers } from "./trainerApi-uqZoQf46.js";
import { M as MultiSelectDropdown } from "./MultiSelectDropdown-Cyo1WA1I.js";
import { FaVideo } from "react-icons/fa";
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
const VideoUploadField = ({ label, name, formik }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const selectedFile = formik.values[name];
  useEffect(() => {
    if (selectedFile instanceof File) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof selectedFile === "string") {
      setPreviewUrl(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);
  const handleChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file && file.type === "video/mp4") {
      formik.setFieldValue(name, file);
    } else {
      formik.setFieldValue(name, null);
      alert("Please upload a valid MP4 file.");
    }
  };
  const error = formik.touched[name] && formik.errors[name];
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-2", children: [
    label && /* @__PURE__ */ jsx(
      "label",
      {
        htmlFor: name,
        className: "block text-sm font-medium text-gray-700",
        children: label
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          name,
          id: name,
          accept: "video/mp4",
          onChange: handleChange,
          className: "absolute inset-0 opacity-0 cursor-pointer z-20"
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex items-center justify-between border-2 border-dashed ${error ? "border-red-400" : "border-gray-300 hover:border-blue-400"} bg-white px-4 py-3 rounded-lg shadow-sm transition-all duration-300`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(FaVideo, { className: "text-blue-600 text-xl" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium truncate max-w-[300px]", children: selectedFile ? selectedFile.name : "Choose a video file (.mp4)" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 hidden md:block", children: "Max: 100MB" })
          ]
        }
      )
    ] }),
    previewUrl && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(
      "video",
      {
        src: previewUrl,
        controls: true,
        className: "w-72 h-44 object-cover rounded-lg border border-gray-300 shadow-md"
      }
    ) }),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs font-medium", children: formik.errors[name] })
  ] });
};
function AddLectures() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(availableCourses);
  const formik = useFormik({
    initialValues: {
      course: "",
      chapter: "",
      title: "",
      description: "",
      contentUrl: null,
      duration: "",
      type: "",
      trainer: [],
      batches: [],
      status: "pending"
    },
    validationSchema: Yup.object({
      course: Yup.string().required(`${COURSE_NAME} is required`)
      // chapter: Yup.string().required("Chapter is required"),
      // title: Yup.string().required("Title is required"),
      // description: Yup.string().required("Description is required"),
      // type: Yup.string(),
      // batches: Yup.array(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("course", values.course);
        formData.append("chapter", values.chapter);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("duration", values.duration);
        formData.append("type", values.type);
        values.trainer.forEach(
          (trainerId) => formData.append("trainer[]", trainerId)
        );
        formData.append("status", values.status);
        values.batches.forEach((batch) => formData.append("batches[]", batch));
        if (values.contentUrl) formData.append("contentUrl", values.contentUrl);
        if (lectureId) {
          await apiClient.put(`/api/lectures/${lectureId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          Swal.fire("Success", "Lecture updated successfully!", "success").then(
            () => {
              resetForm();
              navigate("/manage-course-videos");
            }
          );
        } else {
          await apiClient.post("/api/lectures", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          Swal.fire("Success", "Lecture created successfully!", "success").then(
            () => {
              resetForm();
              navigate("/manage-course-videos");
            }
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || error.message,
          "error"
        );
      }
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getAllCourses();
        setAvailableCourses(coursesRes || []);
        const trainersRes = await fetchAllTrainers();
        setAvailableTrainers(trainersRes || []);
        if (selectedCourseFromParam) {
          setSelectedCourseId(selectedCourseFromParam);
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, [selectedCourseFromParam]);
  useEffect(() => {
    if (selectedCourseFromParam) {
      formik.setFieldValue("course", selectedCourseFromParam);
    }
  }, [selectedCourseFromParam]);
  useEffect(() => {
    const fetchChapters = async (courseId) => {
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }
      try {
        const res = await getChaptersByCourse(courseId);
        setAvailableChapters(res.success ? res.data || [] : []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setAvailableChapters([]);
      }
    };
    fetchChapters(selectedCourseId || formik.values.course);
  }, [selectedCourseId, formik.values.course]);
  useEffect(() => {
    const fetchBatches = async () => {
      const courseId = selectedCourseId || formik.values.course;
      if (!courseId) {
        setAvailableBatches([]);
        return;
      }
      try {
        const batches = await fetchBatchesByCourseId(courseId);
        setAvailableBatches(batches);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setAvailableBatches([]);
      }
    };
    fetchBatches();
  }, [selectedCourseId, formik.values.course]);
  useEffect(() => {
    if (!lectureId) return;
    const fetchLecture = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/lectures/${lectureId}`);
        if (res.data.success && res.data.data) {
          const lecture = res.data.data;
          let prefilledContentUrl = null;
          if (lecture.type === "mp4" && lecture.contentUrl) {
            prefilledContentUrl = DIR.LECTURE_CONTENT + lecture.contentUrl;
          } else if (lecture.type === "youtube") {
            prefilledContentUrl = lecture.contentUrl;
          }
          formik.setValues({
            course: lecture.course?._id || "",
            chapter: lecture.chapter?._id || "",
            title: lecture.title || "",
            description: lecture.description || "",
            duration: lecture.duration || "",
            type: lecture.type || "",
            trainer: lecture.trainer?.map((t) => t._id) || [],
            batches: lecture.batches?.map((b) => b._id) || [],
            status: lecture.status || "pending",
            contentUrl: prefilledContentUrl
          });
          setSelectedCourseId(lecture.course?._id || "");
        } else {
          Swal.fire("Error", "Lecture not found", "error");
          navigate("/manage-course-videos");
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          handleApiError(err) || "Failed to fetch lecture",
          "error"
        );
        navigate("/manage-course-videos");
      } finally {
        setLoading(false);
      }
    };
    fetchLecture();
  }, [lectureId]);
  if (loading) return /* @__PURE__ */ jsx("p", { className: "text-center mt-10", children: "Loading lecture..." });
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center", children: lectureId ? "Edit Recording" : "Add Recording" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", type: "text", formik }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "course",
              options: availableCourses,
              formik,
              onChange: (value) => {
                formik.setFieldValue("course", value);
                formik.setFieldValue("chapter", "");
                setSelectedCourseId(value);
              },
              disabled: isCoursePreselected
            }
          ),
          /* @__PURE__ */ jsx(
            MultiSelectDropdown,
            {
              label: "Batch*",
              name: "batches",
              formik,
              options: availableBatches,
              getOptionValue: (option) => option._id,
              getOptionLabel: (option) => {
                const daysMap = {
                  monday: "Mon",
                  tuesday: "Tue",
                  wednesday: "Wed",
                  thursday: "Thu",
                  friday: "Fri",
                  saturday: "Sat",
                  sunday: "Sun"
                };
                const formattedDays = option.days.map((d) => daysMap[d.toLowerCase()] || d).join(", ");
                return `${option.batchName} | ${option.time.start} - ${option.time.end} | ${formattedDays} | ${option.mode}`;
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Type*",
              name: "type",
              options: [
                { _id: "mp4", name: "MP4" },
                { _id: "youtube", name: "YouTube URL" }
              ],
              formik
            }
          ),
          formik.values.type === "mp4" && /* @__PURE__ */ jsx(
            VideoUploadField,
            {
              label: "Lecture Video (.mp4)",
              name: "contentUrl",
              formik
            }
          ),
          formik.values.type === "youtube" && /* @__PURE__ */ jsx(
            InputField,
            {
              label: "YouTube URL",
              name: "contentUrl",
              type: "url",
              formik
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          TextAreaField,
          {
            label: "Description (optional)",
            name: "description",
            rows: 4,
            formik
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: formik.isSubmitting || loading,
            className: "bg-[rgba(14,85,200,0.83)] text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50",
            children: formik.isSubmitting || loading ? lectureId ? "Updating..." : "Adding..." : lectureId ? "Update Recording" : "Add Recording"
          }
        ) })
      ]
    }
  ) });
}
export {
  AddLectures as default
};
