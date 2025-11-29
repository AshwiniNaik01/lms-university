// SubmitAssignmentModal.jsx
import React, { useState } from "react";
import apiClient from "../../../api/axiosConfig";
// import apiClient from "../apiClient"; // adjust path

const SubmitAssignmentModal = ({ assignment, studentId, onClose, refreshAssignments }) => {
  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("assignmentId", assignment._id);
    formData.append("studentId", studentId);
    formData.append("status", "submitted");
    formData.append("remarks", comments);

    if (submissionType === "file") formData.append("submissionFile", file);
    else if (submissionType === "github") formData.append("githubLink", githubLink);
    else formData.append("otherLink", otherLink);

    await apiClient.post("/api/assignments/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await refreshAssignments();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Submit Assignment</h2>
          <button onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            {["file", "github", "link"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                className={`px-4 py-2 border rounded-lg ${
                  submissionType === type ? "bg-blue-50 border-blue-400" : "border-gray-300"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {submissionType === "file" && (
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          )}

          {submissionType === "github" && (
            <input
              type="url"
              placeholder="GitHub URL"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
          )}

          {submissionType === "link" && (
            <input
              type="url"
              placeholder="Project URL"
              value={otherLink}
              onChange={(e) => setOtherLink(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
          )}

          <textarea
            placeholder="Additional notes"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={
              !submissionType ||
              (submissionType === "file" && !file) ||
              (submissionType === "github" && !githubLink) ||
              (submissionType === "link" && !otherLink)
            }
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignmentModal;
