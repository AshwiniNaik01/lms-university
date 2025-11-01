import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteNote, fetchAllNotes } from "../../../api/notes";
import ScrollableTable from "../../table/ScrollableTable";
// import ScrollableTable from "../../../components/ScrollableTable"; // ✅ adjust path as needed

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all notes
  const loadNotes = async () => {
    setLoading(true);
    try {
      const notesData = await fetchAllNotes();
      setNotes(notesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/admin/edit-note/${id}`);
  };

  // Delete note with SweetAlert2
// Delete note with SweetAlert2
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to recover this note!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0e55c8",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteNote(id);
    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Note deleted successfully!",
    });
    loadNotes(); // Refresh list
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Failed to delete note.",
    });
  }
};

  // Table column configuration
  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Chapter",
      accessor: (row) => row.chapter?.title || row.chapter || "-",
    },
    // { header: "Type", accessor: (row) => row.type || "-" },
    { header: "Duration", accessor: (row) => row.duration || "-" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
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

  // Loading or error states
  if (loading) return <p className="text-center mt-10">Loading notes...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;



return (
  <div className="flex flex-col max-h-screen font-sans">
    {/* Header (fixed top area) */}
    <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
      <h2 className="text-2xl font-bold text-gray-700">Manage Notes</h2>
      <button
        onClick={() => navigate("/admin/add-notes")}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
      >
        + Add Note
      </button>
    </div>

    {/* Scrollable Table Area */}
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <ScrollableTable columns={columns} data={notes} maxHeight="440px" />
      </div>
    </div>
  </div>
);

};

export default ManageNotes;
