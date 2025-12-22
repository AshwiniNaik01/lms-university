import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPhone, FaTransgender, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import CustomDaysSelector from "../../components/form/CustomDaysSelector";
import DynamicInputFields from "../../components/form/DynamicInputFields";
import InputField from "../../components/form/InputField";
import MultiSelectDropdown from "../../components/form/MultiSelectDropdown";
import RadioButtonGroup from "../../components/form/RadioButtonGroup";
import TextAreaField from "../../components/form/TextAreaField";
import { fetchAllCourses } from "../../features/allCoursesSlice";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCertificate,
  FaTrophy,
  FaCode,
  FaLinkedin,
  FaCalendar,
} from "react-icons/fa";

import { COURSE_NAME, DIR } from "../../utils/constants";
import {
  fetchTrainerById,
  registerTrainer,
  updateTrainer,
} from "../admin/trainer-management/trainerApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

// TrainerRegistrationForm
// ==============================================================
// This is the registration form for trainer

// API
// import {
//   fetchTrainerById,
//   registerTrainer,
//   updateTrainer,
// } from "../admin/trainer-management/trainerApi";

const TrainerRegistrationForm = () => {
  const { id } = useParams(); // id means edit mode
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const courses = useSelector((state) => state.courses.data);
  const { data: courses, loading: coursesLoading } = useSelector(
    (state) => state.allCourses
  );

  const [trainerData, setTrainerData] = useState(null);
// inside your component
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    dispatch(fetchAllCourses()); // ✅ use new API thunk here
  }, [dispatch]);

  // Fetch existing trainer in EDIT mode
  useEffect(() => {
    if (!id) return;

    const fetchTrainer = async () => {
      setLoading(true);
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

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: {
    //   fullName: trainerData?.fullName || "",
    //   email: trainerData?.email || "",
    //   mobileNo: trainerData?.mobileNo || "",
    //   dob: trainerData?.dob ? trainerData.dob.split("T")[0] : "",
    //   gender: trainerData?.gender || "",
    //   title: trainerData?.title || "",
    //   summary: trainerData?.summary || "",
    //   certifications: trainerData?.certifications || [],
    //   achievements: trainerData?.achievements || [],
    //   highestQualification: trainerData?.highestQualification || "",
    //   collegeName: trainerData?.collegeName || "",
    //   totalExperience: trainerData?.totalExperience || "",
    //   courses: trainerData?.courses?.map((c) => c._id) || [],
    //   password: "",
    //   availableTiming: trainerData?.availableTiming || "",
    //   customBatchDays: trainerData?.customBatchDays || [],
    //   linkedinProfile: trainerData?.linkedinProfile || "",
    //   resume: null,
    //   idProofTrainer: null,
    //   profilePhotoTrainer: null,
    //   skills: trainerData?.skills || [""],
    //   address: {
    //     add1: trainerData?.address?.add1 || "",
    //     add2: trainerData?.address?.add2 || "",
    //     taluka: trainerData?.address?.taluka || "",
    //     dist: trainerData?.address?.dist || "",
    //     state: trainerData?.address?.state || "",
    //     pincode: trainerData?.address?.pincode || "",
    //   },
    // },

    initialValues: {
      fullName: trainerData?.fullName || "",
      email: trainerData?.email || "",
      mobileNo: trainerData?.mobileNo || "",
      dob: trainerData?.dob ? trainerData.dob.split("T")[0] : "",
      gender: trainerData?.gender || "",
      title: trainerData?.title || "",
      summary: trainerData?.summary || "",
      certifications: trainerData?.certifications || [],
      achievements: trainerData?.achievements || [],
      highestQualification: trainerData?.highestQualification || "",
      collegeName: trainerData?.collegeName || "",
      totalExperience: trainerData?.totalExperience || "",
      // courses: trainerData?.courses?.map((c) => c._id) || [],
      courses: trainerData?.courses
        ? Array.isArray(trainerData.courses)
          ? trainerData.courses.map((c) => c.title || c)
          : [trainerData.courses]
        : [""],

      // password: "", // always empty on edit
      password: !id ? "" : undefined,
      availableTiming: trainerData?.availableTiming?.includes(",")
        ? "custom" // if comma-separated, mark as custom
        : trainerData?.availableTiming || "",
      customBatchDays: trainerData?.availableTiming?.includes(",")
        ? trainerData.availableTiming.split(",") // split comma-separated string into array
        : [],
      linkedinProfile: trainerData?.linkedinProfile || "",
      resume:
        trainerData?.resume && trainerData.resume !== "null"
          ? trainerData.resume
          : null,
      idProofTrainer:
        trainerData?.idProofTrainer && trainerData.idProofTrainer !== "null"
          ? trainerData.idProofTrainer
          : null,
      profilePhotoTrainer:
        trainerData?.profilePhotoTrainer &&
        trainerData.profilePhotoTrainer !== "null"
          ? trainerData.profilePhotoTrainer
          : null,
      skills: trainerData?.skills || [""],
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
      password: !id
    ? Yup.string()
        .required("Password is required")
        .min(4, "Password must be at least 4 characters")
    : Yup.string(),
  confirmPassword: !id
    ? Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required")
    : Yup.string(),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();

      // If user chose 'custom', replace availableTiming with the actual selected days
      const availableDays =
        values.availableTiming === "custom"
          ? values.customBatchDays // send actual selected days
          : values.availableTiming; // send weekdays/weekends

      // Prepare FormData
      // for (let key in values) {
      //   const value = values[key];

      //   if (key === "address") {
      //     Object.entries(value).forEach(([k, v]) =>
      //       formData.append(`address[${k}]`, v)
      //     );
      //   } else if (Array.isArray(value)) {
      //     value.forEach((item) => formData.append(`${key}[]`, item));
      //   } else if (value instanceof File) {
      //     formData.append(key, value);
      //   } else {
      //     formData.append(key, value);
      //   }
      // }

      // Prepare FormData
      for (let key in values) {
        let value = values[key];

        // Replace availableTiming with actual days if custom
        if (key === "availableTiming") {
          if (values.availableTiming === "custom") {
            // Join array into comma-separated string
            value = values.customBatchDays.join(",");
          }
        }

        if (key === "address") {
          Object.entries(value).forEach(([k, v]) =>
            formData.append(`address[${k}]`, v)
          );
        } else if (Array.isArray(value) && key !== "availableTiming") {
          // Append other arrays as repeated form fields
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formData.append(key, value); // only if user uploaded a file
        } else if (key === "password") {
          if (!id) formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
      try {
        if (id) {
          // UPDATE TRAINER
          await updateTrainer(id, formData);
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Trainer updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          // CREATE TRAINER
          await registerTrainer(formData);
          Swal.fire({
            icon: "success",
            title: "Registered!",
            text: "Trainer registered successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        navigate(-1);
      } catch (err) {
        //  catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Error saving trainer",
        });
        // }
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return <div>Loading trainer data...</div>;
  if (fetchError) return <div className="text-red-500">{fetchError}</div>;

  // return (
  //   <div className="max-w-5xl mx-auto p-[4px] rounded-xl bg-indigo-50 border-4 border-indigo-800 shadow-xl my-6">
  //     <form
  //       onSubmit={formik.handleSubmit}
  //       className="w-full rounded-xl p-6 space-y-8"
  //     >
  //       {/* Personal Information Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">
  //           Personal Information
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <InputField name="fullName" label="Full Name" formik={formik} />
  //           <InputField
  //             name="title"
  //             label="Title"
  //             type="text"
  //             formik={formik}
  //           />
  //           <InputField
  //             name="email"
  //             label="Email"
  //             type="email"
  //             formik={formik}
  //           />
  //           <InputField
  //             name="mobileNo"
  //             label="Mobile Number"
  //             formik={formik}
  //             icon={<FaPhone />}
  //           />
  //           <InputField
  //             name="dob"
  //             label="Date of Birth"
  //             type="date"
  //             formik={formik}
  //           />
  //           <RadioButtonGroup
  //             name="gender"
  //             label="Gender"
  //             formik={formik}
  //             options={[
  //               { value: "Male", label: "Male" },
  //               { value: "Female", label: "Female" },
  //               { value: "Other", label: "Other" },
  //             ]}
  //             icon={<FaTransgender />}
  //           />
  //         </div>
  //         <TextAreaField
  //           name="summary"
  //           label="Trainer Summary"
  //           formik={formik}
  //           rows={4}
  //         />
  //       </div>

  //       {/* Address Information Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">Address</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <InputField
  //             name="address.add1"
  //             label="Address Line 1"
  //             formik={formik}
  //           />
  //           <InputField
  //             name="address.add2"
  //             label="Address Line 2"
  //             formik={formik}
  //           />
  //           <InputField name="address.taluka" label="Taluka" formik={formik} />
  //           <InputField name="address.dist" label="District" formik={formik} />
  //           <InputField name="address.state" label="State" formik={formik} />
  //           <InputField
  //             name="address.pincode"
  //             label="Pincode"
  //             formik={formik}
  //           />
  //         </div>
  //       </div>

  //       {/* Education Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">Education</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <InputField
  //             name="highestQualification"
  //             label="Highest Qualification"
  //             formik={formik}
  //           />
  //           {/* <InputField name="specializations" label="Specializations" formik={formik} /> */}
  //           {/* <InputField name="collegeName" label="College Name" formik={formik} /> */}
  //         </div>
  //       </div>

  //       {/* Experience Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">Experience</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <InputField
  //             name="totalExperience"
  //             label="Total Experience(in years)"
  //             formik={formik}
  //             type="number"
  //           />
  //           {/* <MultiSelectDropdown
  //       name="courses"
  //       label="Subject Experience"
  //       options={courses}
  //       formik={formik}
  //       multiple
  //       getOptionValue={(option) => option._id}
  //       getOptionLabel={(option) => option.title}
  //     /> */}

  //           {/* <MultiSelectDropdown
  //             name="courses"
  //             label="Subject Experience"
  //             options={courses}
  //             formik={formik}
  //             multiple
  //             getOptionValue={(option) => option._id}
  //             getOptionLabel={(option) => option.title}
  //           /> */}

  //           {coursesLoading ? (
  //             <p className="text-gray-500">Loading courses...</p>
  //           ) : (
  //             <MultiSelectDropdown
  //               name="courses"
  //               label="Subject Experience"
  //               options={courses}
  //               formik={formik}
  //               multiple
  //               getOptionValue={(option) => option._id}
  //               getOptionLabel={(option) => option.title}
  //             />
  //           )}
  //         </div>
  //       </div>

  //       {/* Other Details Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">
  //           Other Details
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           {/* <InputField name="availableTiming" label="Available Days" formik={formik} /> */}

  //           <DynamicInputFields
  //             formik={formik}
  //             name="certifications"
  //             label="Certification"
  //           />
  //           <DynamicInputFields
  //             formik={formik}
  //             name="achievements"
  //             label="Achievements"
  //           />
  //           <DynamicInputFields formik={formik} name="skills" label="Skills" />

  //           <InputField
  //             name="linkedinProfile"
  //             label="LinkedIn Profile Link"
  //             formik={formik}
  //           />
  //           {/* <InputField
  //             name="password"
  //             label="Password"
  //             type="password"
  //             formik={formik}
  //           /> */}

  //           {/* Password field - only in CREATE mode */}
  //           {!id && (
  //             <InputField
  //               name="password"
  //               label="Password"
  //               type="password"
  //               formik={formik}
  //             />
  //           )}

  //           <div className="mb-4">
  //             <RadioButtonGroup
  //               name="availableTiming"
  //               label="Available Days"
  //               options={[
  //                 { label: "Weekdays (Mon-Fri)", value: "weekdays(mon-fri)" },
  //                 { label: "Weekends (Sat-Sun)", value: "weekends(sat-sun)" },
  //                 { label: "Custom", value: "custom" },
  //               ]}
  //               formik={formik}
  //             />

  //             {formik.values.availableTiming === "custom" && (
  //               <CustomDaysSelector name="customBatchDays" formik={formik} />
  //             )}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Documents Upload Section */}
  //       {/* <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">
  //           Upload Documents
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <FileInput name="idProofTrainer" label="ID Proof" formik={formik} />
  //           <FileInput
  //             name="profilePhotoTrainer"
  //             label="Profile Photo"
  //             formik={formik}
  //           />

  //           <PDFUploadField
  //             name="resume"
  //             label="Upload Resume (PDF)"
  //             formik={formik}
  //           />
  //         </div>
  //       </div> */}

  //       {/* Documents Upload Section */}
  //       {/* Documents Upload Section */}
  //       <div>
  //         <h2 className="text-2xl font-bold text-blue-800 mb-4">
  //           Upload Documents
  //         </h2>

  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           {/* ID Proof Upload */}
  //           <div className="mb-6">
  //             <label className="block text-sm font-semibold text-gray-800 mb-2">
  //               ID Proof
  //             </label>

  //             <div className="relative w-full mb-4">
  //               <input
  //                 type="file"
  //                 name="idProofTrainer"
  //                 accept="application/pdf,image/*"
  //                 onChange={(e) =>
  //                   formik.setFieldValue(
  //                     "idProofTrainer",
  //                     e.currentTarget.files[0]
  //                   )
  //                 }
  //                 className="absolute inset-0 opacity-0 cursor-pointer z-20"
  //               />
  //               <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
  //                 <div className="flex items-center space-x-3">
  //                   <FaUpload className="text-blue-600" />
  //                   <span className="text-gray-700 font-medium truncate max-w-[250px]">
  //                     {formik.values.idProofTrainer
  //                       ? formik.values.idProofTrainer.name
  //                       : "Choose a file..."}
  //                   </span>
  //                 </div>
  //                 <span className="text-sm text-gray-500 hidden md:block">
  //                   Max: 5MB
  //                 </span>
  //               </div>
  //             </div>

  //             {/* Preview existing PDF or image */}
  //             {trainerData?.idProofTrainer &&
  //               !(formik.values.idProofTrainer instanceof File) && (
  //                 <a
  //                   href={`${DIR.ID_PROOF_TRAINER}${trainerData.idProofTrainer}`}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="text-blue-600 underline mb-2 block"
  //                 >
  //                   View Existing ID Proof
  //                 </a>
  //               )}

  //             {formik.touched.idProofTrainer &&
  //               formik.errors.idProofTrainer && (
  //                 <div className="text-red-500 text-sm font-medium mt-1">
  //                   {formik.errors.idProofTrainer}
  //                 </div>
  //               )}
  //           </div>

  //           {/* Resume Upload */}
  //           <div className="mb-6">
  //             <label className="block text-sm font-semibold text-gray-800 mb-2">
  //               Resume (PDF)
  //             </label>

  //             <div className="relative w-full mb-4">
  //               <input
  //                 type="file"
  //                 name="resume"
  //                 accept="application/pdf"
  //                 onChange={(e) =>
  //                   formik.setFieldValue("resume", e.currentTarget.files[0])
  //                 }
  //                 className="absolute inset-0 opacity-0 cursor-pointer z-20"
  //               />
  //               <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
  //                 <div className="flex items-center space-x-3">
  //                   <FaUpload className="text-blue-600" />
  //                   <span className="text-gray-700 font-medium truncate max-w-[250px]">
  //                     {formik.values.resume
  //                       ? formik.values.resume.name
  //                       : "Choose a file..."}
  //                   </span>
  //                 </div>
  //                 <span className="text-sm text-gray-500 hidden md:block">
  //                   Max: 5MB
  //                 </span>
  //               </div>
  //             </div>

  //             {/* Preview existing resume */}
  //             {/* Preview existing resume */}
  //             {trainerData?.resume &&
  //               !(formik.values.resume instanceof File) && (
  //                 <a
  //                   href={`${DIR.TRAINER_RESUME}${trainerData.resume}`}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="text-blue-600 underline mb-2 block"
  //                 >
  //                   View Existing Resume
  //                 </a>
  //               )}

  //             {formik.touched.resume && formik.errors.resume && (
  //               <div className="text-red-500 text-sm font-medium mt-1">
  //                 {formik.errors.resume}
  //               </div>
  //             )}
  //           </div>

  //           {/* Profile Photo Upload */}
  //           <div className="mb-6">
  //             <label className="block text-sm font-semibold text-gray-800 mb-2">
  //               Profile Photo
  //             </label>

  //             <div className="relative w-full mb-4">
  //               <input
  //                 type="file"
  //                 name="profilePhotoTrainer"
  //                 accept="image/*"
  //                 onChange={(e) =>
  //                   formik.setFieldValue(
  //                     "profilePhotoTrainer",
  //                     e.currentTarget.files[0]
  //                   )
  //                 }
  //                 className="absolute inset-0 opacity-0 cursor-pointer z-20"
  //               />
  //               <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
  //                 <div className="flex items-center space-x-3">
  //                   <FaUpload className="text-blue-600" />
  //                   <span className="text-gray-700 font-medium truncate max-w-[250px]">
  //                     {formik.values.profilePhotoTrainer
  //                       ? formik.values.profilePhotoTrainer.name
  //                       : "Choose a file..."}
  //                   </span>
  //                 </div>
  //                 <span className="text-sm text-gray-500 hidden md:block">
  //                   Max: 5MB
  //                 </span>
  //               </div>
  //             </div>

  //             {/* Preview */}
  //             {/* Preview */}
  //             {formik.values.profilePhotoTrainer instanceof File ? (
  //               <img
  //                 src={URL.createObjectURL(formik.values.profilePhotoTrainer)}
  //                 alt="Preview"
  //                 className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
  //               />
  //             ) : trainerData?.profilePhotoTrainer &&
  //               trainerData.profilePhotoTrainer !== "null" ? (
  //               <img
  //                 src={`${DIR.TRAINER_PROFILE_PHOTO}${trainerData.profilePhotoTrainer}`}
  //                 alt="Profile"
  //                 className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
  //               />
  //             ) : null}

  //             {formik.touched.profilePhotoTrainer &&
  //               formik.errors.profilePhotoTrainer && (
  //                 <div className="text-red-500 text-sm font-medium mt-1">
  //                   {formik.errors.profilePhotoTrainer}
  //                 </div>
  //               )}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Submit Button */}
  //       <div className="text-end pt-6">
  //         <button
  //           type="submit"
  //           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition"
  //           disabled={formik.isSubmitting}
  //         >
  //           {formik.isSubmitting
  //             ? id
  //               ? "Updating..."
  //               : "Registering..."
  //             : id
  //             ? "Update Trainer"
  //             : "Register Trainer"}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );

  return (
    <div className="max-w-7xl mx-auto my-8">
      {/* Form Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          {id ? "Update Trainer Profile" : "Register New Trainer"}
        </h1>
        {/* <p className="text-gray-600 text-lg">
        Fill in the details below to {id ? 'update' : 'register'} a trainer
      </p> */}
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Form Container */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg  border-4 border-sky-800 shadow-2xl  overflow-hidden">
        {/* Form with Sections */}
        <form onSubmit={formik.handleSubmit} className="space-y-0">
          {/* SECTION 1: Personal Information */}
          <div className="p-8 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <p className="text-gray-600">Basic details about the trainer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                name="fullName"
                label="Full Name*"
                formik={formik}
                icon={<FaUser className="text-blue-500" />}
                placeholder="Enter full name"
              />
              <InputField
                name="title"
                label="Professional Title*"
                type="text"
                formik={formik}
                placeholder="e.g., Senior Developer, Data Scientist"
              />
              <InputField
                name="email"
                label="Email Address*"
                type="email"
                formik={formik}
                placeholder="trainer@example.com"
              />
              <InputField
                name="mobileNo"
                label="Mobile Number*"
                formik={formik}
                icon={<FaPhone className="text-blue-500" />}
                placeholder="+91 9876543210"
              />
              <InputField
                name="dob"
                label="Date of Birth (optional)"
                type="date"
                formik={formik}
              />
              <div className="md:col-span-2 lg:col-span-1">
                <RadioButtonGroup
                  name="gender"
                  label="Gender*"
                  formik={formik}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                  icon={<FaTransgender className="text-blue-500" />}
                />
              </div>
            </div>

            <div className="mt-6">
              <TextAreaField
                name="summary"
                label="Professional Summary (optional)"
                formik={formik}
                rows={4}
                placeholder="Brief summary about teaching experience and expertise..."
              />
            </div>
          </div>

          {/* SECTION 2: Address Information */}
          <div className="p-8 border-b border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Address Information
                </h2>
                <p className="text-gray-600">Current residential address</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                name="address.add1"
                label="Address Line 1*"
                formik={formik}
                placeholder="Street address, P.O. Box"
              />
              <InputField
                name="address.add2"
                label="Address Line 2*"
                formik={formik}
                placeholder="Apartment, suite, unit, building, floor"
              />
              <InputField
                name="address.taluka"
                label="Taluka*"
                formik={formik}
              />
              <InputField
                name="address.dist"
                label="District*"
                formik={formik}
              />
              <InputField name="address.state" label="State*" formik={formik} />
              <InputField
                name="address.pincode"
                label="Pincode*"
                formik={formik}
              />
            </div>
          </div>

          {/* SECTION 3: Education */}
          <div className="p-8 border-b border-blue-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                <p className="text-gray-600">Academic qualifications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="highestQualification"
                label="Highest Qualification*"
                formik={formik}
                placeholder="e.g., M.Tech, B.E., Ph.D."
              />
              {/* <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-white rounded-xl border border-purple-200 w-full">
                <FaGraduationCap className="text-3xl text-purple-500 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Additional education details can be added to the resume</p>
              </div>
            </div> */}
            </div>
          </div>

          {/* SECTION 4: Experience */}
          <div className="p-8 border-b border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaBriefcase className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Professional Experience
                </h2>
                <p className="text-gray-600">
                  Training and industry experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
           
              <InputField
                name="totalExperience"
                label="Total Experience (Years)*"
                formik={formik}
                type="number"
                min="0"
                max="50"
                step="0.5"
                placeholder="e.g., 5.5"
              />

                 <InputField
                name="linkedinProfile"
                label="LinkedIn Profile Link (optional)"
                formik={formik}
                icon={<FaLinkedin className="text-blue-600" />}
                placeholder="https://linkedin.com/in/username"
              />
              </div>

              {/* <div>
              {coursesLoading ? (
                <div className="flex items-center justify-center h-full min-h-[80px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <MultiSelectDropdown
                  name="courses"
                  label={`${COURSE_NAME}`}
                  options={courses}
                  formik={formik}
                  multiple
                  getOptionValue={(option) => option._id}
                  getOptionLabel={(option) => option.title}
                  placeholder="Select subjects you can teach"
                />
              )}
            </div> */}
              <DynamicInputFields
                formik={formik}
                name="courses"
                label={`${COURSE_NAME}s*`}
                placeholder={`Add ${COURSE_NAME} (e.g., React.js)`}
              />
            {/* </div> */}
          </div>

          {/* SECTION 5: Skills & Certifications */}
          <div className="p-8 border-b border-blue-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaCertificate className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Skills & Achievements
                </h2>
                <p className="text-gray-600">
                  Professional certifications and skills
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <DynamicInputFields
                formik={formik}
                name="certifications"
                label="Certifications (optional)"
                icon={<FaCertificate className="text-emerald-500" />}
                placeholder="Add certification (e.g., AWS Certified)"
              />
              <DynamicInputFields
                formik={formik}
                name="achievements"
                label="Achievements (optional)"
                icon={<FaTrophy className="text-amber-500" />}
                placeholder="Add achievement (e.g., Best Trainer Award 2023)"
              />
              <DynamicInputFields
                formik={formik}
                name="skills"
                label="Technical Skills (optional)"
                icon={<FaCode className="text-blue-500" />}
                placeholder="Add skill (e.g., React, Python, ML)"
              />
           

              <div className="md:col-span-2 lg:col-span-3">
                <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCalendar className="text-blue-500 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Availability Schedule
                    </h3>
                  </div>

                  <RadioButtonGroup
                    name="availableTiming"
                    label="Preferred Training Days*"
                    options={[
                      {
                        label: "Weekdays (Mon-Fri)",
                        value: "weekdays(mon-fri)",
                      },
                      {
                        label: "Weekends (Sat-Sun)",
                        value: "weekends(sat-sun)",
                      },
                      { label: "Custom Schedule", value: "custom" },
                    ]}
                    formik={formik}
                  />

                  {formik.values.availableTiming === "custom" && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100">
                      <CustomDaysSelector
                        name="customBatchDays"
                        formik={formik}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: Documents Upload */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaFileAlt className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Document Upload
                </h2>
                <p className="text-gray-600">
                  Upload required documents (Max 5MB each)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ID Proof Card */}
              <div className="bg-gradient-to-b from-white to-red-50 rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">ID Proof*</h3>
                    <p className="text-sm text-gray-600">
                      Aadhar, PAN, Passport, etc.
                    </p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="file"
                    name="idProofTrainer"
                    accept="application/pdf,image/*"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "idProofTrainer",
                        e.currentTarget.files[0]
                      )
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-2 border-dashed border-red-300 bg-white px-4 py-6 rounded-lg hover:border-red-400 transition-all duration-300 text-center">
                    <FaUpload className="text-red-500 text-2xl mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      {formik.values.idProofTrainer
                        ? formik.values.idProofTrainer.name
                        : "Click to upload"}
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>

                {trainerData?.idProofTrainer &&
                  !(formik.values.idProofTrainer instanceof File) && (
                    <a
                      href={`${DIR.ID_PROOF_TRAINER}${trainerData.idProofTrainer}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      <FaFileAlt /> View Existing ID Proof
                    </a>
                  )}
              </div>

              {/* Resume Card */}
              <div className="bg-gradient-to-b from-white to-blue-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Resume (PDF)*</h3>
                    <p className="text-sm text-gray-600">Professional resume</p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="file"
                    name="resume"
                    accept="application/pdf"
                    onChange={(e) =>
                      formik.setFieldValue("resume", e.currentTarget.files[0])
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-2 border-dashed border-blue-300 bg-white px-4 py-6 rounded-lg hover:border-blue-400 transition-all duration-300 text-center">
                    <FaUpload className="text-blue-500 text-2xl mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      {formik.values.resume
                        ? formik.values.resume.name
                        : "Click to upload"}
                    </p>
                    <p className="text-sm text-gray-500">PDF only (Max 5MB)</p>
                  </div>
                </div>

                {trainerData?.resume &&
                  !(formik.values.resume instanceof File) && (
                    <a
                      href={`${DIR.TRAINER_RESUME}${trainerData.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <FaFileAlt /> View Existing Resume
                    </a>
                  )}
              </div>

              {/* Profile Photo Card */}
              <div className="bg-gradient-to-b from-white to-purple-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Profile Photo (optional)</h3>
                    <p className="text-sm text-gray-600">
                      Professional headshot
                    </p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="file"
                    name="profilePhotoTrainer"
                    accept="image/*"
                    onChange={(e) =>
                      formik.setFieldValue(
                        "profilePhotoTrainer",
                        e.currentTarget.files[0]
                      )
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-2 border-dashed border-purple-300 bg-white px-4 py-6 rounded-lg hover:border-purple-400 transition-all duration-300 text-center">
                    <FaUpload className="text-purple-500 text-2xl mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      {formik.values.profilePhotoTrainer
                        ? formik.values.profilePhotoTrainer.name
                        : "Click to upload"}
                    </p>
                    <p className="text-sm text-gray-500">JPG, PNG (Max 5MB)</p>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {formik.values.profilePhotoTrainer instanceof File ? (
                    <img
                      src={URL.createObjectURL(
                        formik.values.profilePhotoTrainer
                      )}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : trainerData?.profilePhotoTrainer &&
                    trainerData.profilePhotoTrainer !== "null" ? (
                    <img
                      src={`${DIR.TRAINER_PROFILE_PHOTO}${trainerData.profilePhotoTrainer}`}
                      alt="Profile"
                      className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <FaUser className="text-purple-400 text-3xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File Validation Messages */}
            {/* <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <FaFileAlt className="text-blue-500 text-sm" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Upload Guidelines:</p>
                <p className="text-xs text-gray-600">• Maximum file size: 5MB each</p>
                <p className="text-xs text-gray-600">• Supported formats: PDF, JPG, PNG</p>
                <p className="text-xs text-gray-600">• Ensure documents are clear and readable</p>
              </div>
            </div>
          </div> */}
          </div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-5">
  {!id && (
    <>
      {/* Password */}
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password*
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a secure password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border border-blue-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password*
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border border-blue-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
        )}
      </div>
    </>
  )}
</div>


          {/* Submit Section */}
          <div className="p-8 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800">
                  {id ? "Update Trainer Profile" : "Register Trainer"}
                </h3>
                <p className="text-gray-600">
                  {id
                    ? "Review and update the trainer information"
                    : "Complete the registration to add new trainer"}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {formik.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {id ? "Updating..." : "Registering..."}
                    </span>
                  ) : id ? (
                    "Update Trainer"
                  ) : (
                    "Register Trainer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
    </div>
  );
};

export default TrainerRegistrationForm;
