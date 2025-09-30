
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

// import EventTablePage from "../../pages/EventTablePage";
import EventTablePage from "../../pages/admin/EventTablePage";

import DateRangePicker from "../form/DateRangePicker";
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import FileInput from "../form/FileInput";
import InputField from "../form/InputField";
import MultiImageUpload from "../form/MultiImageUpload";
import TextAreaField from "../form/TextAreaField";
import TimeRangePicker from "../form/TimeRangePicker";
import ToggleSwitch from "../form/ToggleSwitch";

import { createEvent, getEventById, updateEvent } from "./upSkillsApi";
// import { DIR } from "../../utils/constants";
import { DIR } from "../../utils/constants";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const mode = query.get("type"); // "edit" or "add"
  const eventId = query.get("id");

  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(false);

  // Default form values
  const defaultValues = {
    title: "",
    slug: "",
    description: "",
    category: id || "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: "",
    location: "",
    mode: "Offline",
    meetingLink: "",
    organizer: "",
    speakers: [""],
    bannerImage: null,
    gallery: [],
    registrationLink: null,
    isFree: true,
    price: 0,
    fees: {
      amount: "",
      currency: "INR",
      refundPolicy: "",
    },
    tags: [""],
    priority: "",
    maxParticipants: "",
    agenda: [{ time: "", activity: "" }],
    resources: [],
    sponsors: [""],
    certificateAvailable: false,
    feedbackFormLink: "",
    topics: [""],
    capacity: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    isActive: true,
  };

  const [initialValues, setInitialValues] = useState(defaultValues);

  // Fetch event data if in edit mode and set form initial values
  useEffect(() => {
    const loadEvent = async () => {
      if (mode === "edit" && eventId) {
        setLoading(true);
        try {
          const resp = await getEventById(eventId);
          const fetchedEvent = resp?.data?.data;
          if (!fetchedEvent) {
            // maybe show error or fallback
            return;
          }
          // Prepare values for Formik, mapping existing images to full URLs
          const prepared = {
            ...defaultValues,
            ...fetchedEvent,
            category: fetchedEvent.category?._id || "",
            startDate: fetchedEvent.startDate
              ? fetchedEvent.startDate.split("T")[0]
              : "",
            endDate: fetchedEvent.endDate
              ? fetchedEvent.endDate.split("T")[0]
              : "",
            startTime: fetchedEvent.startTime || "",
            endTime: fetchedEvent.endTime || "",
            bannerImage: fetchedEvent.bannerImage
              ? `${DIR.EVENT_BANNER}${fetchedEvent.bannerImage}`
              : null,
            gallery: Array.isArray(fetchedEvent.gallery)
              ? fetchedEvent.gallery.map(
                  (file) => `${DIR.EVENT_GALLERY_IMAGE}${file}`
                )
              : [],
            tags: fetchedEvent.tags || [""],
            priority: fetchedEvent.priority || "",
            resources: fetchedEvent.resources || [],
            speakers: fetchedEvent.speakers || [""],
            sponsors: fetchedEvent.sponsors || [""],
            topics: fetchedEvent.topics || [""],
            capacity: fetchedEvent.capacity || "",
            duration: fetchedEvent.duration || "",
            fees: fetchedEvent.fees || {
              amount: "",
              currency: "INR",
              refundPolicy: "",
            },
            socialLinks: {
              facebook: fetchedEvent.socialLinks?.facebook || "",
              instagram: fetchedEvent.socialLinks?.instagram || "",
              twitter: fetchedEvent.socialLinks?.twitter || "",
              linkedin: fetchedEvent.socialLinks?.linkedin || "",
            },
            certificateAvailable: fetchedEvent.certificateAvailable ?? false,
          };
          setInitialValues(prepared);
        } catch (error) {
          console.error("Error fetching event:", error);
          setMessage("Failed to load event for editing.");
        } finally {
          setLoading(false);
        }
      } else {
        // If not edit mode, reset to default
        setInitialValues(defaultValues);
      }
    };

    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, eventId]); // Re-run if mode or eventId changes

  // Validation schema (you can extend this as per your field requirements)
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
    // Add more required validations as needed
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");

      try {
        const formData = new FormData();

        // Append simple scalar or nested data excluding bannerImage and gallery
        Object.entries(values).forEach(([key, value]) => {
          if (key === "bannerImage" || key === "gallery") return;

          if (key === "agenda") {
            // agenda is an array of objects
            value.forEach((item, idx) => {
              formData.append(`agenda[${idx}][time]`, item.time);
              formData.append(`agenda[${idx}][activity]`, item.activity);
            });
          } else if (Array.isArray(value)) {
            // arrays of strings or similar
            value.forEach((item) => {
              if (item !== null && item !== undefined && item !== "")
                formData.append(`${key}[]`, item);
            });
          } else if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            // nested object (e.g. fees, socialLinks)
            Object.entries(value).forEach(([subKey, subVal]) => {
              if (subVal !== undefined && subVal !== null) {
                formData.append(`${key}[${subKey}]`, subVal);
              }
            });
          } else {
            // simple scalar
            formData.append(key, value);
          }
        });

        // Handle bannerImage: only upload if it's a File (new upload)
        if (values.bannerImage instanceof File) {
          formData.append("bannerImage", values.bannerImage);
        }

        // Handle gallery: send existing filenames and new image files
        if (Array.isArray(values.gallery)) {
          values.gallery.forEach((item) => {
            if (item instanceof File) {
              // new image file
              formData.append("gallery", item);
            } else if (typeof item === "string") {
              // existing URL => extract filename
              const fileName = item.split("/").pop();
              formData.append("gallery", fileName);
            }
          });
        }

        // ... after building formData
        console.log("FormData contents:");
        for (let pair of formData.entries()) {
          console.log(pair[0], ":", pair[1]);
        }

        let resp;

        if (mode === "edit" && eventId) {
          resp = await updateEvent(eventId, formData);
          setMessage("✅ Event updated successfully");
        } else {
          resp = await createEvent(formData);
          setMessage("✅ Event created successfully");
          formik.resetForm();
        }

        // Optionally you can use resp to do further actions or redirect
      } catch (err) {
        console.error("Submit error:", err);
        setMessage("❌ Failed to submit event.");
      } finally {
        setLoading(false);
      }
    },
  });

  const modeOptions = [
    { _id: "Online", title: "Online" },
    { _id: "Offline", title: "Offline" },
    { _id: "Hybrid", title: "Hybrid" },
  ];

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200"
    >
      <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8 text-center">
        {mode === "edit" ? "Edit Event" : "Create Event"}
      </h2>

      {message && (
        <p className="mb-4 text-center text-blue-600 font-semibold">
          {message}
        </p>
      )}

      {/* Basic Information */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Title" name="title" formik={formik} />
          <InputField label="Slug" name="slug" formik={formik} />
          <TextAreaField
            label="Description"
            name="description"
            formik={formik}
            rows={4}
            className="md:col-span-2"
          />
          <InputField label="Location" name="location" formik={formik} />
          <Dropdown
            label="Project Mode"
            name="mode"
            options={modeOptions}
            formik={formik}
          />
          {["Online", "Hybrid"].includes(formik.values.mode) && (
            <InputField
              label="Meeting Link"
              name="meetingLink"
              formik={formik}
            />
          )}
        </div>
      </section>

      {/* Date & Time */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Date & Time
        </h3>
        <DateRangePicker formik={formik} />
        <TimeRangePicker formik={formik} />
      </section>

      {/* Organizers & Speakers */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Organizers & Speakers
        </h3>
        <InputField label="Organizer" name="organizer" formik={formik} />
        <DynamicInputFields label="Speakers" name="speakers" formik={formik} />
      </section>

      {/* Pricing & Participants */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Pricing & Participants
        </h3>
        <ToggleSwitch
          label="Is Free Event"
          name="isFree"
          checked={formik.values.isFree}
          onChange={(e) => formik.setFieldValue("isFree", e.target.checked)}
        />
        {!formik.values.isFree && (
          <InputField
            label="Price"
            name="price"
            type="number"
            formik={formik}
          />
        )}
        <InputField
          label="Max Participants"
          name="maxParticipants"
          type="number"
          formik={formik}
        />
      </section>

      {/* Agenda */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Agenda
        </h3>
        {formik.values.agenda.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2"
          >
            <input
              type="time"
              value={item.time}
              onChange={(e) => {
                const arr = [...formik.values.agenda];
                arr[idx].time = e.target.value;
                formik.setFieldValue("agenda", arr);
              }}
              className="border border-blue-500 p-2 rounded w-full"
              required
            />
            <input
              type="text"
              value={item.activity}
              onChange={(e) => {
                const arr = [...formik.values.agenda];
                arr[idx].activity = e.target.value;
                formik.setFieldValue("agenda", arr);
              }}
              placeholder={`Activity ${idx + 1}`}
              className="border border-blue-500 p-2 rounded w-full"
              required
            />
            <div className="flex gap-2">
              {formik.values.agenda.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const filtered = formik.values.agenda.filter(
                      (_, i) => i !== idx
                    );
                    formik.setFieldValue("agenda", filtered);
                  }}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              )}
              {idx === formik.values.agenda.length - 1 && (
                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue("agenda", [
                      ...formik.values.agenda,
                      { time: "", activity: "" },
                    ])
                  }
                  className="bg-blue-500 text-white px-4 rounded"
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Additional Info */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Additional Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FileInput label="Banner Image" name="bannerImage" formik={formik} />
          <DynamicInputFields label="Tags" name="tags" formik={formik} />
          <InputField label="Priority" name="priority" formik={formik} />
          <DynamicInputFields
            label="Resources"
            name="resources"
            formik={formik}
          />
          <MultiImageUpload label="Gallery" name="gallery" formik={formik} />
          <DynamicInputFields
            label="Sponsors"
            name="sponsors"
            formik={formik}
          />
          <InputField
            label="Feedback Form Link"
            name="feedbackFormLink"
            formik={formik}
          />
          <InputField
            label="Registration Link"
            name="registrationLink"
            formik={formik}
          />
          <ToggleSwitch
            label="Certificate Available"
            name="certificateAvailable"
            checked={formik.values.certificateAvailable}
            onChange={(e) =>
              formik.setFieldValue("certificateAvailable", e.target.checked)
            }
          />
        </div>
      </section>

      {/* Social Media Links */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Facebook"
            name="socialLinks.facebook"
            formik={formik}
          />
          <InputField
            label="Instagram"
            name="socialLinks.instagram"
            formik={formik}
          />
          <InputField
            label="Twitter"
            name="socialLinks.twitter"
            formik={formik}
          />
          <InputField
            label="LinkedIn"
            name="socialLinks.linkedin"
            formik={formik}
          />
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={formik.isSubmitting || loading}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "edit" ? "Update Event" : "Create Event"}
        </button>
      </div>

      {/* Optional: status message */}
      {message && (
        <p className="text-sm mt-4 text-center text-gray-600 italic">
          {message}
        </p>
      )}

      {/* Modal / table for events (if needed) */}
      <EventTablePage
        isOpen={isTableOpen}
        onClose={() => setIsTableOpen(false)}
        // you might pass editing callback
      />
    </form>
  );
};

export default EventForm;
