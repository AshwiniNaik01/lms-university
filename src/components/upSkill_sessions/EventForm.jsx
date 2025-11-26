import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import DateRangePicker from "../form/DateRangePicker";
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import FileInput from "../form/FileInput";
import InputField from "../form/InputField";
import MultiImageUpload from "../form/MultiImageUpload";
import TextAreaField from "../form/TextAreaField";
import TimeRangePicker from "../form/TimeRangePicker";
import ToggleSwitch from "../form/ToggleSwitch";

import { DIR } from "../../utils/constants";
import { createEvent, getEventById, updateEvent } from "./upSkillsApi";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const mode = query.get("type"); // "edit" or "add"
  const eventId = query.get("id");

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    // slug: "",
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
    fees: { amount: "", currency: "INR", refundPolicy: "" },
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
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
    isActive: true,
  });

  useEffect(() => {
    const loadEvent = async () => {
      if (mode === "edit" && eventId) {
        setLoading(true);
        try {
          const resp = await getEventById(eventId);
          const fetchedEvent = resp?.data?.data;

          if (!fetchedEvent) {
            Swal.fire("Error", "Event not found", "error");
            return;
          }

          setInitialValues({
            ...initialValues,
            ...fetchedEvent,
            category: fetchedEvent.category?._id || "",
            startDate: fetchedEvent.startDate
              ? fetchedEvent.startDate.split("T")[0]
              : "",
            endDate: fetchedEvent.endDate
              ? fetchedEvent.endDate.split("T")[0]
              : "",
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
          });
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to load event data", "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadEvent();
  }, [mode, eventId]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    // slug: Yup.string().required("Slug is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (key === "bannerImage" || key === "gallery") return;

          if (key === "agenda") {
            value.forEach((item, idx) => {
              formData.append(`agenda[${idx}][time]`, item.time);
              formData.append(`agenda[${idx}][activity]`, item.activity);
            });
          } else if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== null && item !== undefined && item !== "")
                formData.append(`${key}[]`, item);
            });
          } else if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([subKey, subVal]) => {
              if (subVal !== undefined && subVal !== null) {
                formData.append(`${key}[${subKey}]`, subVal);
              }
            });
          } else {
            formData.append(key, value);
          }
        });

        if (values.bannerImage instanceof File) {
          formData.append("bannerImage", values.bannerImage);
        }
        if (Array.isArray(values.gallery)) {
          values.gallery.forEach((item) => {
            if (item instanceof File) formData.append("gallery", item);
            else if (typeof item === "string")
              formData.append("gallery", item.split("/").pop());
          });
        }

        if (mode === "edit" && eventId) {
          await updateEvent(eventId, formData);
          Swal.fire("Success", "Event updated successfully", "success").then(
            () => {
              navigate("/book-session");
            }
          );
        } else {
          await createEvent(formData);
          Swal.fire("Success", "Event created successfully", "success").then(
            () => {
              formik.resetForm();
              navigate("/book-session");
            }
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to submit event", "error");
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
      className="space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80"
    >
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start">
        {mode === "edit" ? "Edit Event" : "Create Event"}
      </h2>

      {/* Basic Info */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" name="title" formik={formik} />
          {/* <InputField label="Slug" name="slug" formik={formik} /> */}

          <InputField label="City" name="location" formik={formik} />
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
        <TextAreaField
          label="Description"
          name="description"
          formik={formik}
          rows={4}
          className="md:col-span-2"
        />
      </section>

      {/* Date & Time */}
      <section className="space-y-4 ">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Date & Time
        </h3>
        <DateRangePicker formik={formik} />
        <TimeRangePicker formik={formik} />
      </section>

      {/* Organizers & Speakers */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Organizers & Speakers
        </h3>
        <InputField label="Organizer" name="organizer" formik={formik} />
        <DynamicInputFields label="Speakers" name="speakers" formik={formik} />
      </section>

      {/* Pricing & Participants */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Pricing & Participants
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <InputField
            label="Max Participants"
            name="maxParticipants"
            type="number"
            formik={formik}
          />
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
        </div>
      </section>

      {/* Agenda */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Agenda
        </h3>
        {/* {formik.values.agenda.map((item, idx) => (
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
              className="border border-blue-500 p-2 rounded-lg w-full bg-white"
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
              className="border border-blue-500 p-2 rounded-lg w-full bg-white"
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
        ))} */}


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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent form submit
          const newAgenda = [...formik.values.agenda, { time: "", activity: "" }];
          formik.setFieldValue("agenda", newAgenda);
        }
      }}
      className="border border-blue-500 p-2 rounded-lg w-full bg-white"
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent form submit
          const newAgenda = [...formik.values.agenda, { time: "", activity: "" }];
          formik.setFieldValue("agenda", newAgenda);
        }
      }}
      placeholder={`Activity ${idx + 1}`}
      className="border border-blue-500 p-2 rounded-lg w-full bg-white"
      required
    />
    <div className="flex gap-2">
      {formik.values.agenda.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const filtered = formik.values.agenda.filter((_, i) => i !== idx);
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
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Additional Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "edit"
            ? loading
              ? "Updating..."
              : "Update Event"
            : loading
            ? "Creating..."
            : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
