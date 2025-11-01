import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
// import MultiSelectDropdown from "../../common/MultiSelectDropdown"; // ✅ Adjust path as needed
// import { getAllCourses } from "../../../api/courseApi"; // ✅ Your provided course API
import { getAllCourses } from "../../../api/courses";
import { fetchAllTrainers } from "../../../pages/admin/trainer-management/trainerApi";
// import { fetchAllTrainers } from "../../../api/trainerApi"; // ✅ Your provided trainer API
import MultiSelectDropdown from "../../form/MultiSelectDropdown";

const AddBatch = ({ onBatchSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedBatchId, setSelectedBatchId] = useState(id || null);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [formData, setFormData] = useState({
    batchName: "",
    startTime: "",
    endTime: "",
    days: [],
    mode: "Online",
    coursesAssigned: [],
    trainersAssigned: [],
    additionalNotes: ""
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // -------------------- Fetch Courses & Trainers --------------------
  const fetchCoursesAndTrainers = async () => {
    try {
      const [coursesData, trainersData] = await Promise.all([getAllCourses(), fetchAllTrainers()]);
      setCourses(coursesData || []);
      setTrainers(trainersData || []);
    } catch (err) {
      console.error("Error fetching courses/trainers:", err);
    }
  };

  // -------------------- Fetch Batch by ID (for editing) --------------------
  useEffect(() => {
    const fetchBatchById = async () => {
      if (!id) return;
      try {
        const res = await apiClient.get(`/api/batches/${id}`);
        const batch = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;

        if (batch) {
          setFormData({
            batchName: batch.batchName || "",
            startTime: batch.time?.start || "",
            endTime: batch.time?.end || "",
            days: batch.days || [],
            mode: batch.mode || "Online",
            coursesAssigned: batch.coursesAssigned?.map(c => c._id) || [],
            trainersAssigned: batch.trainersAssigned?.map(t => t._id) || [],
            additionalNotes: batch.additionalNotes || ""
          });
          setSelectedBatchId(id);
        }
      } catch (err) {
        console.error("Error fetching batch by ID:", err);
      }
    };

    fetchCoursesAndTrainers();
    fetchBatchById();
  }, [id]);

  // -------------------- Handle Form Change --------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && daysOfWeek.includes(value)) {
      setFormData(prev => ({
        ...prev,
        days: checked ? [...prev.days, value] : prev.days.filter(day => day !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // -------------------- Handle MultiSelect --------------------
  const handleMultiSelectChange = (name, selectedIds) => {
    setFormData(prev => ({ ...prev, [name]: selectedIds }));
  };

  // -------------------- Handle Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      batchName: formData.batchName,
      time: { start: formData.startTime, end: formData.endTime },
      days: formData.days,
      mode: formData.mode,
      coursesAssigned: formData.coursesAssigned,
      trainersAssigned: formData.trainersAssigned,
      additionalNotes: formData.additionalNotes
    };

    try {
      if (selectedBatchId) {
        await apiClient.put(`/api/batches/${selectedBatchId}`, payload, {
          headers: { "Content-Type": "application/json" }
        });
        alert("✅ Batch updated successfully");
      } else {
        await apiClient.post("/api/batches", payload, {
          headers: { "Content-Type": "application/json" }
        });
        alert("✅ Batch added successfully");
      }

      setFormData({
        batchName: "",
        startTime: "",
        endTime: "",
        days: [],
        mode: "Online",
        coursesAssigned: [],
        trainersAssigned: [],
        additionalNotes: ""
      });
      setSelectedBatchId(null);

      if (onBatchSaved) onBatchSaved();
      navigate("/admin/manage-batches");
    } catch (err) {
      console.error("Error submitting batch:", err.response?.data || err.message);
      alert("❌ Failed to save batch");
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto mb-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-700">
            {selectedBatchId ? "Update Batch" : "Add New Batch"}
          </h3>
          <button
            onClick={() => navigate("/admin/manage-batches")}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md font-semibold text-gray-700 transition"
          >
            ← Back to Manage
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="flex flex-wrap gap-5">
            <div className="flex-1 min-w-[200px] flex flex-col">
              <label className="mb-1 font-bold">Batch Name</label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                className="p-2 border rounded-md border-gray-300"
                required
              />
            </div>
            <div className="flex-1 min-w-[120px] flex flex-col">
              <label className="mb-1 font-bold">Start Time</label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="03:00 PM"
                className="p-2 border rounded-md border-gray-300"
                required
              />
            </div>
            <div className="flex-1 min-w-[120px] flex flex-col">
              <label className="mb-1 font-bold">End Time</label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="05:00 PM"
                className="p-2 border rounded-md border-gray-300"
                required
              />
            </div>
          </div>

          {/* Days */}
          <div className="mt-4">
            <label className="font-bold">Days:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {daysOfWeek.map(day => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer bg-blue-100 px-3 py-1 rounded-lg"
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.days.includes(day)}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="mt-4 flex flex-col">
            <label className="mb-1 font-bold">Mode</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="p-2 border rounded-md border-gray-300 w-full"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Courses & Trainers - Use MultiSelectDropdown */}
          <div className="flex flex-wrap gap-5 mt-6">
            <div className="flex-1 min-w-[200px]">
              <MultiSelectDropdown
                label="Assign Course(s)"
                name="coursesAssigned"
                options={courses}
                formik={{
                  values: formData,
                  setFieldValue: (name, value) => handleMultiSelectChange(name, value)
                }}
                getOptionValue={(c) => c._id}
                getOptionLabel={(c) => c.title}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <MultiSelectDropdown
                label="Assign Trainer(s)"
                name="trainersAssigned"
                options={trainers}
                formik={{
                  values: formData,
                  setFieldValue: (name, value) => handleMultiSelectChange(name, value)
                }}
                getOptionValue={(t) => t._id}
                getOptionLabel={(t) => t.fullName}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4 flex flex-col">
            <label className="mb-1 font-bold">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="p-2 border rounded-md border-gray-300 min-h-[80px]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-5 px-6 py-2 rounded-lg bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition-colors"
          >
            {selectedBatchId ? "Update Batch" : "Add Batch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
