
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";

export default function AddLectures() {
  const { lectureId } = useParams(); // Get lectureId from route
  const navigate = useNavigate();

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await apiClient.get("/api/chapters");
        setAvailableChapters(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };

    fetchChapters();
  }, []);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      chapter: "",
      title: "",
      contentUrl: null,
      duration: "",
      description: "",
    },
    validationSchema: Yup.object({
      chapter: Yup.string().required("Chapter is required"),
      title: Yup.string().required("Title is required"),
      duration: Yup.string().required("Duration is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("chapter", values.chapter);
        formData.append("title", values.title);
        formData.append("duration", values.duration);
        formData.append("description", values.description);
        if (values.contentUrl) formData.append("contentUrl", values.contentUrl);

        if (lectureId) {
          // ✅ Update lecture
          await apiClient.put(`/api/lectures/${lectureId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Lecture updated successfully!");
        } else {
          // ✅ Add new lecture
          await apiClient.post("/api/lectures", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Lecture created successfully!");
        }

        resetForm();
        navigate("/admin/manage-course-videos");
      } catch (error) {
        console.error(error);
        alert(
          "Failed to submit lecture: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
  });

  // ✅ Fetch lecture data if editing
  useEffect(() => {
    if (!lectureId) return;

    const fetchLecture = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/lectures/${lectureId}`);
        if (res.data.success && res.data.data) {
          const lecture = res.data.data;
          formik.setValues({
            chapter: lecture.chapter?._id || "",
            title: lecture.title || "",
            contentUrl: null, // user can re-upload
            duration: lecture.duration || "",
            description: lecture.description || "",
          });
        } else {
          alert("Lecture not found");
          navigate("/admin/manage-course-videos");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch lecture");
        navigate("/admin/manage-course-videos");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [lectureId]);

  if (loading) return <p className="text-center mt-10">Loading lecture...</p>;

  // ✅ Form UI
  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {lectureId ? "Edit Lecture" : "Add Lecture"}
        </h2>

        {/* Chapter Dropdown */}
        <div>
          <label className="block font-medium mb-1">Chapter</label>
          <select
            name="chapter"
            value={formik.values.chapter}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Chapter</option>
            {availableChapters.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.title}
              </option>
            ))}
          </select>
          {formik.touched.chapter && formik.errors.chapter && (
            <p className="text-red-500 text-sm">{formik.errors.chapter}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded-lg px-4 py-2"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium mb-1">
            Duration (e.g., 30 min)
          </label>
          <input
            type="text"
            name="duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded-lg px-4 py-2"
          />
          {formik.touched.duration && formik.errors.duration && (
            <p className="text-red-500 text-sm">{formik.errors.duration}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* MP4 File Upload */}
        <div>
          <label className="block font-medium mb-1">Lecture Video (.mp4)</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) =>
              formik.setFieldValue("contentUrl", e.currentTarget.files[0])
            }
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {lectureId ? "Update Lecture" : "Submit Lecture"}
        </button>
      </form>
    </FormikProvider>
  );
}
