// import { useState } from "react";
// import apiClient from "../../../api/axiosConfig";

// const ResubmitAssignmentModal = ({ assignment, submission, onClose, refreshAssignments }) => {
//   const [resubmitting, setResubmitting] = useState(false);
//   const [submissionType, setSubmissionType] = useState("");
//   const [file, setFile] = useState(null);
//   const [githubLink, setGithubLink] = useState("");
//   const [otherLink, setOtherLink] = useState("");

//   const handleResubmit = async () => {
//     if (
//       !submissionType ||
//       (submissionType === "file" && !file) ||
//       (submissionType === "github" && !githubLink) ||
//       (submissionType === "link" && !otherLink)
//     ) {
//       return alert("Please provide your resubmission");
//     }

//     const formData = new FormData();
//     formData.append("assignmentId", assignment._id);
//     formData.append("submissionId", submission._id);
//     formData.append("status", "submitted");
//     formData.append("remarks", "Completed all tasks and resubmitted on time");

//     if (submissionType === "file") formData.append("files", file);
//     else if (submissionType === "github") formData.append("githubLink", githubLink);
//     else formData.append("otherLink", otherLink);

//     try {
//       setResubmitting(true);
//       await apiClient.post(`/api/assignments/resubmit`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Resubmitted successfully!");
//       refreshAssignments();
//       onClose();
//     } catch (err) {
//       console.error("Resubmission failed:", err);
//       alert("Failed to resubmit. Try again.");
//     } finally {
//       setResubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">{assignment.title} - Resubmit Assignment</h2>
//           <button onClick={onClose}>X</button>
//         </div>

//         <p className="mb-2">{assignment.description}</p>

//         {submission.mistakePhotos?.length > 0 && (
//           <p className="text-red-500 font-semibold mb-2">Mistake photos found. Resubmit required.</p>
//         )}

//         {/* -------- Submission Type Buttons -------- */}
//         <div className="flex gap-3 mb-4">
//           {["file", "github", "link"].map((type) => (
//             <button
//               key={type}
//               type="button"
//               onClick={() => setSubmissionType(type)}
//               className={`px-4 py-2 border rounded-lg ${
//                 submissionType === type ? "bg-blue-50 border-blue-400" : "border-gray-300"
//               }`}
//             >
//               {type.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         {/* -------- Input Fields -------- */}
//         {submissionType === "file" && (
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
//         )}

//         {submissionType === "github" && (
//           <input
//             type="url"
//             placeholder="GitHub URL"
//             value={githubLink}
//             onChange={(e) => setGithubLink(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg mb-4"
//           />
//         )}

//         {submissionType === "link" && (
//           <input
//             type="url"
//             placeholder="Project URL"
//             value={otherLink}
//             onChange={(e) => setOtherLink(e.target.value)}
//             className="w-full border px-3 py-2 rounded-lg mb-4"
//           />
//         )}

//         <button
//           onClick={handleResubmit}
//           disabled={resubmitting}
//           className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//         >
//           {resubmitting ? "Resubmitting..." : "Resubmit Assignment"}
//         </button>

//         <button
//           onClick={onClose}
//           className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResubmitAssignmentModal;

import { useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { DIR } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { updateAssignment, setAssignments } from "../../../features/assignmentSlice";

const ResubmitAssignmentModal = ({ assignment, submission, onClose }) => {
  const dispatch = useDispatch();
  const { batchId } = useSelector((state) => state.assignments);

  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [otherLink, setOtherLink] = useState("");
  const [comments, setComments] = useState("");
  const [resubmitting, setResubmitting] = useState(false);

  const handleResubmit = async (e) => {
    e.preventDefault();

    if (
      !submissionType ||
      (submissionType === "file" && !file) ||
      (submissionType === "github" && !githubLink) ||
      (submissionType === "link" && !otherLink)
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Incomplete",
        text: "Please provide your resubmission",
      });
    }

    try {
      setResubmitting(true);
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("submissionId", submission._id);
      formData.append("status", "check");
      formData.append(
        "remarks",
        comments || "Completed all tasks and resubmitted on time"
      );

      if (submissionType === "file") formData.append("files", file);
      else if (submissionType === "github") formData.append("githubLink", githubLink);
      else formData.append("githubLink", otherLink);

      const response = await apiClient.post("/api/assignments/resubmit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Assignment resubmitted successfully",
        });

        if (response.data.data) {
          dispatch(updateAssignment(response.data.data));
        }

        if (batchId) {
          const { data } = await apiClient.get(`/api/batches/batches/${batchId}`);
          dispatch(setAssignments(data.data.assignments || []));
        }

        setSubmissionType("");
        setFile(null);
        setGithubLink("");
        setOtherLink("");
        setComments("");
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to resubmit assignment",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message || "Something went wrong",
      });
    } finally {
      setResubmitting(false);
    }
  };

  
const getAssignmentFileUrl = (file) => {
  if (!file) return "#";

  if (file.startsWith("http://") || file.startsWith("https://")) {
    // External link
    return file;
  } else if (file.startsWith("submissionFile")) {
    // Original submission
    return `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
  } else if (file.startsWith("files")) {
    // Resubmission
    return `${DIR.ASSIGNMENT_RESUBMISSIONS}${file}`;
  } else {
    // Fallback
    return `${DIR.ASSIGNMENT_SUBMISSIONS}${file}`;
  }
};


  // return (
  //   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  //     <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
  //       {/* Header */}
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-xl font-bold">
  //           {assignment.title} – Resubmit Assignment
  //         </h2>
  //         <button onClick={onClose} className="text-lg font-bold">
  //           ✕
  //         </button>
  //       </div>

  //       <p className="mb-4 text-gray-700">{assignment.description}</p>

  //       {/* Assignment Main File */}
  //       {assignment.fileUrl && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold">Assignment File:</h3>
  //           <a
  //             href={DIR.ASSIGNMENT_FILES + assignment.fileUrl}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="text-blue-500 underline"
  //           >
  //             {assignment.fileUrl}
  //           </a>
  //         </div>
  //       )}

  //       {/* Mistake Files */}
  //       {submission?.mistakePhotos?.length > 0 && (
  //         <div className="mb-6">
  //           <p className="text-red-500 font-semibold mb-3">
  //             Mistake files found. Please review and resubmit:
  //           </p>
  //           <div className="flex flex-wrap gap-4">
  //             {submission.mistakePhotos.map((fileName, idx) => {
  //               const fileUrl = `${DIR.MISTAKE_PHOTOS}${fileName}`;
  //               const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
  //               return (
  //                 <div key={idx} className="text-center">
  //                   {isImage ? (
  //                     <a href={fileUrl} target="_blank" rel="noopener noreferrer">
  //                       <img
  //                         src={fileUrl}
  //                         alt={`Mistake ${idx + 1}`}
  //                         className="w-28 h-28 object-cover border rounded-lg hover:scale-105 transition"
  //                       />
  //                     </a>
  //                   ) : (
  //                     <a
  //                       href={fileUrl}
  //                       target="_blank"
  //                       rel="noopener noreferrer"
  //                       className="text-blue-600 underline"
  //                     >
  //                       📄 Open Mistake File {idx + 1}
  //                     </a>
  //                   )}
  //                   <p className="text-xs mt-1">Mistake {idx + 1}</p>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       )}

  //       {/* Submission Files */}
  //       {submission?.files?.length > 0 && (
  //         <div className="mb-6">
  //           <h3 className="font-semibold">Previous Submission Files:</h3>
  //           <ul className="list-disc list-inside">
  //             {submission.files.map((file, idx) => {
  //               const isLink = /^https?:\/\//i.test(file);
  //               const href = isLink ? file : DIR.ASSIGNMENT_FILES + file;
  //               return (
  //                 <li key={idx}>
  //                   <a
  //                     href={href}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                     className="text-blue-500 underline"
  //                   >
  //                     {file}
  //                   </a>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         </div>
  //       )}

  //       <form onSubmit={handleResubmit} className="space-y-4">
  //         {/* Submission Type Buttons */}
  //         <div className="flex gap-3 mb-4">
  //           {["file", "github", "link"].map((type) => (
  //             <button
  //               key={type}
  //               type="button"
  //               onClick={() => setSubmissionType(type)}
  //               className={`px-4 py-2 border rounded-lg ${
  //                 submissionType === type ? "bg-blue-50 border-blue-400" : "border-gray-300"
  //               }`}
  //             >
  //               {type.toUpperCase()}
  //             </button>
  //           ))}
  //         </div>

  //         {/* Input Fields */}
  //         {submissionType === "file" && (
  //           <input
  //             type="file"
  //             onChange={(e) => setFile(e.target.files[0])}
  //             className="w-full"
  //           />
  //         )}
  //         {submissionType === "github" && (
  //           <input
  //             type="url"
  //             placeholder="GitHub Repository URL"
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
  //             resubmitting ||
  //             !submissionType ||
  //             (submissionType === "file" && !file) ||
  //             (submissionType === "github" && !githubLink) ||
  //             (submissionType === "link" && !otherLink)
  //           }
  //           className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 disabled:opacity-50"
  //         >
  //           {resubmitting ? "Resubmitting..." : "Resubmit Assignment"}
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );

// const ResubmitAssignmentModal = ({ assignment, submission, onClose }) => {
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {assignment.title}
          </h2>
          {/* <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full uppercase shadow-md">
            Resubmit
          </span> */}
        </div>

        {/* Assignment Description */}
        <p className="text-gray-600 mb-4">{assignment.description}</p>

        {/* Assignment Main File */}
        {assignment.fileUrl && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Assignment File:</h3>
            <a
              href={DIR.ASSIGNMENT_FILES + assignment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600"
            >
              {assignment.fileUrl}
            </a>
          </div>
        )}

        {/* Mistake Files */}
        {submission?.mistakePhotos?.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-600 font-semibold mb-3">
              Mistakes found. Please review and resubmit:
            </p>
            <div className="flex flex-wrap gap-4">
              {submission.mistakePhotos.map((fileName, idx) => {
                const fileUrl = `${DIR.MISTAKE_PHOTOS}${fileName}`;
                const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
                return (
                  <div key={idx} className="text-center">
                    {isImage ? (
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={fileUrl}
                          alt={`Mistake ${idx + 1}`}
                          className="w-28 h-28 object-cover border rounded-lg hover:scale-105 transition-transform duration-200"
                        />
                      </a>
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-700"
                      >
                        📄 Open Mistake File {idx + 1}
                      </a>
                    )}
                    <p className="text-xs mt-1 text-gray-600">Mistake {idx + 1}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Previous Submission Files */}
        {submission?.files?.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Previous Submission:</h3>
            <ul className="list-disc list-inside space-y-1">
              {submission.files.map((file, idx) => {
                // const isLink = /^https?:\/\//i.test(file);
                // const href = isLink ? file : DIR.ASSIGNMENT_FILES + file;


                const href = getAssignmentFileUrl(file);

                return (
                  <li key={idx}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-600"
                    >
                      {file}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Resubmit Form */}
        <form onSubmit={handleResubmit} className="space-y-4">
          {/* Submission Type */}
          <div className="flex gap-3 mb-2">
            {["file", "github", "link"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSubmissionType(type)}
                className={`px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${
                  submissionType === type
                    ? "bg-blue-50 border-blue-400 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          {submissionType === "file" && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border px-3 py-2 rounded-lg"
            />
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
              resubmitting ||
              !submissionType ||
              (submissionType === "file" && !file) ||
              (submissionType === "github" && !githubLink) ||
              (submissionType === "link" && !otherLink)
            }
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md disabled:opacity-50 transition-all duration-300"
          >
            {resubmitting ? "Resubmitting..." : "Resubmit Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
// };


};

export default ResubmitAssignmentModal;
