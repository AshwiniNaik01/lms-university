import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";

const EnrollStudentForm = () => {
  const { enrollmentId } = useParams(); // optional ID for edit
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // initialize navigate

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
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
      coursesInterested: [],
      enrolledBatches: [],
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        let res;

        if (enrollmentId) {
          // Update existing enrollment
          res = await apiClient.put(`/api/enrollments/${enrollmentId}`, values);
        } else {
          // Create new enrollment
          res = await apiClient.post(`/api/enrollments/admin/enroll`, values);
        }

        if (res.data.success) {
          Swal.fire("✅ Success", res.data.message, "success").then(() => {
            // Navigate after user clicks OK
            navigate("/admin/enrolled-student-list");
          });
          resetForm();
          setFilteredBatches([]);
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
  useEffect(() => {
    if (!enrollmentId) return;

    const fetchEnrollment = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/enrollments/${enrollmentId}`);
        if (res.data.success && res.data.data) {
          const enrollment = res.data.data;

          // Prefill form values
          formik.setValues({
            fullName: enrollment.fullName || "",
            mobileNo: enrollment.mobileNo || "",
            email: enrollment.email || "",
            coursesInterested:
              enrollment.enrolledCourses?.map((c) => c._id) || [],
            enrolledBatches:
              enrollment.enrolledBatches?.map((b) => b._id) || [],
          });

          // Populate filteredBatches based on enrolled courses
          const batchList =
            enrollment.enrolledCourses?.flatMap(
              (course) => course.batches || []
            ) || [];
          setFilteredBatches(batchList);
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
  }, [enrollmentId]);

  // Filter batches when courses change
  useEffect(() => {
    const selectedCourses = formik.values.coursesInterested;
    if (selectedCourses.length > 0) {
      const batches = selectedCourses.flatMap((id) => {
        const course = courses.find((c) => c._id === id);
        return course?.batches || [];
      });
      setFilteredBatches(batches);
    } else {
      setFilteredBatches([]);
    }
  }, [formik.values.coursesInterested, courses]);

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
            label="Courses Interested"
            name="coursesInterested"
            options={courses}
            formik={formik}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />

          <MultiSelectDropdown
            label="Select Batches"
            name="enrolledBatches"
            options={filteredBatches}
            formik={formik}
            getOptionValue={(batch) => batch._id}
            getOptionLabel={(batch) =>
              `${batch.batchName} (${batch.mode} - ${batch.status})`
            }
          />
        </div>

        <div className="text-center pt-4">
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
              : "Enroll Student"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default EnrollStudentForm;
