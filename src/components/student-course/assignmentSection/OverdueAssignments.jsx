const OverdueAssignments = ({ assignments, studentId }) => {
  const now = new Date();

  const overdue = assignments.filter((a) => {
    const submitted = a.submissions?.some((s) => s.student === studentId);
    return !submitted && new Date(a.deadline) < now;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {overdue.map((assignment) => (
        <div
          key={assignment._id}
          className="p-6 bg-gray-100 opacity-50 rounded-xl shadow"
        >
          <h2 className="text-xl font-semibold">{assignment.title}</h2>
          <p className="text-gray-600">{assignment.description}</p>

          <p className="text-red-500 font-bold mt-4">Overdue</p>
        </div>
      ))}
    </div>
  );
};

export default OverdueAssignments;
