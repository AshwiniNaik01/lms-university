// -----------------------------------------------------------------------------
// 📘 WebinarForm Component
// Handles both Create & Edit modes for Webinars with form validation,
// dynamic fields, file uploads, and beautiful UI.
// -----------------------------------------------------------------------------

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

// 🧩 Reusable form components
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import FileInput from "../form/FileInput";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import TimeRangePicker from "../form/TimeRangePicker";
import ToggleSwitch from "../form/ToggleSwitch";

// 🌐 API functions & constants
import { DIR } from "../../utils/constants";
import { createWebinar, getWebinarById, updateWebinar } from "./upSkillsApi";

const WebinarForm = () => {
  // ---------------------------------------------------------------------------
  // ⚙️ Setup
  // ---------------------------------------------------------------------------
  const { id: categoryId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);

  const mode = query.get("type"); // "edit" or "add"
  const webinarId = query.get("id");

  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // 🧾 Default Values
  // ---------------------------------------------------------------------------
  const defaultValues = {
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    speakerName: "",
    speakerBio: "",
    speakerPhoto: null,
    platform: "",
    meetingLink: "",
    meetingId: "",
    passcode: "",
    registrationRequired: true,
    maxParticipants: "",
    tags: [""],
    status: "Upcoming",
  };

  const [initialValues, setInitialValues] = useState(defaultValues);

  // ---------------------------------------------------------------------------
  // 📦 Fetch Webinar (Edit Mode)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchWebinar = async () => {
      if (mode !== "edit" || !webinarId) return;

      setLoading(true);
      try {
        const resp = await getWebinarById(webinarId);
        const data = resp.data?.data;

        if (!data) {
          Swal.fire("Error", "Webinar not found", "error");
          return;
        }

        setInitialValues({
          ...defaultValues,
          ...data,
          date: data.date ? data.date.split("T")[0] : "",
          speakerPhoto: data.speakerPhoto
            ? `${DIR.WEBINAR_SPEAKER_PHOTO}${data.speakerPhoto}`
            : null,
          tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [""],
        });
      } catch (err) {
        console.error("❌ Error fetching webinar:", err);
        Swal.fire("Error", "Failed to load webinar data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [mode, webinarId]);

  // ---------------------------------------------------------------------------
  // ✅ Validation Schema (Yup)
  // ---------------------------------------------------------------------------
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.date().required("Date is required"),
    startTime: Yup.string().required("Start time is required"),
    speakerName: Yup.string().required("Speaker name is required"),
    platform: Yup.string().required("Platform is required"),
    meetingLink: Yup.string()
      .url("Must be a valid URL")
      .required("Meeting link is required"),
  });

  // ---------------------------------------------------------------------------
  // 🧠 Formik Setup
  // ---------------------------------------------------------------------------
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      try {
        // Create FormData for file + text data
        const formData = new FormData();

        // Append simple scalar fields
        Object.entries(values).forEach(([key, value]) => {
          if (key === "speakerPhoto" || key === "tags") return;
          if (value !== undefined && value !== null && value !== "")
            formData.append(key, value);
        });

        // Append tags (array)
        if (Array.isArray(values.tags)) {
          values.tags
            .filter((tag) => tag.trim() !== "")
            .forEach((tag) => formData.append("tags[]", tag));
        }

        // Append speaker photo if file
        if (values.speakerPhoto instanceof File) {
          formData.append("speakerPhoto", values.speakerPhoto);
        }

        // Submit: Create or Update
        if (mode === "edit" && webinarId) {
          await updateWebinar(webinarId, formData);
          Swal.fire({
            title: "Success",
            text: "Webinar updated successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate("/book-session"));
        } else {
          await createWebinar(formData);
          Swal.fire({
            title: "Success",
            text: "Webinar created successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            resetForm();
            navigate("/book-session");
          });
        }
      } catch (err) {
        console.error("❌ Error submitting webinar:", err);
        Swal.fire("Error", "Failed to submit webinar", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ---------------------------------------------------------------------------
  // 🎨 UI Layout
  // ---------------------------------------------------------------------------
return (
  <form
    onSubmit={formik.handleSubmit}
    className="space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80"
  >
    {/* 🏷️ Header */}
    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start">
      {mode === "edit" ? "Edit Webinar" : "Create Webinar"}
    </h2>

    {/* 🧩 Basic Information */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Title *" name="title" formik={formik} />
        <InputField label="Platform *" name="platform" formik={formik} />
      </div>
      <TextAreaField label="Description" name="description" formik={formik} />
    </section>

    {/* 📅 Date & Time */}
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Date & Time
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.date}</p>
          )}
        </div>
        <TimeRangePicker formik={formik} />
      </div>
    </section>

    {/* 💻 Meeting Details */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Meeting Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Meeting Link *"
          name="meetingLink"
          formik={formik}
          type="url"
        />
        <InputField label="Meeting ID" name="meetingId" formik={formik} />
        <InputField label="Passcode" name="passcode" formik={formik} />
      </div>
    </section>

    {/* 🎤 Speaker Information */}
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Speaker Information
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <InputField label="Speaker Name *" name="speakerName" formik={formik} />
        <TextAreaField label="Speaker Bio" name="speakerBio" formik={formik} />
        <FileInput label="Speaker Photo" name="speakerPhoto" formik={formik} />
      </div>
    </section>

    {/* 👥 Registration & Tags */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Registration & Tags
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Max Participants"
          name="maxParticipants"
          type="number"
          formik={formik}
        />
        <DynamicInputFields label="Tags" name="tags" formik={formik} />
      </div>
      <ToggleSwitch
        label="Registration Required"
        name="registrationRequired"
        checked={formik.values.registrationRequired}
        onChange={() =>
          formik.setFieldValue(
            "registrationRequired",
            !formik.values.registrationRequired
          )
        }
      />
    </section>

    {/* 📊 Status */}
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Status
      </h3>
      <Dropdown
        label="Webinar Status"
        name="status"
        formik={formik}
        options={[
          { _id: "Upcoming", title: "Upcoming" },
          { _id: "Ongoing", title: "Ongoing" },
          { _id: "Completed", title: "Completed" },
        ]}
      />
    </section>

    {/* 🚀 Submit Button */}
    <div className="flex justify-end pt-4 gap-4">
          <button
    type="button"
    onClick={() => navigate(-1)} // Go back to previous page
    className="px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300"
  >
    Cancel
  </button>
      <button
        type="submit"
        disabled={formik.isSubmitting || loading}
        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mode === "edit"
          ? loading
            ? "Updating..."
            : "Update Webinar"
          : loading
          ? "Creating..."
          : "Create Webinar"}
      </button>
    </div>
  </form>
);

};

export default WebinarForm;
