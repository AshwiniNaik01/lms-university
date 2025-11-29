import React from "react";

const GradedAssignments = ({ assignments, studentId, setViewModal }) => {
  // Filter only graded assignments
  const gradedAssignments = assignments.filter(
    (a) => a.submissions?.[0]?.status === "checked"
  );

  if (gradedAssignments.length === 0) {
    return <div className="text-gray-500">No graded assignments yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gradedAssignments.map((assignment) => {
        const submission = assignment.submissions[0]; // first submission
        return (
          <div
            key={assignment._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
            onClick={() => setViewModal({ assignment, submission })}
          >
            <h3 className="font-bold text-lg">{assignment.title}</h3>
            <p className="text-gray-500 text-sm mb-2">{assignment.description}</p>
            <p className="text-green-600 font-semibold">
              Score: {submission.score ?? "N/A"}
            </p>
            <p className="text-gray-700">Remarks: {submission.remarks}</p>
          </div>
        );
      })}
    </div>
  );
};

export default GradedAssignments;
