// const UnsubmittedAssignments = ({ assignments, studentId, setSubmitModal }) => {
//   const unsubmitted = assignments.filter((a) => {
//     const submission = a.submissions?.find(
//       (s) => s.student === studentId
//     );

//     // Always show when no submission exists (even if overdue)
//     if (!submission) return true;

//     // Submission exists but marked unsubmitted → this is a resubmit, not unsubmitted
//     if (submission.status === "unsubmitted") return false;

//     return false;
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {unsubmitted.map((assignment) => {
//         const overdue = new Date(assignment.deadline) < new Date();
//         const isDisabled = overdue;

//         return (
//           <div
//             key={assignment._id}
//             className={`p-6 shadow rounded-xl 
//               ${isDisabled ? "bg-gray-200 opacity-60 cursor-not-allowed" : "bg-white"}`}
//           >
//             <h2 className="text-xl font-semibold">{assignment.title}</h2>
//             <p className="text-gray-600 mb-4">{assignment.description}</p>

//             <button
//               className={`px-4 py-2 rounded-lg text-white 
//                 ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"}`}
//               disabled={isDisabled}
//               onClick={() => !isDisabled && setSubmitModal(assignment)}
//             >
//               {isDisabled ? "Deadline Passed" : "Submit"}
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default UnsubmittedAssignments;


import { useSelector } from "react-redux";
import { useMemo } from "react";

const UnsubmittedAssignments = ({ studentId, setSubmitModal }) => {
  const { assignments } = useSelector((state) => state.assignments);

  // Memoize filtered unsubmitted assignments
  const unsubmitted = useMemo(() => {
    return assignments.filter((assignment) => {
      const submission = assignment.submissions?.find(
        (s) => s.student === studentId
      );

      // Always show when no submission exists
      if (!submission) return true;

      // Submission exists but marked unsubmitted → show for resubmission
      if (submission.status === "unsubmitted") return true;

      return false;
    });
  }, [assignments, studentId]);

  if (!unsubmitted.length)
    return <div className="text-gray-500">No unsubmitted assignments.</div>;

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //     {unsubmitted.map((assignment) => {
  //       const overdue = new Date(assignment.deadline) < new Date();
  //       const isDisabled = overdue;

  //       return (
  //         <div
  //           key={assignment._id}
  //           className={`p-6 shadow rounded-xl ${
  //             isDisabled ? "bg-gray-200 opacity-60 cursor-not-allowed" : "bg-white"
  //           }`}
  //         >
  //           <h2 className="text-xl font-semibold">{assignment.title}</h2>
  //           <p className="text-gray-600 mb-4">{assignment.description}</p>

  //           <button
  //             className={`px-4 py-2 rounded-lg text-white ${
  //               isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
  //             }`}
  //             disabled={isDisabled}
  //             onClick={() => !isDisabled && setSubmitModal(assignment)}
  //           >
  //             {isDisabled ? "Deadline Passed" : "Submit"}
  //           </button>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
    {unsubmitted.map((assignment) => {
      const overdue = new Date(assignment.deadline) < new Date();
      const isDisabled = overdue;

      // Determine status tag
      const statusTag = overdue
        ? { text: "Overdue", bg: "bg-red-500" }
        : { text: "Not Started", bg: "bg-purple-500" };

      return (
        <div
          key={assignment._id}
          className={`relative p-6 rounded-lg shadow-lg transition-all border-3 border-sky-800 duration-300 ${
            isDisabled ? "bg-gray-200 opacity-70 cursor-not-allowed" : "bg-white hover:shadow-2xl"
          }`}
        >
          {/* Status Tag */}
          <span
            className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide shadow-md ${statusTag.bg}`}
          >
            {statusTag.text}
          </span>

          {/* Assignment Info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{assignment.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{assignment.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Deadline: {new Date(assignment.deadline).toLocaleDateString()}
          </p>

          {/* Submit Button */}
          <button
            className={`px-5 py-2 rounded-xl font-semibold text-white shadow-md transition-colors duration-300 ${
              isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isDisabled}
            onClick={() => !isDisabled && setSubmitModal(assignment)}
          >
            {isDisabled ? "Deadline Passed" : "Submit"}
          </button>
        </div>
      );
    })}
  </div>
);

};

export default UnsubmittedAssignments;
