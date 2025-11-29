

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createBatch, fetchBatchById, updateBatch } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import TextAreaField from "../../form/TextAreaField";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";
import apiClient from "../../../api/axiosConfig"; // Axios instance
import { FiCheck, FiDownload, FiUpload } from "react-icons/fi";

const AddBatch = ({ onBatchSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [selectedBatchId, setSelectedBatchId] = useState(id || null);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);

  const [formData, setFormData] = useState({
    batchName: "",
    startTime: "",
    endTime: "",
    days: [],
    mode: "Online",
    coursesAssigned: [],
    trainersAssigned: [],
    additionalNotes: "",
  });

  const [excelFile, setExcelFile] = useState(null);

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

  // -------------------- Handle Cancel --------------------
  const handleCancel = () => {
    setFormData({
      batchName: "",
      startTime: "",
      endTime: "",
      days: [],
      mode: "Online",
      coursesAssigned: [],
      trainersAssigned: [],
      additionalNotes: "",
    });
    setSelectedBatchId(null);
    setExcelFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

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
          "Failed to fetch Training Program or Trainers.",
        confirmButtonText: "OK",
      });
    }
  };

  // -------------------- Fetch Batch by ID --------------------
  useEffect(() => {
    const loadBatch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const batch = await fetchBatchById(id);

        if (batch) {
          setFormData({
            batchName: batch.batchName || "",
            startTime: batch.time?.start || "",
            endTime: batch.time?.end || "",
            days: batch.days || [],
            mode: batch.mode || "Online",
            coursesAssigned: batch.coursesAssigned?.map((c) => c._id) || [],
            trainersAssigned: batch.trainersAssigned?.map((t) => t._id) || [],
            additionalNotes: batch.additionalNotes || "",
          });
          setSelectedBatchId(id);
        } else {
          Swal.fire("Not Found", "Batch not found", "warning");
          navigate("/manage-batches");
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to fetch batch.", "error");
        navigate("/manage-batches");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndTrainers();
    loadBatch();
  }, [id, navigate]);

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

  // -------------------- Handle Excel File Change --------------------
  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);
  };

  // -------------------- Handle Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // -------------------- Save Batch --------------------
      const payload = {
        batchName: formData.batchName,
        time: { start: formData.startTime, end: formData.endTime },
        days: formData.days,
        mode: formData.mode,
        coursesAssigned: formData.coursesAssigned,
        trainersAssigned: formData.trainersAssigned,
        additionalNotes: formData.additionalNotes,
      };

      let batchId = selectedBatchId;

      if (selectedBatchId) {
        await updateBatch(selectedBatchId, payload);
        Swal.fire({
          title: "Updated!",
          text: "Batch updated successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      } else {
        const res = await createBatch(payload);
        batchId = res._id || res.data?._id;
        Swal.fire({
          title: "Added!",
          text: "Batch added successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      }

      // -------------------- Upload Excel (if any) --------------------
      if (excelFile) {
        const formDataPayload = new FormData();
        formDataPayload.append("excelFile", excelFile);
        formDataPayload.append("enrolledCourses", JSON.stringify(formData.coursesAssigned));
        formDataPayload.append("enrolledBatches", JSON.stringify([batchId]));

        await apiClient.post("/api/batches/upload-excel", formDataPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire({
          title: "Success",
          text: "Excel file uploaded successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      }

      handleCancel(); // reset form

      if (canPerformAction(rolePermissions, "batch", "read")) {
        navigate("/manage-batches");
      } else if (onBatchSaved) {
        onBatchSaved();
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save batch. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-5xl mx-auto border-4 border-blue-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-blue-700 underline">
            {selectedBatchId ? "Update Batch" : "Add Batch"}
          </h3>
          {canPerformAction(rolePermissions, "batch", "read") && (
            <button
              onClick={() => navigate("/manage-batches")}
              className="text-md bg-[rgba(14,85,200,0.83)] hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition"
            >
              ← Manage Batches
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Mode, Courses & Trainers */}
          <div className="grid grid-cols-3 gap-6">
            <Dropdown label="Mode*" name="mode" options={modeOptions} formik={{
              values: formData,
              setFieldValue: (name, value) =>
                setFormData((prev) => ({ ...prev, [name]: value })),
              touched: {},
              errors: {},
              handleBlur: () => {},
            }} />

            <MultiSelectDropdown
              label="Assign Training Program(s)*"
              name="coursesAssigned"
              options={courses}
              formik={{ values: formData, setFieldValue: handleMultiSelectChange }}
              getOptionValue={(c) => c._id}
              getOptionLabel={(c) => c.title}
            />

            <MultiSelectDropdown
              label="Assign Trainer(s)*"
              name="trainersAssigned"
              options={trainers}
              formik={{ values: formData, setFieldValue: handleMultiSelectChange }}
              getOptionValue={(t) => t._id}
              getOptionLabel={(t) => t.fullName}
            />
          </div>

          {/* Days */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Days:*</label>
            <div className="flex flex-wrap gap-3 mt-1">
              {daysOfWeek.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
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

          {/* Additional Notes */}
          <TextAreaField
            label="Additional Notes(optional)"
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

          {/* Excel Upload */}
<div
  className="bg-gray-50 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
  onClick={() => fileRef.current?.click()}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleExcelChange({ target: { files: [droppedFile] } });
  }}
>
  <label className="font-bold"> Upload Student Excel(optional)</label>
  {/* Hidden file input */}
  <input
    type="file"
    ref={fileRef}
    accept=".xlsx,.xls"
    onChange={handleExcelChange}
    className="hidden"
  />

  {/* Drag & Drop Icon */}
  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <FiUpload className="text-blue-600 w-8 h-8" />
  </div>

  {/* Instructions */}
  {!excelFile ? (
    <div>
      <p className="text-gray-700 font-medium mb-2">
        Click to upload or drag & drop
      </p>
      <p className="text-gray-500 text-sm">Excel files only (.xlsx, .xls)</p>
    </div>
  ) : (
    <div>
      <p className="text-green-600 font-semibold mb-2">
        File Selected <FiCheck className="inline" />
      </p>
      <p className="text-gray-600 text-sm">{excelFile.name}</p>
      <p className="text-gray-500 text-xs mt-1">
        {(excelFile.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  )}

  {/* Sample Excel Download */}
  <a
    href="/Enrollment_Sample.xlsx"
    download
    onClick={(e) => e.stopPropagation()} // Prevent triggering the file upload
    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
  >
    <FiDownload className="w-5 h-5" />
    Sample Excel
  </a>
</div>



          {/* Submit Buttons */}
          <div className="text-center flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-300 text-gray-800 font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-gray-400 transition duration-300 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[rgba(14,85,200,0.83)] text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-60"
            >
              {loading ? "Saving..." : selectedBatchId ? "Update Batch" : "Add Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
