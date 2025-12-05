import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { deleteFeedback, getAllFeedback } from "../../../api/feedback";
import { canPerformAction } from "../../../utils/permissionUtils";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

const ManageFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();

  const fetchFeedback = async () => {
    try {
      const res = await getAllFeedback();
      const data = res?.data || [];

      setFeedbackList(data);
      setNoDataMessage(data.length === 0 ? "No feedback forms found" : "");
    } catch (err) {
      setNoDataMessage("Failed to fetch feedback");
      Swal.fire({
        icon: "error",
        title: "Error Fetching Feedback",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback form will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await deleteFeedback(id);
      fetchFeedback();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Feedback deleted successfully.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  const columns = [
    { header: "Title", accessor: (row) => row.title || "-" },

    {
      header: "Batch",
      accessor: (row) => row.batch?.batchName || "-",
    },

    {
      header: "Questions Count",
      accessor: (row) => row.questions?.length || 0,
    },

    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            View
          </button>

          {canPerformAction(rolePermissions, "feedback", "update") && (
            <button
              onClick={() => navigate(`/edit-feedback/${row._id}`)}
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Edit
            </button>
          )}

          {canPerformAction(rolePermissions, "feedback", "delete") && (
            <button
              onClick={() => handleDelete(row._id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  const renderModalContent = () => {
    if (!selectedFeedback) return <p className="text-gray-500">Loading...</p>;

    return (
      <div className="space-y-3">
        <p>
          <strong>Training Program:</strong> {selectedFeedback.course.title}
        </p>
        {/* <p><strong>Course:</strong> {selectedFeedback.course?._id}</p> */}
        <p>
          <strong>Batch:</strong> {selectedFeedback.batch?.batchName}
        </p>

        <div>
          <strong>Questions:</strong>
          <ul className="list-disc ml-5 mt-1">
            {selectedFeedback.questions?.map((q, index) => (
              <li key={index}>{q.question}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Feedback</h2>
      </div>

      <ScrollableTable
        columns={columns}
        data={feedbackList}
        maxHeight="800px"
        emptyMessage={noDataMessage || "No feedback available"}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
       header={selectedFeedback?.title || "Feedback Form Details"}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ManageFeedback;
