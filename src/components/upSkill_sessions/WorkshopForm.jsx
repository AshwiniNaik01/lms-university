// src/components/forms/WorkshopForm.jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import DateRangePicker from "../form/DateRangePicker";
import DynamicInputFields from "../form/DynamicInputFields";
import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import ToggleSwitch from "../form/ToggleSwitch";

import RadioButtonGroup from "../form/RadioButtonGroup";
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
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  /* 🧭 Fetch workshop data when editing */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkshopById(id);
        if (data) {
          // const safeData = {
          //   ...data,
          //   prerequisites: data.prerequisites?.length
          //     ? data.prerequisites
          //     : [""],
          //   topics: data.topics?.length ? data.topics : [""],
          //   instructors:
          //     data.instructors?.length > 0
          //       ? data.instructors.map((ins) => ({
          //           name: ins.name ?? "",
          //           designation: ins.designation ?? "",
          //         }))
          //       : [{ name: "", designation: "" }],
          //   contact: {
          //     email: data.contact?.email ?? "",
          //     phone: data.contact?.phone ?? "",
          //   },
          //   startDate: formatDateForInput(data.startDate),
          //   endDate: formatDateForInput(data.endDate),
          //   certification: data.certification ?? false,
          //   status: data.status ?? "Past",
          // };

         const safeData = {
  ...data,
  prerequisites: data.prerequisites?.length ? data.prerequisites : [""],
  topics: data.topics?.length ? data.topics : [""],
  // Convert instructors to array of strings (only names)
  // instructors:
  //   data.instructors?.length > 0
  //     ? data.instructors.map((ins) => ins.name ?? "")
  //     : [""],

 instructors:
    data.instructors?.length > 0
      ? data.instructors.map((name) => name) // keep as array of strings
      : [""],


  contact: {
    email: data.contact?.email ?? "",
    phone: data.contact?.phone ?? "",
  },
  startDate: formatDateForInput(data.startDate),
  endDate: formatDateForInput(data.endDate),
  certification: data.certification ?? false,
  status: data.status ?? "Past",
};


          setInitialData(safeData);
        }
      } catch (error) {
        console.error("Failed to fetch workshop:", error);
        Swal.fire("Error", "Failed to load workshop details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ✅ Form Validation Schema */
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    // fees: Yup.number()
    //   .min(0, "Fees must be positive")
    //   .required("Fees is required"),
//   instructors: Yup.array().of(
//   Yup.string().required("Instructor name is required")
// ),

  });

  /* 🧾 Initialize Formik */
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
      instructors: [""], // array of strings now
      registrationLink: "",
      fees: "",
      certification: false,
      contact: { email: "", phone: "" },
      status: "Past",
       isFree: false, // ✅ New field
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // const payload = {
        //   ...values,
        //   fees: Number(values.fees),
        //   prerequisites: values.prerequisites.filter((p) => p.trim() !== ""),
        //   topics: values.topics.filter((t) => t.trim() !== ""),
        //   instructors: values.instructors.filter(
        //     (ins) => ins.name.trim() !== "" || ins.designation.trim() !== ""
        //   ),
        // };

        const payload = {
          ...values,
          fees: Number(values.fees),
          prerequisites: values.prerequisites.filter((p) => p.trim() !== ""),
          topics: values.topics.filter((t) => t.trim() !== ""),
          instructors: values.instructors.filter((ins) => ins.trim() !== ""), // strings
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

        navigate("/book-session"); // ✅ Navigate after OK click
      } catch (error) {
        console.error("Error during submission:", error);
         // Show backend error in the form
     // Extract backend message
    const backendMessage =
      error.response?.data?.message || "Failed to submit workshop.";

    // Show backend message in Swal
    await Swal.fire("Error", backendMessage, "error");
        // Swal.fire("Error", "Failed to submit workshop.", "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ➕ Instructor Handlers */
const addInstructor = () => {
  formik.setFieldValue("instructors", [
    ...formik.values.instructors,
    "", // add empty string
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

  /* 🎨 UI Design */
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-10 p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-xl border-3 border-blue-700 border-opacity-80"
    >
      {/* 🏷️ Header */}
      <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">
        {id ? "Edit Workshop" : "Create Workshop"}
      </h2>

      {/* 📘 Basic Information */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" name="title" formik={formik} />
          <InputField
            label="Duration (in min)"
            name="duration"
            type="number"
            formik={formik}
          />
          <InputField label="City" name="location" formik={formik} />
          <InputField
            label="Registration Link"
            name="registrationLink"
            formik={formik}
          />
{/* 💰 Is Free */}
<section className="space-y-4 bg-blue-50 p-4 rounded-lg">
  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
    Pricing
  </h3>

  <ToggleSwitch
    label="Is this workshop free?"
    name="isFree"
    checked={formik.values.isFree}
    onChange={() => {
      const newValue = !formik.values.isFree;
      formik.setFieldValue("isFree", newValue);

      // Optionally clear fees if free
      if (newValue) formik.setFieldValue("fees", 0);
    }}
  />

  {/* Show Fees input only if isFree is false */}
  {!formik.values.isFree && (
    <InputField
      label="Fees"
      name="fees"
      type="number"
      formik={formik}
    />
  )}
</section>


          {/* <InputField label="Fees" name="fees" type="number" formik={formik} /> */}
        </div>
        <TextAreaField label="Description" name="description" formik={formik} />
      </section>

      {/* 📅 Schedule */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Schedule
        </h3>
        <DateRangePicker formik={formik} />
      </section>

      {/* 📖 Workshop Content */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Workshop Content
        </h3>
        <DynamicInputFields
          label="Prerequisites"
          name="prerequisites"
          formik={formik}
        />
        <DynamicInputFields label="Topics" name="topics" formik={formik} />
      </section>

      {/* 👩‍🏫 Instructors */}
      {/* <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Instructors
        </h3>
        {formik.values.instructors.map((ins, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center"
          >
            <input
              type="text"
              name={`instructors.${index}.name`}
              placeholder="Instructor Name"
              value={ins.name}
              onChange={formik.handleChange}
              className="border border-blue-400 rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="text"
              name={`instructors.${index}.designation`}
              placeholder="Designation"
              value={ins.designation}
              onChange={formik.handleChange}
              className="border border-blue-400 rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => removeInstructor(index)}
              className="text-white p-2 rounded-lg text-sm hover:underline bg-red-600"
              disabled={formik.values.instructors.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstructor}
          className="text-white p-2 rounded-lg text-sm hover:bg-blue-700 bg-blue-600"
        >
          + Add Instructor
        </button>
      </section> */}

      {/* 👩‍🏫 Instructors */}
     <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
    Instructors
  </h3>

  <DynamicInputFields
    label="Instructor Name"
    name="instructors"
    formik={formik}
  />
</section>


      {/* 🎓 Certification */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Certification
        </h3>
        {/* <ToggleSwitch
          label="Does this workshop offer a certification?"
          name="certification"
          formik={formik}
        /> */}

        <ToggleSwitch
  label="Does this workshop offer a certification?"
  name="certification"
  checked={formik.values.certification}
  onChange={() =>
    formik.setFieldValue("certification", !formik.values.certification)
  }
/>

      </section>

      {/* 📞 Contact Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* 📊 Status */}
      <section className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Workshop Status
        </h3>
        <RadioButtonGroup
          label="Select Workshop Status"
          name="status"
          formik={formik}
          options={[
            { label: "Past", value: "Past" },
            { label: "Upcoming", value: "Upcoming" },
            { label: "Ongoing", value: "Ongoing" },
          ]}
        />
      </section>

      {/* 🚀 Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)} // Go back to previous page
          className="px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl shadow-lg transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
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
