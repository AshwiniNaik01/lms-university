import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
} from "../../../api/assignment";
import { getChaptersByCourse } from "../../../api/chapters";
import { getAllCourses } from "../../../api/courses";
import { DIR } from "../../../utils/constants";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import PDFUploadField from "../../form/PDFUploadField";
import TextAreaField from "../../form/TextAreaField";
import { useCourseParam } from "../../hooks/useCourseParam";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

export default function AddAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const rolePermissions = useSelector((state) => state.permissions.rolePermissions);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState("");
  const [selectedCourseFromParam, , isCoursePreselected] =
    useCourseParam(availableCourses);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        // setAvailableCourses(res);
        // Remove duplicate courses by _id
      const uniqueCourses = Array.from(
        new Map(res.map((c) => [c._id, c])).values()
      );
      setAvailableCourses(uniqueCourses);
      } catch (err) {
        console.error("Error fetching training program:", err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Whenever courses or selectedCourseFromParam change, set selected course
  useEffect(() => {
    if (selectedCourseFromParam && availableCourses.length > 0) {
      setSelectedCourse(selectedCourseFromParam);
      formik.setFieldValue("course", selectedCourseFromParam); // Update Formik value
      // fetchChapters could also be called here if you want to prefetch chapters
    }
  }, [selectedCourseFromParam, availableCourses]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      course: "",
      chapter: "",
      title: "",
      description: "",
      deadline: "",
      fileUrl: null,
    },
    validationSchema: Yup.object({
      // course: Yup.string().required("Training Program is required"),
      // chapter: Yup.string().required("Chapter is required"),
      // title: Yup.string().required("Title is required"),
      // description: Yup.string().required("Description is required"),
      // deadline: Yup.string().required("Deadline is required"),
    }),
    // onSubmit: async (values, { resetForm }) => {
    //   try {
    //     const formData = new FormData();
    //     Object.entries(values).forEach(([key, value]) => {
    //       if (value) formData.append(key, value);
    //     });

    //     if (assignmentId) {
    //       const res = await updateAssignment(assignmentId, formData);
    //       Swal.fire({
    //         // toast: true,
    //         // position: "top-end",
    //         icon: "success",
    //         title: res.message || "Assignment updated successfully!",
    //         showConfirmButton: true,
    //         // timer: 3000,
    //         // timerProgressBar: true,
    //       });
    //     } else {
    //       const res = await createAssignment(formData);
    //       Swal.fire({
    //         // toast: true,
    //         // position: "top-end",
    //         icon: "success",
    //         title: res.message || "Assignment created successfully!",
    //         showConfirmButton: true,
    //         // timer: 3000,
    //         // timerProgressBar: true,
    //       });
    //     }

    //     resetForm();
    //     navigate("/manage-assignments");
    //   } catch (err) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Submission failed!",
    //       text:
    //         err.response?.data?.message || err.message || "Please Try Again !",
    //     });
    //   }
    // },

    
onSubmit: async (values, { resetForm }) => {
  try {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    let res;

    if (assignmentId) {
      res = await updateAssignment(assignmentId, formData);
      Swal.fire({
        icon: "success",
        title: res.message || "Assignment updated successfully!",
        showConfirmButton: true,
      });
    } else {
      res = await createAssignment(formData);
      Swal.fire({
        icon: "success",
        title: res.message || "Assignment created successfully!",
        showConfirmButton: true,
      });
    }

    // ⛔ Permission Check BEFORE redirect
    const hasReadPermission = canPerformAction(rolePermissions, "assignment", "read");

    if (!hasReadPermission) {
      Swal.fire({
        icon: "warning",
        title: "Assignment created successfully, but you don't have permission to view assignments.",
        // text: "You will stay on this page.",
      });

      resetForm(); // optional
      return; // ⛔ STOP - DO NOT NAVIGATE
    }

    // ✅ user has permission → navigate
    resetForm();
    navigate("/manage-assignments");

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Submission failed!",
      text: err.response?.data?.message || err.message || "Please Try Again!",
    });
  }
},
  });

  // Fetch chapters when course changes
  useEffect(() => {
    const fetchChapters = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }

      try {
        const res = await getChaptersByCourse(courseId);
        // setAvailableChapters(res.data || []);

         // Remove duplicate chapters by _id
      const uniqueChapters = Array.from(
        new Map(res.data.map((c) => [c._id, c])).values()
      );
      setAvailableChapters(uniqueChapters);
      } catch (err) {
        console.error("Error fetching chapters for training program:", err);
        setAvailableChapters([]);
      }
    };

    fetchChapters();
  }, [formik.values.course]);

  // Fetch assignment when editing
  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const res = await getAssignmentById(assignmentId); // use API function

        if (res.success && res.data) {
          const assignment = res.data;
          formik.setValues({
            course: assignment.chapter?.course || assignment.course || "",
            chapter: assignment.chapter?._id || "",
            title: assignment.title || "",
            description: assignment.description || "",
            deadline: assignment.deadline?.split("T")[0] || "",
            fileUrl: null,
          });

          if (assignment.fileUrl) {
            setExistingFile(DIR.ASSIGNMENT_FILES + assignment.fileUrl);
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: res.message || "Assignment not found",
            confirmButtonColor: "#0E55C8",
          });

          navigate("/manage-assignments");
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: err.response?.data?.message || "Failed to fetch assignment",
          confirmButtonColor: "#0E55C8",
        });
        navigate("/manage-assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  if (loading)
    return <p className="text-center mt-10">Loading assignment...</p>;

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto space-y-6 border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center underline">
          {assignmentId ? "Edit Assignment" : "Add Assignment"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course */}

          {/* Title */}
          <InputField label="Title" name="title" type="text" formik={formik} />

          {/* Deadline */}
          <InputField
            label="Deadline"
            name="deadline"
            type="date"
            formik={formik}
          />

          <Dropdown
            label="Training Program"
            name="course"
            options={availableCourses}
            formik={formik}
            value={selectedCourse} // Controlled value
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCourse(value); // Update local state
              formik.setFieldValue("course", value); // Update Formik value
            }}
            disabled={isCoursePreselected} // Optional: disable if course comes from URL param
          />

          {/* Chapter */}
          <Dropdown
            label="Chapter"
            name="chapter"
            options={availableChapters}
            formik={formik}
            // Disable chapter dropdown if no course selected
            multiple={false}
          />

          <div className="flex flex-col">
            <PDFUploadField
              label="Assignment File (PDF)"
              name="fileUrl"
              formik={formik}
            />

            {existingFile && (
              <a
                href={existingFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2 block"
              >
                View Existing File
              </a>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <TextAreaField
              label="Description"
              name="description"
              formik={formik}
              rows={5} // optional, defaults to 4
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4 flex justify-end gap-4">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="bg-gray-400 text-white px-8 py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {assignmentId ? "Update Assignment" : "Add Assignment"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
