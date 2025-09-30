import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ScrollableTable from "../../../components/table/ScrollableTable";
import { BASE_URL } from "../../../utils/constants";
import { approveTrainer, deleteTrainer, fetchAllTrainers } from "./trainerApi";
// import {
//   fetchAllTrainers,
//   approveTrainer,
//   deleteTrainer,
// } from "../../../services/trainerService"; // Adjust path accordingly

/**
 * TrainerTable Component
 *
 * Displays a list of trainers with options to approve, edit, view, or delete.
 * Utilizes a ScrollableTable component for displaying data in a scrollable area.
 * 
 * API interactions are abstracted to a service layer for cleaner separation of concerns.
 */
const TrainerTable = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Fetches trainer profiles from the backend.
   * Handles loading and error states accordingly.
   */
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

  // Load trainers on component mount
  useEffect(() => {
    loadTrainers();
  }, []);

  /**
   * Approves a trainer and refreshes the trainers list.
   * @param {string} trainerId
   */
  const handleApprove = async (trainerId) => {
    try {
      await approveTrainer(trainerId);
      await loadTrainers();
    } catch (err) {
      console.error("Error approving trainer:", err);
      alert("Failed to approve trainer.");
    }
  };

  /**
   * Deletes a trainer after user confirmation and refreshes the trainers list.
   * @param {string} trainerId
   */
  const handleDelete = async (trainerId) => {
    // if (!window.confirm("Are you sure you want to delete this trainer?")) return;

    if (typeof window !== "undefined") {
    const confirmed = window.confirm("Are you sure you want to delete this trainer?");
    if (!confirmed) return;


    try {
      await deleteTrainer(trainerId);
      await loadTrainers();
    } catch (err) {
      console.error("Error deleting trainer:", err);
      alert("Failed to delete trainer.");
    }
  }
  };

  // Define table columns including custom renderers for profile images and actions
const columns = [
  {
    header: "Profile",
    accessor: (row) => (
      row.profilePhotoTrainer ? (
        <img
          src={`${BASE_URL}/uploads/trainer/trainer-profilephoto/${row.profilePhotoTrainer}`}
          alt={row.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          N/A
        </div>
      )
    ),
  },
  { header: "Name", accessor: "fullName" },
  { header: "Title", accessor: "title" },
  { header: "Qualification", accessor: "highestQualification" },
  {
    header: "Experience",
    accessor: "totalExperience",
  },
  {
    header: "Email",
    accessor: (row) => (
      <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
        {row.email}
      </a>
    ),
  },
  {
    header: "Mobile No",
    accessor: "mobileNo",
  },
  {
    header: "Location",
    accessor: (row) => {
      const { add1, add2, taluka, dist, state, pincode } = row.address || {};
      return (
        <div title={`${add1}, ${add2}, ${taluka}, ${dist}, ${state} - ${pincode}`}>
          {add1}, {add2}, {taluka}
        </div>
      );
    },
  },
  {
    header: "Resume",
    accessor: (row) =>
      row.resume ? (
        <a
          href={`${BASE_URL}/uploads/trainer/trainer-resume/${row.resume}`}
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
    header: "LinkedIn",
    accessor: (row) =>
      row.linkedinProfile ? (
        <a
          href={row.linkedinProfile.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline text-sm"
        >
          Profile
        </a>
      ) : (
        "N/A"
      ),
  },
  {
    header: "Certifications",
    accessor: (row) =>
      row.certifications && row.certifications.length > 0
        ? `${row.certifications.length} certifications`
        : "None",
  },
  {
    header: "Status",
    accessor: (row) =>
      row.isApproved || row.approvalStatus === "approved" ? (
        <span className="text-green-600 font-medium">Approved</span>
      ) : (
        <button
          onClick={() => handleApprove(row._id)}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Approve
        </button>
      ),
  },
  {
    header: "Actions",
    accessor: (row) => (
      <div className="flex space-x-2">
        <button
          onClick={() => alert(`Viewing: ${row.fullName}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>

        <button
          onClick={() => navigate(`/admin/trainers/update/${row._id}`)}
          className="text-yellow-600 hover:underline text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-600 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    ),
  },
];



  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100">
      <h2 className="text-2xl font-bold text-black flex justify-center text-center mb-4">All Trainers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ScrollableTable columns={columns} data={trainers} maxHeight="500px" />
      )}
    </div>
  );
};

export default TrainerTable;
