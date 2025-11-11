import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import ScrollableTable from "../../table/ScrollableTable";
import Modal from "../../popupModal/Modal";
import Swal from "sweetalert2";

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/assignments");
      if (res.data.success) {
        setAssignments(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch assignments");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEdit = (id) => navigate(`/admin/edit-assignment/${id}`);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.delete(`/api/assignments/${id}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The assignment has been deleted successfully.",
        confirmButtonColor: "#0E55C8",
        timer: 2000,
      });

      fetchAssignments();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Failed to delete assignment.",
        confirmButtonColor: "#0E55C8",
      });
    }
  };

  const handleView = (assignment) => setSelectedAssignment(assignment);
  const closeModal = () => setSelectedAssignment(null);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Chapter", accessor: (row) => row.chapter?.title || "-" },
    { header: "Deadline", accessor: (row) => row.deadline?.split("T")[0] || "-" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(row._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-center mt-10">Loading assignments...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-8 min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Manage Assignments</h2>
          <button
            onClick={() => navigate("/admin/add-assignment")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            + Add Assignment
          </button>
        </div>

        {/* Scrollable Table */}
        <ScrollableTable
          columns={columns}
          data={assignments}
          maxHeight="550px"
          emptyMessage="No assignments available."
        />

        {/* View Modal */}
        <Modal
          isOpen={!!selectedAssignment}
          onClose={closeModal}
          header={selectedAssignment?.title || "Assignment Details"}
        >
          {selectedAssignment ? (
            <div className="space-y-4 grid grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Title
                </h3>
                <p className="text-lg text-gray-800">{selectedAssignment.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Chapter
                </h3>
                <p className="text-gray-800">
                  {selectedAssignment.chapter?.title || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Description
                </h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {selectedAssignment.description || "No description available"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Deadline
                </h3>
                <p className="text-gray-800">
                  {selectedAssignment.deadline
                    ? new Date(selectedAssignment.deadline).toLocaleString()
                    : "No deadline"}
                </p>
              </div>

              {/* <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Created At
                </h3>
                <p className="text-gray-800">
                  {new Date(selectedAssignment.createdAt).toLocaleString()}
                </p>
              </div> */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </div>
    </div>
  );
}
