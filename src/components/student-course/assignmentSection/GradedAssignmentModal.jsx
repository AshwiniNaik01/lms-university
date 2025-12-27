

// import { useState } from "react";
// import apiClient from "../../../api/axiosConfig";

import { DIR } from "../../../utils/constants";

// const GradedAssignmentModal = ({ assignment, submission, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">{assignment.title} - Graded Submission</h2>
//           <button onClick={onClose}>X</button>
//         </div>

//         <p className="mb-2">{assignment.description}</p>
//         <p className="text-gray-500 mb-4">
//           Submitted At: {new Date(submission.submittedAt).toLocaleString()}
//         </p>

//         {submission.files?.length > 0 && (
//           <div className="mb-4">
//             <h3 className="font-semibold">Files / Links:</h3>
//             <ul>
//               {submission.files.map((file, idx) => {
//                 const isLink = /^https?:\/\//i.test(file);
//                 const href = isLink ? file : DIR.ASSIGNMENT_SUBMISSIONS + file;

//                 return (
//                   <li key={idx}>
//                     <a
//                       href={href}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 underline"
//                     >
//                       {file}
//                     </a>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}

//         <p className="mb-4">Score: {submission.score}</p>
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

const GradedAssignmentModal = ({ assignment, submission, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold transition-colors"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {assignment.title}
          </h2>
          {/* <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full uppercase shadow">
            Graded
          </span> */}
        </div>

        {/* Assignment Description */}
        <p className="text-gray-600 mb-2">{assignment.description}</p>
        <p className="text-gray-500 mb-4 text-sm">
          Submitted At: {new Date(submission.submittedAt).toLocaleString()}
        </p>

        {/* Files / Links */}
        {submission.files?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Files / Links:</h3>
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

        {/* Score & Remarks */}
        <div className="mb-4 space-y-2">
          <p className="text-green-600 font-semibold text-lg">
            Score: {submission.score}
          </p>
          <p className="text-gray-700">{submission.remarks}</p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default GradedAssignmentModal;
