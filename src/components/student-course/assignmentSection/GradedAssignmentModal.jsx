// import { useState } from "react";
// import apiClient from "../../../api/axiosConfig";

// const GradedAssignmentModal = ({ assignment, submission, onClose, studentId, refreshAssignments }) => {
//   const [resubmitting, setResubmitting] = useState(false);
//   const [resubmitFile, setResubmitFile] = useState(null);
// //   const baseUrl = process.env.REACT_APP_BASE_URL || "";

//   const hasMistakePhotos = submission.mistakePhotos?.length > 0;

//   const handleResubmit = async () => {
//     if (!resubmitFile) return alert("Please select a file to resubmit");

//     const formData = new FormData();
//     formData.append("assignmentId", assignment._id);
//     formData.append("submissionId", submission._id);
//     formData.append("status", "re-submitted");
//     formData.append("remarks", "Completed all tasks and resubmitted on time");
//     formData.append("files", resubmitFile);

//     try {
//       setResubmitting(true);
//       await apiClient.post(`/api/assignments/resubmit`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Resubmitted successfully!");
//       refreshAssignments();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to resubmit. Try again.");
//     } finally {
//       setResubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">
//             {assignment.title} - Graded Submission
//           </h2>
//           <button onClick={onClose}>X</button>
//         </div>

//         <p className="mb-2">{assignment.description}</p>

//         <p className="text-gray-500 mb-4">
//           Submitted At: {new Date(submission.submittedAt).toLocaleString()}
//         </p>

//         {submission.files?.length > 0 && (
//           <div className="mb-4">
//             <h3 className="font-semibold">Files:</h3>
//             <ul>
//               {submission.files.map((file, idx) => (
//                 <li key={idx}>
//                   <a
//                     href={file}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-blue-500 underline"
//                   >
//                     {file}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <p className="mb-4">Score: {submission.score}</p>
//         <p className="mb-4">Remarks: {submission.remarks}</p>

//         {hasMistakePhotos && (
//           <>
//             <p className="text-red-500 font-semibold mb-2">
//               Mistake photos found. Resubmit required.
//             </p>
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setResubmitFile(e.target.files[0])}
//               className="mb-4"
//             />
//             <button
//               onClick={handleResubmit}
//               disabled={resubmitting}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//             >
//               {resubmitting ? "Resubmitting..." : "Resubmit Assignment"}
//             </button>
//           </>
//         )}

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

// export default GradedAssignmentModal;


import { useState } from "react";
import apiClient from "../../../api/axiosConfig";

const GradedAssignmentModal = ({
  assignment,
  submission,
  onClose,
  studentId,
  refreshAssignments,
}) => {
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitFile, setResubmitFile] = useState(null);

  // Determine which UI to show
  const showResubmit =
    submission.score == null || submission.score < 0
      ? submission.mistakePhotos?.length > 0
      : false;

  const handleResubmit = async () => {
    if (!resubmitFile) return alert("Please select a file to resubmit");

    const formData = new FormData();
    formData.append("assignmentId", assignment._id);
    formData.append("submissionId", submission._id);
    formData.append("status", "re-submitted");
    formData.append(
      "remarks",
      "Completed all tasks and resubmitted on time"
    );
    formData.append("files", resubmitFile);

    try {
      setResubmitting(true);
      await apiClient.post(`/api/assignments/resubmit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resubmitted successfully!");
      refreshAssignments();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to resubmit. Try again.");
    } finally {
      setResubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {assignment.title} - Graded Submission
          </h2>
          <button onClick={onClose}>X</button>
        </div>

        <p className="mb-2">{assignment.description}</p>

        {!showResubmit ? (
          <>
            <p className="text-gray-500 mb-4">
              Submitted At: {new Date(submission.submittedAt).toLocaleString()}
            </p>

            {submission.files?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Files:</h3>
                <ul>
                  {submission.files.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mb-4">Score: {submission.score}</p>
            <p className="mb-4">Remarks: {submission.remarks}</p>
          </>
        ) : (
          <>
            <p className="text-red-500 font-semibold mb-2">
              Mistake photos found. Resubmit required.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResubmitFile(e.target.files[0])}
              className="mb-4"
            />
            <button
              onClick={handleResubmit}
              disabled={resubmitting}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {resubmitting ? "Resubmitting..." : "Resubmit Assignment"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GradedAssignmentModal;
