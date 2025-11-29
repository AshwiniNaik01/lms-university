import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const ManagePrerequisites = () => {
  const navigate = useNavigate();
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);

  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all prerequisites
  useEffect(() => {
    const fetchPrerequisites = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/prerequisite");

        if (data.success) {
          setPrerequisites(data.data);
        } else {
          setError("Failed to fetch prerequisites");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch prerequisites");
      } finally {
        setLoading(false);
      }
    };

    fetchPrerequisites();
  }, []);

  // View handler
  const handleView = (item) => {
    setSelectedPrerequisite(item);
    setIsModalOpen(true);
  };

  // Edit handler
  const handleEdit = (id) => {
    navigate(`/edit-prerequisite/${id}`);
  };

  // Delete handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This prerequisite will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.delete(`/api/prerequisite/${id}`);

      Swal.fire("Deleted!", "Prerequisite has been deleted.", "success");

      setPrerequisites(prerequisites.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to delete prerequisite.", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading prerequisites...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Table columns
  const columns = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Course", accessor: (row) => row.course?.title || "-" },
    {
      header: "Batch",
      accessor: (row) => row.course?.batches?.length
        ? row.course.batches.find((b) => b === row.batchId)
        : row.batchId,
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          {/* View */}
          <button
            onClick={() => handleView(row)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            View
          </button>

          {/* Edit */}
          {canPerformAction(rolePermissions, "prerequisite", "update") && (
            <button
              onClick={() => handleEdit(row._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}

          {/* Delete */}
          {canPerformAction(rolePermissions, "prerequisite", "delete") && (
            <button
              onClick={() => handleDelete(row._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-blue-50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Manage Prerequisites</h2>

          {canPerformAction(rolePermissions, "prerequisite", "create") && (
            <button
              onClick={() => navigate("/add-prerequisite")}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              + Add Prerequisite
            </button>
          )}
        </div>

        {/* Table */}
        <ScrollableTable columns={columns} data={prerequisites} maxHeight="600px" />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Prerequisite Details"
      >
        {selectedPrerequisite && (
          <div className="space-y-4">
            <p>
              <strong>Title:</strong> {selectedPrerequisite.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedPrerequisite.description}
            </p>

            <p>
              <strong>Course:</strong> {selectedPrerequisite.course?.title || "-"}
            </p>

            <p>
              <strong>Batch ID:</strong> {selectedPrerequisite.batchId}
            </p>

            {/* Topics */}
            <div>
              <strong>Topics:</strong>
              <ul className="list-disc ml-5 mt-1">
                {selectedPrerequisite.topics.map((topic) => (
                  <li key={topic._id} className="mb-2">
                    <strong>{topic.name}</strong>

                    <div className="ml-4">
                      <p className="font-semibold">Video Links:</p>
                      <ul className="list-disc ml-5">
                        {topic.videoLinks.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>

                      <p className="font-semibold mt-2">Materials:</p>
                      <ul className="list-disc ml-5">
                        {topic.materialFiles.map((f) => (
                          <li key={f._id}>{f.fileName} ({f.fileType})</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagePrerequisites;
