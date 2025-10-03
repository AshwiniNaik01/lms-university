import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import InputField from "../../components/form/InputField";
import { FaPhone, FaTransgender } from "react-icons/fa";
import RadioButtonGroup from "../../components/form/RadioButtonGroup";
import FileInput from "../../components/form/FileInput";
import Dropdown from "../../components/form/Dropdown";
import MultiSelectDropdown from "../../components/form/MultiSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../features/coursesSlice";
import { fetchBranches } from "../../features/branchesSlice";
import CustomDaysSelector from "../../components/form/CustomDaysSelector";
import PDFUploadField from "../../components/form/PDFUploadField";
import TextAreaField from "../../components/form/TextAreaField";
import DynamicInputFields from "../../components/form/DynamicInputFields";
import { useNavigate, useParams } from "react-router";
import {
  fetchTrainerById,
  updateTrainer,
} from "../admin/trainer-management/trainerApi";

// TrainerRegistrationForm
// ==============================================================
// This is the registration form for trainer

const TrainerRegistrationForm = () => {
  const { id } = useParams(); // route: /admin/trainers/update/:id
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);

  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Load all courses on component mounts. These are used in dropdowns for form selections.
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Fetch existing trainer data if 'id' is present, to enables the form to work in "edit" mode.

  useEffect(() => {
    if (!id) return;

    const fetchTrainer = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const data = await fetchTrainerById(id);
        setTrainerData(data);
      } catch (err) {
        setFetchError("Error fetching trainer data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  /**
   * Formik setup: enableReinitialize: allows form values to update when `trainerData` is fetched asynchronously.
   * - initialValues,validationSchema, onSubmit.
   */
  const formik = useFormik({
    enableReinitialize: true, // VERY IMPORTANT: allows the form to update when trainerData changes
    initialValues: {
      fullName: trainerData?.fullName || "",
      email: trainerData?.email || "",
      mobileNo: trainerData?.mobileNo || "",
      dob: trainerData?.dob ? trainerData.dob.split("T")[0] : "", // format ISO date to yyyy-mm-dd
      gender: trainerData?.gender || "",
      title: trainerData?.title || "",
      summary: trainerData?.summary || "",
      certifications: trainerData?.certifications || [],
      achievements: trainerData?.achievements || [],
      highestQualification: trainerData?.highestQualification || "",
      collegeName: trainerData?.collegeName || "",
      totalExperience: trainerData?.totalExperience || "",
      courses: trainerData?.courses?.map((c) => c._id) || [],
      password: "", // leave blank for updates unless user wants to change
      availableTiming: trainerData?.availableTiming || "",
      customBatchDays: [], // custom availability days selector
      linkedinProfile: trainerData?.linkedinProfile || "",
      resume: null,
      idProofTrainer: null,
      profilePhotoTrainer: null,
      address: {
        add1: trainerData?.address?.add1 || "",
        add2: trainerData?.address?.add2 || "",
        taluka: trainerData?.address?.taluka || "",
        dist: trainerData?.address?.dist || "",
        state: trainerData?.address?.state || "",
        pincode: trainerData?.address?.pincode || "",
      },
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      // ... add other validation rules as needed
    }),
    onSubmit: async (values, { setSubmitting }) => {
      // Prepare multipart/form-data for file uploads and nested data
      const formData = new FormData();

      // Append all fields
      for (let key in values) {
        const value = values[key];

        if (key === "address" && typeof value === "object" && value !== null) {
          // Flatten nested address fields for backend compatibility
          Object.entries(value).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else if (Array.isArray(value)) {
          // Append arrays properly for multi-select fields
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          // Append files directly
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          // Append primitive values
          formData.append(key, value);
        }
      }

      try {
        // Call the API to update the trainer data
        await updateTrainer(id, formData);
        alert("Trainer updated successfully");
        navigate("/admin/trainers"); // Redirect on success
      } catch (err) {
        alert(err.message || "Error updating trainer");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Render loading and error states for fetch trainer operation
  if (loading) return <div>Loading trainer data...</div>;
  if (fetchError) return <div className="text-red-500">{fetchError}</div>;

  return (
    <div className="max-w-5xl mx-auto p-[4px] rounded-xl bg-gradient-to-r from-[#53b8ec] via-[#485dac] to-[#e9577c] shadow-xl my-6">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-gradient-to-r from-[#e3eff5] via-[#e5e9f6] to-[#f8e9ec] rounded-xl p-6 space-y-8"
      >
        {/* Personal Information Section */}
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

        {/* Address Information Section */}
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

        {/* Education Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="highestQualification"
              label="Highest Qualification"
              formik={formik}
            />
            {/* <InputField name="specializations" label="Specializations" formik={formik} /> */}
            {/* <InputField name="collegeName" label="College Name" formik={formik} /> */}
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="totalExperience"
              label="Total Experience(in years)"
              formik={formik}
              type="number"
            />
            {/* <MultiSelectDropdown
        name="courses"
        label="Subject Experience"
        options={courses}
        formik={formik}
        multiple
        getOptionValue={(option) => option._id}
        getOptionLabel={(option) => option.title}
      /> */}

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

        {/* Other Details Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Other Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <InputField name="availableTiming" label="Available Days" formik={formik} /> */}

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

              {formik.values.availableTiming === "custom" && (
                <CustomDaysSelector name="customBatchDays" formik={formik} />
              )}
            </div>
          </div>
        </div>

        {/* Documents Upload Section */}
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

        {/* Submit Button */}
        <div className="text-end pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Registering..." : "Register Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerRegistrationForm;
