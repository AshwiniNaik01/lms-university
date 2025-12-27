
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import apiClient from "../../../api/axiosConfig";
// import { DIR } from "../../../utils/constants";

// const SubmitAssignmentModal = ({ assignment, studentId, onClose }) => {
//   const [submissionType, setSubmissionType] = useState("");
//   const [file, setFile] = useState(null);
//   const [githubLink, setGithubLink] = useState("");
//   const [otherLink, setOtherLink] = useState("");
//   const [comments, setComments] = useState("");

//   const dispatch = useDispatch();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("assignmentId", assignment._id);
//     formData.append("studentId", studentId);
//     formData.append("status", "check");
//     formData.append("remarks", comments);

//     if (submissionType === "file") formData.append("submissionFile", file);
//     else if (submissionType === "github")
//       formData.append("githubLink", githubLink);
//     else formData.append("githubLink", otherLink);

//     await apiClient.post("/api/assignments/submit", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     dispatch(fetchAssignmentsByBatch(assignment.batches[0]));
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Submit Assignment</h2>
//           <button onClick={onClose}>X</button>
//         </div>

//         {/* View assignment file */}
//         {assignment?.fileUrl && (
//           <a
//             href={`${DIR.ASSIGNMENT_FILES}${assignment.fileUrl}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline mb-4 inline-block"
//           >
//             View Assignment File
//           </a>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-3">
//             {["file", "github", "link"].map((type) => (
//               <button
//                 key={type}
//                 type="button"
//                 onClick={() => setSubmissionType(type)}
//                 className={`px-4 py-2 border rounded-lg ${
//                   submissionType === type
//                     ? "bg-blue-50 border-blue-400"
//                     : "border-gray-300"
//                 }`}
//               >
//                 {type.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           {submissionType === "file" && (
//             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//           )}

//           {submissionType === "github" && (
//             <input
//               type="url"
//               placeholder="GitHub URL"
//               value={githubLink}
//               onChange={(e) => setGithubLink(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg"
//             />
//           )}

//           {submissionType === "link" && (
//             <input
//               type="url"
//               placeholder="Project URL"
//               value={otherLink}
//               onChange={(e) => setOtherLink(e.target.value)}
//               className="w-full border px-3 py-2 rounded-lg"
//             />
//           )}

//           <textarea
//             placeholder="Additional notes"
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg"
//           />

//           <button
//             type="submit"
//             disabled={
//               !submissionType ||
//               (submissionType === "file" && !file) ||
//               (submissionType === "github" && !githubLink) ||
//               (submissionType === "link" && !otherLink)
//             }
//             className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 disabled:opacity-50"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmitAssignmentModal;

import { useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { DIR } from "../../../utils/constants";
import { useDispatch } from "react-redux";
import { updateAssignment } from "../../../features/assignmentSlice";

const SubmitAssignmentModal = ({ assignment, studentId, onClose }) => {
  const dispatch = useDispatch();

  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("studentId", studentId);
      formData.append("status", "check");
      formData.append("remarks", comments);

      if (submissionType === "file") formData.append("submissionFile", file);
      else if (submissionType === "github") formData.append("githubLink", githubLink);
      else formData.append("githubLink", otherLink);

      const response = await apiClient.post("/api/assignments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Assignment submitted successfully",
        });

        // Update Redux with the updated assignment returned from the API
        if (response.data.data) {
          dispatch(updateAssignment(response.data.data));
        }

        // Reset form
        setSubmissionType("");
        setFile(null);
        setGithubLink("");
        setOtherLink("");
        setComments("");

        // Close modal
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to submit assignment",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Something went wrong",
      });
    }
  };

  // return (
  //   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  //     <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-xl font-bold">Submit Assignment</h2>
  //         <button onClick={onClose}>X</button>
  //       </div>

  //       {/* View assignment file */}
  //       {assignment?.fileUrl && (
  //         <a
  //           href={`${DIR.ASSIGNMENT_FILES}${assignment.fileUrl}`}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-600 underline mb-4 inline-block"
  //         >
  //           View Assignment File
  //         </a>
  //       )}

  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <div className="flex gap-3">
  //           {["file", "github", "link"].map((type) => (
  //             <button
  //               key={type}
  //               type="button"
  //               onClick={() => setSubmissionType(type)}
  //               className={`px-4 py-2 border rounded-lg ${
  //                 submissionType === type
  //                   ? "bg-blue-50 border-blue-400"
  //                   : "border-gray-300"
  //               }`}
  //             >
  //               {type.toUpperCase()}
  //             </button>
  //           ))}
  //         </div>

  //         {submissionType === "file" && (
  //           <input type="file" onChange={(e) => setFile(e.target.files[0])} />
  //         )}

  //         {submissionType === "github" && (
  //           <input
  //             type="url"
  //             placeholder="GitHub URL"
  //             value={githubLink}
  //             onChange={(e) => setGithubLink(e.target.value)}
  //             className="w-full border px-3 py-2 rounded-lg"
  //           />
  //         )}

  //         {submissionType === "link" && (
  //           <input
  //             type="url"
  //             placeholder="Project URL"
  //             value={otherLink}
  //             onChange={(e) => setOtherLink(e.target.value)}
  //             className="w-full border px-3 py-2 rounded-lg"
  //           />
  //         )}

  //         <textarea
  //           placeholder="Additional notes"
  //           value={comments}
  //           onChange={(e) => setComments(e.target.value)}
  //           className="w-full border px-3 py-2 rounded-lg"
  //         />

  //         <button
  //           type="submit"
  //           disabled={
  //             !submissionType ||
  //             (submissionType === "file" && !file) ||
  //             (submissionType === "github" && !githubLink) ||
  //             (submissionType === "link" && !otherLink)
  //           }
  //           className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 disabled:opacity-50"
  //         >
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Assignment</h2>

        {/* View Assignment File */}
        {assignment?.fileUrl && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <a
              href={`${DIR.ASSIGNMENT_FILES}${assignment.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600"
            >
              View Assignment File
            </a>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Submission Type Buttons */}
          <div className="flex gap-3">
            {["file", "github", "link"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  submissionType === type
                    ? "bg-blue-50 border-blue-400 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Submission Inputs */}
          {submissionType === "file" && (
            <div className="flex flex-col gap-2">
              {file && (
                <div className="bg-gray-100 border border-gray-300 p-2 rounded-md text-gray-700 text-sm">
                  Selected File: {file.name || file}
                </div>
              )}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          )}

          {submissionType === "github" && (
            <input
              type="url"
              placeholder="GitHub Repository URL"
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

          {/* Additional Notes */}
          <textarea
            placeholder="Additional notes"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !submissionType ||
              (submissionType === "file" && !file) ||
              (submissionType === "github" && !githubLink) ||
              (submissionType === "link" && !otherLink)
            }
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50 transition-all duration-300"
          >
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );




};

export default SubmitAssignmentModal;
