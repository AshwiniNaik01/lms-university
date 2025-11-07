
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
import InputField from "../../form/InputField"; // <-- import InputField
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

  // -------------------- Fetch Batch by ID (for editing) --------------------
  useEffect(() => {
    const fetchBatchById = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/batches/${id}`);
        const batch = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;

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
        console.error("Error fetching batch by ID:", err);
        const message = err.response?.data?.message || "Failed to fetch batch.";
        Swal.fire("Error", message, "error");
        navigate("/admin/manage-batches");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndTrainers();
    fetchBatchById();
  }, [id]);

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

  // -------------------- Handle MultiSelect --------------------
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
        await apiClient.put(`/api/batches/${selectedBatchId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        Swal.fire({
          title: "Updated!",
          text: "Batch updated successfully.",
          icon: "success",
          confirmButtonColor: "#0E55C8",
        });
      } else {
        await apiClient.post("/api/batches", payload, {
          headers: { "Content-Type": "application/json" },
        });

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
      console.error("Error submitting batch:", err.response?.data || err.message);
      const message =
        err.response?.data?.message || "Failed to save batch. Please try again.";
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="p-10 font-sans bg-blue-50 max-h-fit">
      <div className="bg-white p-10 rounded-lg shadow-2xl max-w-5xl mx-auto border-4 border-[rgba(14,85,200,0.83)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-[rgba(14,85,200,0.83)]">
            {selectedBatchId ? "Update Batch" : "Add Batch"}
          </h3>
          <button
            onClick={() => navigate("/admin/manage-batches")}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md font-semibold text-gray-700 transition"
          >
            ← Manage Batches
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Batch Name"
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
            <InputField
              label="Start Time"
              name="startTime"
              type="time"
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  setFormData((prev) => ({ ...prev, [name]: value })),
                touched: {},
                errors: {},
                handleBlur: () => {},
              }}
            />
            <InputField
              label="End Time"
              name="endTime"
              type="time"
              formik={{
                values: formData,
                setFieldValue: (name, value) =>
                  setFormData((prev) => ({ ...prev, [name]: value })),
                touched: {},
                errors: {},
                handleBlur: () => {},
              }}
            />
          </div>

          {/* Days */}
          <div>
            <label className="font-semibold text-gray-700">Days:</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {daysOfWeek.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.days.includes(day)}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
                   <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Courses & Trainers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  rows={4} // optional, default is 4
/>

          {/* Submit */}
          <div className="text-center">
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
