// import React from "react";
// import { useNavigate } from "react-router-dom";

// const TestList = ({ tests, onSelectTest }) => {

// const navigate = useNavigate();

//   if (!tests || tests.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No tests available for this batch.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">Available Tests</h2>

//       {tests.map((test) => (
//         <div
//           key={test._id}
//           className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
//         >
//           <div>
//             <h3 className="font-bold text-blue-700">{test.title}</h3>
//             <p className="text-sm text-gray-600">
//               Level: {test.testLevel} • Questions: {test.totalQuestions}
//             </p>
//           </div>

//           {/* <button
//             onClick={() => onSelectTest(test)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Start Test
//           </button> */}

 
// <button
//   onClick={() => navigate(`/test/${test._id}`)}
//   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// >
//   Start Test
// </button>

//         </div>
//       ))}
//     </div>
//   );
// };

// export default TestList;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { VscDebugStart } from "react-icons/vsc";
import ResultPopup from "./ResultPopup";
import ViewQPPopup from "./ViewQPPopup";
import ResultModal from "../../popupModal/ResultModal";

const TestList = ({ tests }) => {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
const [showQP, setShowQP] = useState(false);
const [selectedTest, setSelectedTest] = useState(null);


  if (!tests || tests.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tests available for this batch.
      </div>
    );
  }

  const handleStartTest = (test) => {
    Swal.fire({
      title: `Start ${test.title}?`,
      html: `
        <div class="text-left max-h-[60vh] overflow-y-auto">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            <h3 class="text-lg font-bold">Test Instructions</h3>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-blue-800 mb-2">General Guidelines:</h4>
            <ul class="space-y-2 list-disc pl-5 text-blue-700">
              <li>Total duration: ${test?.testDuration?.minutes || "N/A"} minutes</li>
              <li>Total questions: ${test.totalQuestions}</li>
              <li>Each question carries equal marks</li>
              <li>No negative marking</li>
            </ul>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-yellow-800 mb-2">During the Test:</h4>
            <ul class="space-y-2 list-disc pl-5 text-yellow-700">
              <li>Select the correct option for each question</li>
              <li>You can change answers before submission</li>
              <li>Do not refresh or close the browser</li>
              <li>Timer starts immediately</li>
            </ul>
          </div>

          <div class="flex items-start mt-4">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              class="w-5 h-5 mt-1 mr-2 cursor-pointer"
            />
            <label for="agreeTerms" class="text-gray-700 cursor-pointer">
              I have read and understood the instructions
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: `
        <span class="flex items-center gap-2">
          <VscDebugStart />
          Start Test
        </span>
      `,
      cancelButtonText: "Cancel",
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const checkbox = Swal.getPopup().querySelector("#agreeTerms");
        confirmBtn.disabled = true;

        checkbox.addEventListener("change", () => {
          confirmBtn.disabled = !checkbox.checked;
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/test/${test._id}`);
      }
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Assessment Zone
      </h2>

      {/* {tests.map((test) => (
        <div
          key={test._id}
          className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-blue-700">{test.title}</h3>
            <p className="text-sm text-gray-600">
              Level: {test.testLevel} • Questions: {test.totalQuestions}
            </p>
          </div>

          <button
            onClick={() => handleStartTest(test)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      ))} */}

      {tests.map((test) => (
  <div
    key={test._id}
    className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
  >
    <div>
      <h3 className="font-bold text-blue-700">{test.title}</h3>
      <p className="text-sm text-gray-600">
        Level: {test.testLevel} • Questions: {test.totalQuestions}
      </p>
    </div>

    {/* NOT ATTEMPTED */}
  {/* NOT ATTEMPTED */}
{test.attempted === 0 && (
  <button
    onClick={() => handleStartTest(test)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Start Test
  </button>
)}

{/* RESUME TEST */}
{test.attempted === -1 && test.iqtest?.status === -1 && (
  <button
    onClick={() => {
      // request fullscreen on user gesture
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(console.warn);
      }

      navigate(`/test/${test._id}`);
    }}
    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
  >
    Resume Test
  </button>
)}

{/* ATTEMPTED / COMPLETED */}
{test.attempted === 1 && (
  <div className="flex gap-2">
    <button
      onClick={() => {
        setSelectedTest(test);
        setShowResult(true);
      }}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      View Result
    </button>

    <button
      onClick={() => {
        setSelectedTest(test);
        setShowQP(true);
      }}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      View QP
    </button>
  </div>
)}

  </div>
))}

{/* {showResult && (
  <ResultPopup
    result={{
      totalQuestions: selectedTest.iqtest.totalQuestions,
      correct: selectedTest.iqtest.correctAnswers,
      wrong: selectedTest.iqtest.wrongAnswers,
      totalMarks: selectedTest.iqtest.totalMarks,
      marks: selectedTest.iqtest.marksGained,
      passingMarks: selectedTest.iqtest.passingMarks,
    }}
    onClose={() => setShowResult(false)}
  />
)} */}


{showResult && selectedTest && (
  <ResultModal
    isOpen={showResult}
    onClose={() => setShowResult(false)}
    result={{
      totalQuestions: selectedTest.iqtest.totalQuestions,
      correct: selectedTest.iqtest.correctAnswers,
      wrong: selectedTest.iqtest.wrongAnswers,
      totalMarks: selectedTest.iqtest.totalMarks,
      marks: selectedTest.iqtest.marksGained,
      passingMarks: selectedTest.iqtest.passingMarks,
    }}
  />
)}


{showQP && (
  <ViewQPPopup
    test={selectedTest}
    onClose={() => setShowQP(false)}
  />
)}


    </div>
  );
};

export default TestList;
