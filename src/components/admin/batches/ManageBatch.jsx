// src/components/Admin/Batch/ManageBatches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [noBatchesMessage, setNoBatchesMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // -------------------- Fetch All Batches --------------------

  const fetchBatches = async () => {
    try {
      const res = await apiClient.get("/api/batches/all");
      const data = res.data.data || [];
      setBatches(data);
      setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
    } catch (err) {
      console.error("Error fetching batches:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch batches";
      setNoBatchesMessage(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Batches",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
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
        Swal.fire({
          icon: "info",
          title: "No Batches Found",
          text: "No batches found for this selected course.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch batches for this course";

      if (err.response?.status === 404) {
        setBatches([]);
        setNoBatchesMessage("No batches found for this course");
      }

      Swal.fire({
        icon: "error",
        title: "Error Fetching Course Batches",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // -------------------- Fetch All Courses --------------------

  const getAllCourses = async () => {
    try {
      const res = await apiClient.get("/api/courses/all");
      setCourses(res.data.data || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch courses";

      Swal.fire({
        icon: "error",
        title: "Error Fetching Courses",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // -------------------- Handle Delete --------------------
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the batch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await apiClient.delete(`/api/batches/${id}`);
      fetchBatches();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Batch has been deleted successfully.",
        confirmButtonColor: "#3085d6",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete batch";

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // -------------------- Handle View --------------------
  const handleView = async (batchId) => {
    try {
      const res = await apiClient.get(`/api/batches/batches/${batchId}`);
      const batch = Array.isArray(res.data.data)
        ? res.data.data[0]
        : res.data.data;
      setSelectedBatch(batch);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch batch details";

      Swal.fire({
        icon: "error",
        title: "Error Fetching Details",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // -------------------- Navigation Handler --------------------
  const handleEdit = (batchId) => navigate(`/admin/add-batch/${batchId}`);

  // -------------------- Handle Course Filter --------------------
  const handleCourseFilterChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchBatchesByCourseId(courseId);
  };

  // -------------------- Fetch on Mount --------------------
  useEffect(() => {
    fetchBatches();
    getAllCourses();
  }, []);

  // -------------------- Table Columns --------------------
  const columns = [
    { header: "Batch Name", accessor: (row) => row.batchName || "-" },
    {
      header: "Time",
      accessor: (row) => `${row.time?.start || "-"} - ${row.time?.end || "-"}`,
    },
    { header: "Mode", accessor: (row) => row.mode || "-" },
    {
      header: "Trainers",
      accessor: (row) =>
        row.trainersAssigned?.map((t) => t?.fullName).join(", ") || "-",
    },
    { header: "Status", accessor: (row) => row.status || "-" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row._id)}
            className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(row._id)}
            className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Batches</h2>
        <button
          onClick={() => navigate("/admin/add-batch")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          + Add Batch
        </button>
      </div>

      {/* ---------- Filter Section ---------- */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-gray-700">
            Filter by Course:
          </label>
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

      {/* ---------- Table Section ---------- */}
      <ScrollableTable
        columns={columns}
        data={batches}
        maxHeight="600px"
        emptyMessage={noBatchesMessage || "No batches found"}
      />

      {/* ---------- Modal for Batch Details ---------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          selectedBatch ? `Batch: ${selectedBatch.batchName}` : "Batch Details"
        }
      >
        {selectedBatch ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <strong>Time:</strong> {selectedBatch.time?.start || "-"} -{" "}
                {selectedBatch.time?.end || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Mode:</strong> {selectedBatch.mode || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Days:</strong>{" "}
                {selectedBatch.days?.length > 0
                  ? selectedBatch.days.join(", ")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <strong>Courses:</strong>{" "}
                {selectedBatch.coursesAssigned
                  ?.map((c) => c?.title)
                  .join(", ") || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Trainers:</strong>{" "}
                {selectedBatch.trainersAssigned
                  ?.map((t) => t?.fullName)
                  .join(", ") || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <strong>Status:</strong> {selectedBatch.status || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Notes:</strong>{" "}
                {selectedBatch.additionalNotes || "No notes available"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading batch details...</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageBatch;
