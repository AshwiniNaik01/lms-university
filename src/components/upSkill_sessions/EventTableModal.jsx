// EventTableModal.jsx
import { Calendar, CheckCircle, Eye, Info, Pencil, Trash2, XCircle } from "lucide-react";
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
  // For the view modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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
      let response;
      switch (categorySlug) {
        case "event":
          response = await deleteEvent(id);
          break;
        case "webinar":
          response = await deleteWebinar(id);
          break;
        case "workshop":
          response = await deleteWorkshop(id);
          break;
        case "session-category":
          response = await deleteSessionCategory(id);
          break;
        case "internship-session":
          response = await deleteInternshipSession(id);
          break;
        default:
          throw new Error("Unknown delete type");
      }

      // Show SweetAlert success message
      await Swal.fire({
        title: "Deleted!",
        text: response?.message || `${categorySlug} deleted successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Remove deleted item from state
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error(
        err?.response?.data?.message || `Failed to delete ${categorySlug}.`
      );
    }

    // try {
    //   switch (categorySlug) {
    //     case "event":
    //       await deleteEvent(id);
    //       toast.success("Event deleted successfully!");
    //       break;
    //     case "webinar":
    //       await deleteWebinar(id);
    //       toast.success("Webinar deleted successfully!");
    //       break;
    //     case "workshop":
    //       await deleteWorkshop(id);
    //       toast.success("Workshop deleted successfully!");
    //       break;
    //     case "session-category":
    //       await deleteSessionCategory(id);
    //       toast.success("Session category deleted successfully!");
    //       break;
    //     case "internship-session":
    //       await deleteInternshipSession(id);
    //       toast.success("Internship session deleted successfully!");
    //       break;
    //     default:
    //       throw new Error("Unknown delete type");
    //   }

    //   // Remove deleted item from state
    //   setData((prev) => prev.filter((item) => item._id !== id));
    // } catch (err) {
    //   console.error("❌ Delete failed:", err);
    //   toast.error(`Failed to delete ${categorySlug}.`);
    // }
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

  /** VIEW HANDLER **/
  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  /** CLEAN DETAIL RENDERER **/
  const renderDetails = (item) => {
    if (!item) {
      return (
        <p className="text-gray-500 italic text-center">
          No details available.
        </p>
      );
    }

    const hiddenFields = [
      "__v",
      "_id",
      "createdAt",
      "description",
      "updatedAt",
      "slug",
      "image",
      "banner",
      "thumbnail",
    ];

    const isDisplayable = (value, key) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "object") return false;
      if (Array.isArray(value)) return false;
      if (
        typeof value === "string" &&
        value.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      )
        return false;
      if (hiddenFields.includes(key)) return false;
      return true;
    };

    const formatValue = (key, value) => {
      if (typeof value === "boolean") {
        return value ? (
          <span className="flex items-center text-green-600 font-medium">
            <CheckCircle size={16} className="mr-1" /> Active
          </span>
        ) : (
          <span className="flex items-center text-red-500 font-medium">
            <XCircle size={16} className="mr-1" /> Inactive
          </span>
        );
      }

      if (
        key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("createdat")
      ) {
        return (
          <span className="flex items-center text-blue-600">
            <Calendar size={16} className="mr-1" />
            {new Date(value).toLocaleString()}
          </span>
        );
      }

      return <span className="text-gray-900">{String(value)}</span>;
    };

    const filteredEntries = Object.entries(item).filter(([key, value]) =>
      isDisplayable(value, key)
    );

    if (filteredEntries.length === 0) {
      return (
        <p className="text-gray-500 italic text-center">
          No readable text fields available.
        </p>
      );
    }

    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-600 text-sm capitalize flex items-center">
                  <Info size={14} className="mr-1 text-indigo-500" />
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
              </div>
              <div className="text-sm leading-relaxed">
                {formatValue(key, value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <button
            onClick={() => handleView(row)}
            className="text-green-600 hover:bg-green-100 p-2 rounded transition"
          >
            <Eye size={18} />
          </button>

          {/* Edit Button */}
          <button
            onClick={() =>
              navigate(
                `/${activeType}/${categoryId}/manage?type=edit&id=${row._id}`
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
    <>
      {/* Main Table Modal */}
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

      {/* Dynamic View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        header={`View ${categorySlug} Details`}
        showCancel={true}
      >
        {renderDetails(selectedItem)}
      </Modal>
    </>
  );
};

export default EventTableModal;
