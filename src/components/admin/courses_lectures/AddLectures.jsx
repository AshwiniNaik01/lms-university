
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import Swal from "sweetalert2";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import { DIR } from "../../../utils/constants";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import TextAreaField from "../../form/TextAreaField";
import VideoUploadField from "../../form/VideoUploadField";
import { useCourseParam } from "../../hooks/useCourseParam";
import { useSelector } from "react-redux";
import { fetchBatchesByCourseId } from "../../../api/batch";
import { getChaptersByCourse } from "../../../api/chapters"; // Make sure this exists

export default function AddLectures() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);

  // State
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Custom hook for preselected course from URL query param
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(availableCourses);

  // Formik setup
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
      status: "pending",
    },
    validationSchema: Yup.object({
      course: Yup.string().required("Training Program is required"),
      chapter: Yup.string().required("Chapter is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      type: Yup.string(),
      batches: Yup.array(),
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
        values.trainer.forEach((trainerId) => formData.append("trainer[]", trainerId));
        formData.append("status", values.status);
        values.batches.forEach((batch) => formData.append("batches[]", batch));
        if (values.contentUrl) formData.append("contentUrl", values.contentUrl);

        if (lectureId) {
          await apiClient.put(`/api/lectures/${lectureId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire("Success", "Lecture updated successfully!", "success").then(() => {
            resetForm();
            navigate("/manage-course-videos");
          });
        } else {
          await apiClient.post("/api/lectures", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire("Success", "Lecture created successfully!", "success").then(() => {
            resetForm();
            navigate("/manage-course-videos");
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.response?.data?.message || error.message, "error");
      }
    },
  });

  // Fetch all courses and trainers initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getAllCourses();
        setAvailableCourses(coursesRes || []);

        const trainersRes = await fetchAllTrainers();
        setAvailableTrainers(trainersRes || []);

        // If a course is preselected from URL, fetch its chapters
        if (selectedCourseFromParam) {
          setSelectedCourseId(selectedCourseFromParam);
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
  }, [selectedCourseFromParam]);

  // Set Formik value if URL param exists
  useEffect(() => {
    if (selectedCourseFromParam) {
      formik.setFieldValue("course", selectedCourseFromParam);
    }
  }, [selectedCourseFromParam]);

  // Fetch chapters whenever the selected course changes
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

  // Fetch batches whenever the selected course changes
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

  // Fetch lecture data if editing
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
            contentUrl: prefilledContentUrl,
          });
          setSelectedCourseId(lecture.course?._id || "");
        } else {
          Swal.fire("Error", "Lecture not found", "error");
          navigate("/manage-course-videos");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch lecture", "error");
        navigate("/manage-course-videos");
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
        className="p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          {lectureId ? "Edit Recording" : "Add Recording"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Training Program */}
          <Dropdown
            label="Training Program"
            name="course"
            options={availableCourses}
            formik={formik}
            onChange={(value) => {
              formik.setFieldValue("course", value);
              formik.setFieldValue("chapter", "");
              setSelectedCourseId(value);
            }}
            disabled={isCoursePreselected}
          />

          {/* Chapter */}
          <Dropdown label="Chapter" name="chapter" options={availableChapters} formik={formik} />

          {/* Title */}
          <InputField label="Title" name="title" type="text" formik={formik} />

          {/* Batch */}
          <MultiSelectDropdown
            label="Batch"
            name="batches"
            formik={formik}
            options={availableBatches}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => {
              const daysMap = {
                monday: "Mon",
                tuesday: "Tue",
                wednesday: "Wed",
                thursday: "Thu",
                friday: "Fri",
                saturday: "Sat",
                sunday: "Sun",
              };
              const formattedDays = option.days.map((d) => daysMap[d.toLowerCase()] || d).join(", ");
              return `${option.batchName} | ${option.time.start} - ${option.time.end} | ${formattedDays} | ${option.mode}`;
            }}
          />

          {/* Type */}
          <Dropdown
            label="Type"
            name="type"
            options={[
              { _id: "mp4", name: "MP4" },
              { _id: "youtube", name: "YouTube URL" },
            ]}
            formik={formik}
          />

          {/* Conditional Fields */}
          {formik.values.type === "mp4" && <VideoUploadField label="Lecture Video (.mp4)" name="contentUrl" formik={formik} />}
          {formik.values.type === "youtube" && <InputField label="YouTube URL" name="contentUrl" type="url" formik={formik} />}

          {/* Status */}
          <Dropdown
            label="Status"
            name="status"
            formik={formik}
            options={[
              { _id: "visible", title: "Visible" },
              { _id: "not_visible", title: "Not Visible" },
            ]}
          />
        </div>

        {/* Description */}
        <TextAreaField label="Description" name="description" rows={4} formik={formik} />

        {/* Submit */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-[rgba(14,85,200,0.83)] text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {lectureId ? "Update Recording" : "Add Recording"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}

