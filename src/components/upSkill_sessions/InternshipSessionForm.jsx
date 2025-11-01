
// 📄 src/pages/admin/InternshipSessionForm.jsx
// ======================================================
// 🎓 Internship Session Form
// Used for both creating & editing internship sessions
// ======================================================

import { useFormik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

// 🧩 Form Components
import DateRangePicker from "../form/DateRangePicker";
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import ToggleSwitch from "../form/ToggleSwitch";
import { createInternshipSession, getInternshipSessionById, updateInternshipSession } from "./upSkillsApi";

// ======================================================
// 🚀 Component
// ======================================================
const InternshipSessionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query params (type & id)
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("id");
  const isEditMode = queryParams.get("type") === "edit";

  // ======================================================
  // 🧠 Formik Setup
  // ======================================================
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
        refundPolicy: "",
      },
      certification: false,
      status: "",
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      duration: Yup.string().required("Duration is required"),
      mode: Yup.string().required("Mode is required"),
      location: Yup.string().required("Location is required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          ...values,
          capacity: Number(values.capacity),
          fees: {
            ...values.fees,
            amount: Number(values.fees.amount),
          },
          topics: values.topics.filter((t) => t.trim() !== ""),
        };

        if (isEditMode && sessionId) {
          await updateInternshipSession(sessionId, payload);
          await Swal.fire({
            icon: "success",
            title: "Internship session updated successfully!",
            confirmButtonColor: "#2563eb",
          });
        } else {
          await createInternshipSession(payload);
          await Swal.fire({
            icon: "success",
            title: "Internship session created successfully!",
            confirmButtonColor: "#2563eb",
          });
          resetForm();
        }

        navigate("/admin/book-session");
      } catch (error) {
        console.error("❌ Error submitting internship session:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Something went wrong while saving the session.",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ======================================================
  // 📦 Fetch existing session data (edit mode)
  // ======================================================
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
              refundPolicy: data.fees?.refundPolicy || "",
            },
            certification: data.certification ?? false,
            status: data.status || "",
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch internship session:", error);
        Swal.fire({
          icon: "error",
          title: "Fetch Error",
          text: "Unable to load session details.",
        });
      }
    };

    fetchSession();
  }, [isEditMode, sessionId]);

  // ======================================================
  // 🎨 UI Rendering
  // ======================================================
return (
  <form
    onSubmit={formik.handleSubmit}
    className="space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80"
  >
    {/* 🏷️ Header */}
    <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4 text-start">
      {isEditMode ? "Edit Internship Session" : "Create Internship Session"}
    </h2>

    {/* 🧾 Basic Information */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Title" name="title" formik={formik} />
        <InputField label="Duration (in months)" name="duration" type="number" formik={formik} />
        <InputField label="Location" name="location" formik={formik} />
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          formik={formik}
        />
      </div>
    </section>

    {/* 💰 Fees & Payment */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Fees & Payment
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Amount (₹)"
          name="fees.amount"
          type="number"
          formik={formik}
        />
        <InputField
          label="Refund Policy"
          name="fees.refundPolicy"
          formik={formik}
        />
      </div>
    </section>

    {/* 📅 Session Details */}
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Session Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Dropdown
          label="Mode"
          name="mode"
          formik={formik}
          options={[
            { _id: "Online", title: "Online" },
            { _id: "Offline", title: "Offline" },
            { _id: "Hybrid", title: "Hybrid" },
          ]}
        />
        <DateRangePicker formik={formik} />
      </div>

      <TextAreaField
        label="Description"
        name="description"
        formik={formik}
      />

      <DynamicInputFields
        label="Topics"
        name="topics"
        formik={formik}
      />
    </section>

    {/* ⚙️ Additional Settings */}
    <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Additional Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Dropdown
          label="Status"
          name="status"
          formik={formik}
          options={[
            { _id: "Upcoming", title: "Upcoming" },
            { _id: "Ongoing", title: "Ongoing" },
            { _id: "Past", title: "Past" },
          ]}
        />

        <ToggleSwitch
          label="Certification Available"
          name="certification"
          checked={formik.values.certification}
          onChange={() =>
            formik.setFieldValue(
              "certification",
              !formik.values.certification
            )
          }
        />
      </div>
    </section>

    {/* 🚀 Submit Button */}
    <div className="flex justify-end pt-4 border-t border-gray-200">
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
      >
        {formik.isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Internship Session"
          : "Create Internship Session"}
      </button>
    </div>
  </form>
);

};

export default InternshipSessionForm;
