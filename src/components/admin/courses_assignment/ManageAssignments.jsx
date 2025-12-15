import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../contexts/AuthContext";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
// import { useAuth } from "../../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
// import { fetchPermissions } from "../../../redux/slices/permissionsSlice";
import { DIR } from "../../../utils/constants";
import { canPerformAction } from "../../../utils/permissionUtils";

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const searchParams = new URLSearchParams(window.location.search);
  const batchId = searchParams.get("b_id");

  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.role;

  const dispatch = useDispatch();
  const { rolePermissions, loading: permLoading } = useSelector(
    (state) => state.permissions
  );

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/assignments");
      if (res.data.success) {
        let filteredAssignments = res.data.data;

        // Filter only if batchId is present
        if (batchId) {
          filteredAssignments = res.data.data.filter((assignment) =>
            assignment.batches?.includes(batchId)
          );
        }

        setAssignments(filteredAssignments || []);
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

  const hasPermission = (module, action) => {
    const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

    const foundModule = permissions.find(
      (perm) => perm.module === module || perm.module === "*"
    );

    if (!foundModule) return false;

    return (
      foundModule.actions.includes(action) || foundModule.actions.includes("*")
    );
  };

  const handleEdit = (id) => {
    if (!canPerformAction(rolePermissions, "assignment", "update")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to update assignments.",
      });
      return;
    }
    navigate(`/edit-assignment/${id}`);
  };

  const handleDelete = async (id) => {
    if (!canPerformAction(rolePermissions, "assignment", "delete")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to delete assignments.",
      });
      return;
    }

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

  if (loading || permLoading)
    return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Chapter", accessor: (row) => row.chapter?.title || "-" },
    {
      header: "Deadline",
      accessor: (row) => row.deadline?.split("T")[0] || "-",
    },
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

          {/* Edit button → only if user has update permission */}
          {canPerformAction(rolePermissions, "assignment", "update") && (
            <button
              onClick={() => handleEdit(row._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
          )}
          {canPerformAction(rolePermissions, "assignment", "create") && (
            <button
              onClick={() =>
                navigate(
                  `/evaluate-assignment?assignmentId=${row._id}&batchId=${batchId}`
                )
              }
              className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
            >
              Evaluate
            </button>
          )}

          {/* Delete button → only if user has delete permission */}
          {canPerformAction(rolePermissions, "assignment", "delete") && (
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

  if (loading)
    return <p className="text-center mt-10">Loading assignments...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Manage Assignments
          </h2>

          {/* Add Assignment button → only if user has CREATE permission */}
          {canPerformAction(rolePermissions, "assignment", "create") && (
            <button
              onClick={() => navigate("/add-assignment")}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
            >
              + Add Assignment
            </button>
          )}
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
            <div className="space-y-4 grid grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Title
                </h3>
                <p className="text-lg text-gray-800">
                  {selectedAssignment.title}
                </p>
              </div>

              {/* Chapter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Chapter
                </h3>
                <p className="text-gray-800">
                  {selectedAssignment.chapter?.title || "N/A"}
                </p>
              </div>

              {/* Description */}
              {/* <div className="col-span-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          Description
        </h3>
        <p className="text-gray-800 whitespace-pre-line">
          {selectedAssignment.description || "No description available"}
        </p>
      </div> */}

              {/* Deadline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Deadline
                </h3>
                <p className="text-gray-800">
                  {selectedAssignment.deadline
                    ? new Date(selectedAssignment.deadline).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>

              {/* 📎 Assignment File */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Assignment File
                </h3>

                {selectedAssignment.fileUrl ? (
                  <a
                    href={`${DIR.ASSIGNMENT_FILES}${selectedAssignment.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    📄 View Assignment File
                  </a>
                ) : (
                  <p className="text-gray-400 italic">No file uploaded</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </div>
    </div>
  );
}
