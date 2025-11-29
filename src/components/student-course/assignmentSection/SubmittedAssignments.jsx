const SubmittedAssignments = ({ assignments, studentId, setViewModal }) => {
  const getSubmission = (a) =>
    a.submissions?.find(
      (s) =>
        s?.student === studentId ||
        (s?.student === null && s.status === "submitted")
    );

  const submitted = assignments.filter((a) => {
    const s = getSubmission(a);
    return s && (s.status === "submitted" || s.status === "checked");
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {submitted.map((assignment) => {
        const submission = getSubmission(assignment);

        return (
          <div key={assignment._id} className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold">{assignment.title}</h2>
            <p className="text-gray-600 mb-4">{assignment.description}</p>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() =>
                setViewModal({ assignment, submission })
              }
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
