// const SubmittedAssignments = ({ assignments, studentId, setViewModal }) => {
//   const getSubmission = (a) =>
//     a.submissions?.find(
//       (s) =>
//         s?.student === studentId ||
//         (s?.student === null && s.status === "submitted")
//     );

//   const submitted = assignments.filter((a) => {
//     const s = getSubmission(a);
//     return s && (s.status === "submitted" || s.status === "checked");
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {submitted.map((assignment) => {
//         const submission = getSubmission(assignment);

//         return (
//           <div key={assignment._id} className="p-6 bg-white shadow rounded-xl">
//             <h2 className="text-xl font-semibold">{assignment.title}</h2>
//             <p className="text-gray-600 mb-4">{assignment.description}</p>

//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               onClick={() =>
//                 setViewModal({ assignment, submission })
//               }
//             >
//               View
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SubmittedAssignments;



// import { useSelector } from "react-redux";

// const SubmittedAssignments = ({ studentId, setViewModal }) => {
//   // Get assignments from Redux store
//   const { assignments } = useSelector((state) => state.assignments);

//   const getSubmission = (a) =>
//     a.submissions?.find(
//       (s) =>
//         s?.student === studentId ||
//         (s?.student === null && s.status === "submitted")
//     );

//   const submitted = assignments.filter((a) => {
//     const s = getSubmission(a);
//     return s && (s.status === "submitted" || s.status === "checked");
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {submitted.map((assignment) => {
//         const submission = getSubmission(assignment);

//         return (
//           <div key={assignment._id} className="p-6 bg-white shadow rounded-xl">
//             <h2 className="text-xl font-semibold">{assignment.title}</h2>
//             <p className="text-gray-600 mb-4">{assignment.description}</p>

//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               onClick={() =>
//                 setViewModal({ assignment, submission })
//               }
//             >
//               View
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SubmittedAssignments;


import { useSelector } from "react-redux";
import { useMemo } from "react";

const SubmittedAssignments = ({ studentId, setViewModal }) => {
  const { assignments } = useSelector((state) => state.assignments);

  // Helper to get a student's submission for an assignment
  const getSubmission = (assignment) =>
    assignment.submissions?.find((s) => s.student === studentId) || null;

  // Memoize filtered submitted assignments for performance
  const submitted = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = getSubmission(assignment);
      return submission && submission.status === "check"; // Only show "check"
    });
  }, [assignments, studentId]);

  if (!submitted.length)
    return <div className="text-gray-500">No submitted assignments yet.</div>;

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //     {submitted.map((assignment) => {
  //       const submission = getSubmission(assignment);

  //       return (
  //         <div key={assignment._id} className="p-6 bg-white shadow rounded-xl">
  //           <h2 className="text-xl font-semibold">{assignment.title}</h2>
  //           <p className="text-gray-600 mb-4">{assignment.description}</p>

  //           <button
  //             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
  //             onClick={() => setViewModal({ assignment, submission })}
  //           >
  //             View
  //           </button>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
    {submitted.map((assignment) => {
      const submission = getSubmission(assignment);

      return (
        <div
          key={assignment._id}
          className="relative p-6 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg border-3 border-sky-700 hover:shadow-2xl transition-all duration-300"
        >
          {/* Tag */}
          <span className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
            Under Review
          </span>

          {/* Assignment Info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{assignment.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{assignment.description}</p>

          {/* View Button */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-colors duration-300"
            onClick={() => setViewModal({ assignment, submission })}
          >
            View
          </button>
        </div>
      );
    })}
  </div>
);

};

export default SubmittedAssignments;
