
// src/components/forms/WebinarForm.jsx

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";

// import InputField from "../form-fields/InputField";
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import FileInput from "../form/FileInput";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import TimeRangePicker from "../form/TimeRangePicker";
import ToggleSwitch from "../form/ToggleSwitch";

import { createWebinar, getWebinarById, updateWebinar } from "./upSkillsApi";
// import { DIR } from "../../constants/dir";
import { DIR } from "../../utils/constants";

const WebinarForm = () => {
  const { id: categoryId } = useParams(); // might be a session-category ID
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const mode = query.get("type"); // "edit" or "add"
  const webinarId = query.get("id"); // only exists in edit mode

  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("");

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

  // Fetch data only in edit mode
  useEffect(() => {
    const fetchWebinar = async () => {
      if (mode !== "edit" || !webinarId) return;

      setLoading(true);
      try {
        const resp = await getWebinarById(webinarId);
        const data = resp.data?.data;
        if (data && data._id) {
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            date: data.date ? data.date.split("T")[0] : "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            speakerName: data.speakerName || "",
            speakerBio: data.speakerBio || "",
            speakerPhoto: data.speakerPhoto
              ? `${DIR.WEBINAR_SPEAKER_PHOTO}${data.speakerPhoto}`
              : null,
            platform: data.platform || "",
            meetingLink: data.meetingLink || "",
            meetingId: data.meetingId || "",
            passcode: data.passcode || "",
            registrationRequired: data.registrationRequired ?? true,
            maxParticipants: data.maxParticipants
              ? String(data.maxParticipants)
              : "",
            tags:
              Array.isArray(data.tags) && data.tags.length > 0
                ? data.tags
                : [""],
            status: data.status || "Upcoming",
          });
          setFormStatus("");
        } else {
          setFormStatus("❌ Webinar not found");
        }
      } catch (err) {
        console.error("Error fetching webinar:", err);
        setFormStatus("❌ Failed to load webinar data");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [mode, webinarId]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      date: Yup.date().required("Date is required"),
      startTime: Yup.string().required("Start time is required"),
      speakerName: Yup.string().required("Speaker name is required"),
      platform: Yup.string().required("Platform is required"),
      meetingLink: Yup.string()
        .url("Must be a valid URL")
        .required("Meeting link is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      setFormStatus("");

      try {
        const formData = new FormData();

        // Tags
        if (Array.isArray(values.tags)) {
          values.tags
            .filter((tag) => tag.trim() !== "")
            .forEach((tag) => formData.append("tags[]", tag));
        }

        // Speaker Photo
        if (values.speakerPhoto instanceof File) {
          formData.append("speakerPhoto", values.speakerPhoto);
        }

        // Scalar fields
        const scalarFields = [
          "title",
          "description",
          "date",
          "startTime",
          "endTime",
          "speakerName",
          "speakerBio",
          "platform",
          "meetingLink",
          "meetingId",
          "passcode",
          "registrationRequired",
          "maxParticipants",
          "status",
        ];

        scalarFields.forEach((field) => {
          const val = values[field];
          if (val !== undefined && val !== null && val !== "") {
            formData.append(field, val);
          }
        });

        // Create or Update
        if (mode === "edit" && webinarId) {
          await updateWebinar(webinarId, formData);
          setFormStatus("✅ Webinar updated successfully!");
        } else {
          await createWebinar(formData);
          setFormStatus("✅ Webinar created successfully!");
          resetForm();
        }
      } catch (err) {
        console.error("Error submitting webinar:", err);
        setFormStatus("❌ Failed to submit webinar.");
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-8 p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        {webinarId ? "Edit Webinar" : "Create Webinar"}
      </h2>

      {loading && (
        <p className="text-center text-gray-500">Loading webinar data...</p>
      )}
      {formStatus && (
        <p
          className={`text-center text-sm font-medium ${
            formStatus.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {formStatus}
        </p>
      )}

      {/* Title & Description */}
      <InputField label="Title" name="title" formik={formik} />
      <TextAreaField label="Description" name="description" formik={formik} />

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date*
          </label>
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
          {formik.touched.date && formik.errors.date && (
            <span className="text-red-500 text-xs">{formik.errors.date}</span>
          )}
        </div>
        <TimeRangePicker formik={formik} />
      </div>

      {/* Platform & Meeting Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Platform" name="platform" formik={formik} />
        <InputField
          label="Meeting Link"
          name="meetingLink"
          formik={formik}
          type="url"
        />
        <InputField label="Meeting ID" name="meetingId" formik={formik} />
        <InputField label="Passcode" name="passcode" formik={formik} />
      </div>

      {/* Speaker info */}
      <InputField label="Speaker Name" name="speakerName" formik={formik} />
      <TextAreaField label="Speaker Bio" name="speakerBio" formik={formik} />
      <FileInput label="Speaker Photo" name="speakerPhoto" formik={formik} />

      {/* Registration & Tags */}
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

      {/* Status */}
      <Dropdown
        label="Status"
        name="status"
        formik={formik}
        options={[
          { _id: "Upcoming", title: "Upcoming" },
          { _id: "Ongoing", title: "Ongoing" },
          { _id: "Completed", title: "Completed" },
        ]}
      />

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow disabled:opacity-50"
        >
          {formik.isSubmitting
            ? "Submitting..."
            : webinarId
            ? "Update Webinar"
            : "Create Webinar"}
        </button>
      </div>
    </form>
  );
};

export default WebinarForm;
