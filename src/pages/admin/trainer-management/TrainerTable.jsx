
import { useEffect, useMemo, useState } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2"; // ✅ New Import
import Modal from "../../../components/popupModal/Modal";
import ScrollableTable from "../../../components/table/ScrollableTable";
import { DIR } from "../../../utils/constants";
import { approveTrainer, deleteTrainer, fetchAllTrainers } from "./trainerApi";

const TrainerTable = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  /** Fetch trainers */
  const loadTrainers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllTrainers();
      setTrainers(data);
    } catch (err) {
      console.error("Failed to fetch trainers:", err);
      setError("Failed to fetch trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  /** Approve Trainer with SweetAlert */
  const handleApprove = async (trainerId) => {
    const result = await Swal.fire({
      title: "Approve Trainer?",
      text: "Do you want to approve this trainer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      background: "#fefefe",
    });

    if (result.isConfirmed) {
      try {
        await approveTrainer(trainerId);
        await loadTrainers();

        Swal.fire({
          title: "Approved!",
          text: "The trainer has been approved successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error approving trainer:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to approve trainer.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  /** Delete Trainer with SweetAlert */
  const handleDelete = async (trainerId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the trainer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fefefe",
    });

    if (result.isConfirmed) {
      try {
        await deleteTrainer(trainerId);
        await loadTrainers();

        Swal.fire({
          title: "Deleted!",
          text: "Trainer has been removed successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting trainer:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete trainer.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  /** Open Modal with Trainer Info */
  const handleView = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
  };

  /** Table Columns */
  const columns = useMemo(
    () => [
      {
        header: "Profile",
        accessor: (row) =>
          row.profilePhotoTrainer ? (
            <img
              src={`${DIR.TRAINER_PROFILE_PHOTO}${row.profilePhotoTrainer}`}
              alt={row.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              N/A
            </div>
          ),
      },
      { header: "Name", accessor: "fullName" },
      { header: "Title", accessor: "title" },
      { header: "Qualification", accessor: "highestQualification" },
      { header: "Experience", accessor: "totalExperience" },
      {
        header: "Email",
        accessor: (row) => (
          <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
            {row.email}
          </a>
        ),
      },
      { header: "Mobile No", accessor: "mobileNo" },
      {
        header: "Resume",
        accessor: (row) =>
          row.resume ? (
            <a
              href={`${DIR.TRAINER_RESUME}${row.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline text-sm"
              download
            >
              Download
            </a>
          ) : (
            "N/A"
          ),
      },
      {
        header: "Status",
        accessor: (row) => {
          const isApproved = row.isApproved || row.approvalStatus === "approved";
          return (
            <div className="flex items-center justify-center">
              {isApproved ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
                  ✅ Approved
                </span>
              ) : (
                <button
                  onClick={() => handleApprove(row._id)}
                  className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm hover:bg-yellow-200 transition-all duration-200"
                >
                  ⏳ Pending
                </button>
              )}
            </div>
          );
        },
      },
      {
        header: "Actions",
        accessor: (row) => (
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => handleView(row)}
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
              title="View Trainer Details"
            >
              <FaEye />
            </button>

            <button
              onClick={() => navigate(`/admin/trainers/update/${row._id}`)}
              className="p-2 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-colors duration-200"
              title="Edit Trainer"
            >
              <FaPencilAlt />
            </button>

            <button
              onClick={() => handleDelete(row._id)}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
              title="Delete Trainer"
            >
              🗑️
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="max-h-screen p-2 bg-gray-50">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <header className="px-6 py-5 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Trainer Management
          </h1>
        </header>

        <div className="p-2">
          {loading ? (
            <p className="text-center text-gray-600 text-lg animate-pulse py-12">
              Loading trainers...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg py-12">{error}</p>
          ) : trainers.length === 0 ? (
            <p className="text-center text-gray-500 italic text-lg py-12">
              No trainers found.
            </p>
          ) : (
            <ScrollableTable columns={columns} data={trainers} maxHeight="500px" />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        header="Trainer Details"
        primaryAction={
          selectedTrainer &&
          !(
            selectedTrainer.isApproved ||
            selectedTrainer.approvalStatus === "approved"
          )
            ? {
                label: "Approve Trainer",
                onClick: () => handleApprove(selectedTrainer._id),
              }
            : null
        }
      >
        {selectedTrainer ? (
          <div className="space-y-6">
            {/* Profile */}
            <div className="flex items-center space-x-5 pb-4 border-b border-gray-200">
              <img
                src={
                  selectedTrainer.profilePhotoTrainer
                    ? `${DIR.TRAINER_PROFILE_PHOTO}${selectedTrainer.profilePhotoTrainer}`
                    : "https://via.placeholder.com/80"
                }
                alt={selectedTrainer.fullName}
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedTrainer.fullName}
                </h3>
                <p className="text-gray-600 text-sm">{selectedTrainer.title}</p>
                {selectedTrainer.isApproved ||
                selectedTrainer.approvalStatus === "approved" ? (
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    ✅ Approved
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    ⏳ Pending Approval
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${selectedTrainer.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedTrainer.email}
                </a>
              </p>
              <p>
                <strong>Mobile:</strong> {selectedTrainer.mobileNo || "N/A"}
              </p>
              <p>
                <strong>Qualification:</strong>{" "}
                {selectedTrainer.highestQualification || "N/A"}
              </p>
              <p>
                <strong>Experience:</strong>{" "}
                {selectedTrainer.totalExperience
                  ? `${selectedTrainer.totalExperience} years`
                  : "N/A"}
              </p>
            </div>

            {/* Resume */}
            {selectedTrainer.resume && (
              <div className="pt-4 border-t border-gray-200">
                <strong>Resume:</strong>{" "}
                <a
                  href={`${DIR.TRAINER_RESUME}${selectedTrainer.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                  download
                >
                  Download Resume
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic py-8">
            No trainer selected.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default TrainerTable;
