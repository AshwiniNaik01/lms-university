

import { useEffect, useState } from "react";
// import ScrollableTable from "./ScrollableTable";
// import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import apiClient from "../utils/apiClient"; // your axios instance
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

const ManageLectures = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/lectures");
        if (data.success) {
          setLectures(data.data);
        } else {
          setError("Failed to fetch lectures");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lectures");
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleView = (lecture) => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const handleEdit = (lectureId) => {
    navigate(`/edit-lecture/${lectureId}`);
  };

  const handleDelete = async (lectureId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This lecture will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/lectures/${lectureId}`);
        Swal.fire("Deleted!", "Lecture has been deleted.", "success");
        setLectures(lectures.filter((lec) => lec._id !== lectureId));
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete lecture.", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading lectures...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const columns = [
    { header: "Title", accessor: (row) => row.title },
    { header: "Chapter", accessor: (row) => row.chapter?.title || "-" },
    // { header: "Duration (min)", accessor: (row) => row.duration },
    { header: "Status", accessor: (row) => row.status },
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

  return (
    <div className="p-8 min-h-screen bg-blue-50 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Manage Lectures</h2>
          <button
            onClick={() => navigate("/add-course-videos")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            + Add Lecture
          </button>
        </div>

        <ScrollableTable columns={columns} data={lectures} maxHeight="600px" />
      </div>

      {/* Modal for View */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Lecture Details"
      >
        {selectedLecture && (
          <div className="space-y-3">
            <p>
              <strong>Title:</strong> {selectedLecture.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedLecture.description || "-"}
            </p>
            <p>
              <strong>Duration:</strong> {selectedLecture.duration} min
            </p>
            <p>
              <strong>Status:</strong> {selectedLecture.status}
            </p>
            {/* <p>
              <strong>Content URL:</strong>{" "}
              <a
                href={selectedLecture.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Content
              </a>
            </p> */}
            {selectedLecture.batches?.length > 0 && (
              <div>
                <strong>Batches:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {selectedLecture.batches.map((batch) => (
                    <li key={batch._id}>
                      {batch.batchName} - {batch.mode} - {batch.status} -{" "}
                      {batch.studentCount} students
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageLectures;

