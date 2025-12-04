import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import apiClient from "../../../api/axiosConfig";
import { fetchBatchesByCourseId } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";

import { DIR } from "../../../utils/constants";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import MultiPDFFileUpload from "../../form/MultiPDFFileUpload";
import TextAreaField from "../../form/TextAreaField";

// export default function AddPrerequisite() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [existingFiles, setExistingFiles] = useState([]);

//   // ------------------ Fetch Courses ------------------
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getAllCourses();
//         setCourses(res || []);
//       } catch (err) {
//         console.error("Failed to load courses:", err);
//       }
//     })();
//   }, []);

//   // ------------------ Formik ------------------
//   const formik = useFormik({
//     initialValues: {
//       courseId: "",
//       batchId: "",
//       title: "",
//       description: "",
//       topics: [
//         {
//           name: "",
//           videoLinks: "", // SINGLE STRING NOW
//         },
//       ],
//       materialFiles: [],
//     },

//     validationSchema: Yup.object(),

//     // onSubmit: async (values) => {
//     //   try {
//     //     const topicsPayload = values.topics.map((topic) => ({
//     //       name: topic.name,
//     //       videoLinks: topic.videoLinks || "",
//     //     }));

//     //     const formData = new FormData();
//     //     formData.append("courseId", values.courseId);
//     //     formData.append("batchId", values.batchId);
//     //     formData.append("title", values.title);
//     //     formData.append("description", values.description);
//     //     formData.append("topics", JSON.stringify(topicsPayload));

//     //     if (values.materialFiles?.length > 0) {
//     //       Array.from(values.materialFiles).forEach((file) =>
//     //         formData.append("materialFiles", file)
//     //       );
//     //     }

//     //     let res;
//     //     if (id) {
//     //       res = await apiClient.put(`/api/prerequisite/${id}`, formData, {
//     //         headers: { "Content-Type": "multipart/form-data" },
//     //       });
//     //     } else {
//     //       res = await apiClient.post(`/api/prerequisite`, formData, {
//     //         headers: { "Content-Type": "multipart/form-data" },
//     //       });
//     //     }

//     //     if (res.data.success) {
//     //       Swal.fire("Success", res.data.message, "success");
//     //       navigate("/manage-prerequisite");
//     //     } else {
//     //       Swal.fire("Warning", res.data.message || "Try again!", "warning");
//     //     }
//     //   } catch (err) {
//     //     Swal.fire("Error", err.response?.data?.message || err.message, "error");
//     //   }
//     // },

//     onSubmit: async (values) => {
//       try {
//         // ------------------ Prepare Payload ------------------
//         const topicsPayload = values.topics.map((topic) => ({
//           name: topic.name,
//           videoLink: topic.videoLinks || "", // singular key naming for backend
//         }));

//         const formData = new FormData();
//         formData.append("courseId", values.courseId);
//         formData.append("batchId", values.batchId);
//         formData.append("title", values.title);
//         formData.append("description", values.description);
//         formData.append("topics", JSON.stringify(topicsPayload));

//         // if (values.materialFiles?.length > 0) {
//         //   Array.from(values.materialFiles).forEach((file) =>
//         //     formData.append("materialFiles", file)
//         //   );
//         // }

//         // Always send materialFiles field
//         if (values.materialFiles && values.materialFiles.length > 0) {
//           Array.from(values.materialFiles).forEach((file) =>
//             formData.append("materialFiles", file)
//           );
//         } else {
//           // Send an empty value to indicate no change
//           formData.append("materialFiles", "");
//         }

//         // ------------------ API Request ------------------
//         const response = id
//           ? await apiClient.put(`/api/prerequisite/${id}`, formData, {
//               headers: { "Content-Type": "multipart/form-data" },
//             })
//           : await apiClient.post(`/api/prerequisite`, formData, {
//               headers: { "Content-Type": "multipart/form-data" },
//             });

//         // ------------------ Handle Response ------------------
//         if (response.data.success) {
//           const { courseId, batchId } = formik.values; // preserve selections

//           const swalResult = await Swal.fire({
//             title: "Success!",
//             text: response.data.message,
//             icon: "success",
//             showCancelButton: true,
//             confirmButtonText: "Add New Prerequisite",
//             cancelButtonText: "Manage Prerequisite",
//             allowOutsideClick: false,
//           });

//           // ------------------ Handle User Choice ------------------
//           switch (true) {
//             case swalResult.isConfirmed:
//               // Reset the form but preserve courseId and batchId
//               formik.resetForm({
//                 values: {
//                   courseId,
//                   batchId,
//                   title: "",
//                   description: "",
//                   topics: [{ name: "", videoLinks: "" }],
//                   materialFiles: [],
//                 },
//               });
//               setExistingFiles([]);
//               break;

//             case swalResult.dismiss === Swal.DismissReason.cancel:
//               // Redirect to Manage Prerequisite page
//               // window.location.href = "http://localhost:6174/manage-prerequisite";
//               navigate("/manage-prerequisite");
//               break;

//             default:
//               // Do nothing if user closes the modal
//               break;
//           }
//         } else {
//           Swal.fire(
//             "Warning",
//             response.data.message || "Please try again!",
//             "warning"
//           );
//         }
//       } catch (error) {
//         Swal.fire(
//           "Error",
//           error.response?.data?.message || error.message,
//           "error"
//         );
//       }
//     },
//   });

//   // ------------------ Fetch Batches by Course ------------------
//   useEffect(() => {
//     (async () => {
//       if (!formik.values.courseId) return setBatches([]);

//       const data = await fetchBatchesByCourseId(formik.values.courseId);

//       const mapped = data.map((b) => ({
//         _id: b._id,
//         name: b.batchName,
//       }));

//       setBatches(mapped);

//       if (!id) formik.setFieldValue("batchId", "");
//     })();
//   }, [formik.values.courseId]);

//   // ------------------ Fetch Data for Editing ------------------
//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);

//     (async () => {
//       try {
//         const res = await apiClient.get(`/api/prerequisite/${id}`);
//         const data = res.data.data;

//         formik.setValues({
//           courseId: data.courseId?._id || data.courseId || "",
//           batchId: data.batchId?._id || data.batchId || "",
//           title: data.title || "",
//           description: data.description || "",
//           topics: data.topics?.map((t) => ({
//             name: t.name || "",
//             videoLinks: t.videoLinks || "",
//           })) || [{ name: "", videoLinks: "" }],
//           materialFiles: [],
//         });

//         const extractedFiles = data.topics
//           ?.map((t) => t.materialFiles)
//           .filter((f) => f && f !== "");

//         setExistingFiles(
//           Array.isArray(extractedFiles) ? extractedFiles : [extractedFiles]
//         );
//       } catch (err) {
//         Swal.fire("Error", "Failed to load prerequisite details", "error");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-blue-700 font-medium">
//         Loading prerequisite...
//       </p>
//     );

//   return (
//     <FormikProvider value={formik}>
//       <form
//         onSubmit={formik.handleSubmit}
//         className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-blue-600"
//       >
//         <h2 className="text-4xl font-bold text-blue-700 text-center">
//           {id ? "Edit Prerequisite" : "Add Prerequisite"}
//         </h2>

//         {/* Main Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Dropdown
//             label="Training Program"
//             name="courseId"
//             options={courses}
//             formik={formik}
//           />
//           <Dropdown
//             label="Batch"
//             name="batchId"
//             options={batches}
//             formik={formik}
//           />
//           <InputField label="Title" name="title" type="text" formik={formik} />
//         </div>

//         <TextAreaField
//           label="Description"
//           name="description"
//           rows={4}
//           formik={formik}
//         />

//         {/* MATERIAL FILES */}
//         <div>
//           <MultiPDFFileUpload
//             label="Upload Material Files (PDF/DOC)"
//             name="materialFiles"
//             formik={formik}
//             multiple={true}
//           />

//           {existingFiles.length > 0 && (
//             <div className="bg-gray-100 p-4 rounded-lg border">
//               <h3 className="font-semibold mb-2 text-blue-700">
//                 Existing Materials
//               </h3>
//               <ul className="space-y-2">
//                 {existingFiles.map((file, idx) => (
//                   <li key={idx}>
//                     <a
//                       href={DIR.PREREQUISITE_MATERIALS + file}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       {file}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* TOPICS */}
//         <FieldArray
//           name="topics"
//           render={(topicHelpers) => (
//             <div className="space-y-6">
//               <h3 className="text-xl font-semibold mb-4">Topics</h3>

//               {formik.values.topics.map((topic, idx) => (
//                 <div
//                   key={idx}
//                   className="border border-blue-500 p-6 rounded-xl space-y-5 shadow-md bg-white"
//                 >
//                   <InputField
//                     label="Topic Name"
//                     name={`topics.${idx}.name`}
//                     formik={formik}
//                   />

//                   {/* SINGLE VIDEO LINK INPUT */}
//                   <InputField
//                     label="Video Link"
//                     name={`topics.${idx}.videoLinks`}
//                     formik={formik}
//                     type="text"
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") e.preventDefault();
//                     }}
//                     placeholder="https://youtube.com/..."
//                   />

//                   <button
//                     type="button"
//                     onClick={() => topicHelpers.remove(idx)}
//                     className="bg-red-600 text-white px-4 py-2 rounded mt-3"
//                   >
//                     Remove Topic
//                   </button>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() =>
//                   topicHelpers.push({
//                     name: "",
//                     videoLinks: "",
//                   })
//                 }
//                 className="bg-blue-600 text-white px-5 py-2 rounded"
//               >
//                 + Add Topic
//               </button>
//             </div>
//           )}
//         />

//         {/* SUBMIT */}
//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-700 text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-800"
//           >
//             {id ? "Update Prerequisite" : "Add Prerequisite"}
//           </button>
//         </div>
//       </form>
//     </FormikProvider>
//   );
// }
export default function AddPrerequisite() {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState({}); // now per topic index

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
      batchId: Yup.string().required("Batch is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      topics: Yup.array().of(
        Yup.object({
          name: Yup.string().required("Topic name is required"),
          videoLinks: Yup.string().url("Invalid URL"),
        })
      ),
    }),
// onSubmit: async (values) => {
//   try {
//     const formData = new FormData();

//     formData.append("courseId", values.courseId);
//     formData.append("batchId", values.batchId);
//     formData.append("title", values.title);
//     formData.append("description", values.description);

//     // --- Build Topics Payload ---
//     const topicsPayload = values.topics.map((topic, idx) => {
//       const existing = existingFiles[idx] || []; // array of strings (old)

//       const newFiles = topic.materialFiles
//         ?.filter((f) => f instanceof File)
//         .map((f) => f.name) || [];

//       const finalFiles = [...existing, ...newFiles];

//       return {
//         name: topic.name,
//         videoLinks: topic.videoLinks || "",
//         materialFiles: finalFiles.length > 0 ? finalFiles : undefined,
//       };
//     });

//     formData.append("topics", JSON.stringify(topicsPayload));

//     // --- Append New Uploaded Files ---
//     values.topics.forEach((topic) => {
//       if (topic.materialFiles?.length) {
//         topic.materialFiles.forEach((file) => {
//           if (file instanceof File) {
//             formData.append("materialFiles", file);
//           }
//         });
//       }
//     });

//     const response = id
//       ? await apiClient.put(`/api/prerequisite/${id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         })
//       : await apiClient.post(`/api/prerequisite`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//     if (response.data.success) {
//       Swal.fire("Success", response.data.message, "success");
//       navigate("/manage-prerequisite");
//     } else {
//       Swal.fire("Warning", response.data.message || "Try again!", "warning");
//     }
//   } catch (err) {
//     Swal.fire("Error", err.response?.data?.message || err.message, "error");
//   }
// }


onSubmit: async (values) => {
  try {
    const formData = new FormData();

    formData.append("courseId", values.courseId);
    formData.append("batchId", values.batchId);
    formData.append("title", values.title);
    formData.append("description", values.description);

    const topicsPayload = values.topics.map((topic, idx) => {
      const existing = existingFiles[idx] || [];
      const newFiles = topic.materialFiles
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
      const { courseId, batchId } = values; // preserve selections

      // Show SweetAlert with 2 buttons
      const result = await Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Add New Prerequisite",
        cancelButtonText: "Manage Prerequisite",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        // Reset form but keep courseId and batchId
        formik.resetForm({
          values: {
            courseId,
            batchId,
            title: "",
            description: "",
            topics: [{ name: "", videoLinks: "", materialFiles: [] }],
          },
        });
        setExistingFiles({}); // clear uploaded files
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/manage-prerequisite");
      }
    } else {
      Swal.fire("Warning", response.data.message || "Try again!", "warning");
    }
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || err.message, "error");
  }
}

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
        Swal.fire("Error", "Failed to load prerequisite details", "error");
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
          <Dropdown label="Training Program" name="courseId" options={courses} formik={formik} />
          <Dropdown label="Batch" name="batchId" options={batches} formik={formik} />
          <InputField label="Title" name="title" type="text" formik={formik} />
        </div>

        <TextAreaField label="Description" name="description" rows={4} formik={formik} />

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
                  <InputField label="Topic Name" name={`topics.${idx}.name`} formik={formik} />
                  <InputField
                    label="Video Link"
                    name={`topics.${idx}.videoLinks`}
                    formik={formik}
                    type="text"
                    placeholder="https://youtube.com/..."
                  />

                

                  <MultiPDFFileUpload
                    label="Upload Topic Files"
                    name={`topics.${idx}.materialFiles`}
                    formik={formik}
                    multiple
                  />
                    {/* Existing files for this topic */}
                  {existingFiles[idx]?.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded border">
                      <h4 className="font-semibold text-blue-700 mb-1">Existing Files</h4>
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
                onClick={() => topicHelpers.push({ name: "", videoLinks: "", materialFiles: [] })}
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
            className="bg-blue-700 text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-800"
          >
            {id ? "Update Prerequisite" : "Add Prerequisite"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
