import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { canPerformAction } from "../../../utils/permissionUtils";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

const ManagePrerequisites = () => {
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get("b_id"); // optional batch filter

  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();

  // Fetch prerequisites
  const loadPrerequisites = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/prerequisite");
      let data = response.data.data || [];

      // Filter by batch if batchId param exists
      if (batchIdParam) {
        data = data.filter((p) => p.batchId === batchIdParam);
      }

      setPrerequisites(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrerequisites();
  }, [batchIdParam]);

  const handleEdit = (id) => navigate(`/edit-prerequisite/${id}`);
  const handleAdd = () => navigate("/add-prerequisite");
  const handleView = (prerequisite) => {
    setSelectedPrerequisite(prerequisite);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won’t be able to recover "${title}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e55c8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.delete(`/api/prerequisite/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${title}" deleted successfully!`,
      });
      loadPrerequisites();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete prerequisite.",
      });
    }
  };

  // Table columns
  const columns = [
    { header: "Title", accessor: "title" },
    // { header: "Course ID", accessor: "courseId" },
    // { header: "Batch ID", accessor: "batchId" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            View
          </button>
          {canPerformAction(rolePermissions, "prerequisite", "update") && (
            <button
              onClick={() => handleEdit(row._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          {canPerformAction(rolePermissions, "prerequisite", "delete") && (
            <button
              onClick={() => handleDelete(row._id, row.title)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading)
    return <p className="text-center mt-10">Loading prerequisites...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col max-h-screen bg-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
        <h2 className="text-2xl font-bold text-gray-700">
          Manage Prerequisites
        </h2>
        {!batchIdParam &&
          canPerformAction(rolePermissions, "prerequisite", "create") && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              + Add Prerequisite
            </button>
          )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <ScrollableTable
            columns={columns}
            data={prerequisites}
            maxHeight="440px"
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={selectedPrerequisite?.title || "Prerequisite Details"}
      >
        {selectedPrerequisite && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Title</span>
                <span className="text-gray-800">
                  {selectedPrerequisite.title}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Active</span>
                <span className="text-gray-800">
                  {selectedPrerequisite.isActive ? "Yes" : "No"}
                </span>
              </div>
              {/* <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Course ID</span>
                <span className="text-gray-800">{selectedPrerequisite.courseId}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Batch ID</span>
                <span className="text-gray-800">{selectedPrerequisite.batchId}</span>
              </div> */}
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Description</span>
                <span className="text-gray-800">
                  {selectedPrerequisite.description || "-"}
                </span>
              </div>
              {/* <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Created At</span>
                <span className="text-gray-800">
                  {selectedPrerequisite.createdAt
                    ? new Date(selectedPrerequisite.createdAt).toLocaleString()
                    : "-"}
                </span>
              </div> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagePrerequisites;
