import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createBatch, fetchBatchById, updateBatch } from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import Dropdown from "../../form/Dropdown";
import InputField from "../../form/InputField";
import MultiSelectDropdown from "../../form/MultiSelectDropdown";
import TextAreaField from "../../form/TextAreaField";

const AddBatch = ({ onBatchSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedBatchId, setSelectedBatchId] = useState(id || null);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // -------------------- Handled the cancel button --------------------

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
      console.error("Error fetching courses/trainers:", err);
      Swal.fire("Error", "Failed to fetch courses or trainers.", "error");
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
          navigate("/admin/manage-batches");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to fetch batch.", "error");
        navigate("/admin/manage-batches");
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

  // -------------------- Handle Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      batchName: formData.batchName,
      time: { start: formData.startTime, end: formData.endTime },
      days: formData.days,
      mode: formData.mode,
      coursesAssigned: formData.coursesAssigned,
      trainersAssigned: formData.trainersAssigned,
      additionalNotes: formData.additionalNotes,
    };

    try {
      if (selectedBatchId) {
        await updateBatch(selectedBatchId, payload);
        Swal.fire({
          title: "Updated!",
          text: "Batch updated successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      } else {
        await createBatch(payload);
        Swal.fire({
          title: "Added!",
          text: "Batch added successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      }

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

      if (onBatchSaved) onBatchSaved();
      navigate("/admin/manage-batches");
    } catch (err) {
      console.error(
        "Error submitting batch:",
        err.response?.data || err.message
      );
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Failed to save batch. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Formik-like object for Dropdowns --------------------
  const formik = {
    values: formData,
    touched: {},
    errors: {},
    handleBlur: () => {},
    setFieldValue: (name, value) =>
      setFormData((prev) => ({ ...prev, [name]: value })),
  };

  // -------------------- JSX --------------------
  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-5xl mx-auto border-4 border-blue-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-blue-700 underline">
            {selectedBatchId ? "Update Batch" : "Add Batch"}
          </h3>
          <button
            onClick={() => navigate("/admin/manage-batches")}
            className="text-md bg-[rgba(14,85,200,0.83)] hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition"
          >
            ← Manage Batches
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["batchName", "startTime", "endTime"].map((field, idx) => (
              <InputField
                key={idx}
                label={
                  field === "batchName"
                    ? "Batch Name"
                    : field === "startTime"
                    ? "Start Time"
                    : "End Time"
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

          {/* Mode */}
          <div className="grid grid-cols-3 gap-6">
            <Dropdown
              label="Mode"
              name="mode"
              options={modeOptions}
              formik={formik}
            />

            {/* Courses & Trainers */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <MultiSelectDropdown
              label="Assign Course(s)"
              name="coursesAssigned"
              options={courses}
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  handleMultiSelectChange(name, value),
              }}
              getOptionValue={(c) => c._id}
              getOptionLabel={(c) => c.title}
            />
            <MultiSelectDropdown
              label="Assign Trainer(s)"
              name="trainersAssigned"
              options={trainers}
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  handleMultiSelectChange(name, value),
              }}
              getOptionValue={(t) => t._id}
              getOptionLabel={(t) => t.fullName}
            />
          </div>
          {/* </div> */}

          {/* Days */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Days:
            </label>
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

          {/* Notes */}
          <TextAreaField
            label="Additional Notes"
            name="additionalNotes"
            formik={{
              values: formData,
              handleChange: handleChange,
              handleBlur: () => {},
              touched: {},
              errors: {},
            }}
            rows={4}
          />

          {/* Submit */}
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
