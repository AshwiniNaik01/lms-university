
import React, { useState, useEffect } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
// import apiClient from "../apiClient"; // adjust path as needed
// import Dropdown from "../components/Dropdown"; // adjust path as needed
import Dropdown from "../../form/Dropdown";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
// import { getAllCourses } from "../helpers/courseHelpers"; // adjust path as needed


export default function AddLectures() {
  const { lectureId } = useParams();
  const navigate = useNavigate();

  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      course: "",
      chapter: "",
      title: "",
      description: "",
      contentUrl: null,
      duration: "",
      type: "",
      trainer: "",
      batches: [],
      status: "pending",
    },
    validationSchema: Yup.object({
      course: Yup.string().required("Course is required"),
      chapter: Yup.string().required("Chapter is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      duration: Yup.number().required("Duration is required"),
      type: Yup.string(),
      trainer: Yup.string().required("Trainer is required"),
      batches: Yup.array(),
      status: Yup.string().oneOf(["pending", "in-progress", "completed"]),
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
        formData.append("trainer", values.trainer);
        formData.append("status", values.status);
        values.batches.forEach((batch) => formData.append("batches[]", batch));
        if (values.contentUrl) formData.append("contentUrl", values.contentUrl);

        if (lectureId) {
          await apiClient.put(`/api/lectures/${lectureId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Lecture updated successfully!");
        } else {
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

  // ✅ Fetch all dropdown data
 useEffect(() => {
  const fetchData = async () => {
    try {
      const coursesRes = await getAllCourses();
      setAvailableCourses(coursesRes || []);

      const [chaptersRes, trainersRes, batchesRes] = await Promise.all([
        apiClient.get("/api/chapters"),
        fetchAllTrainers(), // ✅ Use your fetchAllTrainers function
        apiClient.get("/api/batches"),
      ]);

      setAvailableChapters(chaptersRes.data?.data || []);
      setAvailableTrainers(trainersRes || []); // trainersRes is already an array of trainer objects
      setAvailableBatches(batchesRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  fetchData();
}, []);


  // ✅ Fetch chapters whenever the selected course changes
  useEffect(() => {
    const fetchChaptersByCourse = async (courseId) => {
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }
      try {
        const res = await apiClient.get(`/api/chapters/course/${courseId}`);
        if (res.data.success) {
          setAvailableChapters(res.data.data || []);
        } else {
          setAvailableChapters([]);
        }
      } catch (err) {
        console.error("Error fetching chapters for course:", err);
        setAvailableChapters([]);
      }
    };

    fetchChaptersByCourse(formik.values.course);
  }, [formik.values.course]);

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
            course: lecture.course?._id || "",
            chapter: lecture.chapter?._id || "",
            title: lecture.title || "",
            description: lecture.description || "",
            duration: lecture.duration || "",
            type: lecture.type || "",
            trainer: lecture.trainer?._id || "",
            batches: lecture.batches?.map((b) => b._id) || [],
            status: lecture.status || "pending",
            contentUrl: null,
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

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 p-6 bg-white rounded-xl shadow-md max-w-7xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {lectureId ? "Edit Lecture" : "Add Lecture"}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Course Dropdown */}
          <Dropdown
            label="Course"
            name="course"
            options={availableCourses}
            formik={formik}
            onChange={(value) => {
              formik.setFieldValue("course", value);
              formik.setFieldValue("chapter", ""); // reset chapter
            }}
          />

          {/* Chapter Dropdown */}
          <Dropdown
  label="Chapter"
  name="chapter"
  options={availableChapters} // already in { value, label } format
  formik={formik}
/>


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

          {/* Duration */}
          <div>
            <label className="block font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
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

          {/* Type */}
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={formik.values.type}
              onChange={(e) => {
                formik.setFieldValue("type", e.target.value);
                formik.setFieldValue("contentUrl", null);
              }}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Type</option>
              <option value="mp4">MP4</option>
              <option value="youtube">YouTube URL</option>
            </select>
          </div>

          {/* Conditional content input */}
          {formik.values.type === "mp4" && (
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
          )}

          {formik.values.type === "youtube" && (
            <div>
              <label className="block font-medium mb-1">YouTube URL</label>
              <input
                type="url"
                name="contentUrl"
                value={formik.values.contentUrl || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://youtube.com/..."
                className="w-full border rounded-lg px-4 py-2"
              />
              {formik.touched.contentUrl && formik.errors.contentUrl && (
                <p className="text-red-500 text-sm">{formik.errors.contentUrl}</p>
              )}
            </div>
          )}

          {/* Trainer Dropdown */}
        <div>
  <label className="block font-medium mb-1">Trainer</label>
  <select
    name="trainer"
    value={formik.values.trainer}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    className="w-full border rounded-lg px-4 py-2"
  >
    <option value="">Select Trainer</option>
    {availableTrainers.map((trainer) => (
      <option key={trainer._id} value={trainer._id}>
        {trainer.fullName} {/* ✅ fullName from API */}
      </option>
    ))}
  </select>
  {formik.touched.trainer && formik.errors.trainer && (
    <p className="text-red-500 text-sm">{formik.errors.trainer}</p>
  )}
</div>


       {/* Batch Dropdown (Single Select) */}
<div>
  <label className="block font-medium mb-1">Batch</label>
  <select
    name="batches"
    value={formik.values.batches[0] || ""} // single select stored as first element
    onChange={(e) => formik.setFieldValue("batches", [e.target.value])} // wrap in array to keep API format
    className="w-full border rounded-lg px-4 py-2"
  >
    <option value="">Select Batch</option>
    {availableBatches.map((b) => (
      <option key={b._id} value={b._id}>
        {b.batchName} | {b.time.start} - {b.time.end} | {b.days.join(", ")} | {b.mode}
      </option>
    ))}
  </select>
  {formik.touched.batches && formik.errors.batches && (
    <p className="text-red-500 text-sm">{formik.errors.batches}</p>
  )}
</div>


          {/* Status */}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
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
