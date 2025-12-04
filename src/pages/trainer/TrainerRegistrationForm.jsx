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
import { fetchCourses } from "../../features/coursesSlice";
import { DIR } from "../../utils/constants";
import {
  fetchTrainerById,
  registerTrainer,
  updateTrainer,
} from "../admin/trainer-management/trainerApi";

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
  const courses = useSelector((state) => state.courses.data);

  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
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
      courses: trainerData?.courses?.map((c) => c._id) || [],
      password: "",
      availableTiming: trainerData?.availableTiming || "",
      customBatchDays: trainerData?.customBatchDays || [],
      linkedinProfile: trainerData?.linkedinProfile || "",
      resume: null,
      idProofTrainer: null,
      profilePhotoTrainer: null,
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
    }),

    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();

      // Prepare FormData
      for (let key in values) {
        const value = values[key];

        if (key === "address") {
          Object.entries(value).forEach(([k, v]) =>
            formData.append(`address[${k}]`, v)
          );
        } else if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }

      try {
        if (id) {
          // UPDATE TRAINER
          await updateTrainer(id, formData);
          alert("Trainer updated successfully");
        } else {
          // CREATE TRAINER
          await registerTrainer(formData);
          alert("Trainer registered successfully");
        }

        navigate("/trainers");
      } catch (err) {
        alert(err.message || "Error saving trainer");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return <div>Loading trainer data...</div>;
  if (fetchError) return <div className="text-red-500">{fetchError}</div>;

  return (
    <div className="max-w-5xl mx-auto p-[4px] rounded-xl bg-indigo-50 border-4 border-indigo-800 shadow-xl my-6">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full rounded-xl p-6 space-y-8"
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
            <TextAreaField
              name="summary"
              label="Trainer Summary"
              formik={formik}
              rows={4}
            />
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
            <DynamicInputFields formik={formik} name="skills" label="Skills" />

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
        {/* <div>
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
        </div> */}

        {/* Documents Upload Section */}
        {/* Documents Upload Section */}
        <div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Upload Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Proof Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                ID Proof
              </label>

              <div className="relative w-full mb-4">
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
                <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
                  <div className="flex items-center space-x-3">
                    <FaUpload className="text-blue-600" />
                    <span className="text-gray-700 font-medium truncate max-w-[250px]">
                      {formik.values.idProofTrainer
                        ? formik.values.idProofTrainer.name
                        : "Choose a file..."}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 hidden md:block">
                    Max: 5MB
                  </span>
                </div>
              </div>

              {/* Preview existing PDF or image */}
              {trainerData?.idProofTrainer && (
                <a
                  href={`${DIR.ID_PROOF_TRAINER}${trainerData.idProofTrainer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mb-2 block"
                >
                  View Existing ID Proof
                </a>
              )}

              {formik.touched.idProofTrainer &&
                formik.errors.idProofTrainer && (
                  <div className="text-red-500 text-sm font-medium mt-1">
                    {formik.errors.idProofTrainer}
                  </div>
                )}
            </div>

            {/* Resume Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Resume (PDF)
              </label>

              <div className="relative w-full mb-4">
                <input
                  type="file"
                  name="resume"
                  accept="application/pdf"
                  onChange={(e) =>
                    formik.setFieldValue("resume", e.currentTarget.files[0])
                  }
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
                  <div className="flex items-center space-x-3">
                    <FaUpload className="text-blue-600" />
                    <span className="text-gray-700 font-medium truncate max-w-[250px]">
                      {formik.values.resume
                        ? formik.values.resume.name
                        : "Choose a file..."}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 hidden md:block">
                    Max: 5MB
                  </span>
                </div>
              </div>

              {/* Preview existing resume */}
              {trainerData?.resume && !formik.values.resume && (
                <a
                  href={`${DIR.TRAINER_RESUME}${trainerData.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mb-2 block"
                >
                  View Existing Resume
                </a>
              )}

              {formik.touched.resume && formik.errors.resume && (
                <div className="text-red-500 text-sm font-medium mt-1">
                  {formik.errors.resume}
                </div>
              )}
            </div>

            {/* Profile Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Profile Photo
              </label>

              <div className="relative w-full mb-4">
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
                <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
                  <div className="flex items-center space-x-3">
                    <FaUpload className="text-blue-600" />
                    <span className="text-gray-700 font-medium truncate max-w-[250px]">
                      {formik.values.profilePhotoTrainer
                        ? formik.values.profilePhotoTrainer.name
                        : "Choose a file..."}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 hidden md:block">
                    Max: 5MB
                  </span>
                </div>
              </div>

              {/* Preview */}
              {formik.values.profilePhotoTrainer ? (
                <img
                  src={URL.createObjectURL(formik.values.profilePhotoTrainer)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
                />
              ) : trainerData?.profilePhotoTrainer ? (
                <img
                  src={`${DIR.TRAINER_PROFILE_PHOTO}${trainerData.profilePhotoTrainer}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
                />
              ) : null}

              {formik.touched.profilePhotoTrainer &&
                formik.errors.profilePhotoTrainer && (
                  <div className="text-red-500 text-sm font-medium mt-1">
                    {formik.errors.profilePhotoTrainer}
                  </div>
                )}
            </div>
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
