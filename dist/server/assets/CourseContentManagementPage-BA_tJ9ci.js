import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Q as BASE_URL, u as useAuth, R as addVideoToCourse, U as addNoteToCourse, f as fetchCourseById } from "../entry-server.js";
import { HiArrowLeft } from "react-icons/hi";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
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
const NoteComponent = ({ note }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: "bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200",
    children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h5", { className: "font-medium text-gray-900 text-sm mb-1", children: note.title }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center text-xs text-gray-500 mb-2", children: note.duration && /* @__PURE__ */ jsxs("span", { className: "bg-green-100 text-green-800 px-2 py-1 rounded mr-2", children: [
          "⏱️ ",
          note.duration
        ] }) }),
        note.content && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 line-clamp-2", children: note.content })
      ] }),
      note.file && /* @__PURE__ */ jsx(
        "a",
        {
          href: `${BASE_URL}/uploads/course-notes/${note.file}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200",
          children: "📄 View"
        }
      )
    ] })
  },
  note._id
);
const noteValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  duration: Yup.string(),
  file: Yup.mixed()
});
const AddNoteForm = ({ courseId, token, onSuccess, onError, addNoteToCourse: addNoteToCourse2 }) => {
  return /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues: {
        title: "",
        content: "",
        duration: "",
        file: null
      },
      validationSchema: noteValidationSchema,
      onSubmit: async (values, { resetForm, setSubmitting }) => {
        try {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("content", values.content);
          formData.append("duration", values.duration || "");
          formData.append("uploadedAt", (/* @__PURE__ */ new Date()).toISOString());
          if (values.file instanceof File) {
            formData.append("file", values.file);
          }
          const response = await addNoteToCourse2(courseId, formData, token);
          if (response.success) {
            onSuccess("Note added successfully!");
            resetForm();
          } else {
            onError(response.message || "Failed to add note.");
          }
        } catch (err) {
          onError(err.message || "An error occurred while adding the note.");
        } finally {
          setSubmitting(false);
        }
      },
      children: ({ isSubmitting, setFieldValue }) => /* @__PURE__ */ jsxs(Form, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Duration (MM:SS)" }),
            /* @__PURE__ */ jsx(
              Field,
              {
                type: "text",
                name: "duration",
                placeholder: "00:00",
                className: "w-full border border-gray-300 rounded-lg px-4 py-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "File Type" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "PDF Upload" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Note Title" }),
          /* @__PURE__ */ jsx(
            Field,
            {
              type: "text",
              name: "title",
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Content Description" }),
          /* @__PURE__ */ jsx(
            Field,
            {
              as: "textarea",
              name: "content",
              rows: 3,
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Upload PDF File" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: ".pdf",
              onChange: (event) => {
                const file = event.currentTarget.files[0];
                setFieldValue("file", file);
              },
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg",
            children: isSubmitting ? "Adding Note..." : "📝 Add Note"
          }
        )
      ] })
    }
  );
};
const videoValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  contentUrl: Yup.string().url("Must be a valid URL").required("Video URL is required"),
  duration: Yup.string().required("Duration is required"),
  type: Yup.string().required("Type is required"),
  description: Yup.string()
});
const AddVideoForm = ({ courseId, token, onSuccess, onError, addVideoToCourse: addVideoToCourse2 }) => {
  return /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues: {
        type: "video",
        title: "",
        contentUrl: "",
        duration: "",
        description: ""
      },
      validationSchema: videoValidationSchema,
      onSubmit: async (values, { resetForm, setSubmitting }) => {
        try {
          const payload = { ...values, course: courseId };
          const response = await addVideoToCourse2(courseId, payload, token);
          if (response.success) {
            onSuccess("Video added successfully!");
            resetForm();
          } else {
            onError(response.message || "Failed to add video.");
          }
        } catch (err) {
          onError(err.message || "An error occurred while adding the video.");
        } finally {
          setSubmitting(false);
        }
      },
      children: ({ isSubmitting, errors, touched }) => /* @__PURE__ */ jsxs(Form, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }),
            /* @__PURE__ */ jsxs(
              Field,
              {
                as: "select",
                name: "type",
                className: "w-full border border-gray-300 rounded-lg px-4 py-2",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "video", children: "Video" }),
                  /* @__PURE__ */ jsx("option", { value: "lecture", children: "Lecture" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Duration (MM:SS)" }),
            /* @__PURE__ */ jsx(
              Field,
              {
                type: "text",
                name: "duration",
                placeholder: "00:00",
                className: "w-full border border-gray-300 rounded-lg px-4 py-2"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Video Title" }),
          /* @__PURE__ */ jsx(
            Field,
            {
              type: "text",
              name: "title",
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Video URL" }),
          /* @__PURE__ */ jsx(
            Field,
            {
              type: "url",
              name: "contentUrl",
              placeholder: "https://example.com/video.mp4",
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }),
          /* @__PURE__ */ jsx(
            Field,
            {
              as: "textarea",
              name: "description",
              rows: 3,
              className: "w-full border border-gray-300 rounded-lg px-4 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg",
            children: isSubmitting ? "Adding Video..." : "➕ Add Video"
          }
        )
      ] })
    }
  );
};
const VideoComponent = ({ video, setSelectedVideo }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: "bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200",
    children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h5", { className: "font-medium text-gray-900 text-sm mb-1", children: video.title }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-gray-500 mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2", children: video.type }),
          /* @__PURE__ */ jsxs("span", { children: [
            "⏱️ ",
            video.duration
          ] })
        ] }),
        video.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 line-clamp-2", children: video.description })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedVideo(video),
          className: "ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200",
          children: "▶ Play"
        }
      )
    ] })
  },
  video._id
);
const CourseContentManagementPage = () => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const loadCourseDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError("Failed to load course details.");
      console.error("Error fetching course:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);
  if (isLoading) return /* @__PURE__ */ jsx("p", { children: "Loading course details..." });
  if (error && !course) return /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: error });
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-800 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/courses",
        className: "inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6",
        children: [
          /* @__PURE__ */ jsx(HiArrowLeft, { className: "w-5 h-5 mr-2" }),
          "Back to Course List"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Course Content Manager" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl text-blue-700 font-semibold", children: course?.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: course?.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 px-4 py-2 rounded-lg border border-blue-200", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-blue-700 font-medium", children: [
            "Videos:",
            " "
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: course?.videolectures?.length || 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-green-50 px-4 py-2 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-green-700 font-medium", children: [
            "Notes:",
            " "
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: course?.notes?.length || 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 px-4 py-2 rounded-lg border border-purple-200", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-purple-700 font-medium", children: [
            "Duration:",
            " "
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: course?.duration || "N/A" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-red-700 font-medium", children: error }) }),
      success && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-green-700 font-medium", children: success }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Add New Video" }),
        /* @__PURE__ */ jsx(
          AddVideoForm,
          {
            courseId,
            token,
            onSuccess: setSuccess,
            onError: setError,
            addVideoToCourse: async (courseId2, payload, token2) => {
              const res = await addVideoToCourse(courseId2, payload);
              if (res.success) await loadCourseDetails();
              return res;
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Add New Note" }),
        /* @__PURE__ */ jsx(
          AddNoteForm,
          {
            courseId,
            token,
            onSuccess: setSuccess,
            onError: setError,
            addNoteToCourse: async (courseId2, payload, token2) => {
              const res = await addNoteToCourse(courseId2, payload, token2);
              if (res.success) await loadCourseDetails();
              return res;
            }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Existing Course Content" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: [
            course?.videolectures?.length || 0,
            " Videos"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium", children: [
            course?.notes?.length || 0,
            " Notes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2 w-5 h-5 inline-block bg-blue-600 rounded" }),
            "Video Lectures"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: course?.videolectures?.length > 0 ? course.videolectures.map((video) => /* @__PURE__ */ jsx(VideoComponent, { video }, video._id)) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No videos available" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2 w-5 h-5 inline-block bg-green-600 rounded" }),
            "Study Notes"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: course?.notes?.length > 0 ? course.notes.map((note) => /* @__PURE__ */ jsx(NoteComponent, { note }, note._id)) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "No notes available" }) })
        ] })
      ] })
    ] }),
    selectedVideo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold text-gray-900", children: selectedVideo.title }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedVideo(null),
            className: "text-gray-400 hover:text-gray-600 text-2xl font-bold",
            "aria-label": "Close",
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx(
          "video",
          {
            src: selectedVideo.url,
            controls: true,
            className: "w-full h-auto rounded-lg",
            autoPlay: true
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-700", children: selectedVideo.description })
      ] })
    ] }) })
  ] }) });
};
export {
  CourseContentManagementPage as default
};
