import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import InputField from "../../components/form/InputField";
import TextAreaField from "../../components/form/TextAreaField";
import RadioButtonGroup from "../../components/form/RadioButtonGroup";
import MultiSelectDropdown from "../../components/form/MultiSelectDropdown";
import CustomDaysSelector from "../../components/form/CustomDaysSelector";
import DynamicInputFields from "../../components/form/DynamicInputFields";
import FileInput from "../../components/form/FileInput";
import PDFUploadField from "../../components/form/PDFUploadField";
import { FaPhone, FaTransgender } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/coursesSlice";
import {
  fetchTrainerById,
  updateTrainer,
} from "../admin/trainer-management/trainerApi";

// TrainerProfile
// =============================================
// this page handles the trainer profile and also allow to update it

const TrainerProfile = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  // Declared for initial data loading when the TrainerProfile component is mounted.
  useEffect(() => {
    // Fetch the list of available courses on component mount
    dispatch(fetchCourses());

    //Fetch trainer profile data
    const fetchTrainerData = async () => {
      setLoading(true); // Set loading state before making the async call

      try {
        // Retrieve trainer ID from cookies
        const trainerId = Cookies.get("trainerId");
        if (!trainerId) return;

        // Fetch trainer data from the server
        const data = await fetchTrainerById(trainerId);

        // Map response to formik's initialValues format
        setInitialValues({
          fullName: data.fullName || "",
          email: data.email || "",
          mobileNo: data.mobileNo || "",
          dob: data.dob?.split("T")[0] || "", // Format date to YYYY-MM-DD
          gender: data.gender || "",
          title: data.title || "",
          summary: data.summary || "",
          certifications: data.certifications || [],
          achievements: data.achievements || [],
          highestQualification: data.highestQualification || "",
          collegeName: data.collegeName || "",
          totalExperience: data.totalExperience || "",
          courses: data.courses || [],
          password: "", // Password is optional and intentionally left blank
          availableTiming: data.availableTiming || "",
          customBatchDays: [], // Will be populated only if user selects "custom"
          linkedinProfile: data.linkedinProfile || "",
          resume: null,
          idProofTrainer: null,
          profilePhotoTrainer: null,
          address: {
            add1: data.address?.add1 || "",
            add2: data.address?.add2 || "",
            taluka: data.address?.taluka || "",
            dist: data.address?.dist || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || "",
          },
        });
      } catch (err) {
        console.error("❌ Error fetching trainer data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [dispatch]);

  const formik = useFormik({
    // Reinitializes the form when `initialValues` changes
    enableReinitialize: true,

    // Pre-filled values loaded from backend using useEffect
    initialValues: initialValues || {},

    // Yup Validations
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNo: Yup.string().required("Mobile number is required"),
      dob: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      title: Yup.string().required("Title is required"),
      summary: Yup.string().required("Trainer summary is required"),
      highestQualification: Yup.string().required("Qualification is required"),
      totalExperience: Yup.number().required("Experience is required"),
      courses: Yup.array().min(1, "Select at least one course"),
      password: Yup.string().min(6).nullable(),
      availableTiming: Yup.string().required("Select availability"),
    }),

    // Form submission handler
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();

      // Clone the form values
      const finalValues = { ...values };

      // Convert selected custom days into a string before submission
      if (finalValues.availableTiming === "custom") {
        finalValues.availableTiming = (finalValues.customBatchDays || []).join(
          "-"
        );
      }

      // Remove the temp `customBatchDays` field (as not required by backend)
      delete finalValues.customBatchDays;

      /**
       * Convert all fields into multipart/form-data format:
       * - Nested fields like address[] are flattened
       * - Arrays (like certifications) are appended as array fields
       * - File inputs are handled
       */
      for (let key in finalValues) {
        const value = finalValues[key];

        if (key === "address" && typeof value === "object" && value !== null) {
          // Flatten nested address fields
          Object.entries(value).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else if (Array.isArray(value)) {
          // Append arrays (e.g., courses[], certifications[])
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          // Handle file inputs (e.g., profilePhotoTrainer)
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          // Basic key-value pairs
          formData.append(key, value);
        }
      }

      try {
        // Extract trainer ID from cookies
        const trainerId = getCookie("trainerId");
        if (!trainerId) throw new Error("Trainer ID not found");

        // API call to update trainer profile
        const res = await updateTrainer(trainerId, formData);

        alert("Trainer updated successfully!");
      } catch (err) {
        console.error("❌ Error updating trainer", err);
        alert("Error updating trainer");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Loading Handler
  if (loading)
    return <p className="text-center mt-10">Loading trainer info...</p>;
  if (!initialValues)
    return (
      <p className="text-center mt-10 text-red-500">Trainer data not found.</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-xl bg-gradient-to-r from-[#53b8ec] via-[#485dac] to-[#e9577c] shadow-xl my-6">
      {/* Form Wrapper */}
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-gradient-to-r from-[#e3eff5] via-[#e5e9f6] to-[#f8e9ec] rounded-xl p-6 space-y-8"
      >
        {/* === 1. Personal Information Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="fullName" label="Full Name" formik={formik} />
            <InputField
              name="title"
              label="Title"
              type="text"
              formik={formik}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              formik={formik}
            />
            <InputField
              name="mobileNo"
              label="Mobile Number"
              formik={formik}
              icon={<FaPhone />}
            />
            <InputField
              name="dob"
              label="Date of Birth"
              type="date"
              formik={formik}
            />
            <TextAreaField
              name="summary"
              label="Trainer Summary"
              formik={formik}
            />
            <RadioButtonGroup
              name="gender"
              label="Gender"
              formik={formik}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              icon={<FaTransgender />}
            />
          </div>
        </div>

        {/* === 2. Address Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="address.add1"
              label="Address Line 1"
              formik={formik}
            />
            <InputField
              name="address.add2"
              label="Address Line 2"
              formik={formik}
            />
            <InputField name="address.taluka" label="Taluka" formik={formik} />
            <InputField name="address.dist" label="District" formik={formik} />
            <InputField name="address.state" label="State" formik={formik} />
            <InputField
              name="address.pincode"
              label="Pincode"
              formik={formik}
            />
          </div>
        </div>

        {/* === 3. Education Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="highestQualification"
              label="Highest Qualification"
              formik={formik}
            />
            <InputField
              name="collegeName"
              label="College Name"
              formik={formik}
            />
          </div>
        </div>

        {/* === 4. Experience Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="totalExperience"
              label="Total Experience (years)"
              type="number"
              formik={formik}
            />
            <MultiSelectDropdown
              name="courses"
              label="Subject Experience"
              options={courses}
              formik={formik}
              multiple
              getOptionValue={(option) => option._id}
              getOptionLabel={(option) => option.title}
            />
          </div>
        </div>

        {/* === 5. Other Details Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Other Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DynamicInputFields
              formik={formik}
              name="certifications"
              label="Certification"
            />
            <DynamicInputFields
              formik={formik}
              name="achievements"
              label="Achievements"
            />
            <InputField
              name="linkedinProfile"
              label="LinkedIn Profile Link"
              formik={formik}
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              formik={formik}
            />

            {/* Availability - Includes custom days logic */}
            <div className="mb-4">
              <RadioButtonGroup
                name="availableTiming"
                label="Available Days"
                options={[
                  { label: "Weekdays (Mon-Fri)", value: "weekdays(mon-fri)" },
                  { label: "Weekends (Sat-Sun)", value: "weekends(sat-sun)" },
                  { label: "Custom", value: "custom" },
                ]}
                formik={formik}
              />

              {/* Render custom days only if selected */}
              {formik.values.availableTiming === "custom" && (
                <CustomDaysSelector name="customBatchDays" formik={formik} />
              )}
            </div>
          </div>
        </div>

        {/* === 6. Documents Upload Section === */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Upload Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput name="idProofTrainer" label="ID Proof" formik={formik} />
            <FileInput
              name="profilePhotoTrainer"
              label="Profile Photo"
              formik={formik}
            />
            <PDFUploadField
              name="resume"
              label="Upload Resume (PDF)"
              formik={formik}
            />
          </div>
        </div>

        {/* === 7. Submit Button === */}
        <div className="text-end pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Updating..." : "Update Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerProfile;
