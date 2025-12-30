import { jsx, jsxs } from "react/jsx-runtime";
import { useFormik, FormikProvider } from "formik";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { j as apiClient, I as InputField, D as Dropdown, C as COURSE_NAME, g as getAllCourses } from "../entry-server.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "yup";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const AddMeetingForm = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customPlatform, setCustomPlatform] = useState("");
  const [trainers, setTrainers] = useState([]);
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
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      notification: ""
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
            text: res.data.message || "Session created successfully!",
            confirmButtonText: "OK"
          });
          formik.resetForm();
          setCustomPlatform("");
        }
      } catch (err) {
        console.error("Error creating session:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to create session.",
          confirmButtonText: "OK"
        });
      } finally {
        setLoading(false);
      }
    }
  });
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    apiClient.get("/api/trainer/all").then((res) => {
      if (res.data.success) {
        setTrainers(res.data.data);
      }
    }).catch((err) => {
      console.error("Error fetching trainers:", err);
    });
  }, []);
  useEffect(() => {
    if (!formik.values.course) {
      setBatches([]);
      formik.setFieldValue("batch", "");
      return;
    }
    apiClient.get(`/api/batches/course/${formik.values.course}`).then((res) => {
      if (res.data.success && res.data.data.length > 0) {
        setBatches(res.data.data);
      } else {
        setBatches([]);
        formik.setFieldValue("batch", "");
      }
    }).catch((err) => {
      setBatches([]);
      formik.setFieldValue("batch", "");
      console.error("Error fetching batches:", err);
    });
  }, [formik.values.course]);
  useEffect(() => {
    if (!formik.values.batch) return;
    apiClient.get(`/api/batches/batches/${formik.values.batch}`).then((res) => {
      if (res.data.success && res.data.data) {
        const batch = res.data.data;
        if (batch.trainer && batch.trainer.length > 0) {
          formik.setFieldValue("trainer", batch.trainer[0]._id);
        }
        if (batch.startDate) formik.setFieldValue("startDate", batch.startDate);
        if (batch.endDate) formik.setFieldValue("endDate", batch.endDate);
        if (batch.time?.start) formik.setFieldValue("startTime", batch.time.start);
        if (batch.time?.end) formik.setFieldValue("endTime", batch.time.end);
      }
    }).catch((err) => console.error("Error fetching batch details:", err));
  }, [formik.values.batch]);
  const calculateMeetingCount = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  const meetingOccurrence = calculateMeetingCount(
    formik.values.startDate,
    formik.values.endDate
  );
  return /* @__PURE__ */ jsx(FormikProvider, { value: formik, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: formik.handleSubmit,
      className: "p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-[rgba(14,85,200,0.83)] text-center mb-6", children: "Add Session" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsx(InputField, { label: "Title*", name: "title", formik }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Platform*" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: ["Zoom", "Google Meet", "Teams"].includes(formik.values.platform) ? formik.values.platform : "Other",
                onChange: (e) => {
                  const value = e.target.value;
                  formik.setFieldValue("platform", value);
                  if (value !== "Other") setCustomPlatform("");
                },
                className: "w-full px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select Platform" }),
                  /* @__PURE__ */ jsx("option", { value: "Zoom", children: "Zoom" }),
                  /* @__PURE__ */ jsx("option", { value: "Google Meet", children: "Google Meet" }),
                  /* @__PURE__ */ jsx("option", { value: "Teams", children: "Teams" }),
                  /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
                ]
              }
            ),
            formik.values.platform === "Other" && /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Enter custom platform",
                value: customPlatform,
                onChange: (e) => setCustomPlatform(e.target.value),
                className: "w-full px-4 py-2 rounded-lg border border-blue-100 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(InputField, { label: "Session Link*", name: "meetingLink", type: "url", formik }),
          /* @__PURE__ */ jsx(InputField, { label: "Session ID*", name: "meetingId", formik }),
          /* @__PURE__ */ jsx(InputField, { label: "Session Password*", name: "meetingPassword", formik }),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: `${COURSE_NAME}*`,
              name: "course",
              formik,
              options: courses.map((c) => ({ _id: c._id, title: c.title }))
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Batch*",
              name: "batch",
              formik,
              options: batches.map((b) => ({ _id: b._id, name: b.batchName }))
            }
          ),
          /* @__PURE__ */ jsx(
            Dropdown,
            {
              label: "Trainer*",
              name: "trainer",
              formik,
              options: trainers.map((t) => ({
                _id: t._id,
                title: t.fullName
              }))
            }
          ),
          /* @__PURE__ */ jsx(InputField, { label: "Start Date*", name: "startDate", type: "date", formik }),
          /* @__PURE__ */ jsx(InputField, { label: "End Date*", name: "endDate", type: "date", formik }),
          /* @__PURE__ */ jsx(InputField, { label: "Start Time*", name: "startTime", type: "time", formik }),
          /* @__PURE__ */ jsx(InputField, { label: "End Time*", name: "endTime", type: "time", formik }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Meeting Occurrence" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: meetingOccurrence > 0 ? `${meetingOccurrence} meetings` : "Select start & end date",
                disabled: true,
                className: "w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(InputField, { label: "Notification (optional)", name: "notification", formik, type: "textarea" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300",
            children: loading ? "Adding..." : "Add Session"
          }
        ) })
      ]
    }
  ) });
};
export {
  AddMeetingForm as default
};
