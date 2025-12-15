import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { DIR } from "../../../utils/constants";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

export default function EvaluateAssignment() {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    remarks: "",
    score: "",
    mistakePhotos: [],
  });
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("marks"); // "marks" or "mistake"

  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");
  const navigate = useNavigate();

  // Fetch assignment and submissions
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignmentId) return;
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/assignments/${assignmentId}`);
        if (res.data.success && res.data.data) {
          setAssignment(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch assignment");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleOpenModal = (submission) => {
    setSelectedSubmission(submission);
    setMode("marks");
    setFormData({
      status: "submitted",
      remarks: "",
      score: "",
      mistakePhotos: [],
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, mistakePhotos: Array.from(e.target.files) });
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (!selectedSubmission) return;

    if (selectedMode === "marks") {
      setFormData({
        status: "submitted",
        remarks: "",
        score: "",
        mistakePhotos: [],
      });
    } else {
      setFormData({
        status: "unsubmitted",
        remarks: "",
        score: "",
        mistakePhotos: [],
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubmission) return;
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("assignmentId", assignmentId);
      payload.append("submissionId", selectedSubmission._id);
      payload.append("status", formData.status);
      payload.append("remarks", formData.remarks);

      if (mode === "marks") payload.append("score", formData.score);
      if (mode === "mistake") {
        formData.mistakePhotos.forEach((file) =>
          payload.append("mistakePhotos", file)
        );
      }

      const res = await apiClient.post(`/api/assignments/grade`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Submission updated successfully.",
        });
        setModalOpen(false);

        // Refresh assignment data
        const updatedAssignment = await apiClient.get(
          `/api/assignments/${assignmentId}`
        );
        if (updatedAssignment.data.success && updatedAssignment.data.data) {
          setAssignment(updatedAssignment.data.data);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res.data.message || "Failed to update submission.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Determine status text and evaluate button state
  const getStatus = (submission) => {
    if (submission.status === "submitted" && submission.score) {
      return { text: `Graded (${submission.score})`, disabled: true };
    }
    if (
      submission.status === "unsubmitted" &&
      submission.mistakePhotos?.length
    ) {
      return { text: "Resubmission Requested", disabled: true };
    }
    if (submission.status === "check" && submission.mistakePhotos?.length) {
      return { text: "Resubmitted", disabled: false };
    }
    if (submission.status === "check") {
      return { text: "Submitted", disabled: false };
    }
    return { text: submission.status || "-", disabled: false };
  };

  const columns = [
    // {
    //   header: "Student Name",
    //   accessor: (row) => row.student.fullName || "Unknown",
    // },

    {
      header: "Student Name",
      accessor: (row) => (row.student ? row.student.fullName : "Unknown"),
    },
    {
      header: "Submitted File(s)",
      accessor: (row) =>
        row.files && row.files.length > 0 ? (
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => {
              setSelectedFiles(row.files);
              // setSelectedStudent(row.student.fullName || "Unknown");
              setSelectedStudent(row.student && row.student.fullName ? row.student.fullName : "Unknown");
               setSelectedSubmission(row); // Add this line
              setFileModalOpen(true);
            }}
          >
            {row.files.length} file{row.files.length > 1 ? "s" : ""}
          </button>
        ) : (
          "No files"
        ),
    },
    {
      header: "Status",
      accessor: (row) => getStatus(row).text,
    },
    {
      header: "Actions",
      accessor: (row) => {
        const { disabled, text } = getStatus(row);
        return disabled ? (
          <button
            disabled
            className="px-3 py-1 rounded-md bg-gray-400 text-white text-sm cursor-not-allowed"
          >
            {text}
          </button>
        ) : (
          <button
            onClick={() => handleOpenModal(row)}
            className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
          >
            Evaluate
          </button>
        );
      },
    },
  ];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!assignment)
    return <p className="text-center mt-10">Assignment not found.</p>;

  return (
    <div className="p-8 font-sans bg-white max-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          {assignment.title} - Submissions
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          Back to Assignments
        </button>
      </div>

      <ScrollableTable
        columns={columns}
        data={assignment.submissions || []}
        maxHeight="600px"
        emptyMessage="No submissions found for this assignment."
      />

      {/* File Modal */}
      {/* <Modal
        isOpen={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        header={`Files submitted by: ${selectedStudent}`}
        primaryAction={null}
      >
        <div className="flex flex-col gap-2">
          {selectedFiles && selectedFiles.length > 0 ? (
            selectedFiles.map((file, index) => {
              const isUrl =
                file.startsWith("http://") || file.startsWith("https://");
              const fileUrl = isUrl
                ? file
                : `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
              return (
                <a
                  key={index}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file}
                </a>
              );
            })
          ) : (
            <p>No files submitted</p>
          )}
        </div>
      </Modal> */}
{/* <Modal
  isOpen={fileModalOpen}
  onClose={() => setFileModalOpen(false)}
  header={`Files submitted by: ${selectedStudent}`}
  primaryAction={null}
>
  <div className="flex flex-col gap-2">
{selectedFiles && selectedFiles.length > 0 ? (
  selectedFiles.map((file, index) => {
    let fileUrl;

    if (file.startsWith("http://") || file.startsWith("https://")) {
      // External links
      fileUrl = file;
    } else if (selectedSubmission?.mistakePhotos?.includes(file)) {
      // Mistake photo → resubmissions folder
      fileUrl = `${DIR.ASSIGNMENT_RESUBMISSIONS}${file}`;
    // } else if (selectedSubmission?.files?.includes(file)) {
    //   // Original submission → initial folder
    //   fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
    } else {
      // fallback
      fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
    }

    return (
      <a
        key={index}
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {file}
      </a>
    );
  })
) : (
  <p>No files submitted</p>
)}

  </div>
</Modal> */}

<Modal
  isOpen={fileModalOpen}
  onClose={() => setFileModalOpen(false)}
  header={`Files submitted by: ${selectedStudent}`}
  primaryAction={null}
>
  <div className="flex flex-col gap-2">
    {selectedFiles && selectedFiles.length > 0 ? (
      selectedFiles.map((file, index) => {
        let fileUrl;

        if (file.startsWith("http://") || file.startsWith("https://")) {
          // External link
          fileUrl = file;
        } else if (file.startsWith("submissionFile")) {
          // Original submission → ASSIGNMENT_SUBMISSIONS folder
          fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
        } else if (file.startsWith("files")) {
          // Resubmission → ASSIGNMENT_RESUBMISSIONS folder
          fileUrl = `${DIR.ASSIGNMENT_RESUBMISSIONS}${file}`;
        } else {
          // Fallback
          fileUrl = `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
        }

        return (
          <a
            key={index}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {file}
          </a>
        );
      })
    ) : (
      <p>No files submitted</p>
    )}
  </div>
</Modal>


      {/* Evaluate Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        header={`Evaluate Submission: ${
          selectedSubmission?.student?.fullName || ""
        }`}
        primaryAction={{
          label: mode === "marks" ? "Submit Marks" : "Submit Mistakes",
          onClick: handleSubmit,
          loading: saving,
        }}
      >
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-white ${
              mode === "marks" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => handleModeChange("marks")}
          >
            Give Marks
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              mode === "mistake" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => handleModeChange("mistake")}
          >
            Re-Upload Request to Studnet
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full p-2 border rounded-md border-gray-300"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "unsatisfied",
                "good",
                "better",
                "average",
                "best",
                "error",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer px-3 py-1 border rounded-full hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={option}
                    checked={formData.rating === option}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {mode === "marks" && (
            <div>
              <label className="block font-semibold text-gray-700">Score</label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
          )}

          {mode === "mistake" && (
            <div>
              <label className="block font-semibold text-gray-700">
                Mistake Photos
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
