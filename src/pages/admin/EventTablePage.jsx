import { useEffect, useState } from "react";
// import ScrollableTable from "../../src/components/table/ScrollableTable";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ScrollableTable from "../../components/table/ScrollableTable";
// import apiClient from "../api/axiosConfig";
import apiClient from "../../api/axiosConfig";

const EventTablePage = ({ isOpen, onClose, onEdit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/event");
      if (res.data.success) setEvents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this event?")) return;
   
   if (typeof window === 'undefined' || !window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await apiClient.delete(`/api/event/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Slug", accessor: "slug" },
    { header: "Category", accessor: (row) => row.category?.name || "N/A" },
    {
      header: "Start Date",
      accessor: (row) =>
        row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A",
    },
    {
      header: "End Date",
      accessor: (row) =>
        row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A",
    },
    { header: "Mode", accessor: "mode" },
    { header: "Organizer", accessor: "organizer" },
    { header: "Max Participants", accessor: "maxParticipants" },
    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/session-category/${row.category?._id}/manage`)
            }
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
          >
            <FaEdit size={14} /> Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1"
          >
            <FaTrash size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-6xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Events Table</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : (
          <ScrollableTable columns={columns} data={events} maxHeight="500px" />
        )}
      </div>
    </div>
  );
};

export default EventTablePage;
