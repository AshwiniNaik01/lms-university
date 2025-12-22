import { FormikProvider, useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { COURSE_NAME, DIR } from "../../../utils/constants";
import { canPerformAction } from "../../../utils/permissionUtils";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import ToggleSwitch from "../../form/ToggleSwitch";
import { usePassword } from "../../hooks/usePassword";

const EnrollStudentForm = () => {
  const { enrollmentId } = useParams(); // optional ID for edit
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const navigate = useNavigate(); // initialize navigate
  const { rolePermissions } = useSelector((state) => state.permissions);
  const fileInputRef = useRef(null);
    const { password, setPassword, generate } = usePassword();
  const [showPassword, setShowPassword] = useState(false);




  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error(`Error fetching ${COURSE_NAME}:`, error);
      }
    };
    fetchCourses();
  }, []);

  // Formik Setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNo: "",
      email: "",
      enrolledCourses: [],
      enrolledBatches: [],
      //  password: "", // ✅ add password here
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      // mobileNo: Yup.string()
      //   .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      //   .required("Mobile number is required"),
      // email: Yup.string().email("Invalid email").required("Email is required"),
      // designation: Yup.string().required("Designation is required"),
      // collegeName: Yup.string().required("College name is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        // // ✅ ADD THIS HERE
        // await apiClient.post("/api/otp/send-email", {
        //   email: values.email,
        // });

         // ✅ Add the password to form values
    values.password = password;


        // REQUIRED CHANGE HERE 👇
        values.enrolledBatches = [
          ...values.enrolledBatches,
          ...values.enrolledCourses,
        ];

        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key === "enrolledCourses") {
            formData.append(key, values[key]); // still array
          } else if (key === "enrolledBatches") {
            formData.append(key, values[key].join(",")); // now a comma-separated string
          } else if (key === "profilePhotoStudent") {
            if (values.profilePhotoStudent) {
              formData.append(
                "profilePhotoStudent",
                values.profilePhotoStudent
              );
            }
          } else {
            formData.append(key, values[key]);
          }
        });

        let res;
        if (enrollmentId) {
          res = await apiClient.put(
            `/api/enrollments/${enrollmentId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          res = await apiClient.post(
            `/api/enrollments/admin/enroll`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        if (res.data.success) {
          Swal.fire("✅ Success", res.data.message, "success").then(() => {
            if (canPerformAction(rolePermissions, "enrollment", "read")) {
              navigate("/enrolled-student-list");
            }
          });

          resetForm();
          setFilteredBatches([]);

          // FIX — Reset Preview Image
          setProfilePhotoPreview(null);

          // FIX — Reset File Input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          Swal.fire(
            "⚠️ Warning",
            res.data.message || "Operation failed",
            "warning"
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Warning",
          err.response?.data?.message || "Please Try Again!",
          "warning"
        );
      } finally {
        setLoading(false);
      }
    },
  });

    const isBusy = loading || formik.isSubmitting;

 // Optional: auto-generate password on mount
  // useEffect(() => {
  //   generate(); // generates a password when component loads
  //   formik.setFieldValue("password", password);
  // }, []);


  //   useEffect(() => {
  //   formik.setFieldValue("password", password);
  // }, [password]);


  // Prefill data if editing

  useEffect(() => {
    if (!enrollmentId) return;

    const fetchEnrollment = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/enrollments/${enrollmentId}`);
        if (res.data.success && res.data.data) {
          const enrollment = res.data.data;

          // Prefill formik fields
          formik.setValues({
            fullName: enrollment.fullName || "",
            mobileNo: enrollment.mobileNo || "",
            email: enrollment.email || "",
            designation: enrollment.designation || "",
            collegeName: enrollment.collegeName || "",
            // enrolledCourses: enrollment.enrolledCourses || [],

            // ✅ FIX HERE
            enrolledCourses:
              enrollment.enrolledCourses?.map((c) => c._id) || [],

            enrolledBatches:
              enrollment.enrolledBatches?.map((b) => b._id) || [],
            profilePhotoStudent: null, // File input cannot be prefilled
          });

          // Set preview URL for existing image
          if (enrollment.profilePhotoStudent) {
            setProfilePhotoPreview(
              DIR.STUDENT_PHOTO + enrollment.profilePhotoStudent
            );
          }

          // Set filtered batches based on enrolled courses
          // const batchesFromCourses = enrollment.enrolledCourses.flatMap(
          //   (courseId) => {
          //     const course = courses.find((c) => c._id === courseId);
          //     return course?.batches || [];
          //   }
          // );

          const batchesFromCourses = enrollment.enrolledCourses.flatMap(
            (course) => {
              const foundCourse = courses.find((c) => c._id === course._id);
              return foundCourse?.batches || [];
            }
          );

          setFilteredBatches(batchesFromCourses);

          setFilteredBatches(batchesFromCourses);
        } else {
          Swal.fire(
            "⚠️ Warning",
            res.data.message || "Enrollment not found",
            "warning"
          );
        }
      } catch (err) {
        console.error(err);
        Swal.fire(
          "⚠️ Error",
          err.response?.data?.message || "Failed to fetch enrollment",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [enrollmentId, courses]);

  // Filter batches when courses change

  useEffect(() => {
    const selectedCourses = formik.values.enrolledCourses;
    if (selectedCourses.length > 0) {
      const allBatches = selectedCourses.flatMap((id) => {
        const course = courses.find((c) => c._id === id);
        return course?.batches || [];
      });

      // Remove duplicates based on _id
      const uniqueBatches = Array.from(
        new Map(allBatches.map((batch) => [batch._id, batch])).values()
      );

      setFilteredBatches(uniqueBatches);
    } else {
      setFilteredBatches([]);
    }
  }, [formik.values.enrolledCourses, courses]);

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-10 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          {enrollmentId ? "Update Enrollment" : "Enroll Participate"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name*" name="fullName" formik={formik} />
          <InputField
            label="Mobile Number (optional)"
            name="mobileNo"
            type="tel"
            formik={formik}
          />
          <InputField label="Email*" name="email" type="email" formik={formik} />

          <MultiSelectDropdown
            label="Training Interested*"
            name="enrolledCourses"
            options={courses}
            formik={formik}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />

          <MultiSelectDropdown
            label="Select Batches*"
            name="enrolledBatches"
            options={filteredBatches}
            formik={formik}
            getOptionValue={(batch) => batch._id}
            getOptionLabel={(batch) =>
              `${batch.batchName} (${batch.mode} - ${batch.status})`
            }
          />

          <InputField
            label="Designation (optional)"
            name="designation"
            formik={formik}
          />

          <InputField
            label="Organization Name (optional)"
            name="collegeName"
            formik={formik}
          />

          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo (optional)
            </label>

            <div
              className="border border-gray-300 rounded-lg w-full px-4 py-2 mt-1 bg-white flex justify-between items-center cursor-pointer hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-blue-400"
              onClick={() =>
                document.getElementById("profilePhotoInput").click()
              }
            >
              <span className="text-gray-800 truncate w-[90%]">
                {formik.values.profilePhotoStudent
                  ? formik.values.profilePhotoStudent.name
                  : "Choose a file"}
              </span>
              {/* Using a simple icon from react-icons */}
              <FaUpload className="text-gray-500" />
              {/* Or just text */}
              {/* <span className="text-gray-500">Upload</span> */}
            </div>

            <input
              id="profilePhotoInput"
              ref={fileInputRef} // ← ADD THIS
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                formik.setFieldValue("profilePhotoStudent", file);
                if (file) {
                  setProfilePhotoPreview(URL.createObjectURL(file)); // update preview
                }
              }}
            />

            {formik.errors.profilePhotoStudent && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {formik.errors.profilePhotoStudent}
              </p>
            )}
            {/* Preview Section */}
            {/* Preview Section */}
            {(formik.values.profilePhotoStudent || profilePhotoPreview) && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={
                    formik.values.profilePhotoStudent
                      ? URL.createObjectURL(formik.values.profilePhotoStudent)
                      : profilePhotoPreview
                  }
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                />
                {formik.values.profilePhotoStudent && (
                  <span className="text-gray-700">
                    {formik.values.profilePhotoStudent.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Password Field */}
          {/* <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            <button
              type="button"
              onClick={() => generate()}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Generate Password
            </button>
            {formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div> */}


          {/* Password Field — ONLY on Create */}
{!enrollmentId && (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Password*
    </label>

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Password"
    />

    <div
      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </div>

   <button
  type="button"
  onClick={() => generate(6)}   // 👈 PASS LENGTH
  className="mt-2 text-sm text-blue-600 hover:underline"
>
  Generate Password
</button>


    {formik.errors.password && (
      <p className="text-red-500 text-sm mt-1">
        {formik.errors.password}
      </p>
    )}
  </div>
)}

          {/* <ToggleSwitch label="Send Notification" name="certification" /> */}
        </div>

        {/* <div className="pt-4 flex flex-col md:flex-row md:justify-end items-center gap-4">
          {/* Submit Button */}
          {/* <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-10 py-3 rounded-xl shadow-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[rgba(14,85,200,0.83)] hover:bg-[rgba(14,85,200,1)]"
            }`}
          >
            {loading
              ? enrollmentId
                ? "Updating..."
                : "Enrolling..."
              : enrollmentId
              ? "Update Enrollment"
              : "Add Participate"}
          </button> */}

          {/* Excel Upload Button */}
          {/* <button
            type="button"
             disabled={loading} // ← disable when loading 
            onClick={() => navigate("/enrollments/upload-excel")}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
          >
            Upload Participates via Excel/CSV
          </button>
        </div> */} 



        <div className="pt-4 flex flex-col md:flex-row md:justify-end items-center gap-4">
  {/* Submit Button */}
  <button
    type="submit"
    disabled={isBusy}
    className={`w-full md:w-auto px-10 py-3 rounded-xl shadow-lg text-white font-semibold transition duration-300 ${
      isBusy
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[rgba(14,85,200,0.83)] hover:bg-[rgba(14,85,200,1)]"
    }`}
  >
    {isBusy
      ? enrollmentId
        ? "Updating..."
        : "Enrolling..."
      : enrollmentId
      ? "Update Enrollment"
      : "Add Participate"}
  </button>

  {/* Excel Upload Button */}
  <button
    type="button"
    disabled={isBusy}
    onClick={() => navigate("/enrollments/upload-excel")}
    className={`w-full md:w-auto px-6 py-3 rounded-lg shadow transition font-semibold ${
      isBusy
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700"
    }`}
  >
    Upload Participates via Excel/CSV
  </button>
</div>

      </form>
    </FormikProvider>
  );
};

export default EnrollStudentForm;
