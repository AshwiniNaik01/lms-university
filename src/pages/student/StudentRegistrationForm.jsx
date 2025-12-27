import { useFormik } from "formik";
import pkg from "prelude-ls";
import { useEffect } from "react";
import {
  FaPhone,
  FaTransgender
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import apiClient from "../../api/axiosConfig";
import CheckboxGroup from "../../components/form/CheckBoxGroup";
import Dropdown from "../../components/form/Dropdown";
import FileInput from "../../components/form/FileInput";
import InputField from "../../components/form/InputField";
import MultiSelectDropdown from "../../components/form/MultiSelectDropdown";
import RadioButtonGroup from "../../components/form/RadioButtonGroup";
import { fetchBranches } from "../../features/branchesSlice";
import { fetchCourses } from "../../features/coursesSlice";
const { div } = pkg;

const StudentRegistrationForm = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.data);
  const branches = useSelector((state) => state.branches.data);
  const statusOptions = [
    { _id: "Studying", title: "Studying" },
    { _id: "Pursuing", title: "Pursuing" },
    { _id: "Working", title: "Working" },
    { _id: "Internship", title: "Internship" },
    { _id: "Completed", title: "Completed" },
    { _id: "Freelancing", title: "Freelancing" },
  ];

  const batchTimingOptions = [
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" },
  ];

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBranches());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      mobileNo: "",
      dob: "",
      gender: "",
      address: {
        add1: "",
        add2: "",
        taluka: "",
        dist: "",
        state: "",
        pincode: "",
      },
      currentEducation: "",
      status: "",
      boardUniversityCollege: "",
      preferredBatchTiming: "",
      customBatchDays: [],
      preferredMode: "",
      password: "",
      // branch: "",
      enrolledCourses: [],
      idProofStudent: null,
      profilePhotoStudent: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      mobileNo: Yup.string().required("Required"),
      dob: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.object({
        add1: Yup.string().required("Required"),
        add2: Yup.string().required("Required"),
        taluka: Yup.string().required("Required"),
        dist: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        pincode: Yup.string().required("Required"),
      }),
      currentEducation: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      boardUniversityCollege: Yup.string().required("Required"),
      // preferredBatchTiming: Yup.string().required("Required"),
      preferredMode: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      // branch: Yup.string().required("Required"),
      enrolledCourses: Yup.array().min(1, "Select at least one course"),
      idProofStudent: Yup.mixed().required("Required"),
      profilePhotoStudent: Yup.mixed().required("Required"),
    }),

    onSubmit: async (values) => {
      const formData = new FormData();
      const finalValues = { ...values };

      for (let key in finalValues) {
        if (key === "address") {
          Object.entries(finalValues.address).forEach(([k, v]) => {
            formData.append(`address[${k}]`, v);
          });
        } else if (Array.isArray(finalValues[key])) {
          finalValues[key].forEach((val) => formData.append(key, val));
        } else if (finalValues[key] instanceof File) {
          formData.append(key, finalValues[key]);
        } else {
          formData.append(key, finalValues[key]);
        }
      }

      try {
        const res = await apiClient.post("/api/student/register", formData);
        console.log("✅ Success:", res.data);
      } catch (err) {
        console.error("❌ Error submitting form", err);
      }
    },
  });

  const handleFileChange = (e, field) => {
    formik.setFieldValue(field, e.currentTarget.files[0]);
  };

  return (
    <div className="max-w-5xl mx-auto p-[4px] rounded-xl bg-gradient-to-r from-[#53b8ec] via-[#485dac] to-[#e9577c] shadow-xl my-6">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-gradient-to-r from-[#e3eff5] via-[#e5e9f6] to-[#f8e9ec]  rounded-xl p-6 space-y-8"
      >
        {/* Personal Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <InputField name="fullName" label="Full Name" formik={formik} />
            <InputField
              name="email"
              label="Email"
              type="email"
              formik={formik}
            />
            {/* <InputField name="mobileNo" label="Mobile Number" formik={formik} icon={<FaPhone />} /> */}
            <InputField
              name="dob"
              label="Date of Birth"
              type="date"
              formik={formik}
            />
            <InputField
              name="mobileNo"
              label="Mobile Number"
              formik={formik}
              icon={<FaPhone />}
            />

            <RadioButtonGroup
              name="gender"
              label="Gender"
              formik={formik}
              options={[
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
                { value: "OTHER", label: "Other" },
              ]}
              icon={<FaTransgender />}
            />
          </div>
        </div>
        {/* Address */}
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

        {/* Education Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Education Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="currentEducation"
              label="Current Education"
              formik={formik}
            />
            {/* <InputField name="status" label="Status" formik={formik} icon={<FaGraduationCap />} /> */}

            <Dropdown
              name="status"
              label="Status"
              options={statusOptions}
              formik={formik}
            />
            <InputField
              name="boardUniversityCollege"
              label="College/University Name"
              formik={formik}
            />
            {/* <InputField name="preferredBatchTiming" label="Preferred Batch Timing" formik={formik} icon={<FaClock />} /> */}
            <InputField
              name="password"
              label="Password"
              type="password"
              formik={formik}
            />

            <div className="mb-6">
              <CheckboxGroup
                name="preferredBatchTiming"
                label="Preferred Batch Timing"
                options={batchTimingOptions}
                formik={formik}
              />
            </div>

            {/* <InputField name="preferredMode" label="Preferred Mode" formik={formik} icon={<FaClock />} /> */}

            <RadioButtonGroup
              name="preferredMode"
              label="Preferred Mode"
              formik={formik}
              options={[
                { label: "Online", value: "Online" },
                { label: "Offline", value: "Offline" },
                { label: "Hybrid", value: "Hybrid" },
              ]}
            />
            {/* <InputField name="password" label="Password" type="password" formik={formik} icon={<FaLock />} /> */}
          </div>
        </div>

        {/* Branch & Courses */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Enrollment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <Dropdown name="branch" label="Branch" options={branches} formik={formik} /> */}
            <MultiSelectDropdown
              name="enrolledCourses"
              label="Courses"
              options={courses}
              formik={formik}
              multiple
              getOptionValue={(option) => option._id}
              getOptionLabel={(option) => option.title}
            />
          </div>
        </div>

        {/* File Uploads */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              name="idProofStudent"
              label="ID Proof"
              formik={formik}
              onChange={handleFileChange}
            />
            <FileInput
              name="profilePhotoStudent"
              label="Profile Photo"
              formik={formik}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="text-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3  cursor-pointer rounded-full font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
