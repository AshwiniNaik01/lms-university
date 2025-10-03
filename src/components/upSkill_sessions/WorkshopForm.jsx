import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";

import DateRangePicker from "../form/DateRangePicker";
import DynamicInputFields from "../form/DynamicInputFields";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import ToggleSwitch from "../form/ToggleSwitch";

import {
  createWorkshop,
  fetchWorkshopById,
  updateWorkshop,
} from "./upSkillsApi";

const useQuery = () => new URLSearchParams(useLocation().search);

const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};

const WorkshopForm = () => {
  const query = useQuery();
  const id = query.get("id");

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
            prerequisites:
              Array.isArray(data.prerequisites) && data.prerequisites.length > 0
                ? data.prerequisites
                : [""],
            topics:
              Array.isArray(data.topics) && data.topics.length > 0
                ? data.topics
                : [""],
            instructors:
              Array.isArray(data.instructors) && data.instructors.length > 0
                ? data.instructors.map((ins) => ({
                    name: ins.name ?? "",
                    designation: ins.designation ?? "",
                  }))
                : [{ name: "", designation: "" }],
            contact: {
              email: data.contact?.email ?? "",
              phone: data.contact?.phone ?? "",
            },
            fees: data.fees ?? "",
            startDate: formatDateForInput(data.startDate),
            endDate: formatDateForInput(data.endDate),
            certification: data.certification ?? false,
            status: data.status ?? "Past",
          };
          setInitialData(safeData);
        }
      } catch (error) {
        console.error("Failed to fetch workshop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    fees: Yup.number()
      .min(0, "Fees must be positive")
      .required("Fees is required"),
    instructors: Yup.array().of(
      Yup.object({
        name: Yup.string().required("Instructor name is required"),
        designation: Yup.string().required("Designation is required"),
      })
    ),
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
      instructors: [{ name: "", designation: "" }],
      registrationLink: "",
      fees: "",
      certification: false,
      contact: {
        email: "",
        phone: "",
      },
      status: "Past",
    },
    validationSchema,
    // onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
    //   try {
    //     const payload = {
    //       ...values,
    //       fees: Number(values.fees),
    //       prerequisites: values.prerequisites.filter((p) => p.trim() !== ''),
    //       topics: values.topics.filter((t) => t.trim() !== ''),
    //       instructors: values.instructors.filter(
    //         (ins) => ins.name.trim() !== '' || ins.designation.trim() !== ''
    //       ),
    //     };

    //     if (id) {
    //       await updateWorkshop(id, payload);
    //       setStatus('Workshop updated successfully!');
    //     } else {
    //       await createWorkshop(payload);
    //       setStatus('Workshop created successfully!');
    //       resetForm();
    //     }
    //   } catch (error) {
    //     console.error('Submission error:', error);
    //     setStatus('Failed to submit workshop.');
    //   } finally {
    //     setSubmitting(false);
    //   }
    // },

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const payload = {
          ...values,
          fees: Number(values.fees),
          prerequisites: values.prerequisites.filter((p) => p.trim() !== ""),
          topics: values.topics.filter((t) => t.trim() !== ""),
          instructors: values.instructors.filter(
            (ins) => ins.name.trim() !== "" || ins.designation.trim() !== ""
          ),
        };

        console.log("Submitting payload:", payload);

        if (id) {
          const result = await updateWorkshop(id, payload);
          console.log("Update result:", result);
          setStatus("Workshop updated successfully!");
        } else {
          await createWorkshop(payload);
          setStatus("Workshop created successfully!");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        setStatus("Failed to submit workshop: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addInstructor = () => {
    formik.setFieldValue("instructors", [
      ...formik.values.instructors,
      { name: "", designation: "" },
    ]);
  };

  const removeInstructor = (index) => {
    const updated = [...formik.values.instructors];
    updated.splice(index, 1);
    formik.setFieldValue("instructors", updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500 font-semibold">
        Loading workshop data...
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl border border-gray-300 p-8 space-y-10"
    >
      <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">
        {id ? "Edit Workshop" : "Create Workshop"}
      </h2>

      {/* Basic Info */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Title" name="title" formik={formik} />
          <InputField label="Duration" name="duration" formik={formik} />
          <InputField label="Location" name="location" formik={formik} />
          <InputField
            label="Registration Link"
            name="registrationLink"
            formik={formik}
          />
          <InputField label="Fees" name="fees" type="number" formik={formik} />
        </div>
        <TextAreaField label="Description" name="description" formik={formik} />
      </section>

      {/* Schedule */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Schedule
        </h3>
        <DateRangePicker formik={formik} />
      </section>

      {/* Workshop Content */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Workshop Content
        </h3>
        <DynamicInputFields
          label="Prerequisites"
          name="prerequisites"
          formik={formik}
        />
        <DynamicInputFields label="Topics" name="topics" formik={formik} />
      </section>

      {/* Instructors */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Instructors
        </h3>

        {formik.values.instructors.map((instructor, index) => {
          const nameField = `instructors.${index}.name`;
          const designationField = `instructors.${index}.designation`;

          const nameError =
            formik.touched.instructors?.[index]?.name &&
            formik.errors.instructors?.[index]?.name;
          const designationError =
            formik.touched.instructors?.[index]?.designation &&
            formik.errors.instructors?.[index]?.designation;

          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center"
            >
              <div>
                <input
                  type="text"
                  name={nameField}
                  placeholder="Name"
                  value={instructor.name ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border outline-none bg-white transition ${
                    nameError
                      ? "border-red-500 focus:ring-red-300"
                      : "border-blue-400 focus:ring-blue-300"
                  }`}
                />
                {nameError && (
                  <div className="text-red-600 text-sm mt-1">{nameError}</div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name={designationField}
                  placeholder="Designation"
                  value={instructor.designation ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border outline-none bg-white transition ${
                    designationError
                      ? "border-red-500 focus:ring-red-300"
                      : "border-blue-400 focus:ring-blue-300"
                  }`}
                />
                {designationError && (
                  <div className="text-red-600 text-sm mt-1">
                    {designationError}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeInstructor(index)}
                className="text-sm text-red-600 hover:underline"
                disabled={formik.values.instructors.length === 1}
              >
                Remove
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addInstructor}
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          + Add Instructor
        </button>
      </section>

      {/* Certification Toggle */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Certification
        </h3>
        <ToggleSwitch
          label="Will this workshop offer a certification?"
          name="certification"
          formik={formik}
        />
      </section>

      {/* Contact Info */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField
            label="Contact Email"
            name="contact.email"
            formik={formik}
          />
          <InputField
            label="Contact Phone"
            name="contact.phone"
            formik={formik}
          />
        </div>
      </section>

      {/* Status Selection */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Workshop Status
        </h3>
        <div className="flex gap-6">
          {["Past", "Upcoming", "Ongoing"].map((status) => (
            <label key={status} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formik.values.status === status}
                onChange={formik.handleChange}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Submit Button and Status */}
      <div className="pt-6 border-t border-gray-200">
        {formik.status && (
          <div className="mb-4 text-green-600 font-medium">{formik.status}</div>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {formik.isSubmitting
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update Workshop"
            : "Create Workshop"}
        </button>
      </div>
    </form>
  );
};

export default WorkshopForm;
