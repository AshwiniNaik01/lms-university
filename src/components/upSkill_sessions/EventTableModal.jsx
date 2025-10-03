
/**
 * 📦 EventTableModal.jsx
 *
 * This modal displays all sessions under a given session category (e.g., event, webinar, workshop, internship-session).
 * It page is triggered when the user clicks the "Manage" button from the `SessionCategoryForm` component.
 */

import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import ScrollableTable from "../table/ScrollableTable";

import { Pencil } from "lucide-react";
import { Tooltip } from "react-tooltip";

// Helps screen readers focus on the modal
ReactModal.setAppElement("#root");

const EventTableModal = ({ isOpen, onClose, categoryId, categorySlug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  Fetch sessions based on the selected category slug (type)
  useEffect(() => {
    if (!isOpen) return;

    const fetchSessions = async () => {
      setLoading(true);
      setError("");

      try {
        let response;

        switch (categorySlug) {
          case "event":
            response = await apiClient.get("/api/event");
            break;
          case "webinar":
            response = await apiClient.get("/api/webinars");
            break;
          case "workshop":
            response = await apiClient.get("/api/workshops");
            break;
          case "internship-session":
            response = await apiClient.get("/api/internship-sessions");
            break;
          default:
            throw new Error("Unknown session type");
        }

        setData(response.data?.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch sessions:", err);
        setError("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [isOpen, categorySlug]);

  //  Table column definitions
  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Start Date",
      accessor: (row) =>
        row.startDate
          ? new Date(row.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
    },
    {
      header: "End Date",
      accessor: (row) =>
        row.endDate
          ? new Date(row.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          {/* ✏️ Edit Button with Tooltip */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Edit Session"
            onClick={() =>
              navigate(
                `/admin/session-category/${categoryId}/manage?type=edit&id=${row._id}`
              )
            }
            className="text-blue-600 hover:bg-blue-100 p-2 rounded transition"
          >
            <Pencil size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="All Sessions Modal"
      className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto mt-20 outline-none"
      overlayClassName="fixed inset-0 bg-black/70 flex items-start justify-center z-50"
    >
      <div>
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">
            All {categorySlug} Sessions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ScrollableTable columns={columns} data={data} maxHeight="400px" />
        )}
      </div>

      {/* Tooltip provider for icons */}
      <Tooltip id="tooltip" place="top" />
    </ReactModal>
  );
};

export default EventTableModal;
