// import { useNavigate } from "react-router-dom";

// const ResultPopup = ({ result, onClose }) => {
//   const percentage = ((result.marks / result.totalMarks) * 100).toFixed(1);
//   const isPassed = result.marks >= result.passingMarks;
//    const navigate = useNavigate();

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">

//         {/* Header */}
//         <div className="text-center mb-4">
//           <h2 className="text-2xl font-bold text-blue-700">Test Result</h2>
//           <p className="text-gray-500 text-sm">Summary of your performance</p>
//         </div>

//         {/* Score */}
//         <div className="flex justify-center mb-4">
//           <div
//             className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold
//               ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
//             `}
//           >
//             {result.marks}/{result.totalMarks}
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-3 text-center mb-4">
//           <div className="bg-green-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Correct</p>
//             <p className="text-xl font-bold text-green-600">{result.correct}</p>
//           </div>
//           <div className="bg-red-50 p-3 rounded-lg">
//             <p className="text-sm text-gray-500">Wrong</p>
//             <p className="text-xl font-bold text-red-600">{result.wrong}</p>
//           </div>
//         </div>

//         {/* Percentage */}
//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Percentage</span>
//             <span>{percentage}%</span>
//           </div>
//           <div className="w-full bg-gray-200 h-2 rounded-full">
//             <div
//               className={`h-2 rounded-full ${isPassed ? "bg-green-500" : "bg-red-500"}`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>
//         </div>

//         {/* Status */}
//         <div
//           className={`text-center font-semibold mb-4
//             ${isPassed ? "text-green-700" : "text-red-600"}
//           `}
//         >
//           {isPassed ? "🎉 Congratulations! You Passed" : "📚 Keep Practicing!"}
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//             <button
//       onClick={() => navigate(-1)} // Go back to previous page
//       className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
//     >
//       Back to Tests
//     </button>

//           {/* <button
//             onClick={() => window.location.href = "/profile/test/?type=result"}
//             className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//           >
//             View Full Result
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPopup;


import { useNavigate } from "react-router-dom";

const ResultPopup = ({ result, onClose }) => {
  const navigate = useNavigate();
  if (!result) return null; // Prevent crashes

  const percentage = ((result.marks / result.totalMarks) * 100).toFixed(1);
  const isPassed = result.marks >= result.passingMarks;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Test Result</h2>
          <p className="text-gray-500 text-sm">Summary of your performance</p>
        </div>

        {/* Score */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold
              ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
            `}
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
            ${isPassed ? "text-green-700" : "text-red-600"}
          `}
        >
          {isPassed ? "🎉 Congratulations! You Passed" : "📚 Keep Practicing!"}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Back to Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
