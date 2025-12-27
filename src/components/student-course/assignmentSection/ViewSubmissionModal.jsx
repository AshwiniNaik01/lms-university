// // ViewSubmissionModal.jsx
// const ViewSubmissionModal = ({ assignment, submission, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">{assignment.title} - Submission</h2>
//           <button onClick={onClose}>X</button>
//         </div>

import { DIR } from "../../../utils/constants";

//         <p className="mb-2">{assignment.description}</p>
//         <p className="text-gray-500 mb-4">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>

//         {submission.files?.length > 0 && (
//           <div className="mb-4">
//             <h3 className="font-semibold">Files:</h3>
//             <ul>
//               {submission.files.map((file, idx) => (
//                 <li key={idx}>
//                   <a href={file} target="_blank" className="text-blue-500 underline">{file}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <p className="mb-4">Remarks: {submission.remarks}</p>

//         <button
//           onClick={onClose}
//           className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewSubmissionModal;


// import { DIR } from "../constants/paths"; // adjust path as needed

// import { DIR } from "../../../utils/constants";

const ViewSubmissionModal = ({ assignment, submission, onClose }) => {
  // return (
  //   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  //     <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-xl font-bold">{assignment.title} - Submission</h2>
  //         <button onClick={onClose}>X</button>
  //       </div>

  //       <p className="mb-2">{assignment.description}</p>
  //       <p className="text-gray-500 mb-4">
  //         Submitted At: {new Date(submission.submittedAt).toLocaleString()}
  //       </p>

  //       {submission.files?.length > 0 && (
  //         <div className="mb-4">
  //           <h3 className="font-semibold">Files / Links:</h3>
  //           <ul>
  //             {submission.files.map((file, idx) => {
  //               const isLink = /^https?:\/\//i.test(file);
  //               const href = isLink ? file : DIR.ASSIGNMENT_SUBMISSIONS + file;

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

  //       <p className="mb-4">Remarks: {submission.remarks}</p>

  //       <button
  //         onClick={onClose}
  //         className="bg-gray-500 text-white px-4 py-2 rounded-lg"
  //       >
  //         Close
  //       </button>
  //     </div>
  //   </div>
  // );


// const SubmissionDetailsModal = ({ assignment, submission, onClose }) => {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {assignment.title} – Submission Details
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-2">{assignment.description}</p>
        <p className="text-gray-500 mb-4">
          Submitted At: {new Date(submission.submittedAt).toLocaleString()}
        </p>

        {/* Files / Links */}
        {submission.files?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Files / Links:</h3>
            <ul className="list-disc list-inside space-y-1">
              {submission.files.map((file, idx) => {
                const isLink = /^https?:\/\//i.test(file);
                const href = isLink ? file : DIR.ASSIGNMENT_SUBMISSIONS + file;

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

        {/* Remarks */}
        <div className="mb-6">
          <h3 className="font-semibold mb-1">Remarks:</h3>
          <p className="text-gray-700">
            {submission.remarks || "No remarks provided"}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
// };

};

export default ViewSubmissionModal;
