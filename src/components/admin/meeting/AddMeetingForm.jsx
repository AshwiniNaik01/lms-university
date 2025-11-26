
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import TextAreaField from "../../form/TextAreaField";

const AddMeetingForm = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customPlatform, setCustomPlatform] = useState("");

  // ✅ Move Formik to TOP so useEffect can read formik.values
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      meetingDescription: "",
      platform: "Google Meet",
      meetingLink: "",
      meetingId: "",
      meetingPassword: "",
      batch: "",
      trainer: "",
      course: "",
      startTime: "",
      endTime: "",
      notification: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      const submitValues = { ...values };

      if (values.platform === "Other") {
        submitValues.platform = customPlatform;
      }

      try {
        const res = await apiClient.post("/api/meetings", submitValues);

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.message || "Meeting created successfully!",
            confirmButtonText: "OK",
          });

          formik.resetForm();
          setCustomPlatform("");
        }
      } catch (err) {
        console.error("Error creating meeting:", err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to create meeting.",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Fetch Courses & Trainers only
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [coursesData, trainersData] = await Promise.all([
          getAllCourses(),
          fetchAllTrainers(),
        ]);

        setCourses(coursesData);
        setTrainers(trainersData);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdowns();
  }, []);

  // ✅ Fetch Batches dynamically based on selected course
  useEffect(() => {
    if (!formik.values.course) {
      setBatches([]);
      formik.setFieldValue("batch", ""); // reset batch field
      return;
    }

    apiClient
      .get(`/api/batches/course/${formik.values.course}`)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setBatches(res.data.data);
        } else {
          setBatches([]);
          formik.setFieldValue("batch", "");

          Swal.fire({
            icon: "warning",
            title: "No Batches Found",
            text: res.data.message || "No batches found for this training.",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((err) => {
        setBatches([]);
        formik.setFieldValue("batch", "");

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            err.response?.data?.message ||
            "Failed to load batches for selected training program.",
          confirmButtonText: "OK",
        });
      });
  }, [formik.values.course]);

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-3xl font-bold text-[rgba(14,85,200,0.83)] text-center mb-6">
          Add Meeting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <InputField label="Title" name="title" formik={formik} />

          {/* Platform */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              value={
                ["Zoom", "Google Meet", "Teams"].includes(
                  formik.values.platform
                )
                  ? formik.values.platform
                  : "Other"
              }
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("platform", value);
                if (value !== "Other") setCustomPlatform("");
              }}
              className="w-full px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Platform</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Teams">Teams</option>
              <option value="Other">Other</option>
            </select>

            {formik.values.platform === "Other" && (
              <input
                type="text"
                placeholder="Enter custom platform"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-blue-100 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            )}
          </div>

          {/* Meeting Link */}
          <InputField
            label="Meeting Link"
            name="meetingLink"
            type="url"
            formik={formik}
          />

          {/* Meeting ID */}
          <InputField label="Meeting ID" name="meetingId" formik={formik} />

          {/* Meeting Password */}
          <InputField
            label="Meeting Password"
            name="meetingPassword"
            formik={formik}
          />

          {/* Course */}
          <Dropdown
            label="Training Program"
            name="course"
            formik={formik}
            options={courses.map((c) => ({
              _id: c._id,
              title: c.title,
            }))}
          />

          {/* Batch */}
          <Dropdown
            label="Batch"
            name="batch"
            formik={formik}
            options={batches.map((b) => ({
              _id: b._id,
              name: b.batchName,
            }))}
          />

          {/* Trainer */}
          <Dropdown
            label="Trainer"
            name="trainer"
            formik={formik}
            options={trainers.map((t) => ({
              _id: t._id,
              name: t.fullName,
            }))}
          />

          {/* Start Time */}
          <InputField
            label="Start Time"
            name="startTime"
            type="datetime-local"
            formik={formik}
          />

          {/* End Time */}
          <InputField
            label="End Time"
            name="endTime"
            type="datetime-local"
            formik={formik}
          />

          {/* Notification */}
          <div className="md:col-span-2">
            <InputField
              label="Notification"
              name="notification"
              type="textarea"
              formik={formik}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Description"
              name="description"
              formik={formik}
              rows={4}
            />
          </div>

          {/* Meeting Description */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Meeting Description"
              name="meetingDescription"
              formik={formik}
              rows={4}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Adding..." : "Add Meeting"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default AddMeetingForm;
