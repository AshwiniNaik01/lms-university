
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { fetchAllChapters } from "../../../api/curriculum";
import { createNote, fetchNoteById, updateNote } from "../../../api/notes";
import { DIR } from "../../../utils/constants";

import Swal from "sweetalert2";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import PDFUploadField from "../../form/PDFUploadField";
import TextAreaField from "../../form/TextAreaField";

export default function AddNotes() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);

// Fetch all chapters on mount
useEffect(() => {
  const fetchChapters = async () => {
    try {
      const chapters = await fetchAllChapters();
      setAvailableChapters(chapters);
    } catch (err) {
      console.error("Failed to load chapters:", err);
    }
  };
  fetchChapters();
}, []);

// Formik configuration
const formik = useFormik({
  initialValues: {
    chapter: "",
    title: "",
    content: "",
    type: "",
    duration: "",
    file: null,
  },
  validationSchema: Yup.object({
    chapter: Yup.string().required("Chapter is required"),
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    // type: Yup.string().required("Type is required"),
    duration: Yup.string().required("Duration is required"),
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

// Fetch existing note for edit
useEffect(() => {
  const fetchNote = async () => {
    if (!noteId || availableChapters.length === 0) return;

    setLoading(true);
    try {
      const note = await fetchNoteById(noteId);

      if (note) {
        formik.setValues({
          chapter: note.chapter?._id || "",
          title: note.title || "",
          content: note.content || "",
          type: note.type || "",
          duration: note.duration || "",
          file: null,
        });

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
}, [noteId, availableChapters]);

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
        {/* Form Heading */}
        <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
          {noteId ? "Edit Note" : "Add New Note"}
        </h2>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Chapter Dropdown */}
          <Dropdown
            label="Chapter"
            name="chapter"
            options={availableChapters}
            formik={formik}
          />

          {/* Type Input */}
          {/* <InputField
            label="Type"
            name="type"
            placeholder="e.g., Article, PDF, PPT"
            formik={formik}
          /> */}

          {/* Title Input */}
          <InputField label="Title" name="title" formik={formik} />

          {/* Duration Input */}
          <InputField
            label="Duration"
            name="duration"
            placeholder="e.g., 15:30"
            formik={formik}
          />

          {/* File Upload */}
          <div className="md:col-span-2">
            <PDFUploadField name="file" label="Upload File" formik={formik} />

            {/* Existing file preview */}
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

          {/* Content TextArea */}
          <div className="md:col-span-2">
            <TextAreaField
              label="Content"
              name="content"
              formik={formik}
              rows={4}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {noteId ? "Update Note" : "Submit Note"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
