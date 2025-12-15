// import React, { useState } from "react";

// const TestsTab = ({ batch }) => {
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   // Updated: tests coming from batch.tests safely
//   const tests = batch?.tests || [];

//   if (!tests || tests.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No tests available for this batch.
//       </div>
//     );
//   }

//   // ------------------------
//   // START TEST
//   // ------------------------
//   const startTest = (test) => {
//     setSelectedTest(test);
//     setAnswers({});
//     setSubmitted(false);
//   };

//   // ------------------------
//   // SELECT ANSWER
//   // ------------------------
//   const handleAnswer = (questionId, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: selectedOption,
//     }));
//   };

//   // ------------------------
//   // SUBMIT TEST
//   // ------------------------
//   const submitTest = () => {
//     setSubmitted(true);
//   };

//   // ------------------------
//   // SHOW TEST LIST
//   // ------------------------
//   if (!selectedTest) {
//     return (
//       <div className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold text-gray-800">Available Tests</h2>

//         {tests.map((test) => (
//           <div
//             key={test._id}
//             className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
//           >
//             <div>
//               <h3 className="font-bold text-blue-700">{test.title}</h3>
//               <p className="text-sm text-gray-600">
//                 Level: {test.testLevel} • Questions: {test.totalQuestions}
//               </p>
//             </div>

//             <button
//               onClick={() => startTest(test)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Start Test
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // ------------------------
//   // SHOW TEST QUESTIONS
//   // ------------------------
//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setSelectedTest(null)}
//         className="mb-4 text-blue-600 underline"
//       >
//         ← Back to Tests
//       </button>

//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         {selectedTest.title}
//       </h2>

//       <p className="text-gray-600 mb-6">
//         Duration: {selectedTest.testDuration?.minutes || 0} min
//       </p>

//       <div className="space-y-6">
//         {selectedTest.questions.map((q, index) => {
//           const isCorrect = submitted && answers[q._id] === q.correctAns;

//           return (
//             <div
//               key={q._id}
//               className="p-4 border rounded-lg bg-white shadow"
//             >
//               <h3 className="font-semibold text-gray-800">
//                 {index + 1}. {q.question}
//               </h3>

//               <div className="mt-3 space-y-2">
//                 {["A", "B", "C", "D"].map((opt) => {
//                   const optionText = q[`option${opt}`];

//                   const selected = answers[q._id] === opt;

//                   return (
//                     <label
//                       key={opt}
//                       className={`flex items-center gap-2 p-2 border rounded cursor-pointer 
//                       ${selected ? "bg-blue-50 border-blue-500" : "bg-gray-50"}`}
//                     >
//                       <input
//                         type="radio"
//                         name={q._id}
//                         value={opt}
//                         checked={selected}
//                         disabled={submitted}
//                         onChange={() => handleAnswer(q._id, opt)}
//                       />
//                       <span>
//                         {opt}. {optionText}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>

//               {/* Show correctness after submission */}
//               {submitted && (
//                 <p
//                   className={`mt-2 font-semibold ${
//                     isCorrect ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {isCorrect
//                     ? `Correct (+${q.marks} marks)`
//                     : `Wrong (Correct: ${q.correctAns})`}
//                 </p>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {!submitted ? (
//         <button
//           onClick={submitTest}
//           className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           Submit Test
//         </button>
//       ) : (
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded">
//           <p className="text-lg font-semibold text-blue-700">Test submitted!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestsTab;

import React, { useState } from "react";
import TestDetail from "./testSection/TestDetail";
import TestList from "./testSection/TestList";

const TestsTab = ({ batch, studentId, baseurl }) => {
  const [selectedTestID, setSelectedTestID] = useState(null);
  const tests = batch?.tests || [];

  return selectedTestID ? (
    <TestDetail
      testID={selectedTestID}
      studentId={studentId}
      baseurl={baseurl}
      onBack={() => setSelectedTestID(null)}
    />
  ) : (
    <TestList
      tests={tests}
      onSelectTest={(test) => setSelectedTestID(test._id)} // Pass only the ID
    />
  );
};

export default TestsTab;

// import React, { useState } from "react";
// import TestDetail from "./testSection/TestDetail";
// import TestList from "./testSection/TestList";
// // import TestList from "./TestList";
// // import TestDetail from "./TestDetail";

// const TestsTab = ({ batch }) => {
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [selectedTestID, setSelectedTestID] = useState(null);
//   const tests = batch?.tests || [];

//   return selectedTest ? (
//     <TestDetail
//       test={selectedTest}
//       onBack={() => setSelectedTest(null)}
//     />
//   ) : (
//     <TestList
//       tests={tests}
//       onSelectTest={(test) => setSelectedTest(test)}
//     />
//   );
// };

// export default TestsTab;
