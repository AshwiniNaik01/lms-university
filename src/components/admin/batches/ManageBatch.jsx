// src/components/Admin/Batch/ManageBatches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";

const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [noBatchesMessage, setNoBatchesMessage] = useState("");
  const navigate = useNavigate();

  // -------------------- Fetch All Batches --------------------
  const fetchBatches = async () => {
    try {
      const res = await apiClient.get("/api/batches");
      const data = res.data.data || [];
      setBatches(data);
      setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
    } catch (err) {
      console.error("Error fetching batches:", err);
      setNoBatchesMessage("Failed to fetch batches");
    }
  };

  // -------------------- Fetch Batches by Course ID --------------------
  const fetchBatchesByCourseId = async (courseId) => {
    try {
      if (courseId === "all") {
        fetchBatches();
        return;
      }

      const res = await apiClient.get(`/api/batches/course/${courseId}`);
      if (res.data && res.data.success && res.data.data?.length > 0) {
        setBatches(res.data.data);
        setNoBatchesMessage("");
      } else {
        setBatches([]);
        setNoBatchesMessage("No batches found for this course");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setBatches([]);
        setNoBatchesMessage("No batches found for this course");
      } else {
        console.error("Error fetching batches by course ID:", err);
        setNoBatchesMessage("Failed to fetch batches for this course");
      }
    }
  };

  // -------------------- Fetch All Courses --------------------
  const getAllCourses = async () => {
    try {
      const res = await apiClient.get("/api/courses/all");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // -------------------- Handle Delete --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await apiClient.delete(`/api/batches/${id}`);
      fetchBatches();
    } catch (err) {
      console.error("Error deleting batch:", err.response?.data || err.message);
      alert("❌ Failed to delete batch");
    }
  };

// -------------------- Handle Edit --------------------
const handleEdit = (batchId) => {
  // Navigate using the batch ID
  navigate(`/admin/add-batch/${batchId}`);
};

// -------------------- Handle Course Filter Change --------------------
const handleCourseFilterChange = (e) => {
  const batchId = e.target.value; // now using batch ID instead of course ID
  setSelectedCourseId(batchId);   // consider renaming this state to selectedBatchId for clarity
  fetchBatchesByCourseId(batchId); // if your API fetch expects courseId, you might need to update this
};

  useEffect(() => {
    fetchBatches();
    getAllCourses();
  }, []);

  // -------------------- JSX --------------------
  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Batches</h2>
        <button
          onClick={() => navigate("/admin/add-batch")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          + Add New Batch
        </button>
      </div>

      {/* ---------- TABLE SECTION ---------- */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">All Batches</h3>

          {/* Course Filter Dropdown */}
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-600">Filter by Course:</label>
            <select
              value={selectedCourseId}
              onChange={handleCourseFilterChange}
              className="p-2 border rounded-md border-gray-300"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {noBatchesMessage ? (
            <p className="text-center text-gray-600 py-6 font-medium">
              {noBatchesMessage}
            </p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-cyan-500 text-white text-left">
                  <th className="p-2">Batch Name</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Days</th>
                  <th className="p-2">Mode</th>
                  <th className="p-2">Courses</th>
                  <th className="p-2">Trainers</th>
                  <th className="p-2">Notes</th>
                  <th className="p-2">Students</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold text-gray-700">
                      {batch.batchName}
                    </td>
                    <td className="p-2">
                      {batch.time?.start || "-"} - {batch.time?.end || "-"}
                    </td>
                    <td className="p-2">{batch.days?.join(", ") || "-"}</td>
                    <td className="p-2">{batch.mode || "-"}</td>
                    <td className="p-2">
                      {batch.coursesAssigned
                        ?.map((c) => c?.title)
                        .join(", ") || "-"}
                    </td>
                    <td className="p-2">
                      {batch.trainersAssigned
                        ?.map((t) => t?.fullName)
                        .join(", ") || "-"}
                    </td>
                    <td className="p-2">{batch.additionalNotes || "-"}</td>
                    <td className="p-2 text-center">
                      {batch.studentCount || 0}
                    </td>
                    <td className="p-2 text-center">{batch.status || "-"}</td>
                   <td className="p-2 flex gap-2">
  <button
    onClick={() => handleEdit(batch._id)} // <-- send batch ID instead of course ID
    className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(batch._id)}
    className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
  >
    Delete
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBatch;
