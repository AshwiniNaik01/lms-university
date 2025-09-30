
import { useFormik } from "formik";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import apiClient from "../../api/axiosConfig";
import DateRangePicker from "../form/DateRangePicker";
import Dropdown from "../form/Dropdown";
import DynamicInputFields from "../form/DynamicInputFields";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import ToggleSwitch from "../form/ToggleSwitch";

const InternshipSessionForm = () => {


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
      topics: [""], // ✅ now as array
      capacity: "",
      fees: {
        amount: "",
        currency: "",
        refundPolicy: "",
      },
      certification: false,
      status: "",
    },
    validationSchema: Yup.object({
      // add validations if needed
    }),
 
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
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
      await apiClient.put(`/api/internship-sessions/${sessionId}`, payload);
      setStatus("✅ Internship session updated successfully!");
    } else {
      await apiClient.post("/api/internship-sessions", payload);
      setStatus("✅ Internship session created successfully!");
      resetForm();
    }
  } catch (err) {
    console.error("Error submitting internship session:", err);
    setStatus("❌ Failed to submit internship session.");
  } finally {
    setSubmitting(false);
  }
}

  });

  useEffect(() => {
  const fetchInternshipSession = async () => {
    if (!isEditMode || !sessionId) return;

    try {
      const response = await apiClient.get(`/api/internship-sessions/${sessionId}`);
      const data = response.data?.data;

      if (data && data._id) {
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
            currency: data.fees?.currency || "",
            refundPolicy: data.fees?.refundPolicy || "",
          },
          certification: data.certification ?? false,
          status: data.status || "",
        });
      } else {
        console.warn("Session not found");
        formik.setStatus("❌ Internship session not found.");
      }
    } catch (error) {
      console.error("Failed to fetch internship session:", error);
      formik.setStatus("❌ Failed to fetch session data.");
    }
  };

  fetchInternshipSession();
}, [isEditMode, sessionId]);


  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-10 p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-xl border border-gray-300"
    >
      <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">
        Create Internship Session
      </h2>

      {/* Section 1: Basic Information */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Title"
            name="title"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
          <InputField
            label="Duration (in months)"
            name="duration"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
          <InputField
            label="Location"
            name="location"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
          <InputField
            label="Capacity"
            name="capacity"
            type="number"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </section>

      {/* Section 2: Fees & Payment */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Fees & Payment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InputField
            label="Amount"
            name="fees.amount"
            type="number"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
          <InputField
            label="Currency"
            name="fees.currency"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
          <InputField
            label="Refund Policy"
            name="fees.refundPolicy"
            formik={formik}
            className="focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </section>

      {/* Section 3: Session Details */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Session Details
        </h3>

<div className="w-132">
        <Dropdown
          label="Mode"
          name="mode"
          formik={formik}
          options={[
            { _id: "Online", title: "Online" },
            { _id: "Offline", title: "Offline" },
            { _id: "Hybrid", title: "Hybrid" },
          ]}
          className="focus:ring-2 focus:ring-blue-400 transition"
        />
        </div>

        <TextAreaField
          label="Description"
          name="description"
          formik={formik}
          className="focus:ring-2 focus:ring-blue-400 transition"
        />

        <DateRangePicker formik={formik} />

        <DynamicInputFields
          formik={formik}
          name="topics"
          label="Topics"
          className=""
        />
      </section>

      {/* Section 4: Additional Settings */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Additional Settings
        </h3>

<div className="w-132">
        <Dropdown
          label="Status"
          name="status"
          formik={formik}
          options={[
            { _id: "Upcoming", title: "Upcoming" },
            { _id: "Ongoing", title: "Ongoing" },
            { _id: "Past", title: "Past" },
          ]}
          className="focus:ring-2 focus:ring-blue-400 transition"
        />
        </div>

        <ToggleSwitch
          label="Certification Available"
          name="certification"
          checked={formik.values.certification}
          onChange={() =>
            formik.setFieldValue("certification", !formik.values.certification)
          }
          className=""
        />
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full md:w-auto mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formik.isSubmitting ? "Submitting..." : "Create Session"}
      </button>

      {formik.status && (
        <p className="text-sm mt-4 text-gray-600 italic">{formik.status}</p>
      )}
    </form>
  );
};

export default InternshipSessionForm;
