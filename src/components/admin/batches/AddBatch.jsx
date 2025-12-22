import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { createBatch, fetchBatchById, updateBatch } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import { canPerformAction } from "../../../utils/permissionUtils";
import Dropdown from "../../form/Dropdown";
import ExcelUploader from "../../form/ExcelUploader";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import TextAreaField from "../../form/TextAreaField";
import { useCourseParam } from "../../hooks/useCourseParam";
import handleApiError from "../../../utils/handleApiError";
import { COURSE_NAME, DIR } from "../../../utils/constants";
import { usePassword } from "../../hooks/usePassword";

// ⭐ NEW EXCEL UPLOADER
const AddBatch = ({ onBatchSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedBatchId, setSelectedBatchId] = useState(id || null);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);

  const [excelFile, setExcelFile] = useState(null);
  const [excelPreview, setExcelPreview] = useState([]);
  // Inside your AddBatch component
  const { generate: generatePassword } = usePassword(); // initialize hook

  const [formData, setFormData] = useState({
    batchName: "",
    // startTime: "",
    // endTime: "",
    time: { start: "", end: "" },
    days: [],
    mode: "Online",
    startDate: "",
    endDate: "",
    coursesAssigned: "", // single course ID string
    trainer: [],
    additionalNotes: "",
    durationPerDayHours: "",

    cloudLabsOption: "no", // yes | no
    cloudLabs: {
      link: "",
      excelFile: null, // existing file from API
    },
    labs: null, // newly uploaded excel
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const modeOptions = [
    { _id: "Online", title: "Online" },
    { _id: "Offline", title: "Offline" },
    { _id: "Hybrid", title: "Hybrid" },
  ];

  // -------------------- Use Hook for Preselected Course --------------------
  const [selectedCourse, setSelectedCourse, isPreselected] =
    useCourseParam(courses);

  // -------------------- Handle Cancel --------------------
  const handleCancel = () => {
    setFormData({
      batchName: "",
      time: { start: "", end: "" },
      // startTime: "",
      // endTime: "",
      days: [],
      mode: "Online",
      startDate: "",
      endDate: "",
      coursesAssigned: "",
      trainer: [],
      additionalNotes: "",
      durationPerDayHours: "",
      cloudLabsLink: "",
      labs: null,
      cloudLabsOption: "no",
    });
    setExcelFile(null);
    setExcelPreview([]);
    setSelectedBatchId(null);
  };

  // This will hold data formatted for Dropdown
  const trainerOptions = trainers.map((t) => ({
    ...t,
    name: t.fullName, // needed for Dropdown
  }));

  useEffect(() => {
    const init = async () => {
      const data = await fetchCoursesAndTrainers(); // make sure it returns the response
      if (data?.data) {
        setTrainers(data.data); // save API response
      }

      if (id) {
        await loadBatch();
      } else if (isPreselected) {
        setFormData((prev) => ({
          ...prev,
          coursesAssigned: selectedCourse,
        }));
      }
    };

    init();
  }, [id, selectedCourse, isPreselected]);

  // -------------------- Fetch Courses & Trainers --------------------
  const fetchCoursesAndTrainers = async () => {
    try {
      const [coursesData, trainersData] = await Promise.all([
        getAllCourses(),
        fetchAllTrainers(),
      ]);
      setCourses(coursesData || []);
      setTrainers(trainersData || []);
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text:
          err.response?.data?.message ||
          `Failed to fetch ${COURSE_NAME} or Trainers.`,
      });
    }
  };

  // -------------------- Fetch Batch by ID --------------------
  const loadBatch = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const batch = await fetchBatchById(id);

      // const hasValidCloudLabs =
      //   !!batch.cloudLabs?.link || !!batch.cloudLabs?.excelFile?.fileUrl;

const hasValidCloudLabs =
  !!batch.cloudLabs?.link || !!batch.cloudLabs?.cloudLabsFile?.fileUrl;



      if (batch) {
        setFormData({
          batchName: batch.batchName || "",
          // startTime: batch.time?.start || "",
          // endTime: batch.time?.end || "",
          time: { start: batch.time?.start || "", end: batch.time?.end || "" },
          days: batch.days || [],
          mode: batch.mode || "Online",
          startDate: batch.startDate || "",
          endDate: batch.endDate || "",
          coursesAssigned: batch.coursesAssigned?.[0]?._id || "",
          trainer: batch.trainer?.map((t) => t._id) || [], // ✅ Corrected
          additionalNotes: batch.additionalNotes || "",
          durationPerDayHours: batch.durationPerDayHours || "",
          // cloudLabsLink: batch.cloudLabsLink || "",
          // labs: null,

          cloudLabsOption: hasValidCloudLabs ? "yes" : "no",
          // cloudLabs: hasValidCloudLabs
          //   ? {
          //       link: batch.cloudLabs?.link || "",
          //       excelFile: batch.cloudLabs?.excelFile || null,
          //     }
          //   : { link: "", excelFile: null },

          cloudLabs: hasValidCloudLabs
  ? {
      link: batch.cloudLabs?.link || "",
      cloudLabsFile: batch.cloudLabs?.cloudLabsFile || null, // <-- match JSX
    }
  : { link: "", cloudLabsFile: null },



          labs: null, // never prefill new upload
        });
        setSelectedBatchId(id);
      } else {
        Swal.fire("Not Found", "Batch not found", "warning");
        navigate("/manage-batches");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        handleApiError(err) || "Failed to fetch batch.",
        "error"
      );
      navigate("/manage-batches");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Initial Load --------------------
  useEffect(() => {
    const init = async () => {
      await fetchCoursesAndTrainers();
      if (id) {
        await loadBatch();
      } else if (isPreselected) {
        setFormData((prev) => ({
          ...prev,
          coursesAssigned: selectedCourse,
        }));
      }
    };
    init();
  }, [id, selectedCourse, isPreselected]);

  // -------------------- Handle Form Change --------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && daysOfWeek.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        days: checked
          ? [...prev.days, value]
          : prev.days.filter((day) => day !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (name, selectedIds) => {
    setFormData((prev) => ({ ...prev, [name]: selectedIds }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const payload = {
  //       batchName: formData.batchName,
  //       time: formData.time || { start: "", end: "" },
  //       days: formData.days,
  //       mode: formData.mode,
  //       startDate: formData.startDate,
  //       endDate: formData.endDate,
  //       coursesAssigned: formData.coursesAssigned
  //         ? [formData.coursesAssigned]
  //         : [],
  //       trainer: formData.trainer,
  //       additionalNotes: formData.additionalNotes,
  //       durationPerDayHours: formData.durationPerDayHours,

  // cloudLabs:
  //   formData.cloudLabsOption === "yes"
  //     ? {
  //         link: formData.cloudLabs.link,
  //       }
  //     : {},

  //       // cloudLabsLink: formData.cloudLabsLink,
  //     };

  //     let batchId = selectedBatchId;
  //     let response;

  //     // -------------------- CREATE / UPDATE BATCH --------------------
  //     if (formData.labs) {
  //       // ⚠️ If CloudLabs Excel exists → use FormData
  //       const formDataPayload = new FormData();

  //       // Append each key correctly
  //       formDataPayload.append("batchName", payload.batchName);
  //       formDataPayload.append("time[start]", payload.time.start);
  //       formDataPayload.append("time[end]", payload.time.end);

  //       payload.days.forEach((day) => formDataPayload.append("days[]", day));

  //       formDataPayload.append("mode", payload.mode);
  //       formDataPayload.append("startDate", payload.startDate);
  //       formDataPayload.append("endDate", payload.endDate);
  //       formDataPayload.append(
  //         "durationPerDayHours",
  //         payload.durationPerDayHours ?? ""
  //       );
  //       formDataPayload.append("cloudLabsLink", payload.cloudLabsLink ?? "");
  //       formDataPayload.append(
  //         "additionalNotes",
  //         payload.additionalNotes ?? ""
  //       );

  //       payload.coursesAssigned.forEach((c) =>
  //         formDataPayload.append("coursesAssigned[]", c)
  //       );
  //       payload.trainer.forEach((t) => formDataPayload.append("trainer[]", t));

  //       // Append CloudLabs Excel file
  //       formDataPayload.append("labs", formData.labs);

  //       // Send FormData request
  //       if (selectedBatchId) {
  //         response = await apiClient.put(
  //           `/api/batches/${selectedBatchId}`,
  //           formDataPayload,
  //           {
  //             headers: { "Content-Type": "multipart/form-data" },
  //           }
  //         );
  //         Swal.fire("Updated!", "Batch updated successfully.", "success");
  //       } else {
  //         response = await apiClient.post("/api/batches", formDataPayload, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });
  //         batchId = response._id || response.data?._id;
  //         Swal.fire("Added!", "Batch added successfully.", "success");
  //       }
  //     } else {
  //       // ✅ No CloudLabs Excel → normal JSON request
  //       if (selectedBatchId) {
  //         response = await updateBatch(selectedBatchId, payload);
  //         batchId = selectedBatchId;
  //         Swal.fire("Updated!", "Batch updated successfully.", "success");
  //       } else {
  //         response = await createBatch(payload);
  //         batchId = response._id || response.data?._id;
  //         Swal.fire("Added!", "Batch added successfully.", "success");
  //       }
  //     }

  //     // -------------------- UPLOAD EXCEL IF AVAILABLE --------------------
  //     if (excelFile) {
  //       const formDataPayload = new FormData();
  //       formDataPayload.append("excelFile", excelFile);
  //       formDataPayload.append(
  //         "enrolledCourses",
  //         JSON.stringify(payload.coursesAssigned)
  //       );
  //       formDataPayload.append("enrolledBatches", JSON.stringify([batchId]));

  //       await apiClient.post("/api/batches/upload-excel", formDataPayload, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });

  //       Swal.fire("Success", "Excel file uploaded successfully!", "success");
  //     }

  //     // -------------------- NEXT ACTION MODAL --------------------
  //     const result = await Swal.fire({
  //       title: "Batch saved successfully! What would you like to do next?",
  //       showDenyButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: "Add New Batch",
  //       denyButtonText: "Show List",
  //       cancelButtonText: "Add Participate",
  //     });

  //     let action;
  //     if (result.isConfirmed) action = "ADD_NEW";
  //     else if (result.isDenied) action = "SHOW_LIST";
  //     else if (result.isDismissed) action = "ADD_PARTICIPATE";

  //     switch (action) {
  //       case "ADD_NEW":
  //         handleCancel();
  //         break;
  //       case "SHOW_LIST":
  //         navigate(
  //           `/manage-batches?courseId=${formData.coursesAssigned || ""}`
  //         );
  //         break;
  //       case "ADD_PARTICIPATE":
  //         if (batchId) {
  //           const courseIds = [formData.coursesAssigned].join(",");
  //           navigate(
  //             `/enrollments/upload-excel?batchId=${batchId}&courseIds=${courseIds}`
  //           );
  //         }
  //         break;
  //       default:
  //         console.log("No action taken");
  //     }

  //     handleCancel();
  //   } catch (err) {
  //     Swal.fire(
  //       "Error",
  //       err?.response?.data?.message ||
  //         err?.message ||
  //         "Failed to save batch. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // -------------------- JSX --------------------

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // -------------------- BASE PAYLOAD --------------------
    const basePayload = {
      batchName: formData.batchName,
      time: formData.time || { start: "", end: "" },
      days: formData.days,
      mode: formData.mode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      coursesAssigned: formData.coursesAssigned ? [formData.coursesAssigned] : [],
      trainer: formData.trainer,
      additionalNotes: formData.additionalNotes,
      durationPerDayHours: formData.durationPerDayHours,
    };

    let batchId = selectedBatchId;
    let response;
    const isUpdate = !!selectedBatchId; // NEW: flag for PUT or POST
    

    const hasCloudLabsExcel = !!formData.labs;
    const hasCloudLabsLink = formData.cloudLabsOption === "yes" && formData.cloudLabs.link?.trim();

    // ======================================================
    // CASE 1: CLOUDLABS (LINK OR EXCEL) → FormData
    // ======================================================
    if (hasCloudLabsExcel || hasCloudLabsLink) {
      const fd = new FormData();

      fd.append("batchName", basePayload.batchName);
      fd.append("time[start]", basePayload.time.start);
      fd.append("time[end]", basePayload.time.end);

      basePayload.days.forEach((day) => fd.append("days[]", day));

      fd.append("mode", basePayload.mode);
      fd.append("startDate", basePayload.startDate);
      fd.append("endDate", basePayload.endDate);
      fd.append("durationPerDayHours", basePayload.durationPerDayHours ?? "");
      fd.append("additionalNotes", basePayload.additionalNotes ?? "");

      basePayload.coursesAssigned.forEach((c) => fd.append("coursesAssigned[]", c));
      basePayload.trainer.forEach((t) => fd.append("trainer[]", t));

      if (hasCloudLabsLink) fd.append("cloudLabsLink", formData.cloudLabs.link);
      if (hasCloudLabsExcel) fd.append("labs", formData.labs);

      // -------- CREATE / UPDATE BATCH --------
      // if (selectedBatchId) {
      if (isUpdate) {
        await apiClient.put(`/api/batches/${selectedBatchId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        batchId = selectedBatchId;
        Swal.fire("Updated!", "Batch updated successfully.", "success");
      } else {
        response = await apiClient.post("/api/batches", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // batchId = response?.data?._id || response?._id;
        batchId = response?.data?.batch?._id || response?.data?.data?.batchId;
;

        if (!batchId) throw new Error("Batch ID not returned from API.");
        Swal.fire("Added!", "Batch added successfully.", "success");
      }
    }

    // ======================================================
    // CASE 2: NO CLOUDLABS → NORMAL JSON
    // ======================================================
    else {
      // if (selectedBatchId) {
       if (isUpdate) {
        await updateBatch(selectedBatchId, basePayload);
        batchId = selectedBatchId;
        // Swal.fire("Updated!", "Batch updated successfully.", "success");
         Swal.fire("Updated!", "Batch updated successfully.", "success").then(() => {
    navigate("/manage-batches");
  });
      } else {
        response = await createBatch(basePayload);
        // batchId = response?.data?._id || response?._id;
        batchId = response?.data?.batch?._id || response?.data?.data?.batchId;
;

        if (!batchId) throw new Error("Batch ID not returned from API.");
        Swal.fire("Added!", "Batch added successfully.", "success");
      }
    }

    // ======================================================
    // OPTIONAL: PARTICIPANT EXCEL UPLOAD
    // ======================================================
    if (excelFile && batchId) {
      const excelFD = new FormData();
      excelFD.append("excelFile", excelFile);
      excelFD.append("enrolledCourses", JSON.stringify(basePayload.coursesAssigned));
      excelFD.append("enrolledBatches", JSON.stringify([batchId]));

      await apiClient.post("/api/batches/upload-excel", excelFD, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Excel file uploaded successfully!", "success");
    }

    // ======================================================
    // NEXT ACTION MODAL
    // ======================================================
     if (!isUpdate) {
    const result = await Swal.fire({
      title: "Batch saved successfully! What would you like to do next?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Add New Batch",
      denyButtonText: "Show List",
      cancelButtonText: "Add Participant",
    });

    if (result.isConfirmed) {
      handleCancel();
    } else if (result.isDenied) {
      navigate(`/manage-batches?courseId=${formData.coursesAssigned || ""}`);
    } else if (result.isDismissed && batchId) {
      navigate(
        `/enrollments/upload-excel?batchId=${batchId}&courseIds=${formData.coursesAssigned}`
      );
    }
  }

    handleCancel();
  } catch (err) {
    Swal.fire(
      "Error",
      err?.response?.data?.message || err?.message || "Failed to save batch. Please try again.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-5xl mx-auto border-4 border-blue-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-blue-700 underline">
            {selectedBatchId ? "Update Batch" : "Create Batch"}
          </h3>

          {canPerformAction(rolePermissions, "batch", "read") && (
            <button
              onClick={() => navigate("/manage-batches")}
              className="text-md bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition"
            >
              ← Manage Batches
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["batchName", "startTime", "endTime"].map((field, idx) => (
              <InputField
                key={idx}
                label={
                  field === "batchName"
                    ? "Batch Name*"
                    : field === "startTime"
                    ? "Start Time*"
                    : "End Time*"
                }
                name={field}
                type={field.includes("Time") ? "time" : "text"}
                formik={{
                  values: formData,
                  setFieldValue: (name, value) =>
                    setFormData((prev) => ({ ...prev, [name]: value })),
                  touched: {},
                  errors: {},
                  handleBlur: () => {},
                }}
              />
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Batch Name*"
              name="batchName"
              type="text"
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  setFormData((prev) => ({ ...prev, [name]: value })),
                touched: {},
                errors: {},
                handleBlur: () => {},
              }}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Duration (Hours Per Day)*
              </label>
              <input
                type="number"
                min="0.5"
                step="any" // ✅ allows any decimal like 2.8, 5.2
                placeholder="e.g. 2, 2.5, 2.8"
                value={formData.durationPerDayHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    durationPerDayHours: e.target.value,
                  }))
                }
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Start Date*
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                End Date*
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Start Time */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Start Time*
              </label>
              <input
                type="time"
                value={formData.time?.start || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    time: { ...prev.time, start: e.target.value },
                  }))
                }
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                End Time*
              </label>
              <input
                type="time"
                value={formData.time?.end || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    time: { ...prev.time, end: e.target.value },
                  }))
                }
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Start & End Date */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}

            {/* Duration Per Day Hours */}
          </div>

          {/* Mode, Courses, Trainers */}
          <div className="grid grid-cols-3 gap-6">
            <Dropdown
              label="Mode*"
              name="mode"
              options={modeOptions}
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  setFormData((prev) => ({ ...prev, [name]: value })),
                touched: {},
                errors: {},
                handleBlur: () => {},
              }}
            />

            <Dropdown
              label={`Assign ${COURSE_NAME}*`}
              name="coursesAssigned"
              options={courses}
              formik={{
                values: formData,
                setFieldValue: (field, value) =>
                  setFormData((prev) => ({ ...prev, [field]: value })),
                handleBlur: () => {},
                touched: {},
                errors: {},
              }}
              disabled={isPreselected} // <-- Add this
            />

            {/* <MultiSelectDropdown
              label="Assign Trainer(s)*"
              name="trainer"
              options={trainers}
              formik={{
                values: formData,
                setFieldValue: handleMultiSelectChange,
              }}
              getOptionValue={(t) => t._id}
              getOptionLabel={(t) => t.fullName}
            /> */}

            <Dropdown
              label="Assign Trainer*"
              name="trainer"
              options={trainerOptions}
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  setFormData((prev) => ({ ...prev, [name]: [value] })),
                handleBlur: () => {},
                touched: {},
                errors: {},
              }}
              getOptionValue={(t) => t._id}
              getOptionLabel={(t) => t.fullName}
            />
          </div>

          {/* Days */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Days:*
            </label>
            <div className="flex flex-wrap gap-3 mt-1">
              {daysOfWeek.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200"
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.days.includes(day)}
                    onChange={handleChange}
                    className="accent-blue-700 w-5 h-5"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* CloudLabs Section */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Radio Button to choose CloudLabs Upload */}
            <label className="font-semibold text-gray-700 mb-2 block">
              Do you want to provide CloudLabs access?
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="cloudLabsOption"
                  value="yes"
                  checked={formData.cloudLabsOption === "yes"}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, cloudLabsOption: "yes" }))
                  }
                  className="accent-blue-600"
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="cloudLabsOption"
                  value="no"
                  checked={formData.cloudLabsOption === "no"}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      cloudLabsOption: "no",
                      cloudLabs: { link: "", excelFile: null },
                      labs: null,
                    }))
                  }
                />
                No
              </label>
            </div>
          </div>

          {/* Conditionally show CloudLabs fields */}
          {/* {formData.cloudLabsOption === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CloudLabs Link */}
          {/* <InputField
                label="CloudLabs Link (optional)"
                name="cloudLabsLink"
                type="url"
                placeholder="https://cloudlabs.example.com"
                formik={{
                  values: formData,
                  setFieldValue: (name, value) =>
                    setFormData((prev) => ({ ...prev, [name]: value })),
                  touched: {},
                  errors: {},
                  handleBlur: () => {},
                }}
              /> */}

          {/* CloudLabs Excel Upload */}
          {/* <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  CloudLabs Excel (optional)
                </label>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      labs: e.target.files[0],
                    }))
                  }
                  className="w-full border-2 border-dashed border-gray-300 p-2 rounded-lg bg-white cursor-pointer hover:border-blue-400"
                />

                {formData.cloudLabsExcel && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {formData.cloudLabsExcel.name}
                  </p>
                )}

                {/* Sample File Link */}
          <a
            href="/cloudlabs_sample_excel.xlsx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Download sample Excel
          </a>
          {/* </div>
            </div>
          )} */}

          {formData.cloudLabsOption === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CloudLabs Link */}
              <InputField
                label="CloudLabs Link"
                name="cloudLabs.link"
                type="url"
                placeholder="https://cloudlabs.example.com"
                formik={{
                  values: { cloudLabs: formData.cloudLabs },
                  setFieldValue: (_, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      cloudLabs: { ...prev.cloudLabs, link: value },
                    })),
                  touched: {},
                  errors: {},
                  handleBlur: () => {},
                }}
              />

              {/* CloudLabs Excel */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  CloudLabs Excel
                </label>

                {/* Existing file (EDIT MODE) */}
                {/* {formData.cloudLabs.excelFile && ( */}

               {formData.cloudLabs?.cloudLabsFile && (
  <a
    href={DIR.CLOUD_LABS + formData.cloudLabs.cloudLabsFile.fileName}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline text-sm mb-2 block"
  >
    📄 {formData.cloudLabs.cloudLabsFile.fileName}
  </a>
)}


                {/* Upload new file */}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      labs: e.target.files[0],
                    }))
                  }
                  className="w-full border-2 border-dashed border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <TextAreaField
            label="Additional Notes (optional)"
            name="additionalNotes"
            formik={{
              values: formData,
              handleChange,
              handleBlur: () => {},
              touched: {},
              errors: {},
            }}
            rows={4}
          />

          {/* Excel Uploader */}
          {/* <ExcelUploader
            key={excelFile ? excelFile.name : "excel-uploader"} // force re-mount
            sampleFileUrl="/Enrollment_Sample.xlsx"
            requiredFields={["fullName", "mobileNo", "email"]}
            title="Upload Participate Excel (optional)"
            onImport={({ file, data }) => {
              setExcelFile(file);
              setExcelPreview(data);
            }}
          /> */}

          <ExcelUploader
            key={excelFile ? excelFile.name : "excel-uploader"} // force re-mount
            sampleFileUrl="/Enrollment_Sample.xlsx"
            requiredFields={["fullName", "mobileNo", "email"]}
            title="Upload Participate Excel (optional)"
            onImport={({ file, data }) => {
              const processedData = data.map((row) => {
                const password = row.password ?? ""; // fallback to empty string if undefined/null
                const needsPassword = password.toString().trim() === "";
                return {
                  ...row,
                  password: needsPassword
                    ? generatePassword(8)
                    : password.toString(),
                };
              });

              setExcelFile(file);
              setExcelPreview(processedData);
            }}
          />

          {/* Excel Preview */}
          {excelPreview.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-2">
                Excel Preview:
              </h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-blue-100">
                    <tr>
                      {Object.keys(excelPreview[0]).map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 border-b border-gray-300 text-gray-700 font-medium"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelPreview.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        {Object.values(row).map((val, i) => (
                          <td
                            key={i}
                            className="px-4 py-2 border-b border-gray-200 text-gray-600"
                          >
                            {val || (
                              <span className="text-gray-400 italic">
                                empty
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Excel Preview */}
          {/* {excelPreview.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-2">
                Excel Preview:
              </h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-blue-100">
                    <tr>
                      {Object.keys(excelPreview[0]).map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 border-b border-gray-300 text-gray-700 font-medium"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelPreview.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        {Object.values(row).map((val, i) => (
                          <td
                            key={i}
                            className="px-4 py-2 border-b border-gray-200 text-gray-600"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Buttons */}
          <div className="text-center flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-300 text-gray-800 font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-gray-400 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : selectedBatchId
                ? "Update Batch"
                : "Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
