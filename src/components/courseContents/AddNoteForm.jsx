import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const noteValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  duration: Yup.string(),
  file: Yup.mixed(),
});

const AddNoteForm = ({ courseId, token, onSuccess, onError, addNoteToCourse }) => {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        duration: "",
        file: null,
      }}
      validationSchema={noteValidationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("content", values.content);
          formData.append("duration", values.duration || "");
          formData.append("uploadedAt", new Date().toISOString());

          if (values.file instanceof File) {
            formData.append("file", values.file);
          }

          const response = await addNoteToCourse(courseId, formData, token);

          if (response.success) {
            onSuccess("Note added successfully!");
            resetForm();
          } else {
            onError(response.message || "Failed to add note.");
          }
        } catch (err) {
          onError(err.message || "An error occurred while adding the note.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (MM:SS)</label>
              <Field
                type="text"
                name="duration"
                placeholder="00:00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <p className="text-sm text-gray-500 mt-1">PDF Upload</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Title</label>
            <Field
              type="text"
              name="title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Description</label>
            <Field
              as="textarea"
              name="content"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue("file", file);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg"
          >
            {isSubmitting ? "Adding Note..." : "📝 Add Note"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddNoteForm;
