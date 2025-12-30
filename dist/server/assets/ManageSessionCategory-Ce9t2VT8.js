import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { m as updateEvent, n as createEvent, k as handleApiError, I as InputField, D as Dropdown, T as TextAreaField, a as DynamicInputFields, o as getEventById, d as DIR, p as updateInternshipSession, q as createInternshipSession, r as getInternshipSessionById, t as updateWebinar, v as createWebinar, w as getWebinarById, x as updateWorkshop, y as createWorkshop, z as fetchWorkshopById, A as getSessionCategories } from "../entry-server.js";
import { F as FileInput } from "./FileInput-Dlxa0ArB.js";
import { FaUpload, FaTrash } from "react-icons/fa";
import { T as ToggleSwitch } from "./ToggleSwitch-DAPeiKLd.js";
import { R as RadioButtonGroup } from "./RadioButtonGroup-BQF-groJ.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const DateRangePicker = ({ formik }) => /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Start Date*" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "date",
        name: "startDate",
        value: formik.values.startDate,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        required: true,
        className: "w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      }
    )
  ] }),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "End Date*" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "date",
        name: "endDate",
        value: formik.values.endDate,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        required: true,
        className: "w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      }
    )
  ] })
] }) });
const MultiImageUpload = ({ name, formik, label }) => {
  if (!formik) {
    console.error("Formik prop is missing in MultiImageUpload!");
    return null;
  }
  const files = formik.values[name] || [];
  const previews = useMemo(() => {
    if (!files || files.length === 0) return [];
    return files.map((file) => {
      if (file instanceof File) {
        return {
          url: URL.createObjectURL(file),
          name: file.name
        };
      } else if (typeof file === "string") {
        return {
          url: file,
          // ✅ Already a full URL, don't prepend anything
          name: file.split("/").pop()
        };
      } else {
        return { url: "", name: "Unknown" };
      }
    });
  }, [files]);
  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    formik.setFieldValue(name, [...files, ...newFiles]);
  };
  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    formik.setFieldValue(name, updatedFiles);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full mb-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          multiple: true,
          accept: "image/*",
          id: name,
          name,
          onChange: handleFilesChange,
          className: "absolute inset-0 opacity-0 cursor-pointer z-20"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium", children: "Upload one or multiple images" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 hidden md:block", children: "Max: 5MB each" })
      ] })
    ] }),
    previews.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: previews.map((preview, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative border rounded-lg overflow-hidden shadow-sm",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: preview.url,
              alt: `preview-${index}`,
              className: "w-full h-32 object-cover"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => handleRemove(index),
              className: "absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700",
              children: /* @__PURE__ */ jsx(FaTrash, { size: 14 })
            }
          )
        ]
      },
      index
    )) }),
    formik.touched[name] && formik.errors[name] && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-2", children: formik.errors[name] })
  ] });
};
const TimeRangePicker = ({ formik }) => /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Start Time*" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "time",
        name: "startTime",
        value: formik.values.startTime,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        required: true,
        className: "w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      }
    )
  ] }),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "End Time*" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "time",
        name: "endTime",
        value: formik.values.endTime,
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        required: true,
        className: "w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      }
    )
  ] })
] }) });
const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const mode = query.get("type");
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
    isActive: true
  });
  useEffect(() => {
    const loadEvent = async () => {
      if (mode === "edit" && eventId) {
        setLoading(true);
        try {
          const resp = await getEventById(eventId);
          const fetchedEvent = resp?.data?.data;
          if (!fetchedEvent) {
            Swal.fire("Warning", "Event not found", "warning");
            return;
          }
          setInitialValues({
            ...initialValues,
            ...fetchedEvent,
            category: fetchedEvent.category?._id || "",
            startDate: fetchedEvent.startDate ? fetchedEvent.startDate.split("T")[0] : "",
            endDate: fetchedEvent.endDate ? fetchedEvent.endDate.split("T")[0] : "",
            bannerImage: fetchedEvent.bannerImage ? `${DIR.EVENT_BANNER}${fetchedEvent.bannerImage}` : null,
            gallery: Array.isArray(fetchedEvent.gallery) ? fetchedEvent.gallery.map(
              (file) => `${DIR.EVENT_GALLERY_IMAGE}${file}`
            ) : [],
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
              refundPolicy: ""
            },
            socialLinks: {
              facebook: fetchedEvent.socialLinks?.facebook || "",
              instagram: fetchedEvent.socialLinks?.instagram || "",
              twitter: fetchedEvent.socialLinks?.twitter || "",
              linkedin: fetchedEvent.socialLinks?.linkedin || ""
            },
            certificateAvailable: fetchedEvent.certificateAvailable ?? false
          });
        } catch (error) {
          console.error(error);
          Swal.fire("Error", handleApiError(error) || "Failed to load event data", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    loadEvent();
  }, [mode, eventId]);
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required")
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
              if (item !== null && item !== void 0 && item !== "")
                formData.append(`${key}[]`, item);
            });
          } else if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([subKey, subVal]) => {
              if (subVal !== void 0 && subVal !== null) {
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
        Swal.fire("Error", handleApiError(error) || "Failed to submit event", "error");
      } finally {
        setLoading(false);
      }
    }
  });
  const modeOptions = [
    { _id: "Online", title: "Online" },
    { _id: "Offline", title: "Offline" },
    { _id: "Hybrid", title: "Hybrid" }
  ];
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start", children: mode === "edit" ? "Edit Event" : "Create Event" }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Basic Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "Title", name: "title", formik }),
            /* @__PURE__ */ jsx(InputField, { label: "City", name: "location", formik }),
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                label: "Project Mode",
                name: "mode",
                options: modeOptions,
                formik
              }
            ),
            ["Online", "Hybrid"].includes(formik.values.mode) && /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Meeting Link",
                name: "meetingLink",
                formik
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            TextAreaField,
            {
              label: "Description",
              name: "description",
              formik,
              rows: 4,
              className: "md:col-span-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 ", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Date & Time" }),
          /* @__PURE__ */ jsx(DateRangePicker, { formik }),
          /* @__PURE__ */ jsx(TimeRangePicker, { formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Organizers & Speakers" }),
          /* @__PURE__ */ jsx(InputField, { label: "Organizer", name: "organizer", formik }),
          /* @__PURE__ */ jsx(DynamicInputFields, { label: "Speakers", name: "speakers", formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Pricing & Participants" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Max Participants",
                name: "maxParticipants",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Is Free Event",
                name: "isFree",
                checked: formik.values.isFree,
                onChange: (e) => formik.setFieldValue("isFree", e.target.checked)
              }
            ),
            !formik.values.isFree && /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Price",
                name: "price",
                type: "number",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Agenda" }),
          formik.values.agenda.map((item, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: item.time,
                    onChange: (e) => {
                      const arr = [...formik.values.agenda];
                      arr[idx].time = e.target.value;
                      formik.setFieldValue("agenda", arr);
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newAgenda = [...formik.values.agenda, { time: "", activity: "" }];
                        formik.setFieldValue("agenda", newAgenda);
                      }
                    },
                    className: "border border-blue-500 p-2 rounded-lg w-full bg-white",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: item.activity,
                    onChange: (e) => {
                      const arr = [...formik.values.agenda];
                      arr[idx].activity = e.target.value;
                      formik.setFieldValue("agenda", arr);
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newAgenda = [...formik.values.agenda, { time: "", activity: "" }];
                        formik.setFieldValue("agenda", newAgenda);
                      }
                    },
                    placeholder: `Activity ${idx + 1}`,
                    className: "border border-blue-500 p-2 rounded-lg w-full bg-white",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  formik.values.agenda.length > 1 && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const filtered = formik.values.agenda.filter((_, i) => i !== idx);
                        formik.setFieldValue("agenda", filtered);
                      },
                      className: "bg-red-500 text-white px-2 rounded",
                      children: "✕"
                    }
                  ),
                  idx === formik.values.agenda.length - 1 && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => formik.setFieldValue("agenda", [
                        ...formik.values.agenda,
                        { time: "", activity: "" }
                      ]),
                      className: "bg-blue-500 text-white px-4 rounded",
                      children: "+"
                    }
                  )
                ] })
              ]
            },
            idx
          ))
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Additional Info" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(FileInput, { label: "Banner Image", name: "bannerImage", formik }),
            /* @__PURE__ */ jsx(DynamicInputFields, { label: "Tags", name: "tags", formik }),
            /* @__PURE__ */ jsx(InputField, { label: "Priority", name: "priority", formik }),
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                label: "Resources",
                name: "resources",
                formik
              }
            ),
            /* @__PURE__ */ jsx(MultiImageUpload, { label: "Gallery", name: "gallery", formik }),
            /* @__PURE__ */ jsx(
              DynamicInputFields,
              {
                label: "Sponsors",
                name: "sponsors",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Feedback Form Link",
                name: "feedbackFormLink",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Registration Link",
                name: "registrationLink",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Certificate Available",
                name: "certificateAvailable",
                checked: formik.values.certificateAvailable,
                onChange: (e) => formik.setFieldValue("certificateAvailable", e.target.checked)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Social Media Links" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Facebook",
                name: "socialLinks.facebook",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Instagram",
                name: "socialLinks.instagram",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Twitter",
                name: "socialLinks.twitter",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "LinkedIn",
                name: "socialLinks.linkedin",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end pt-4 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(-1),
              className: "px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting || loading,
              className: "px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed",
              children: mode === "edit" ? loading ? "Updating..." : "Update Event" : loading ? "Creating..." : "Create Event"
            }
          )
        ] })
      ]
    }
  );
};
const InternshipSessionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("id");
  const isEditMode = queryParams.get("type") === "edit";
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      duration: "",
      mode: "",
      location: "",
      topics: [""],
      capacity: "",
      fees: {
        amount: "",
        refundPolicy: ""
      },
      certification: false,
      status: "",
      isFree: false
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      duration: Yup.string().required("Duration is required")
      // mode: Yup.string().required("Mode is required"),
      // location: Yup.string().required("Location is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          ...values,
          capacity: Number(values.capacity),
          fees: values.isFree ? { amount: 0, refundPolicy: "No Refund" } : { ...values.fees, amount: Number(values.fees.amount) },
          // fees: {
          //   ...values.fees,
          //   amount: Number(values.fees.amount),
          // },
          topics: values.topics.filter((t) => t.trim() !== "")
        };
        if (isEditMode && sessionId) {
          await updateInternshipSession(sessionId, payload);
          await Swal.fire({
            icon: "success",
            title: "Internship session updated successfully!",
            confirmButtonColor: "#2563eb"
          });
        } else {
          await createInternshipSession(payload);
          await Swal.fire({
            icon: "success",
            title: "Internship session created successfully!",
            confirmButtonColor: "#2563eb"
          });
          resetForm();
        }
        navigate("/book-session");
      } catch (error) {
        console.error("❌ Error submitting internship session:", error);
        Swal.fire({
          icon: "error",
          title: handleApiError(error) || "Submission Failed",
          // text: "Please Try Again.",
          confirmButtonColor: "#dc2626"
        });
      } finally {
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    const fetchSession = async () => {
      if (!isEditMode || !sessionId) return;
      try {
        const data = await getInternshipSessionById(sessionId);
        if (data) {
          formik.setValues({
            title: data.title || "",
            description: data.description || "",
            startDate: data.startDate?.split("T")[0] || "",
            endDate: data.endDate?.split("T")[0] || "",
            duration: data.duration || "",
            mode: data.mode || "",
            location: data.location || "",
            topics: Array.isArray(data.topics) ? data.topics : [""],
            capacity: data.capacity?.toString() || "",
            fees: {
              amount: data.fees?.amount?.toString() || "",
              refundPolicy: data.fees?.refundPolicy || ""
            },
            certification: data.certification ?? false,
            status: data.status || "",
            isFree: data.isFree ?? false
            // ✅ Add this line
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch internship session:", error);
        Swal.fire({
          icon: "error",
          title: handleApiError(error) || "Fetch Error",
          text: "Unable to load session details."
        });
      }
    };
    fetchSession();
  }, [isEditMode, sessionId]);
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start", children: isEditMode ? "Edit Internship Session" : "Create Internship Session" }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Basic Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "Title", name: "title", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Duration (in months)",
                name: "duration",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(InputField, { label: "City", name: "location", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Capacity",
                name: "capacity",
                type: "number",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Fees & Payment" }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Is Free?",
              name: "isFree",
              checked: formik.values.isFree,
              onChange: () => {
                const newValue = !formik.values.isFree;
                formik.setFieldValue("isFree", newValue);
                if (newValue) {
                  formik.setFieldValue("fees.amount", 0);
                  formik.setFieldValue("fees.refundPolicy", "No Refund");
                }
              }
            }
          ) }),
          !formik.values.isFree && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-4", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Amount (₹)",
                name: "fees.amount",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                label: "Refund Policy",
                name: "fees.refundPolicy",
                formik,
                options: [
                  { _id: "no_refund", title: "No Refund" },
                  { _id: "7_days", title: "7 Days" },
                  { _id: "15_days", title: "15 Days" },
                  { _id: "1_month", title: "1 Month" }
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Session Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                label: "Mode",
                name: "mode",
                formik,
                options: [
                  { _id: "Online", title: "Online" },
                  { _id: "Offline", title: "Offline" },
                  { _id: "Hybrid", title: "Hybrid" }
                ]
              }
            ),
            /* @__PURE__ */ jsx(DateRangePicker, { formik })
          ] }),
          /* @__PURE__ */ jsx(TextAreaField, { label: "Description", name: "description", formik }),
          /* @__PURE__ */ jsx(DynamicInputFields, { label: "Topics", name: "topics", formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Additional Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                label: "Status",
                name: "status",
                formik,
                options: [
                  { _id: "Upcoming", title: "Upcoming" },
                  { _id: "Ongoing", title: "Ongoing" },
                  { _id: "Past", title: "Past" }
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleSwitch,
              {
                label: "Certification Available",
                name: "certification",
                checked: formik.values.certification,
                onChange: () => formik.setFieldValue(
                  "certification",
                  !formik.values.certification
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end pt-4 border-t border-gray-200 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(-1),
              className: "px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting,
              className: "px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50",
              children: formik.isSubmitting ? isEditMode ? "Updating..." : "Creating..." : isEditMode ? "Update Internship Session" : "Create Internship Session"
            }
          )
        ] })
      ]
    }
  );
};
const WebinarForm = () => {
  const { id: categoryId } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);
  const mode = query.get("type");
  const webinarId = query.get("id");
  const [loading, setLoading] = useState(false);
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
    status: "Upcoming"
  };
  const [initialValues, setInitialValues] = useState(defaultValues);
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
          speakerPhoto: data.speakerPhoto ? `${DIR.WEBINAR_SPEAKER_PHOTO}${data.speakerPhoto}` : null,
          tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [""]
        });
      } catch (err) {
        console.error("❌ Error fetching webinar:", err);
        Swal.fire("Error", handleApiError(err) || "Failed to load webinar data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWebinar();
  }, [mode, webinarId]);
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required")
    // date: Yup.date().required("Date is required"),
    // startTime: Yup.string().required("Start time is required"),
    // speakerName: Yup.string().required("Speaker name is required"),
    // platform: Yup.string().required("Platform is required"),
    // meetingLink: Yup.string()
    //   .url("Must be a valid URL")
    //   .required("Meeting link is required"),
  });
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "speakerPhoto" || key === "tags") return;
          if (value !== void 0 && value !== null && value !== "")
            formData.append(key, value);
        });
        if (Array.isArray(values.tags)) {
          values.tags.filter((tag) => tag.trim() !== "").forEach((tag) => formData.append("tags[]", tag));
        }
        if (values.speakerPhoto instanceof File) {
          formData.append("speakerPhoto", values.speakerPhoto);
        }
        if (mode === "edit" && webinarId) {
          await updateWebinar(webinarId, formData);
          Swal.fire({
            title: "Success",
            text: "Webinar updated successfully!",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => navigate("/book-session"));
        } else {
          await createWebinar(formData);
          Swal.fire({
            title: "Success",
            text: "Webinar created successfully!",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            resetForm();
            navigate("/book-session");
          });
        }
      } catch (err) {
        console.error("❌ Error submitting webinar:", err);
        Swal.fire("Error", handleApiError(err) || "Failed to submit webinar", "error");
      } finally {
        setSubmitting(false);
      }
    }
  });
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start", children: mode === "edit" ? "Edit Webinar" : "Create Webinar" }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Basic Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "Title *", name: "title", formik }),
            /* @__PURE__ */ jsx(InputField, { label: "Platform *", name: "platform", formik })
          ] }),
          /* @__PURE__ */ jsx(TextAreaField, { label: "Description", name: "description", formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Date & Time" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Date *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  name: "date",
                  value: formik.values.date,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  className: "w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                }
              ),
              formik.touched.date && formik.errors.date && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: formik.errors.date })
            ] }),
            /* @__PURE__ */ jsx(TimeRangePicker, { formik })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Meeting Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Meeting Link *",
                name: "meetingLink",
                formik,
                type: "url"
              }
            ),
            /* @__PURE__ */ jsx(InputField, { label: "Meeting ID", name: "meetingId", formik }),
            /* @__PURE__ */ jsx(InputField, { label: "Passcode", name: "passcode", formik })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Speaker Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "Speaker Name *", name: "speakerName", formik }),
            /* @__PURE__ */ jsx(TextAreaField, { label: "Speaker Bio", name: "speakerBio", formik }),
            /* @__PURE__ */ jsx(FileInput, { label: "Speaker Photo", name: "speakerPhoto", formik })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Registration & Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Max Participants",
                name: "maxParticipants",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(DynamicInputFields, { label: "Tags", name: "tags", formik })
          ] }),
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Registration Required",
              name: "registrationRequired",
              checked: formik.values.registrationRequired,
              onChange: () => formik.setFieldValue(
                "registrationRequired",
                !formik.values.registrationRequired
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Status" }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Webinar Status",
              name: "status",
              formik,
              options: [
                { _id: "Upcoming", title: "Upcoming" },
                { _id: "Ongoing", title: "Ongoing" },
                { _id: "Completed", title: "Completed" }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end pt-4 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(-1),
              className: "px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting || loading,
              className: "px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              children: mode === "edit" ? loading ? "Updating..." : "Update Webinar" : loading ? "Creating..." : "Create Webinar"
            }
          )
        ] })
      ]
    }
  );
};
const useQuery = () => new URLSearchParams(useLocation().search);
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};
const WorkshopForm = () => {
  const query = useQuery();
  const id = query.get("id");
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkshopById(id);
        if (data) {
          const safeData = {
            ...data,
            prerequisites: data.prerequisites?.length ? data.prerequisites : [""],
            topics: data.topics?.length ? data.topics : [""],
            // Convert instructors to array of strings (only names)
            // instructors:
            //   data.instructors?.length > 0
            //     ? data.instructors.map((ins) => ins.name ?? "")
            //     : [""],
            instructors: data.instructors?.length > 0 ? data.instructors.map((name) => name) : [""],
            contact: {
              email: data.contact?.email ?? "",
              phone: data.contact?.phone ?? ""
            },
            startDate: formatDateForInput(data.startDate),
            endDate: formatDateForInput(data.endDate),
            certification: data.certification ?? false,
            status: data.status ?? "Past"
          };
          setInitialData(safeData);
        }
      } catch (error) {
        console.error("Failed to fetch workshop:", error);
        Swal.fire("Error", handleApiError(error) || "Failed to load workshop details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required")
    // fees: Yup.number()
    //   .min(0, "Fees must be positive")
    //   .required("Fees is required"),
    //   instructors: Yup.array().of(
    //   Yup.string().required("Instructor name is required")
    // ),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialData || {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      duration: "",
      location: "",
      prerequisites: [""],
      topics: [""],
      instructors: [""],
      // array of strings now
      registrationLink: "",
      fees: "",
      certification: false,
      contact: { email: "", phone: "" },
      status: "Past",
      isFree: false
      // ✅ New field
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          fees: Number(values.fees),
          prerequisites: values.prerequisites.filter((p) => p.trim() !== ""),
          topics: values.topics.filter((t) => t.trim() !== ""),
          instructors: values.instructors.filter((ins) => ins.trim() !== "")
          // strings
          // instructors: values.instructors.filter((ins) => ins.trim() !== ""), // array of names
        };
        if (id) {
          await updateWorkshop(id, payload);
          await Swal.fire(
            "Success",
            "Workshop updated successfully!",
            "success"
          );
        } else {
          await createWorkshop(payload);
          await Swal.fire(
            "Success",
            "Workshop created successfully!",
            "success"
          );
          resetForm();
        }
        navigate("/book-session");
      } catch (error) {
        console.error("Error during submission:", error);
        Swal.fire("Error", handleApiError(error) || "Failed to submit workshop.", "error");
      } finally {
        setSubmitting(false);
      }
    }
  });
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-40 text-gray-500 font-semibold", children: "Loading workshop data..." });
  }
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4", children: id ? "Edit Workshop" : "Create Workshop" }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Basic Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "Title", name: "title", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Duration (in min)",
                name: "duration",
                type: "number",
                formik
              }
            ),
            /* @__PURE__ */ jsx(InputField, { label: "City", name: "location", formik }),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Registration Link",
                name: "registrationLink",
                formik
              }
            ),
            /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Pricing" }),
              /* @__PURE__ */ jsx(
                ToggleSwitch,
                {
                  label: "Is this workshop free?",
                  name: "isFree",
                  checked: formik.values.isFree,
                  onChange: () => {
                    const newValue = !formik.values.isFree;
                    formik.setFieldValue("isFree", newValue);
                    if (newValue) formik.setFieldValue("fees", 0);
                  }
                }
              ),
              !formik.values.isFree && /* @__PURE__ */ jsx(
                InputField,
                {
                  label: "Fees",
                  name: "fees",
                  type: "number",
                  formik
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(TextAreaField, { label: "Description", name: "description", formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Schedule" }),
          /* @__PURE__ */ jsx(DateRangePicker, { formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Workshop Content" }),
          /* @__PURE__ */ jsx(
            DynamicInputFields,
            {
              label: "Prerequisites",
              name: "prerequisites",
              formik
            }
          ),
          /* @__PURE__ */ jsx(DynamicInputFields, { label: "Topics", name: "topics", formik })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Instructors" }),
          /* @__PURE__ */ jsx(
            DynamicInputFields,
            {
              label: "Instructor Name",
              name: "instructors",
              formik
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Certification" }),
          /* @__PURE__ */ jsx(
            ToggleSwitch,
            {
              label: "Does this workshop offer a certification?",
              name: "certification",
              checked: formik.values.certification,
              onChange: () => formik.setFieldValue("certification", !formik.values.certification)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Contact Information" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Contact Email",
                name: "contact.email",
                formik
              }
            ),
            /* @__PURE__ */ jsx(
              InputField,
              {
                label: "Contact Phone",
                name: "contact.phone",
                formik
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2", children: "Workshop Status" }),
          /* @__PURE__ */ jsx(
            RadioButtonGroup,
            {
              label: "Select Workshop Status",
              name: "status",
              formik,
              options: [
                { label: "Past", value: "Past" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "Ongoing", value: "Ongoing" }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end pt-4 border-t border-gray-200 gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(-1),
              className: "px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formik.isSubmitting,
              className: "px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50",
              children: formik.isSubmitting ? id ? "Updating..." : "Creating..." : id ? "Update Workshop" : "Create Workshop"
            }
          )
        ] })
      ]
    }
  );
};
const formMap = {
  workshop: WorkshopForm,
  "internship-session": InternshipSessionForm,
  webinar: WebinarForm,
  event: EventForm
  // Add more session types here as needed
};
const ManageSessionCategory = () => {
  const { slug, id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const categories = await getSessionCategories();
        console.log("✅ Available Categories:", categories.map((cat) => cat._id));
        console.log("🔍 Searching for ID:", id);
        const foundCategory = categories.find(
          (item) => String(item._id) === String(id)
        );
        if (foundCategory) {
          console.log("✅ Found Category:", foundCategory);
        } else {
          console.warn("❌ No category found for the provided ID.");
        }
        setCategory(foundCategory || null);
      } catch (error) {
        console.error("❌ Error fetching session categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);
  if (loading) return /* @__PURE__ */ jsx("p", { children: "Loading..." });
  if (!category)
    return /* @__PURE__ */ jsx("p", { className: "text-red-500 text-center mt-8 font-medium", children: "Category not found." });
  const FormComponent = formMap[category.slug.toLowerCase()];
  console.log("Category slug:", category.slug);
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen flex flex-col items-center justify-start ", children: [
    /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full max-w-6xl p-2 md:p-4", children: FormComponent ? /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(FormComponent, { category }) }) : /* @__PURE__ */ jsx("p", { className: "text-center text-red-500 font-medium text-lg", children: "No form available for this type." }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-200 to-transparent -z-10" })
  ] });
};
export {
  ManageSessionCategory as default
};
