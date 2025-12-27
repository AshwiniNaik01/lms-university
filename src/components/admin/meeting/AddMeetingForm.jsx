
// import { FormikProvider, useFormik } from "formik";
// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import apiClient from "../../../api/axiosConfig";
// import { getAllCourses } from "../../../api/courses";
// import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
// import Dropdown from "../../form/Dropdown";
// import InputField from "../../form/InputField";
// import TextAreaField from "../../form/TextAreaField";
// import { COURSE_NAME } from "../../../utils/constants";

// const AddMeetingForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [trainers, setTrainers] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [customPlatform, setCustomPlatform] = useState("");

//   // ✅ Move Formik to TOP so useEffect can read formik.values
//   const formik = useFormik({
//     initialValues: {
//       title: "",
//       description: "",
//       meetingDescription: "",
//       platform: "Google Meet",
//       meetingLink: "",
//       meetingId: "",
//       meetingPassword: "",
//       batch: "",
//       trainer: "",
//       course: "",
//       startTime: "",
//       endTime: "",
//       notification: "",
//     },
//     onSubmit: async (values) => {
//       setLoading(true);
//       const submitValues = { ...values };

//       if (values.platform === "Other") {
//         submitValues.platform = customPlatform;
//       }

//       try {
//         const res = await apiClient.post("/api/meetings", submitValues);

//         if (res.data.success) {
//           Swal.fire({
//             icon: "success",
//             title: "Success",
//             text: res.data.message || "Session created successfully!",
//             confirmButtonText: "OK",
//           });

//           formik.resetForm();
//           setCustomPlatform("");
//         }
//       } catch (err) {
//         console.error("Error creating session:", err);

//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: err.response?.data?.message || "Failed to create session.",
//           confirmButtonText: "OK",
//         });
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // ✅ Fetch Courses & Trainers only
//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [coursesData, trainersData] = await Promise.all([
//           getAllCourses(),
//           fetchAllTrainers(),
//         ]);

//         setCourses(coursesData);
//         setTrainers(trainersData);
//       } catch (err) {
//         console.error("Error fetching dropdown data:", err);
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   // ✅ Fetch Batches dynamically based on selected course
//   useEffect(() => {
//     if (!formik.values.course) {
//       setBatches([]);
//       formik.setFieldValue("batch", ""); // reset batch field
//       return;
//     }

//     apiClient
//       .get(`/api/batches/course/${formik.values.course}`)
//       .then((res) => {
//         if (res.data.success && res.data.data.length > 0) {
//           setBatches(res.data.data);
//         } else {
//           setBatches([]);
//           formik.setFieldValue("batch", "");

//           Swal.fire({
//             icon: "warning",
//             title: "No Batches Found",
//             text: res.data.message || "No batches found for this training.",
//             confirmButtonText: "OK",
//           });
//         }
//       })
//       .catch((err) => {
//         setBatches([]);
//         formik.setFieldValue("batch", "");

//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text:
//             err.response?.data?.message ||
//             `Failed to load batches for selected ${COURSE_NAME}.`,
//           confirmButtonText: "OK",
//         });
//       });
//   }, [formik.values.course]);

//   return (
//     <FormikProvider value={formik}>
//       <form
//         onSubmit={formik.handleSubmit}
//         className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]"
//       >
//         <h2 className="text-3xl font-bold text-[rgba(14,85,200,0.83)] text-center mb-6">
//           Add Session
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Title */}
//           <InputField label="Title*" name="title" formik={formik} />

//           {/* Platform */}
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-700">
//               Platform*
//             </label>
//             <select
//               value={
//                 ["Zoom", "Google Meet", "Teams"].includes(
//                   formik.values.platform
//                 )
//                   ? formik.values.platform
//                   : "Other"
//               }
//               onChange={(e) => {
//                 const value = e.target.value;
//                 formik.setFieldValue("platform", value);
//                 if (value !== "Other") setCustomPlatform("");
//               }}
//               className="w-full px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             >
//               <option value="">Select Platform</option>
//               <option value="Zoom">Zoom</option>
//               <option value="Google Meet">Google Meet</option>
//               <option value="Teams">Teams</option>
//               <option value="Other">Other</option>
//             </select>

//             {formik.values.platform === "Other" && (
//               <input
//                 type="text"
//                 placeholder="Enter custom platform"
//                 value={customPlatform}
//                 onChange={(e) => setCustomPlatform(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg border border-blue-100 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             )}
//           </div>

//           {/* Meeting Link */}
//           <InputField
//             label="Session Link*"
//             name="meetingLink"
//             type="url"
//             formik={formik}
//           />

//           {/* Meeting ID */}
//           <InputField label="Session ID" name="meetingId" formik={formik} />

//           {/* Meeting Password */}
//           <InputField
//             label="Session Password*"
//             name="meetingPassword"
//             formik={formik}
//           />

//           {/* Course */}
//           <Dropdown
//             label={`${COURSE_NAME}*`}
//             name="course"
//             formik={formik}
//             options={courses.map((c) => ({
//               _id: c._id,
//               title: c.title,
//             }))}
//           />

//           {/* Batch */}
//           <Dropdown
//             label="Batch*"
//             name="batch"
//             formik={formik}
//             options={batches.map((b) => ({
//               _id: b._id,
//               name: b.batchName,
//             }))}
//           />

//           {/* Trainer */}
//           <Dropdown
//             label="Trainer*"
//             name="trainer"
//             formik={formik}
//             options={trainers.map((t) => ({
//               _id: t._id,
//               name: t.fullName,
//             }))}
//           />

//           {/* Start Time */}
//           <InputField
//             label="Start Time*"
//             name="startTime"
//             type="datetime-local"
//             formik={formik}
//           />

//           {/* End Time */}
//           <InputField
//             label="End Time*"
//             name="endTime"
//             type="datetime-local"
//             formik={formik}
//           />

//           {/* Notification */}
//           <div className="md:col-span-2">
//             <InputField
//               label="Notification (optional)"
//               name="notification"
//               type="textarea"
//               formik={formik}
//             />
//           </div>

//           {/* Description */}
//           <div className="md:col-span-2">
//             <TextAreaField
//               label="Description (optional)"
//               name="description"
//               formik={formik}
//               rows={4}
//             />
//           </div>

//           {/* Meeting Description */}
//           <div className="md:col-span-2">
//             <TextAreaField
//               label="Session Description (optional)"
//               name="meetingDescription"
//               formik={formik}
//               rows={4}
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="text-center">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
//           >
//             {loading ? "Adding..." : "Add Session"}
//           </button>
//         </div>
//       </form>
//     </FormikProvider>
//   );
// };

// export default AddMeetingForm;



import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import TextAreaField from "../../form/TextAreaField";
import { COURSE_NAME } from "../../../utils/constants";

const AddMeetingForm = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [customPlatform, setCustomPlatform] = useState("");
  const [trainers, setTrainers] = useState([]);


  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      meetingDescription: "",
      platform: "Google Meet",
      meetingLink: "",
      meetingId: "",
      meetingPassword: "",
      batch: "",
      trainer: "",
      course: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      notification: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      const submitValues = { ...values };

      if (values.platform === "Other") {
        submitValues.platform = customPlatform;
      }

      try {
        const res = await apiClient.post("/api/meetings", submitValues);

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.message || "Session created successfully!",
            confirmButtonText: "OK",
          });

          formik.resetForm();
          setCustomPlatform("");
        }
      } catch (err) {
        console.error("Error creating session:", err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to create session.",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

useEffect(() => {
  apiClient
    .get("/api/trainer/all")
    .then((res) => {
      if (res.data.success) {
        setTrainers(res.data.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching trainers:", err);
    });
}, []);


  // Fetch batches dynamically based on selected course
  useEffect(() => {
    if (!formik.values.course) {
      setBatches([]);
      formik.setFieldValue("batch", "");
      return;
    }

    apiClient
      .get(`/api/batches/course/${formik.values.course}`)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setBatches(res.data.data);
        } else {
          setBatches([]);
          formik.setFieldValue("batch", "");
        }
      })
      .catch((err) => {
        setBatches([]);
        formik.setFieldValue("batch", "");
        console.error("Error fetching batches:", err);
      });
  }, [formik.values.course]);

  // Prefill trainer, startDate, endDate based on selected batch
useEffect(() => {
  if (!formik.values.batch) return;

  apiClient
    .get(`/api/batches/batches/${formik.values.batch}`)
    .then((res) => {
      if (res.data.success && res.data.data) {
        const batch = res.data.data;
        if (batch.trainer && batch.trainer.length > 0) {
          formik.setFieldValue("trainer", batch.trainer[0]._id); // use first trainer
        }
        if (batch.startDate) formik.setFieldValue("startDate", batch.startDate);
        if (batch.endDate) formik.setFieldValue("endDate", batch.endDate);
        if (batch.time?.start) formik.setFieldValue("startTime", batch.time.start);
        if (batch.time?.end) formik.setFieldValue("endTime", batch.time.end);
      }
    })
    .catch((err) => console.error("Error fetching batch details:", err));
}, [formik.values.batch]);



const calculateMeetingCount = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) return 0;

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
};

const meetingOccurrence = calculateMeetingCount(
  formik.values.startDate,
  formik.values.endDate
);



  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-white rounded-xl shadow-2xl max-w-5xl mx-auto space-y-6 overflow-hidden border-4 border-[rgba(14,85,200,0.83)]"
      >
        <h2 className="text-3xl font-bold text-[rgba(14,85,200,0.83)] text-center mb-6">
          Add Session
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Title*" name="title" formik={formik} />

          {/* Platform */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Platform*
            </label>
            <select
              value={
                ["Zoom", "Google Meet", "Teams"].includes(formik.values.platform)
                  ? formik.values.platform
                  : "Other"
              }
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue("platform", value);
                if (value !== "Other") setCustomPlatform("");
              }}
              className="w-full px-4 py-2 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Platform</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Teams">Teams</option>
              <option value="Other">Other</option>
            </select>

            {formik.values.platform === "Other" && (
              <input
                type="text"
                placeholder="Enter custom platform"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-blue-100 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            )}
          </div>

          <InputField label="Session Link*" name="meetingLink" type="url" formik={formik} />
          <InputField label="Session ID*" name="meetingId" formik={formik} />
          <InputField label="Session Password*" name="meetingPassword" formik={formik} />

          {/* Course & Batch */}
          <Dropdown
            label={`${COURSE_NAME}*`}
            name="course"
            formik={formik}
            options={courses.map((c) => ({ _id: c._id, title: c.title }))}
          />

          <Dropdown
            label="Batch*"
            name="batch"
            formik={formik}
            options={batches.map((b) => ({ _id: b._id, name: b.batchName }))}
          />

          {/* Trainer */}
          <Dropdown
  label="Trainer*"
  name="trainer"
  formik={formik}
  options={trainers.map((t) => ({
    _id: t._id,
    title: t.fullName,
  }))}
/>

          {/* Dates */}
          <InputField label="Start Date*" name="startDate" type="date" formik={formik} />
          <InputField label="End Date*" name="endDate" type="date" formik={formik} />

          {/* Times */}
          <InputField label="Start Time*" name="startTime" type="time" formik={formik} />
          <InputField label="End Time*" name="endTime" type="time" formik={formik} />

          {/* Meeting Occurrence (Read-only) */}
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Meeting Occurrence
  </label>
  <input
    type="text"
    value={
      meetingOccurrence > 0
        ? `${meetingOccurrence} meetings`
        : "Select start & end date"
    }
    disabled
    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
  />
</div>


          <InputField label="Notification (optional)" name="notification" formik={formik} type="textarea" />
          {/* <TextAreaField label="Description (optional)" name="description" formik={formik} rows={4} />
          <TextAreaField label="Session Description (optional)" name="meetingDescription" formik={formik} rows={4} /> */}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {loading ? "Adding..." : "Add Session"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default AddMeetingForm;
