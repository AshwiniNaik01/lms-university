// import { FieldArray, FormikProvider, useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";
// import Swal from "sweetalert2";
// import * as Yup from "yup";
// import { fetchBatchesByCourseId } from "../../../api/batch";
// import { getAllCourses } from "../../../api/courses";
// import { createPrerequisite } from "../../../api/prerequisite";
// import Dropdown from "../../form/Dropdown";
// import InputField from "../../form/InputField";
// import TextAreaField from "../../form/TextAreaField";

// export default function AddPrerequisite() {
//   const [courses, setCourses] = useState([]);
//   const [batches, setBatches] = useState([]);

//   // Fetch all courses on mount
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const courseData = await getAllCourses();
//         setCourses(courseData || []);
//       } catch (err) {
//         console.error("Failed to fetch courses:", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const validationSchema = Yup.object({
//     // Uncomment and adjust validation if needed
//     // courseId: Yup.string().required("Course is required"),
//     // batchId: Yup.string().required("Batch is required"),
//     // title: Yup.string().required("Title is required"),
//     // topics: Yup.array().of(
//     //   Yup.object().shape({
//     //     name: Yup.string().required("Topic name required"),
//     //     videoLinks: Yup.array().of(Yup.string().url("Invalid URL")),
//     //     materialFiles: Yup.array(),
//     //   })
//     // ),
//   });

//   const formik = useFormik({
//     initialValues: {
//       courseId: "",
//       batchId: "",
//       title: "",
//       description: "",
//       topics: [{ name: "", videoLinks: [""], materialFiles: [] }],
//     },
//     validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const topicsPayload = values.topics.map((topic) => ({
//           name: topic.name,
//           videoLinks: topic.videoLinks,
//           materialFiles: Array.from(topic.materialFiles || []).map((file) => ({
//             fileName: file.name,
//             fileType: file.type,
//             filePath: "",
//           })),
//         }));

//         const payload = {
//           courseId: values.courseId,
//           batchId: values.batchId,
//           title: values.title,
//           description: values.description,
//           topics: topicsPayload,
//         };

//         const res = await createPrerequisite(payload);

//         if (res.success) {
//           Swal.fire(
//             "Success",
//             res.message || "Prerequisite added successfully!",
//             "success"
//           );
//           resetForm();
//         } else {
//           Swal.fire("Warning", res.message || "Please Try Again!", "warning");
//         }
//       } catch (err) {
//         Swal.fire(
//           "Error",
//           err.message || "Failed to create prerequisite",
//           "error"
//         );
//       }
//     },
//   });

//   // Fetch batches whenever a course is selected
//   useEffect(() => {
//     const fetchBatches = async () => {
//       if (!formik.values.courseId) {
//         setBatches([]);
//         return;
//       }

//       try {
//         const batchData = await fetchBatchesByCourseId(formik.values.courseId);
//         // map batchName -> name for Dropdown component
//         const mappedBatches = batchData.map((b) => ({
//           ...b,
//           name: b.batchName,
//         }));
//         setBatches(mappedBatches);
//         // Reset selected batch when course changes
//         formik.setFieldValue("batchId", "");
//       } catch (err) {
//         console.error("Failed to fetch batches:", err);
//         setBatches([]);
//       }
//     };

//     fetchBatches();
//   }, [formik.values.courseId]);

//   return (
//     <FormikProvider value={formik}>
//       <form
//         onSubmit={formik.handleSubmit}
//         className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-8 border-4 border-[rgba(14,85,200,0.83)]"
//       >
//         {/* Heading */}
//         <h2 className="text-4xl font-bold text-[rgba(14,85,200,0.83)] text-center">
//           Add Prerequisite
//         </h2>

//         {/* Grid Layout for main fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course & Batch Dropdowns */}
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

//           {/* Title */}
//           <InputField label="Title" name="title" type="text" formik={formik} />

//           {/* You could add more 2-column fields here if needed */}
//         </div>

//         {/* Description */}
//         <TextAreaField
//           label="Description"
//           name="description"
//           rows={4}
//           formik={formik}
//         />

//         {/* Topics FieldArray */}
//         <FieldArray
//           name="topics"
//           render={(topicHelpers) => (
//             <div className="space-y-6">
//               <h3 className="text-xl font-semibold mb-4">Topics</h3>

//               {formik.values.topics.map((topic, idx) => (
//                 <div
//                   key={idx}
//                   className="border border-blue-500 p-6 rounded-xl space-y-4 shadow-md bg-white relative"
//                 >
//                   {/* Topic Name */}
//                   <InputField
//                     label="Topic Name"
//                     name={`topics.${idx}.name`}
//                     formik={formik}
//                   />

//                   {/* Video Links */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Video Links
//                     </label>
//                     <FieldArray
//                       name={`topics.${idx}.videoLinks`}
//                       render={(vlHelpers) => (
//                         <div className="space-y-2">
//                           {topic.videoLinks.map((_, vIdx) => (
//                             <div key={vIdx} className="flex gap-3">
//                               <input
//                                 type="text"
//                                 value={topic.videoLinks[vIdx]}
//                                 onChange={(e) =>
//                                   formik.setFieldValue(
//                                     `topics.${idx}.videoLinks.${vIdx}`,
//                                     e.target.value
//                                   )
//                                 }
//                                 onKeyDown={(e) => {
//                                   if (e.key === "Enter") {
//                                     e.preventDefault(); // Prevent form submission
//                                     vlHelpers.insert(vIdx + 1, ""); // Insert a new field below
//                                   }
//                                 }}
//                                 className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
//                                 placeholder="https://youtube.com/..."
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => vlHelpers.remove(vIdx)}
//                                 className="px-3 py-2 bg-rose-500 text-white rounded"
//                               >
//                                 <FaMinus />
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => vlHelpers.push("")}
//                                 className="px-3 py-2 bg-emerald-500 text-white rounded"
//                               >
//                                 <FaPlus />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     />
//                   </div>

//                   {/* Material Files */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-semibold text-gray-800 mb-2">
//                       Upload Files
//                     </label>
//                     <div className="relative w-full">
//                       <input
//                         type="file"
//                         multiple
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             `topics.${idx}.materialFiles`,
//                             e.target.files
//                           )
//                         }
//                         className="absolute inset-0 opacity-0 cursor-pointer z-20"
//                       />
//                       <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
//                         <div className="flex items-center space-x-3">
//                           <FaUpload className="text-blue-600" />
//                           <span className="text-gray-700 font-medium truncate max-w-[300px]">
//                             {topic.materialFiles.length > 0
//                               ? `${topic.materialFiles.length} file(s) selected`
//                               : "Choose files..."}
//                           </span>
//                         </div>
//                         <span className="text-sm text-gray-500 hidden md:block">
//                           Max: 5MB
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => topicHelpers.remove(idx)}
//                     className="mt-3 bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-400"
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
//                     videoLinks: [""],
//                     materialFiles: [],
//                   })
//                 }
//                 className="mt-3 bg-sky-600 text-white px-4 py-2 rounded"
//               >
//                 Add Topic
//               </button>
//             </div>
//           )}
//         />

//         {/* Submit Button */}
//         <div className="text-center pt-4">
//           <button
//             type="submit"
//             className="bg-[rgba(14,85,200,0.83)] text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
//           >
//             Add Prerequisite
//           </button>
//         </div>
//       </form>
//     </FormikProvider>
//   );
// }

import { FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../../api/axiosConfig";
import { fetchBatchesByCourseId } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import { createPrerequisite } from "../../../api/prerequisite";

import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import TextAreaField from "../../form/TextAreaField";
import { DIR } from "../../../utils/constants";

export default function AddPrerequisite() {
  const { id } = useParams(); // <-- ID for editing
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

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
          videoLinks: [""],
          materialFiles: [],
          existingFiles: [],
        },
      ],
    },

    validationSchema: Yup.object(),

    onSubmit: async (values) => {
      try {
        const topicsPayload = values.topics.map((topic) => ({
          name: topic.name,
          videoLinks: topic.videoLinks,
          materialFiles: [
            ...Array.from(topic.materialFiles || []).map((file) => ({
              fileName: file.name,
              fileType: file.type,
              filePath: "",
            })),
            ...topic.existingFiles, // ⬅ keep previously uploaded files
          ],
        }));

        const payload = {
          courseId: values.courseId,
          batchId: values.batchId,
          title: values.title,
          description: values.description,
          topics: topicsPayload,
        };

        // ---------- UPDATE ----------
        if (id) {
          await apiClient.put(`/api/prerequisite/${id}`, payload);

          Swal.fire(
            "Success",
            "Prerequisite updated successfully!",
            "success"
          );
          navigate("/manage-prerequisite");
          return;
        }

        // ---------- CREATE ----------
        const res = await createPrerequisite(payload);

        if (res.success) {
          Swal.fire("Success", res.message, "success");
          navigate("/manage-prerequisite");
        } else {
          Swal.fire("Warning", res.message || "Try again!", "warning");
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    },
  });

  // ------------------ Fetch Batches by Course ------------------
  // useEffect(() => {
  //   (async () => {
  //     if (!formik.values.courseId) return setBatches([]);

  //     try {
  //       const data = await fetchBatchesByCourseId(formik.values.courseId);
  //       const mapped = data.map((b) => ({ ...b, name: b.batchName }));

  //       setBatches(mapped);
  //       formik.setFieldValue("batchId", "");
  //     } catch {
  //       setBatches([]);
  //     }
  //   })();
  // }, [formik.values.courseId]);

  useEffect(() => {
  (async () => {
    if (!formik.values.courseId) return setBatches([]);

    const data = await fetchBatchesByCourseId(formik.values.courseId);
    const mapped = data.map((b) => ({ ...b, name: b.batchName }));
    setBatches(mapped);

    // ❗ ONLY RESET IF ADDING NEW, NOT EDITING
    if (!id) {
      formik.setFieldValue("batchId", "");
    }
  })();
}, [formik.values.courseId]);


  // ------------------ Fetch Data for Editing ------------------
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    (async () => {
      try {
        const res = await apiClient.get(`/api/prerequisite/${id}`);
        const data = res.data.data;

        formik.setValues({
          courseId: data.courseId,
          batchId: data.batchId,
          title: data.title,
          description: data.description,
          topics: data.topics.map((t) => ({
            name: t.name,
            videoLinks: t.videoLinks,
            materialFiles: [],
            existingFiles: t.materialFiles, // ⬅ prefilled files here
          })),
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
          <InputField label="Title" name="title" type="text" formik={formik} />
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

                  {/* Video Links */}
                  <FieldArray
                    name={`topics.${idx}.videoLinks`}
                    render={(vlHelpers) => (
                      <div className="space-y-3">
                        <label className="font-medium">Video Links</label>

                        {topic.videoLinks.map((_, vIdx) => (
                          <div key={vIdx} className="flex gap-3">
                            <input
                              type="text"
                              className="flex-1 px-4 py-2 border rounded-lg"
                              value={topic.videoLinks[vIdx]}
                              placeholder="https://youtube.com/..."
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `topics.${idx}.videoLinks.${vIdx}`,
                                  e.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() => vlHelpers.remove(vIdx)}
                              className="px-3 py-2 bg-red-500 text-white rounded"
                            >
                              <FaMinus />
                            </button>

                            <button
                              type="button"
                              onClick={() => vlHelpers.push("")}
                              className="px-3 py-2 bg-green-600 text-white rounded"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  />

                  {/* Material File Upload */}
                  <div>
                    <label className="block mb-1 font-medium">Upload Files</label>

                    <div className="relative border-2 border-dashed p-4 rounded-lg bg-white">
                      <input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                          formik.setFieldValue(
                            `topics.${idx}.materialFiles`,
                            e.target.files
                          )
                        }
                      />

                      <div className="flex items-center gap-3 text-gray-600">
                        <FaUpload />
                        <span>
                          {topic.materialFiles?.length > 0
                            ? `${topic.materialFiles.length} selected`
                            : "Choose files..."}
                        </span>
                      </div>
                    </div>

                    {/* Prefilled uploaded files */}
                    {topic.existingFiles?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {topic.existingFiles.map((file, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                          >
                            <a
                              href={`${DIR.PREREQUISITE_MATERIALS}${file.fileName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              {file.fileName}
                            </a>

                            <button
                              type="button"
                              className="text-red-600"
                              onClick={() => {
                                const updated = [...topic.existingFiles];
                                updated.splice(fIdx, 1);
                                formik.setFieldValue(
                                  `topics.${idx}.existingFiles`,
                                  updated
                                );
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

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
                    videoLinks: [""],
                    materialFiles: [],
                    existingFiles: [],
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
            className="bg-blue-700 text-white font-semibold px-10 py-3 rounded-md shadow-lg hover:bg-blue-800"
          >
            {id ? "Update Prerequisite" : "Add Prerequisite"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}


// export default function AddPrerequisite() {
//   const { id } = useParams(); // <-- ID for editing
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);

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
//       topics: [{ name: "", videoLinks: [""], materialFiles: [] }],
//     },

//     validationSchema: Yup.object(), // add validations if needed

//     onSubmit: async (values) => {
//       try {
//         const topicsPayload = values.topics.map((topic) => ({
//           name: topic.name,
//           videoLinks: topic.videoLinks,
//           materialFiles: Array.from(topic.materialFiles || []).map((file) => ({
//             fileName: file.name,
//             fileType: file.type,
//             filePath: "",
//           })),
//         }));

//         const payload = {
//           courseId: values.courseId,
//           batchId: values.batchId,
//           title: values.title,
//           description: values.description,
//           topics: topicsPayload,
//         };

//         // ---------- UPDATE ----------
//         if (id) {
//           const res = await apiClient.put(`/api/prerequisite/${id}`, payload);

//           Swal.fire("Success", "Prerequisite updated successfully!", "success");
//           navigate("/manage-prerequisite");
//           return;
//         }

//         // ---------- CREATE ----------
//         const res = await createPrerequisite(payload);

//         if (res.success) {
//           Swal.fire("Success", res.message, "success");
//           navigate("/manage-prerequisite");
//         } else {
//           Swal.fire("Warning", res.message || "Try again!", "warning");
//         }
//       } catch (err) {
//         Swal.fire("Error", err.response?.data?.message || err.message, "error");
//       }
//     },
//   });

//   // ------------------ Fetch Batches on Course Change ------------------
//   useEffect(() => {
//     (async () => {
//       if (!formik.values.courseId) return setBatches([]);

//       try {
//         const data = await fetchBatchesByCourseId(formik.values.courseId);
//         const mapped = data.map((b) => ({ ...b, name: b.batchName }));

//         setBatches(mapped);
//         formik.setFieldValue("batchId", "");
//       } catch {
//         setBatches([]);
//       }
//     })();
//   }, [formik.values.courseId]);

//   // ------------------ Fetch Existing Prerequisite for Editing ------------------
//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     (async () => {
//       try {
//         const res = await apiClient.get(`/api/prerequisite/${id}`);
//         const data = res.data.data;

//         // Pre-fill form
//         formik.setValues({
//           courseId: data.courseId,
//           batchId: data.batchId,
//           title: data.title,
//           description: data.description,
//           topics: data.topics.map((t) => ({
//             name: t.name,
//             videoLinks: t.videoLinks,
//             materialFiles: [], // cannot prefill files
//           })),
//         });
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

//   // ---------------------------------------------------
//   // ------------------ UI TEMPLATE ---------------------
//   // ---------------------------------------------------

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

//         {/* Topics */}
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

//                   {/* Video Links */}
//                   <FieldArray
//                     name={`topics.${idx}.videoLinks`}
//                     render={(vlHelpers) => (
//                       <div className="space-y-3">
//                         <label className="font-medium">Video Links</label>

//                         {topic.videoLinks.map((_, vIdx) => (
//                           <div key={vIdx} className="flex gap-3">
//                             <input
//                               type="text"
//                               className="flex-1 px-4 py-2 border rounded-lg"
//                               value={topic.videoLinks[vIdx]}
//                               placeholder="https://youtube.com/..."
//                               onChange={(e) =>
//                                 formik.setFieldValue(
//                                   `topics.${idx}.videoLinks.${vIdx}`,
//                                   e.target.value
//                                 )
//                               }
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                   e.preventDefault();
//                                   vlHelpers.insert(vIdx + 1, "");
//                                 }
//                               }}
//                             />

//                             {/* Buttons */}
//                             <button
//                               type="button"
//                               onClick={() => vlHelpers.remove(vIdx)}
//                               className="px-3 py-2 bg-red-500 text-white rounded"
//                             >
//                               <FaMinus />
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => vlHelpers.push("")}
//                               className="px-3 py-2 bg-green-600 text-white rounded"
//                             >
//                               <FaPlus />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   />

//                   {/* File Upload */}
//                   {/* <div>
//                     <label className="block mb-1 font-medium">
//                       Upload Files
//                     </label>
//                     <div className="relative border-2 border-dashed p-4 rounded-lg">
//                       <input
//                         type="file"
//                         multiple
//                         className="absolute inset-0 opacity-0"
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             `topics.${idx}.materialFiles`,
//                             e.target.files
//                           )
//                         }
//                       />
//                       <div className="flex items-center gap-3 text-gray-600">
//                         <FaUpload />
//                         <span>
//                           {topic.materialFiles.length > 0
//                             ? `${topic.materialFiles.length} selected`
//                             : "Choose files..."}
//                         </span>
//                       </div>
//                     </div>
//                   </div> */}

//                   {/* Material Files Upload */}
//                   <div className="mb-4">
//                     <label className="block mb-1 font-medium">
//                       Upload Files
//                     </label>

//                     <div className="relative border-2 border-dashed p-4 rounded-lg bg-white">
//                       <input
//                         type="file"
//                         multiple
//                         className="absolute inset-0 opacity-0 cursor-pointer"
//                         onChange={(e) =>
//                           formik.setFieldValue(
//                             `topics.${idx}.materialFiles`,
//                             e.target.files
//                           )
//                         }
//                       />
//                       <div className="flex items-center gap-3 text-gray-600">
//                         <FaUpload />
//                         <span>
//                           {topic.materialFiles?.length > 0
//                             ? `${topic.materialFiles.length} selected`
//                             : "Choose files..."}
//                         </span>
//                       </div>
//                     </div>

//                     {/* 📌 SHOW PREFILLED FILES (Already uploaded) */}
//                     {topic.existingFiles && topic.existingFiles.length > 0 && (
//                       <ul className="mt-3 space-y-1">
//                         {topic.existingFiles.map((file, fIdx) => (
//                           <li
//                             key={fIdx}
//                             className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
//                           >
//                             <a
//                               href={`${DIR.PREREQUISITE_MATERIALS}${file.fileName}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 underline text-sm"
//                             >
//                               {file.fileName}
//                             </a>

//                             {/* Remove existing file */}
//                             <button
//                               type="button"
//                               className="text-red-600"
//                               onClick={() => {
//                                 const updated = [...topic.existingFiles];
//                                 updated.splice(fIdx, 1);
//                                 formik.setFieldValue(
//                                   `topics.${idx}.existingFiles`,
//                                   updated
//                                 );
//                               }}
//                             >
//                               Remove
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>

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
//                     videoLinks: [""],
//                     materialFiles: [],
//                   })
//                 }
//                 className="bg-blue-600 text-white px-5 py-2 rounded"
//               >
//                 + Add Topic
//               </button>
//             </div>
//           )}
//         />

//         {/* Submit */}
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
