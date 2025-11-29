const UnsubmittedAssignments = ({ assignments, studentId, setSubmitModal }) => {
  const unsubmitted = assignments.filter((a) => {
    const submitted = a.submissions?.some((s) => s.student === studentId);
    const overdue = new Date(a.deadline) < new Date();
    return !submitted && !overdue;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {unsubmitted.map((assignment) => (
        <div key={assignment._id} className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold">{assignment.title}</h2>
          <p className="text-gray-600 mb-4">{assignment.description}</p>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setSubmitModal(assignment)}
          >
            Submit
          </button>
        </div>
      ))}
    </div>
  );
};

export default UnsubmittedAssignments;
