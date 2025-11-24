import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { createNote, fetchNoteById, updateNote } from "../../../api/notes";
import { DIR } from "../../../utils/constants";

import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import PDFUploadField from "../../form/PDFUploadField";
import TextAreaField from "../../form/TextAreaField";
import { useCourseParam } from "../../hooks/useCourseParam";

export default function AddNotes() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);
  const [selectedCourseFromParam, , isCoursePreselected] = useCourseParam(availableCourses);


  // ✅ Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCourses();
        setAvailableCourses(courses);
      } catch (err) {
        console.error("Failed to load training program:", err);
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

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      course: "",
      chapter: "",
      title: "",
      content: "",
      type: "",
      file: null,
    },
    validationSchema: Yup.object({
      course: Yup.string().required("Training Program is required"),
      chapter: Yup.string().required("Chapter is required"),
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        if (noteId) {
          await updateNote(noteId, formData);
          Swal.fire("Success", "Note updated successfully!", "success");
        } else {
          await createNote(formData);
          Swal.fire("Success", "Note created successfully!", "success");
        }

        resetForm();
        navigate("/admin/manage-notes");
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          "Failed to submit note: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }
    },
  });

  // ✅ Fetch chapters whenever a course changes
  useEffect(() => {
    const fetchChaptersByCourse = async () => {
      const courseId = formik.values.course;
      if (!courseId) {
        setAvailableChapters([]);
        return;
      }

      try {
        const res = await apiClient.get(`/api/chapters/course/${courseId}`);
        setAvailableChapters(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load chapters for training program:", err);
        setAvailableChapters([]);
      }
    };

    fetchChaptersByCourse();
  }, [formik.values.course]);

  // ✅ Fetch existing note for editing
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;

      setLoading(true);
      try {
        const res = await fetchNoteById(noteId);
        const note = res?.data || res; // handles both raw and wrapped responses

        if (note) {
          // ✅ Extract correct course and chapter from nested structure
          const courseId = note.chapter?.courseDetails?._id || "";
          const chapterId = note.chapter?._id || "";

          // First set course to trigger chapter loading
          formik.setFieldValue("course", courseId);

          // Wait for chapters to load before setting chapter
          setTimeout(() => {
            formik.setValues({
              course: courseId,
              chapter: chapterId,
              title: note.title || "",
              content: note.content || "",
              type: note.type || "",
              file: null,
            });
          }, 400);

          if (note.file) setExistingFile(note.file);
        } else {
          Swal.fire("Not Found", "Note not found.", "warning");
          navigate("/admin/manage-notes");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch note details.", "error");
        navigate("/admin/manage-notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading)
    return (
      <p className="text-center mt-10 text-blue-700 font-medium">
        Loading note details...
      </p>
    );

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-lg shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          {noteId ? "Edit Study Material" : "Add Study Material"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Dropdown */}
          {/* <Dropdown
            label="Training Program"
            name="course"
            options={availableCourses}
            formik={formik}
          /> */}


          <Dropdown
  label="Training Program"
  name="course"
  options={availableCourses}
  formik={formik}
  value={selectedCourse} // Controlled value
  onChange={(e) => {
    const value = e.target.value;
    setSelectedCourse(value);          // Update local state
    formik.setFieldValue("course", value); // Update Formik value
  }}
  disabled={isCoursePreselected} // Disable if course comes from URL param
/>


          {/* Chapter Dropdown */}
          <Dropdown
            label="Chapter"
            name="chapter"
            options={availableChapters}
            formik={formik}
          />

          {/* Title */}
          <InputField label="Title" name="title" formik={formik} />

          {/* File Upload */}
          <div className="md:col-span-2">
            <PDFUploadField name="file" label="Upload File" formik={formik} />

            {existingFile && !formik.values.file && (
              <p className="mt-2 text-sm text-blue-700">
                Existing file:{" "}
                <a
                  href={`${DIR.COURSE_NOTES}${existingFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  {existingFile}
                </a>
              </p>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Content"
              name="content"
              formik={formik}
              rows={4}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {noteId ? "Update Study Material" : "Add Study Material"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
