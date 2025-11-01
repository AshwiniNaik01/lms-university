// EventTableModal.jsx
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert2 import
import Modal from "../popupModal/Modal";
import ScrollableTable from "../table/ScrollableTable";

// Import all APIs from a centralized file
import {
  deleteEvent,
  deleteInternshipSession,
  deleteSessionCategory,
  deleteWebinar,
  deleteWorkshop,
  getAllEvents,
  getAllInternshipSessions,
  getAllWebinars,
  getAllWorkshops,
  getSessionCategories,
} from "./upSkillsApi";

/**
 * EventTableModal
 * 
 * Displays a modal with a scrollable table of sessions/events/categories.
 * Supports dynamic fetching, editing, and deletion based on categorySlug.
 */
const EventTableModal = ({ isOpen, onClose, categoryId, categorySlug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("session-category");

  /**
   * handleDelete
   * Deletes a session/item dynamically using SweetAlert2 for confirmation.
   */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete this ${categorySlug}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      switch (categorySlug) {
        case "event":
          await deleteEvent(id);
          toast.success("Event deleted successfully!");
          break;
        case "webinar":
          await deleteWebinar(id);
          toast.success("Webinar deleted successfully!");
          break;
        case "workshop":
          await deleteWorkshop(id);
          toast.success("Workshop deleted successfully!");
          break;
        case "session-category":
          await deleteSessionCategory(id);
          toast.success("Session category deleted successfully!");
          break;
        case "internship-session":
          await deleteInternshipSession(id);
          toast.success("Internship session deleted successfully!");
          break;
        default:
          throw new Error("Unknown delete type");
      }

      // Remove deleted item from state
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error(`Failed to delete ${categorySlug}.`);
    }
  };

  /**
   * useEffect - Fetch sessions dynamically
   */
  useEffect(() => {
    if (!isOpen) return;

    const fetchSessions = async () => {
      setLoading(true);
      setError("");

      try {
        let responseData = [];

        switch (categorySlug) {
          case "event":
            responseData = await getAllEvents();
            break;
          case "webinar":
            responseData = await getAllWebinars();
            break;
          case "workshop":
            responseData = await getAllWorkshops();
            break;
          case "session-category":
            responseData = await getSessionCategories();
            break;
          case "internship-session":
            responseData = await getAllInternshipSessions();
            break;
          default:
            throw new Error("Unknown session type");
        }

        setData(responseData);
      } catch (err) {
        console.error("❌ Failed to fetch sessions:", err);
        setError("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isOpen, categorySlug]);

  /**
   * Table columns configuration
   */
  const columns = [
    { header: "Title", accessor: "title" },
    // Uncomment if you want date columns
    // {
    //   header: "Start Date",
    //   accessor: (row) =>
    //     row.startDate
    //       ? new Date(row.startDate).toLocaleDateString("en-US", {
    //           year: "numeric",
    //           month: "short",
    //           day: "numeric",
    //         })
    //       : "—",
    // },
    // {
    //   header: "End Date",
    //   accessor: (row) =>
    //     row.endDate
    //       ? new Date(row.endDate).toLocaleDateString("en-US", {
    //           year: "numeric",
    //           month: "short",
    //           day: "numeric",
    //         })
    //       : "—",
    // },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          <button
            onClick={() =>
              navigate(
                `/admin/${activeType}/${categoryId}/manage?type=edit&id=${row._id}`
              )
            }
            className="text-blue-600 hover:bg-blue-100 p-2 rounded transition"
          >
            <Pencil size={18} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:bg-red-100 p-2 rounded transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`All ${categorySlug} Sessions`}
      showCancel={true}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ScrollableTable columns={columns} data={data} maxHeight="400px" />
      )}
    </Modal>
  );
};

export default EventTableModal;
