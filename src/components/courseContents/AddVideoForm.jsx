import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const videoValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  contentUrl: Yup.string().url("Must be a valid URL").required("Video URL is required"),
  duration: Yup.string().required("Duration is required"),
  type: Yup.string().required("Type is required"),
  description: Yup.string(),
});

const AddVideoForm = ({ courseId, token, onSuccess, onError, addVideoToCourse }) => {
  return (
    <Formik
      initialValues={{
        type: "video",
        title: "",
        contentUrl: "",
        duration: "",
        description: "",
      }}
      validationSchema={videoValidationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const payload = { ...values, course: courseId };
          const response = await addVideoToCourse(courseId, payload, token);

          if (response.success) {
            onSuccess("Video added successfully!");
            resetForm();
          } else {
            onError(response.message || "Failed to add video.");
          }
        } catch (err) {
          onError(err.message || "An error occurred while adding the video.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Field
                as="select"
                name="type"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="video">Video</option>
                <option value="lecture">Lecture</option>
              </Field>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (MM:SS)</label>
              <Field
                type="text"
                name="duration"
                placeholder="00:00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
            <Field
              type="text"
              name="title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <Field
              type="url"
              name="contentUrl"
              placeholder="https://example.com/video.mp4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Field
              as="textarea"
              name="description"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
          >
            {isSubmitting ? "Adding Video..." : "➕ Add Video"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddVideoForm;
