import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import apiClient from "../../../api/axiosConfig";
import { fetchBatchesByCourseId } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";

import { DIR } from "../../../utils/constants";
import handleApiError from "../../../utils/handleApiError";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import MultiPDFFileUpload from "../../form/MultiPDFFileUpload";
import TextAreaField from "../../form/TextAreaField";

export default function AddPrerequisite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState({}); // now per topic index
  const [inputKey, setInputKey] = useState(Date.now());

  // ------------------ Fetch Courses ------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCourses();
        setCourses(res || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    })();
  }, []);

  // ------------------ Formik ------------------
  const formik = useFormik({
    initialValues: {
      courseId: "",
      batchId: "",
      title: "",
      description: "",
      topics: [
        {
          name: "",
          videoLinks: "",
          materialFiles: [],
        },
      ],
    },
    validationSchema: Yup.object({
      courseId: Yup.string().required("Training Program is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("courseId", values.courseId);
        formData.append("batchId", values.batchId);
        formData.append("title", values.title);
        formData.append("description", values.description);

        // Prepare topics payload
        const topicsPayload = values.topics.map((topic, idx) => {
          const existing = existingFiles[idx] || [];
          const newFiles =
            topic.materialFiles
              ?.filter((f) => f instanceof File)
              .map((f) => f.name) || [];
          const finalFiles = [...existing, ...newFiles];

          return {
            name: topic.name,
            videoLinks: topic.videoLinks || "",
            materialFiles: finalFiles.length > 0 ? finalFiles : undefined,
          };
        });

        formData.append("topics", JSON.stringify(topicsPayload));

        // Append new files
        values.topics.forEach((topic) => {
          if (topic.materialFiles?.length) {
            topic.materialFiles.forEach((file) => {
              if (file instanceof File) {
                formData.append("materialFiles", file);
              }
            });
          }
        });

        const response = id
          ? await apiClient.put(`/api/prerequisite/${id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : await apiClient.post(`/api/prerequisite`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

        if (response.data.success) {
          if (!id) {
            // Creating new prerequisite
            Swal.fire({
              title: "Success",
              text: response.data.message,
              icon: "success",
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "Add New Prerequisite",
              denyButtonText: "Manage Prerequisite",
            }).then((result) => {
              if (result.isConfirmed) {
                // Reset form for new entry
                const emptyTopic = {
                  name: "",
                  videoLinks: "",
                  materialFiles: [],
                };

                resetForm({
                  values: {
                    courseId: values.courseId,
                    batchId: values.batchId,
                    title: "",
                    description: "",
                    topics: [emptyTopic],
                  },
                });

                // Clear existing files
                setExistingFiles({});
                setInputKey(Date.now()); // forces all <MultiPDFFileUpload> to remount

                // Force MultiPDFFileUpload reset
                // setInputKey(Date.now());
              } else if (result.isDenied) {
                navigate("/manage-prerequisite");
              }
            });
          } else {
            // Updating existing prerequisite
            Swal.fire("Success", response.data.message, "success").then(() => {
              navigate("/manage-prerequisite"); // Navigate after update
            });
          }
        } else {
          Swal.fire(
            "Warning",
            response.data.message || "Try again!",
            "warning"
          );
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    },
  });

  // ------------------ Fetch Batches by Course ------------------
  useEffect(() => {
    const fetchBatches = async () => {
      const courseId = formik.values.courseId;
      if (!courseId) {
        setBatches([]);
        formik.setFieldValue("batchId", "");
        return;
      }

      try {
        const data = await fetchBatchesByCourseId(courseId);
        setBatches(data.map((b) => ({ _id: b._id, name: b.batchName })));

        if (!id) formik.setFieldValue("batchId", "");
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      }
    };

    fetchBatches();
  }, [formik.values.courseId, id]);

  // ------------------ Fetch Data for Editing ------------------
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    (async () => {
      try {
        const res = await apiClient.get(`/api/prerequisite/${id}`);
        const data = res.data.data;

        // Map topics and set existing files per topic
        const topics = data.topics?.map((t, idx) => {
          setExistingFiles((prev) => ({
            ...prev,
            [idx]: t.materialFiles || [],
          }));

          return {
            name: t.name || "",
            videoLinks: t.videoLinks || "",
            materialFiles: [], // keep empty; user can add new files
          };
        }) || [{ name: "", videoLinks: "", materialFiles: [] }];

        formik.setValues({
          courseId: data.courseId?._id || data.courseId || "",
          batchId: data.batchId?._id || data.batchId || "",
          title: data.title || "",
          description: data.description || "",
          topics,
        });
      } catch (err) {
        Swal.fire(
          "Error",
          handleApiError(err) || "Failed to load prerequisite details",
          "error"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-blue-700 font-medium">
        Loading prerequisite...
      </p>
    );

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-blue-600"
      >
        <h2 className="text-4xl font-bold text-blue-700 text-center">
          {id ? "Edit Prerequisite" : "Add Prerequisite"}
        </h2>

        {/* Main Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title" name="title" type="text" formik={formik} />
          <Dropdown
            label="Training Program"
            name="courseId"
            options={courses}
            formik={formik}
          />
          <Dropdown
            label="Batch"
            name="batchId"
            options={batches}
            formik={formik}
          />
        </div>

        <TextAreaField
          label="Description"
          name="description"
          rows={4}
          formik={formik}
        />

        {/* Topics */}
        <FieldArray
          name="topics"
          render={(topicHelpers) => (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Topics</h3>

              {formik.values.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="border border-blue-500 p-6 rounded-xl space-y-5 shadow-md bg-white"
                >
                  <InputField
                    label="Topic Name"
                    name={`topics.${idx}.name`}
                    formik={formik}
                  />
                  <InputField
                    label="Video Link"
                    name={`topics.${idx}.videoLinks`}
                    formik={formik}
                    type="text"
                    placeholder="https://youtube.com/..."
                  />

                  <MultiPDFFileUpload
                    key={inputKey + idx} // each topic gets a new key when inputKey changes
                    label="Upload Topic Files"
                    name={`topics.${idx}.materialFiles`}
                    formik={formik}
                    multiple
                  />
                  {/* Existing files for this topic */}
                  {existingFiles[idx]?.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded border">
                      <h4 className="font-semibold text-blue-700 mb-1">
                        Existing Files
                      </h4>
                      <ul className="space-y-1">
                        {existingFiles[idx].map((file, fIdx) => (
                          <li key={fIdx}>
                            <a
                              href={DIR.PREREQUISITE_MATERIALS + file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {file.split("/").pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => topicHelpers.remove(idx)}
                    className="bg-red-600 text-white px-4 py-2 rounded mt-3"
                  >
                    Remove Topic
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  topicHelpers.push({
                    name: "",
                    videoLinks: "",
                    materialFiles: [],
                  })
                }
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                + Add Topic
              </button>
            </div>
          )}
        />

        {/* Submit */}

        <div className="text-center">
          <button
            type="submit"
            disabled={formik.isSubmitting || loading} // disable while submitting
            className="bg-blue-700 text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {formik.isSubmitting || loading
              ? id
                ? "Updating..."
                : "Adding..."
              : id
              ? "Update Prerequisite"
              : "Add Prerequisite"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
