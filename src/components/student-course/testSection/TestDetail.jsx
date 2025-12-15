// import React, { useState, useEffect } from "react";
// import TestClock from "./TestClock";
// // import TestClock from "./TestClock";

// const TestDetail = ({ test, onBack }) => {
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState((test.testDuration?.minutes || 0) * 60 + (test.testDuration?.seconds || 0));

//   const handleAnswer = (questionId, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: selectedOption,
//     }));
//   };

//   const submitTest = () => {
//     setSubmitted(true);
//     // Auto close after 3 seconds
//     setTimeout(() => {
//       onBack();
//     }, 3000);
//   };

//   return (
//     <div className="p-6">
//       <button onClick={onBack} className="mb-4 text-blue-600 underline">
//         ← Back to Tests
//       </button>

//       {/* ------------------ Test Clock ------------------ */}
//       {!submitted && (
//         <TestClock
//           testDuration={test.testDuration}
//           title={test.title}
//           timeLeft={timeLeft}
//           setTimeLeft={setTimeLeft}
//           handleSubmit={submitTest}
//         />
//       )}

//       <div className="space-y-6 mt-6">
//         {test.questions.map((q, index) => {
//           const isCorrect = submitted && answers[q._id] === q.correctAns;

//           return (
//             <div key={q._id} className="p-4 border rounded-lg bg-white shadow">
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
//                       <span>{opt}. {optionText}</span>
//                     </label>
//                   );
//                 })}
//               </div>

//               {submitted && (
//                 <p
//                   className={`mt-2 font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}
//                 >
//                   {isCorrect ? `Correct (+${q.marks} marks)` : `Wrong (Correct: ${q.correctAns})`}
//                 </p>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {!submitted && (
//         <button
//           onClick={submitTest}
//           className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           Submit Test
//         </button>
//       )}

//       {submitted && (
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded">
//           <p className="text-lg font-semibold text-blue-700">
//             Test submitted! Closing shortly...
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestDetail;

import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import TestClock from "./TestClock";
import apiClient from "../../../api/axiosConfig";
import { useParams } from "react-router-dom";
import ResultPopup from "./ResultPopup";

const OPTIONS = ["A", "B", "C", "D"];

const TestDetail = ({  onBack, baseurl }) => {
    const { testID } = useParams(); // ✅ fetch testID from URL
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
const [submitResult, setSubmitResult] = useState(null);


  const progressIntervalRef = useRef(null);

  // Fetch studentId from cookies
  const studentId = Cookies.get("studentId");

  // Ensure studentId and testID exist before fetching
useEffect(() => {
  if (!studentId) return; // only wait for studentId

  const fetchQuestions = async () => {
    if (!testID) return; // safeguard

    try {
      const response = await apiClient.post(`/api/iqtest/questions`, {
        testID,
        studentId,
      });

      if (response.data.success) {
        const data = response.data.data;
        setTest(data);
        setAnswers(data.questions.map((q) => q.selectedOption || ""));
        const duration =
          (data.testDuration?.minutes || 0) * 60 +
          (data.testDuration?.seconds || 0);
        setTimeLeft(duration);
      }
    } catch (err) {
      console.error("Error fetching test questions:", err);
    }
  };

  fetchQuestions();
}, [studentId, testID, baseurl]);

useEffect(() => {
  console.log("studentId:", studentId, "testID:", testID);
}, [studentId, testID]);


  // Handle option select
  const handleOptionSelect = async (option) => {
    if (submitted || !test) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);

    const currentQ = test.questions[currentQuestion];

    try {
      await apiClient.put(`/api/iqtest/update-answer`, {
        iqTestId: test._id,
        studentId,
        testID: test.testID,
        questionId: currentQ._id,
        selectedOption: option,
        status: 1,
        testDuration: test.testDuration,
      });
    } catch (err) {
      console.error("Error updating answer:", err);
    }
  };

  // Navigation
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, test.questions.length - 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  // Submit Test
  // const submitTest = async () => {
  //   if (!test) return;
  //   setSubmitted(true);

  //   try {
  //     await apiClient.post(`/api/iqtest/submit`, {
  //       testID: test.testID,
  //       studentId,
  //       testDuration: test.testDuration,
  //     });
  //   } catch (err) {
  //     console.error("Error submitting test:", err);
  //   }

  //   setTimeout(() => {
  //     onBack();
  //   }, 3000);
  // };

  const submitTest = async () => {
  if (!test) return;

  setSubmitted(true);

  try {
    const response = await apiClient.post(`/api/iqtest/submit`, {
      testID: test.testID,
      studentId,
      testDuration: test.testDuration,
    });

    if (response.data?.success) {
      setSubmitResult(response.data.data);
      setShowResultPopup(true);
    }
  } catch (err) {
    console.error("Error submitting test:", err);
  }
};


  // Auto-submit if time runs out
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      submitTest();
    }
  }, [timeLeft, submitted]);

  // // Optional auto-save progress
  // useEffect(() => {
  //   if (submitted) return;

  //   const updateProgress = async () => {
  //     // Can add auto-save API call here
  //     if (!test) return;
  //     try {
  //       await apiClient.post(`/api/iqtest/auto-save`, {
  //         testID: test.testID,
  //         studentId,
  //         answers,
  //         currentQuestion,
  //       });
  //     } catch (err) {
  //       console.error("Error auto-saving progress:", err);
  //     }
  //   };

  //   progressIntervalRef.current = setInterval(updateProgress, 10000);

  //   return () => clearInterval(progressIntervalRef.current);
  // }, [currentQuestion, answers, submitted, test, studentId]);

  if (!test) return <p>Loading test...</p>;

  const currentQ = test.questions[currentQuestion];

  return (
    // <div className="flex flex-col w-full max-w-7xl mx-auto p-4 space-y-4">
    <div className="flex flex-col w-screen min-h-screen p-4 space-y-4 bg-gray-100">

      {/* <button
        onClick={onBack}
        className="text-blue-600 underline mb-2 self-start"
      >
        ← Back to Tests
      </button> */}

      {/* Test Clock */}
      {!submitted && (
        <div className="w-full bg-gray-100 p-3 md:p-4 shadow-lg rounded-xl mb-4 flex justify-between items-center">
          <TestClock
            testDuration={test.testDuration}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            title={test.title}
            handleSubmit={submitTest}
          />
        </div>
      )}

      {/* Main Question Area */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Question & Options */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          {/* Question Header */}
          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-2">
              <div className="bg-[#2C4167] text-white w-10 h-10 flex items-center justify-center text-xl font-bold rounded-sm">
                {currentQuestion + 1}
              </div>
              <div className="text-lg font-semibold">
                {currentQ.chapterName || "Chapter: N/A"}
              </div>
            </div>
            <h2 className="text-xl font-medium text-[#2C4167]">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {OPTIONS.map((opt) => {
              const optionText = currentQ[`option${opt}`];
              if (!optionText) return null;
              const selected = answers[currentQuestion] === opt;
              const isCorrect =
                submitted && answers[currentQuestion] === currentQ.correctAns;

              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer
                    ${selected ? "bg-blue-50 border-blue-500" : "bg-gray-50"}
                    ${submitted &&
                    (isCorrect
                      ? "bg-green-100 border-green-500"
                      : selected
                      ? "bg-red-100 border-red-500"
                      : "")}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ._id}`}
                    value={opt}
                    checked={selected}
                    disabled={submitted}
                    onChange={() => handleOptionSelect(opt)}
                  />
                  <span>
                    {opt}. {optionText}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevQuestion}
              className="flex items-center bg-white border border-[#2C4167] text-[#2C4167] px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>

            {currentQuestion < test.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className={`flex items-center px-4 py-2 rounded transition-colors
                  ${
                    answers[currentQuestion]
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
                disabled={!answers[currentQuestion]}
              >
                Save & Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={submitTest}
                className={`flex items-center px-4 py-2 rounded transition-colors
                  ${
                    answers[currentQuestion]
                      ? "bg-[#F7941D] text-white hover:bg-[#E88C19]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
                disabled={!answers[currentQuestion]}
              >
                Submit <FaCheckCircle className="ml-2" />
              </button>
            )}
          </div>

          {/* Submitted Info */}
          {submitted && (
            <p className="mt-4 text-blue-700 font-semibold">
              Test submitted! Closing shortly...
            </p>
          )}
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Questions</h2>
          <div className="flex flex-wrap gap-2">
            {test.questions.map((q, idx) => {
              const attempted = answers[idx] !== "";
              const isCurrent = idx === currentQuestion;

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 flex items-center justify-center border-2 rounded transition-all
                    ${
                      isCurrent
                        ? "bg-blue-500 text-white border-blue-700"
                        : attempted
                        ? "bg-cyan-800 text-white border-cyan-900"
                        : "bg-amber-400 text-black border-amber-600"
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-[#2C4167] mb-2">Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#2C4167] mr-2"></div>
                <span>Attempted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#3498DB] mr-2"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#E67E22] mr-2"></div>
                <span>Unattempted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResultPopup && submitResult && (
  <ResultPopup
    result={submitResult}
    onClose={() => {
      setShowResultPopup(false);
      onBack();
    }}
  />
)}

    </div>

    
  );
};

export default TestDetail;



// import React, { useState, useEffect, useRef } from "react";
// import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
// import TestClock from "./TestClock";
// import axios from "axios";
// import apiClient from "../../../api/axiosConfig";

// const OPTIONS = ["A", "B", "C", "D"];

// const TestDetail = ({ testID, studentId, onBack, baseurl }) => {
//   const [test, setTest] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [submitted, setSubmitted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);

//   const progressIntervalRef = useRef(null);

//   // Fetch questions from API
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await apiClient.post(`/api/iqtest/questions`, {
//           testID,
//           studentId,
//         });

//         if (response.data.success) {
//           setTest(response.data.data);
//           setAnswers(response.data.data.questions.map(q => q.selectedOption || ""));
//           const duration =
//             (response.data.data.testDuration?.minutes || 0) * 60 +
//             (response.data.data.testDuration?.seconds || 0);
//           setTimeLeft(duration);
//         }
//       } catch (err) {
//         console.error("Error fetching test questions:", err);
//       }
//     };

//     fetchQuestions();
//   }, [testID, studentId, baseurl]);

//   // Handle option select
//   const handleOptionSelect = async (option) => {
//     if (submitted) return;

//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = option;
//     setAnswers(newAnswers);

//     const currentQ = test.questions[currentQuestion];

//     // Call API to update answer
//     try {
//       await apiClient.post(`/api/iqtest/update-answer`, {
//         iqTestId: test._id,
//         studentId,
//         testID: test.testID,
//         questionId: currentQ._id,
//         selectedOption: option,
//         status: 1,
//         testDuration: test.testDuration,
//       });
//     } catch (err) {
//       console.error("Error updating answer:", err);
//     }
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestion((prev) => Math.min(prev + 1, test.questions.length - 1));
//   };

//   const handlePrevQuestion = () => {
//     setCurrentQuestion((prev) => Math.max(prev - 1, 0));
//   };

//   const submitTest = async () => {
//     setSubmitted(true);

//     try {
//       await apiClient.post(`/api/iqtest/submit`, {
//         testID: test.testID,
//         studentId,
//         testDuration: test.testDuration,
//       });
//     } catch (err) {
//       console.error("Error submitting test:", err);
//     }

//     setTimeout(() => {
//       onBack();
//     }, 3000);
//   };

//   // Auto submit if time runs out
//   useEffect(() => {
//     if (timeLeft === 0 && !submitted) {
//       submitTest();
//     }
//   }, [timeLeft, submitted]);

//   // Auto save progress (optional)
//   useEffect(() => {
//     if (submitted) return;

//     const updateProgress = () => {
//       // Optional: can add API call for auto-save
//     };

//     progressIntervalRef.current = setInterval(updateProgress, 10000);

//     return () => clearInterval(progressIntervalRef.current);
//   }, [currentQuestion, submitted]);

//   if (!test) return <p>Loading test...</p>;

//   const currentQ = test.questions[currentQuestion];

//   return (
//     <div className="flex flex-col w-full max-w-7xl mx-auto p-4 space-y-4">
//       <button
//         onClick={onBack}
//         className="text-blue-600 underline mb-2 self-start"
//       >
//         ← Back to Tests
//       </button>

//       {/* Test Clock */}
//       {!submitted && (
//         <div className="w-full bg-gray-100 p-3 md:p-4 shadow-lg rounded-xl mb-4 flex justify-between items-center">
//           <TestClock
//             testDuration={test.testDuration}
//             timeLeft={timeLeft}
//             setTimeLeft={setTimeLeft}
//             title={test.title}
//             handleSubmit={submitTest}
//           />
//         </div>
//       )}

//       {/* Main Question Area */}
//       <div className="flex flex-col lg:flex-row gap-4">
//         {/* Question & Options */}
//         <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
//           {/* Question Header */}
//           <div className="mb-4">
//             <div className="flex items-center space-x-4 mb-2">
//               <div className="bg-[#2C4167] text-white w-10 h-10 flex items-center justify-center text-xl font-bold rounded-sm">
//                 {currentQuestion + 1}
//               </div>
//               <div className="text-lg font-semibold">
//                 {currentQ.chapterName || "Chapter: N/A"}
//               </div>
//             </div>
//             <h2 className="text-xl font-medium text-[#2C4167]">
//               {currentQ.question}
//             </h2>
//           </div>

//           {/* Options */}
//           <div className="space-y-3">
//             {OPTIONS.map((opt) => {
//               const optionText = currentQ[`option${opt}`];
//               if (!optionText) return null;
//               const selected = answers[currentQuestion] === opt;
//               const isCorrect =
//                 submitted && answers[currentQuestion] === currentQ.correctAns;

//               return (
//                 <label
//                   key={opt}
//                   className={`flex items-center gap-2 p-2 border rounded cursor-pointer
//                     ${selected ? "bg-blue-50 border-blue-500" : "bg-gray-50"}
//                     ${submitted &&
//                     (isCorrect
//                       ? "bg-green-100 border-green-500"
//                       : selected
//                       ? "bg-red-100 border-red-500"
//                       : "")}
//                   `}
//                 >
//                   <input
//                     type="radio"
//                     name={`question-${currentQ._id}`}
//                     value={opt}
//                     checked={selected}
//                     disabled={submitted}
//                     onChange={() => handleOptionSelect(opt)}
//                   />
//                   <span>
//                     {opt}. {optionText}
//                   </span>
//                 </label>
//               );
//             })}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={handlePrevQuestion}
//               className="flex items-center bg-white border border-[#2C4167] text-[#2C4167] px-4 py-2 rounded hover:bg-gray-50 transition-colors"
//             >
//               <FaArrowLeft className="mr-2" /> Previous
//             </button>

//             {currentQuestion < test.questions.length - 1 ? (
//               <button
//                 onClick={handleNextQuestion}
//                 className={`flex items-center px-4 py-2 rounded transition-colors
//                   ${
//                     answers[currentQuestion]
//                       ? "bg-green-600 text-white hover:bg-green-700"
//                       : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   }
//                 `}
//                 disabled={!answers[currentQuestion]}
//               >
//                 Save & Next <FaArrowRight className="ml-2" />
//               </button>
//             ) : (
//               <button
//                 onClick={submitTest}
//                 className={`flex items-center px-4 py-2 rounded transition-colors
//                   ${
//                     answers[currentQuestion]
//                       ? "bg-[#F7941D] text-white hover:bg-[#E88C19]"
//                       : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   }
//                 `}
//                 disabled={!answers[currentQuestion]}
//               >
//                 Submit <FaCheckCircle className="ml-2" />
//               </button>
//             )}
//           </div>

//           {/* Submitted Info */}
//           {submitted && (
//             <p className="mt-4 text-blue-700 font-semibold">
//               Test submitted! Closing shortly...
//             </p>
//           )}
//         </div>

//         {/* Sidebar - Question Navigation */}
//         <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-bold mb-4">Questions</h2>
//           <div className="flex flex-wrap gap-2">
//             {test.questions.map((q, idx) => {
//               const attempted = answers[idx] !== "";
//               const isCurrent = idx === currentQuestion;

//               return (
//                 <button
//                   key={q._id}
//                   onClick={() => setCurrentQuestion(idx)}
//                   className={`w-8 h-8 flex items-center justify-center border-2 rounded transition-all
//                     ${
//                       isCurrent
//                         ? "bg-blue-500 text-white border-blue-700"
//                         : attempted
//                         ? "bg-cyan-800 text-white border-cyan-900"
//                         : "bg-amber-400 text-black border-amber-600"
//                     }
//                   `}
//                 >
//                   {idx + 1}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Legend */}
//           <div className="mt-6">
//             <h2 className="text-base font-bold text-[#2C4167] mb-2">Legend</h2>
//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#2C4167] mr-2"></div>
//                 <span>Attempted</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#3498DB] mr-2"></div>
//                 <span>Current</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#E67E22] mr-2"></div>
//                 <span>Unattempted</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestDetail;




// import React, { useState, useEffect, useRef } from "react";
// import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
// import TestClock from "./TestClock";

// const OPTIONS = ["A", "B", "C", "D"];

// const TestDetail = ({ test, onBack }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState(
//     test.questions.map(() => "")
//   );
//   const [submitted, setSubmitted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(
//     (test.testDuration?.minutes || 0) * 60 + (test.testDuration?.seconds || 0)
//   );

//   const progressIntervalRef = useRef(null);

//   const handleOptionSelect = (option) => {
//     if (submitted) return;
//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = option;
//     setAnswers(newAnswers);
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestion((prev) =>
//       Math.min(prev + 1, test.questions.length - 1)
//     );
//   };

//   const handlePrevQuestion = () => {
//     setCurrentQuestion((prev) => Math.max(prev - 1, 0));
//   };

//   const submitTest = () => {
//     setSubmitted(true);
//     setTimeout(() => {
//       onBack();
//     }, 3000);
//   };

//   useEffect(() => {
//     if (timeLeft === 0 && !submitted) {
//       submitTest();
//     }
//   }, [timeLeft]);

//   // Auto save progress (if needed for backend)
//   useEffect(() => {
//     if (submitted) return;

//     const updateProgress = () => {
//       // You could integrate API calls here for auto-saving
//     };

//     progressIntervalRef.current = setInterval(updateProgress, 10000);

//     return () => clearInterval(progressIntervalRef.current);
//   }, [currentQuestion, submitted]);

//   const currentQ = test.questions[currentQuestion];

//   return (
//     <div className="flex flex-col w-full max-w-7xl mx-auto p-4 space-y-4">
//       <button
//         onClick={onBack}
//         className="text-blue-600 underline mb-2 self-start"
//       >
//         ← Back to Tests
//       </button>

//       {/* Test Clock */}
//       {!submitted && (
//         <div className="w-full bg-gray-100 p-3 md:p-4 shadow-lg rounded-xl mb-4 flex justify-between items-center">
//           <TestClock
//             testDuration={test.testDuration}
//             timeLeft={timeLeft}
//             setTimeLeft={setTimeLeft}
//             title={test.title}
//             handleSubmit={submitTest}
//           />
//         </div>
//       )}

//       {/* Main Question Area */}
//       <div className="flex flex-col lg:flex-row gap-4">
//         {/* Question & Options */}
//         <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
//           {/* Question Header */}
//           <div className="mb-4">
//             <div className="flex items-center space-x-4 mb-2">
//               <div className="bg-[#2C4167] text-white w-10 h-10 flex items-center justify-center text-xl font-bold rounded-sm">
//                 {currentQuestion + 1}
//               </div>
//               <div className="text-lg font-semibold">
//                 {currentQ.chapterName || "Chapter: N/A"}
//               </div>
//             </div>
//             <h2 className="text-xl font-medium text-[#2C4167]">
//               {currentQ.question}
//             </h2>
//           </div>

//           {/* Options */}
//           <div className="space-y-3">
//             {OPTIONS.map((opt) => {
//               const optionText = currentQ[`option${opt}`];
//               if (!optionText) return null;
//               const selected = answers[currentQuestion] === opt;
//               const isCorrect = submitted && answers[currentQuestion] === currentQ.correctAns;

//               return (
//                 <label
//                   key={opt}
//                   className={`flex items-center gap-2 p-2 border rounded cursor-pointer
//                     ${selected ? "bg-blue-50 border-blue-500" : "bg-gray-50"}
//                     ${submitted && (isCorrect ? "bg-green-100 border-green-500" : (selected ? "bg-red-100 border-red-500" : ""))}
//                   `}
//                 >
//                   <input
//                     type="radio"
//                     name={`question-${currentQ._id}`}
//                     value={opt}
//                     checked={selected}
//                     disabled={submitted}
//                     onChange={() => handleOptionSelect(opt)}
//                   />
//                   <span>{opt}. {optionText}</span>
//                 </label>
//               );
//             })}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={handlePrevQuestion}
//               className="flex items-center bg-white border border-[#2C4167] text-[#2C4167] px-4 py-2 rounded hover:bg-gray-50 transition-colors"
//             >
//               <FaArrowLeft className="mr-2" /> Previous
//             </button>

//             {currentQuestion < test.questions.length - 1 ? (
//               <button
//                 onClick={handleNextQuestion}
//                 className={`flex items-center px-4 py-2 rounded transition-colors
//                   ${answers[currentQuestion] ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
//                 `}
//                 disabled={!answers[currentQuestion]}
//               >
//                 Save & Next <FaArrowRight className="ml-2" />
//               </button>
//             ) : (
//               <button
//                 onClick={submitTest}
//                 className={`flex items-center px-4 py-2 rounded transition-colors
//                   ${answers[currentQuestion] ? "bg-[#F7941D] text-white hover:bg-[#E88C19]" : "bg-gray-300 text-gray-600 cursor-not-allowed"}
//                 `}
//                 disabled={!answers[currentQuestion]}
//               >
//                 Submit <FaCheckCircle className="ml-2" />
//               </button>
//             )}
//           </div>

//           {/* Submitted Info */}
//           {submitted && (
//             <p className="mt-4 text-blue-700 font-semibold">
//               Test submitted! Closing shortly...
//             </p>
//           )}
//         </div>

//         {/* Sidebar - Question Navigation */}
//         <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-lg font-bold mb-4">Questions</h2>
//           <div className="flex flex-wrap gap-2">
//             {test.questions.map((q, idx) => {
//               const attempted = answers[idx] !== "";
//               const isCurrent = idx === currentQuestion;

//               return (
//                 <button
//                   key={q._id}
//                   onClick={() => setCurrentQuestion(idx)}
//                   className={`w-8 h-8 flex items-center justify-center border-2 rounded transition-all
//                     ${isCurrent ? "bg-blue-500 text-white border-blue-700" : attempted ? "bg-cyan-800 text-white border-cyan-900" : "bg-amber-400 text-black border-amber-600"}
//                   `}
//                 >
//                   {idx + 1}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Legend */}
//           <div className="mt-6">
//             <h2 className="text-base font-bold text-[#2C4167] mb-2">Legend</h2>
//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#2C4167] mr-2"></div>
//                 <span>Attempted</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#3498DB] mr-2"></div>
//                 <span>Current</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-[#E67E22] mr-2"></div>
//                 <span>Unattempted</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestDetail;
