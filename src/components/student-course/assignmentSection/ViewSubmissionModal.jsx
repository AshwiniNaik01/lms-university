// ViewSubmissionModal.jsx
const ViewSubmissionModal = ({ assignment, submission, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{assignment.title} - Submission</h2>
          <button onClick={onClose}>X</button>
        </div>

        <p className="mb-2">{assignment.description}</p>
        <p className="text-gray-500 mb-4">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>

        {submission.files?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Files:</h3>
            <ul>
              {submission.files.map((file, idx) => (
                <li key={idx}>
                  <a href={file} target="_blank" className="text-blue-500 underline">{file}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mb-4">Remarks: {submission.remarks}</p>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewSubmissionModal;
