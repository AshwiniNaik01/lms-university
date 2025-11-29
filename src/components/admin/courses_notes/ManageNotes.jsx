
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteNote, fetchAllNotes } from "../../../api/notes";
import { DIR } from "../../../utils/constants";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";
// import Modal from "../../modal/Modal"; // Import your modal

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
    const { rolePermissions } = useSelector((state) => state.permissions);

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
    navigate(`/edit-note/${id}`);
  };

  // Delete note with SweetAlert2
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this Study Material!",
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
        text: "Study Material deleted successfully!",
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

  // Open modal
  const handleView = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // Table column configuration
  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Chapter",
      accessor: (row) => row.chapter?.title || row.chapter || "-",
    },
    // { header: "Duration", accessor: (row) => row.duration || "-" },
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
          {canPerformAction(rolePermissions, "note", "update") && (
          <button
            onClick={() => handleEdit(row._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          )}
          {canPerformAction(rolePermissions, "note", "delete") && (
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

  if (loading) return <p className="text-center mt-10">Loading notes...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col max-h-screen bg-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
        <h2 className="text-2xl font-bold text-gray-700">Manage Study Material</h2>
        {canPerformAction(rolePermissions, "note", "create") && (
        <button
          onClick={() => navigate("/add-notes")}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
        >
          + Add Study Material
        </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <ScrollableTable columns={columns} data={notes} maxHeight="440px" />
        </div>
      </div>

      {/* Modal */}
     {/* Modal */}
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  header={selectedNote?.title || "Note Details"}
  // primaryAction={{
  //   label: "Close",
  //   onClick: () => setIsModalOpen(false),
  // }}
>
{selectedNote && (
  <div className="space-y-4">
    {/* Details Table */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <span className="text-gray-500 font-medium">Title</span>
        <span className="text-gray-800">{selectedNote.title}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-500 font-medium">Chapter</span>
        <span className="text-gray-800">{selectedNote.chapter?.title || selectedNote.chapter || "-"}</span>
      </div>

      {/* <div className="flex flex-col">
        <span className="text-gray-500 font-medium">Duration</span>
        <span className="text-gray-800">{selectedNote.duration || "-"}</span>
      </div> */}

      <div className="flex flex-col">
        <span className="text-gray-500 font-medium">Content</span>
        <span className="text-gray-800">{selectedNote.content || "No description available."}</span>
      </div>
    </div>

    {/* File Section */}
    {selectedNote.file && (
      <div className="flex flex-col mt-4">
        <span className="text-gray-500 font-medium">File</span>
        <div className="mt-2">
          <a
            href={DIR.COURSE_NOTES + selectedNote.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            View PDF
          </a>

          {/* Optional inline preview */}
          <iframe
            src={DIR.COURSE_NOTES + selectedNote.file}
            title="Training Note PDF"
            className="w-full h-64 mt-2 border rounded shadow-sm"
          ></iframe>
        </div>
      </div>
    )}
  </div>
)}

</Modal>

    </div>
  );
};

export default ManageNotes;
