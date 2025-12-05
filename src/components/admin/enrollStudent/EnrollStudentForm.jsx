import { FormikProvider, useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { DIR } from "../../../utils/constants";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import ToggleSwitch from "../../form/ToggleSwitch";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const EnrollStudentForm = () => {
  const { enrollmentId } = useParams(); // optional ID for edit
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const navigate = useNavigate(); // initialize navigate
  const { rolePermissions } = useSelector((state) => state.permissions);
  const fileInputRef = useRef(null);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching training program:", error);
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
    // onSubmit: async (values, { resetForm }) => {
    //   try {
    //     setLoading(true);
    //     let res;

    //     if (enrollmentId) {
    //       // Update existing enrollment
    //       res = await apiClient.put(`/api/enrollments/${enrollmentId}`, values);
    //     } else {
    //       // Create new enrollment
    //       res = await apiClient.post(`/api/enrollments/admin/enroll`, values);
    //     }

    //     if (res.data.success) {
    //       Swal.fire("✅ Success", res.data.message, "success");
    //         // Navigate after user clicks OK
    //         // navigate("/admin/enrolled-student-list");

    //       resetForm();
    //       setFilteredBatches([]);
    //     } else {
    //       Swal.fire(
    //         "⚠️ Warning",
    //         res.data.message || "Operation failed",
    //         "warning"
    //       );
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     Swal.fire(
    //       "Warning",
    //       err.response?.data?.message || "Please Try Again!",
    //       "warning"
    //     );
    //   } finally {
    //     setLoading(false);
    //   }
    // },

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

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

  // Prefill data if editing
  // useEffect(() => {
  //   if (!enrollmentId) return;

  //   const fetchEnrollment = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await apiClient.get(`/api/enrollments/${enrollmentId}`);
  //       if (res.data.success && res.data.data) {
  //         const enrollment = res.data.data;

  //         // Prefill form values
  //         formik.setValues({
  //           fullName: enrollment.fullName || "",
  //           mobileNo: enrollment.mobileNo || "",
  //           email: enrollment.email || "",
  //           coursesInterested:
  //             enrollment.enrolledCourses?.map((c) => c._id) || [],
  //           enrolledBatches:
  //             enrollment.enrolledBatches?.map((b) => b._id) || [],
  //         });

  //         // Populate filteredBatches based on enrolled courses
  //         const batchList =
  //           enrollment.enrolledCourses?.flatMap(
  //             (course) => course.batches || []
  //           ) || [];
  //         setFilteredBatches(batchList);
  //       } else {
  //         Swal.fire(
  //           "⚠️ Warning",
  //           res.data.message || "Enrollment not found",
  //           "warning"
  //         );
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       Swal.fire(
  //         "⚠️ Error",
  //         err.response?.data?.message || "Failed to fetch enrollment",
  //         "error"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEnrollment();
  // }, [enrollmentId]);

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
            enrolledCourses: enrollment.enrolledCourses || [],
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
          const batchesFromCourses = enrollment.enrolledCourses.flatMap(
            (courseId) => {
              const course = courses.find((c) => c._id === courseId);
              return course?.batches || [];
            }
          );

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
  // useEffect(() => {
  //   const selectedCourses = formik.values.coursesInterested;
  //   if (selectedCourses.length > 0) {
  //     const batches = selectedCourses.flatMap((id) => {
  //       const course = courses.find((c) => c._id === id);
  //       return course?.batches || [];
  //     });
  //     setFilteredBatches(batches);
  //   } else {
  //     setFilteredBatches([]);
  //   }
  // }, [formik.values.coursesInterested, courses]);

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
          {enrollmentId ? "Update Enrollment" : "Enroll Student"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="fullName" formik={formik} />
          <InputField
            label="Mobile Number"
            name="mobileNo"
            type="tel"
            formik={formik}
          />
          <InputField label="Email" name="email" type="email" formik={formik} />

          <MultiSelectDropdown
            label="Training Interested (optional)"
            name="enrolledCourses"
            options={courses}
            formik={formik}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />

          <MultiSelectDropdown
            label="Select Batches (optional)"
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
            label="College Name (optional)"
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
          <ToggleSwitch label="Send Notification" name="certification" />
        </div>

        {/* <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-3 rounded-xl shadow-lg text-white font-semibold transition duration-300 ${
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
              : "Add Student"}
          </button>

          <div className="flex justify-end mb-6">
  <button
    type="button"
    onClick={() => navigate("/admin/enrollments/upload-excel")}
    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
  >
    Upload Students via Excel
  </button>
</div>

        </div> */}

        <div className="pt-4 flex flex-col md:flex-row md:justify-end items-center gap-4">
          {/* Submit Button */}
          <button
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
              : "Add Student"}
          </button>

          {/* Excel Upload Button */}
          <button
            type="button"
            onClick={() => navigate("/enrollments/upload-excel")}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
          >
            Upload Students via Excel/CSV
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default EnrollStudentForm;
