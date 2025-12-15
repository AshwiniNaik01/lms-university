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

  const [formData, setFormData] = useState({
    batchName: "",
    startTime: "",
    endTime: "",
    days: [],
    mode: "Online",
    coursesAssigned: "", // single course ID string
    trainer: [],
    additionalNotes: "",
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
      startTime: "",
      endTime: "",
      days: [],
      mode: "Online",
      coursesAssigned: "",
      trainer: [],
      additionalNotes: "",
    });
    setExcelFile(null);
    setExcelPreview([]);
    setSelectedBatchId(null);
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
      });
    }
  };

  // -------------------- Fetch Batch by ID --------------------
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
          coursesAssigned: batch.coursesAssigned?.[0]?._id || "",
          trainer: batch.trainer?.map((t) => t._id) || [], // ✅ Corrected
          additionalNotes: batch.additionalNotes || "",
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

  // -------------------- Handle Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        batchName: formData.batchName,
        time: { start: formData.startTime, end: formData.endTime },
        days: formData.days,
        mode: formData.mode,
        coursesAssigned: formData.coursesAssigned
          ? [formData.coursesAssigned]
          : [],
        trainer: formData.trainer,
        additionalNotes: formData.additionalNotes,
      };

      let batchId = selectedBatchId;
      let response;

      if (selectedBatchId) {
        response = await updateBatch(selectedBatchId, payload);
        Swal.fire("Updated!", "Batch updated successfully.", "success");
      } else {
        response = await createBatch(payload);
        batchId = response._id || response.data?._id;
        Swal.fire("Added!", "Batch added successfully.", "success");
      }

      // Upload Excel if available
      if (excelFile) {
        const formDataPayload = new FormData();
        formDataPayload.append("excelFile", excelFile);
        formDataPayload.append(
          "enrolledCourses",
          JSON.stringify(
            formData.coursesAssigned ? [formData.coursesAssigned] : []
          )
        );
        formDataPayload.append("enrolledBatches", JSON.stringify([batchId]));

        await apiClient.post("/api/batches/upload-excel", formDataPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire("Success", "Excel file uploaded successfully!", "success");
      }

      // Next action modal
      const result = await Swal.fire({
        title: "Batch saved successfully! What would you like to do next?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Add New Batch",
        denyButtonText: "Show List",
        cancelButtonText: "Add Candidate",
      });

      let action;
      if (result.isConfirmed) action = "ADD_NEW";
      else if (result.isDenied) action = "SHOW_LIST";
      else if (result.isDismissed) action = "ADD_STUDENT";

      switch (action) {
        case "ADD_NEW":
          handleCancel();
          break;
        case "SHOW_LIST":
          navigate(
            `/manage-batches?courseId=${formData.coursesAssigned || ""}`
          );
          break;
        case "ADD_STUDENT":
          if (batchId) {
            const courseIds = [formData.coursesAssigned].join(",");
            navigate(
              `/enrollments/upload-excel?batchId=${batchId}&courseIds=${courseIds}`
            );
          }
          break;
        default:
          console.log("No action taken");
      }

      handleCancel();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save batch. Please try again.",
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
              className="text-md bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition"
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
              label="Assign Training Program*"
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

            <MultiSelectDropdown
              label="Assign Trainer(s)*"
              name="trainer"
              options={trainers}
              formik={{
                values: formData,
                setFieldValue: handleMultiSelectChange,
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
          <ExcelUploader
            key={excelFile ? excelFile.name : "excel-uploader"} // force re-mount
            sampleFileUrl="/Enrollment_Sample.xlsx"
            requiredFields={["fullName", "mobileNo", "email"]}
            title="Upload Student Excel (optional)"
            onImport={({ file, data }) => {
              setExcelFile(file);
              setExcelPreview(data);
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
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                : "Add Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
