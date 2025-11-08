import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";

const EnrollStudentForm = () => {
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Courses
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

  // ✅ Formik Setup
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
    //   coursesInterested: Yup.array().min(1, "Select at least one course"),
    //   enrolledBatches: Yup.array().min(1, "Select at least one batch"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const res = await apiClient.post(
          `/api/enrollments/admin/enroll`,
          values
        );

        if (res.data.success) {
          Swal.fire("✅ Success", res.data.message, "success");
          resetForm();
          setFilteredBatches([]);
        } else {
          Swal.fire(
            "⚠️ Warning",
            res.data.message || "Failed to enroll",
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

  // ✅ Filter batches based on selected courses
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
        {/* Header */}
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          Enroll Student
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <InputField label="Full Name" name="fullName" formik={formik} />

          {/* Mobile */}
          <InputField
            label="Mobile Number"
            name="mobileNo"
            type="tel"
            formik={formik}
          />

          {/* Email */}
          <InputField label="Email" name="email" type="email" formik={formik} />

          {/* Courses Dropdown */}
          {/* <div className="md:col-span-2"> */}
          <MultiSelectDropdown
            label="Courses Interested"
            name="coursesInterested"
            options={courses}
            formik={formik}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />
          {/* </div> */}

          {/* Batches Dropdown (Dynamic) */}
          {/* <div className="md:col-span-2"> */}
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
          {/* </div> */}
        </div>

        {/* Submit Button */}
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
            {loading ? "Enrolling..." : "Enroll Student"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default EnrollStudentForm;
