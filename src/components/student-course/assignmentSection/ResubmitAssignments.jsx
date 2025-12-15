// // ResubmitAssignments.jsx
// import React from "react";

// const ResubmitAssignments = ({ assignments, studentId, setViewModal }) => {
//   // Filter assignments that need resubmission
//   const resubmitAssignments = assignments.filter((assignment) => {
//     const submission = assignment.submissions?.find(
//       (s) =>
//         s.student === studentId &&
//         s.mistakePhotos?.length > 0 &&
//         s.status === "unsubmitted"
//     );
//     return submission;
//   });

//   if (!resubmitAssignments.length) {
//     return <div className="text-gray-500">No assignments to resubmit.</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {resubmitAssignments.map((assignment) => {
//         const submission = assignment.submissions.find(
//           (s) =>
//             s.student === studentId &&
//             s.mistakePhotos?.length > 0 &&
//             s.status === "unsubmitted"
//         );

//         return (
//           <div
//             key={assignment._id}
//             className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
//             onClick={() => setViewModal({ assignment, submission })}
//           >
//             <h3 className="font-bold text-lg">{assignment.title}</h3>
//             <p className="text-gray-500 text-sm mb-2">{assignment.description}</p>
//             <p className="text-red-600 font-semibold">
//               Mistakes Found: {submission.mistakePhotos.length}
//             </p>
//             <p className="text-gray-700">Remarks: {submission.remarks}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ResubmitAssignments;


import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const ResubmitAssignments = ({ studentId, setViewModal }) => {
  const { assignments } = useSelector((state) => state.assignments);

  // Memoize filtered assignments that need resubmission
  const resubmitAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = assignment.submissions?.find(
        (s) =>
          s.student === studentId &&
          s.mistakePhotos?.length > 0 &&
          s.status === "unsubmitted"
      );
      return submission;
    });
  }, [assignments, studentId]);

  if (!resubmitAssignments.length) {
    return <div className="text-gray-500">No assignments to resubmit.</div>;
  }

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //     {resubmitAssignments.map((assignment) => {
  //       const submission = assignment.submissions.find(
  //         (s) =>
  //           s.student === studentId &&
  //           s.mistakePhotos?.length > 0 &&
  //           s.status === "unsubmitted"
  //       );

  //       return (
  //         <div
  //           key={assignment._id}
  //           className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
  //           onClick={() => setViewModal({ assignment, submission })}
  //         >
  //           <h3 className="font-bold text-lg">{assignment.title}</h3>
  //           <p className="text-gray-500 text-sm mb-2">{assignment.description}</p>
  //           <p className="text-red-600 font-semibold">
  //             Mistakes Found: {submission.mistakePhotos.length}
  //           </p>
  //           <p className="text-gray-700">Remarks: {submission.remarks}</p>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );


return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {resubmitAssignments.map((assignment) => {
      const submission = assignment.submissions.find(
        (s) =>
          s.student === studentId &&
          s.mistakePhotos?.length > 0 &&
          s.status === "unsubmitted"
      );

      return (
        <div
          key={assignment._id}
          className="relative bg-white rounded-lg border-3 border-sky-800 shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
        >
          {/* Rejected Tag */}
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase shadow-md">
            Rejected
          </span>

          {/* Assignment Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{assignment.description}</p>

            {/* Mistakes & Remarks */}
            <div className="flex flex-col gap-2">
              <p className="text-red-600 font-semibold text-lg">
                Mistakes Found: {submission?.mistakePhotos.length ?? 0}
              </p>
              <p className="text-gray-700">
                Remarks: {submission?.remarks ?? "No remarks provided"}
              </p>
            </div>
          </div>

          {/* Resubmit Button */}
          <div
            onClick={() => setViewModal({ assignment, submission })}
            className="mt-6 cursor-pointer bg-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-rose-600 hover:shadow-lg transition-all duration-300 text-center text-lg"
          >
            Resubmit Assignment
          </div>
        </div>
      );
    })}
  </div>
);



};

export default ResubmitAssignments;
