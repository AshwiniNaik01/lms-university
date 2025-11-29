import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
// import apiClient from "../apiClient"; // adjust path as needed
// import Dropdown from "../components/Dropdown"; // adjust path as needed
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

// import { getAllCourses } from "../helpers/courseHelpers"; // adjust path as needed

export default function AddLectures() {
  const { lectureId } = useParams();
  const navigate = useNavigate();

  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(false);
      const { rolePermissions } = useSelector((state) => state.permissions);

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
      trainer: [],
      batches: [],
      status: "pending",
    },
    validationSchema: Yup.object({
      course: Yup.string().required("Training Program is required"),
      chapter: Yup.string().required("Chapter is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      // duration: Yup.number().required("Duration is required"),
      type: Yup.string(),
      //    trainer: Yup.array()
      // .of(Yup.string().required())
      // .min(1, "At least one trainer is required"),

      batches: Yup.array(),
      // status: Yup.string().oneOf(["pending", "in-progress", "completed"]),
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
        // formData.append("trainer", values.trainer);
        values.trainer.forEach((trainerId) =>
          formData.append("trainer[]", trainerId)
        );

        formData.append("status", values.status);
        values.batches.forEach((batch) => formData.append("batches[]", batch));
        if (values.contentUrl) formData.append("contentUrl", values.contentUrl);

        if (lectureId) {
          await apiClient.put(`/api/lectures/${lectureId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire({
            icon: "success",
            title: "Lecture Updated",
            text: "Lecture updated successfully!",
            confirmButtonColor: "#0e55c8",
          }).then(() => {
            resetForm();
            navigate("/manage-course-videos");
          });
        } else {
          await apiClient.post("/api/lectures", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          Swal.fire({
            icon: "success",
            title: "Lecture Created",
            text: "Lecture created successfully!",
            confirmButtonColor: "#0e55c8",
          }).then(() => {
            resetForm();
            // navigate("/manage-course-videos");
          });
        }

        resetForm();
        // navigate("/manage-course-videos");
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
          apiClient.get("/api/batches/all"),
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

// Use custom hook to get preselected course from URL query param
const [selectedCourseFromParam, setSelectedCourseFromParam, isCoursePreselected] = useCourseParam(availableCourses);

// Whenever availableCourses change, set Formik value if hook returned a course
useEffect(() => {
  if (selectedCourseFromParam) {
    formik.setFieldValue("course", selectedCourseFromParam);
  }
}, [selectedCourseFromParam]);

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
        console.error("Error fetching chapters for training program:", err);
        setAvailableChapters([]);
      }
    };

    fetchChaptersByCourse(formik.values.course);
  }, [formik.values.course]);

  // ✅ Fetch lecture data if editing
  // useEffect(() => {
  //   if (!lectureId) return;

  //   const fetchLecture = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await apiClient.get(`/api/lectures/${lectureId}`);
  //       if (res.data.success && res.data.data) {
  //         const lecture = res.data.data;
  //         formik.setValues({
  //           course: lecture.course?._id || "",
  //           chapter: lecture.chapter?._id || "",
  //           title: lecture.title || "",
  //           description: lecture.description || "",
  //           // duration: lecture.duration || "",
  //           type: lecture.type || "",
  //           // trainer: lecture.trainer?._id || "",
  //           // trainer: lecture.trainer?.map((t) => t._id) || [],
  //           batches: lecture.batches?.map((b) => b._id) || [],
  //           status: lecture.status || "pending",
  //           contentUrl: prefilledContentUrl, // ✅ prefilled here
  //         });
  //       } else {
  //         alert("Lecture not found");
  //         navigate("/admin/manage-course-videos");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       alert("Failed to fetch lecture");
  //       navigate("/admin/manage-course-videos");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLecture();
  // }, [lectureId]);

  // Inside your fetchLecture useEffect
  useEffect(() => {
    if (!lectureId) return;

    const fetchLecture = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/lectures/${lectureId}`);
        if (res.data.success && res.data.data) {
          const lecture = res.data.data;

          // Determine prefilled contentUrl
          let prefilledContentUrl = null;
          if (lecture.type === "mp4" && lecture.contentUrl) {
            // Prepend the LECTURE_CONTENT path
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
            contentUrl: prefilledContentUrl, // ✅ prefilled here
          });
        } else {
          alert("Lecture not found");
          navigate("/manage-course-videos");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch lecture");
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
        {/* Heading */}
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          {lectureId ? "Edit Recording" : "Add Recording"}
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Dropdown */}
          {/* <Dropdown
            label="Training Program"
            name="course"
            options={availableCourses}
            formik={formik}
            onChange={(value) => {
              formik.setFieldValue("course", value);
              formik.setFieldValue("chapter", "");
            }}
          /> */}


          <Dropdown
  label="Training Program"
  name="course"
  options={availableCourses}
  formik={formik}
  onChange={(value) => {
    formik.setFieldValue("course", value);
    formik.setFieldValue("chapter", "");
  }}
  disabled={isCoursePreselected} // ✅ Disable if preselected from URL
/>


          {/* Chapter Dropdown */}
          <Dropdown
            label="Chapter"
            name="chapter"
            options={availableChapters}
            formik={formik}
          />

          <InputField label="Title" name="title" type="text" formik={formik} />

         

         
          {/* Batch Dropdown */}
          {/* <MultiSelectDropdown
            label="Batch"
            name="batches"
            formik={formik}
            options={availableBatches}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) =>
              `${option.batchName} | ${option.time.start} - ${
                option.time.end
              } | ${option.days.join(", ")} | ${option.mode}`
            }
          /> */}

          <MultiSelectDropdown
            label="Batch"
            name="batches"
            formik={formik}
            options={availableBatches}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => {
              // Convert API day strings to short day names if needed
              const daysMap = {
                monday: "Mon",
                tuesday: "Tue",
                wednesday: "Wed",
                thursday: "Thu",
                friday: "Fri",
                saturday: "Sat",
                sunday: "Sun",
              };

              const formattedDays = option.days
                .map((day) => daysMap[day.toLowerCase()] || day)
                .join(", ");

              return `${option.batchName} | ${option.time.start} - ${option.time.end} | ${formattedDays} | ${option.mode}`;
            }}
          />

          {/* Type Selector */}
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
          {formik.values.type === "mp4" && (
            <VideoUploadField
              label="Lecture Video (.mp4)"
              name="contentUrl"
              formik={formik}
            />
          )}

          {formik.values.type === "youtube" && (
            <InputField
              label="YouTube URL"
              name="contentUrl"
              type="url"
              formik={formik}
            />
          )}

          {/* Status */}
          <Dropdown
            label="Status"
            name="status"
            formik={formik}
            options={[
              { _id: "visible", title: "Visible" },
              { _id: "not_visible", title: "Not Visible" },
              // { _id: "completed", title: "Completed" },
            ]}
          />
        </div>

        <TextAreaField
          label="Description"
          name="description"
          rows={4}
          formik={formik}
        />

        {/* Submit Button */}
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
