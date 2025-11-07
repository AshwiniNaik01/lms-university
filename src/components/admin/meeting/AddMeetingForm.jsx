
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import TextAreaField from "../../form/TextAreaField";

const AddMeetingForm = () => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customPlatform, setCustomPlatform] = useState("");

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [coursesData, trainersData, batchesData] = await Promise.all([
          getAllCourses(),
          fetchAllTrainers(),
          apiClient.get("/api/batches/all").then((res) => res.data.data || []),
        ]);

        setCourses(coursesData);
        setTrainers(trainersData);
        setBatches(batchesData);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchDropdowns();
  }, []);

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
      setResponseMessage("");
      const submitValues = { ...values };
      if (values.platform === "Other") {
        submitValues.platform = customPlatform;
      }

      try {
        const res = await apiClient.post("/api/meetings", submitValues);
        if (res.status === 201) {
          setResponseMessage(res.data.success || "Meeting created successfully!");
          formik.resetForm();
          setCustomPlatform("");
        }
      } catch (err) {
        console.error("Error creating meeting:", err);
        setResponseMessage(err.response?.data?.message || "Failed to create meeting.");
      } finally {
        setLoading(false);
      }
    },
  });

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

          {/* Platform with 'Other' */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Platform</label>
            <select
              value={["Zoom", "Google Meet"].includes(formik.values.platform) ? formik.values.platform : "Other"}
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
          <InputField label="Meeting Link" name="meetingLink" type="url" formik={formik} />

          {/* Meeting ID */}
          <InputField label="Meeting ID" name="meetingId" formik={formik} />

          {/* Meeting Password */}
          <InputField label="Meeting Password" name="meetingPassword" formik={formik} />

          {/* Batch */}
          <Dropdown
            label="Batch"
            name="batch"
            formik={formik}
            options={batches.map((b) => ({ _id: b._id, name: b.batchName }))}
          />

          {/* Trainer */}
          <Dropdown
            label="Trainer"
            name="trainer"
            formik={formik}
            options={trainers.map((t) => ({ _id: t._id, name: t.fullName }))}
          />

          {/* Course */}
          <Dropdown
            label="Course"
            name="course"
            formik={formik}
            options={courses.map((c) => ({ _id: c._id, title: c.title }))}
          />

          {/* Start Time */}
          <InputField label="Start Time" name="startTime" type="datetime-local" formik={formik} />

          {/* End Time */}
          <InputField label="End Time" name="endTime" type="datetime-local" formik={formik} />

          {/* Notification (full width) */}
          <div className="md:col-span-2">
            <InputField label="Notification" name="notification" type="textarea" formik={formik} />
          </div>

          {/* Description (full width) */}
          <div className="md:col-span-2">
            <TextAreaField label="Description" name="description" formik={formik} rows={4} />
          </div>

          {/* Meeting Description (full width) */}
          <div className="md:col-span-2">
            <TextAreaField label="Meeting Description" name="meetingDescription" formik={formik} rows={4} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Adding..." : "Add Meeting"}
          </button>
        </div>

        {/* Response Message */}
        {/* {responseMessage && (
          <p className="mt-4 text-green-600 font-medium text-center">{responseMessage}</p>
        )} */}
      </form>
    </FormikProvider>
  );
};

export default AddMeetingForm;
