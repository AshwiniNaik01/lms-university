import { FaCheck, FaTimes } from "react-icons/fa";
import Modal from "./Modal";
// import Modal from "./Modal"; // your reusable Modal

const ResultModal = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const percentage = ((result.marks / result.totalMarks) * 100).toFixed(1);
  const isPassed = result.marks >= result.passingMarks;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Test Result"
      showCancel={false} // we’ll use a custom button below
      primaryAction={{
        label: "Close",
        onClick: onClose,
      }}
    >
      {/* Score */}
      <div className="flex justify-center mb-6 mt-2">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold
            ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {result.marks}/{result.totalMarks}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-center mb-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Correct</p>
          <p className="text-xl font-bold text-green-600">{result.correct}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Wrong</p>
          <p className="text-xl font-bold text-red-600">{result.wrong}</p>
        </div>
      </div>

      {/* Percentage */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Percentage</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${isPassed ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div
        className={`text-center font-semibold mb-4
          ${isPassed ? "text-green-700" : "text-red-600"}`}
      >
        {isPassed ? "🎉 Congratulations! You Passed" : "📚 Keep Practicing!"}
      </div>
    </Modal>
  );
};

export default ResultModal;
