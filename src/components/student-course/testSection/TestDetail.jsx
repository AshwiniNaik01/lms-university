import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import TestClock from "./TestClock";
import apiClient from "../../../api/axiosConfig";
import { useParams } from "react-router-dom";
import ResultPopup from "./ResultPopup";
import Swal from "sweetalert2";

const OPTIONS = ["A", "B", "C", "D"];

const TestDetail = ({ onBack = () => window.history.back(), baseurl }) => {
  const { testID } = useParams(); // ✅ fetch testID from URL
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [connectionLost, setConnectionLost] = useState(false);

  const progressIntervalRef = useRef(null);

  // Fetch studentId from cookies
  const studentId = Cookies.get("studentId");

  const totalDurationInSeconds = test?.testDuration
    ? test.testDuration.minutes * 60 + test.testDuration.seconds
    : 0;

  const secondsToDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
  };

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

          // Restore answers
          const restoredAnswers = data.questions.map(
            (q) => q.selectedOption || ""
          );
          setAnswers(restoredAnswers);

          // 🔥 Find first unattempted question
          const firstUnansweredIndex = data.questions.findIndex(
            (q) => !q.selectedOption
          );

          // If all answered, stay on last question
          setCurrentQuestion(
            firstUnansweredIndex !== -1
              ? firstUnansweredIndex
              : data.questions.length - 1
          );

          // Restore remaining time
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
    // if (submitted || !test) return;
    if (submitted || !test || connectionLost) return;

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
        // testDuration: test.testDuration,
        testDuration: secondsToDuration(timeLeft), // ✅ latest time
      });
    } catch (err) {
      console.error("Error updating answer:", err);
      // Trigger connection lost
      setConnectionLost(true);
      // console.error("Error updating answer:", err);
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

    exitFullscreen(); // Exit fullscreen when submitting
    try {
      const response = await apiClient.post(`/api/iqtest/submit`, {
        testID: test.testID,
        studentId,
        // testDuration: test.testDuration,
        testDuration: secondsToDuration(timeLeft), // ✅ latest time
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

  useEffect(() => {
    if (connectionLost) {
      exitFullscreen(); // Exit fullscreen on connection loss
      Swal.fire({
        icon: "error",
        title: "Connection Lost!",
        text: "Your connection to the server has been lost. The test will be closed.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Close Test",
      }).then(() => {
        onBack(); // Go back to test list or dashboard
      });
    }
  }, [connectionLost]);

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
    <div
      className={`flex flex-col w-screen min-h-screen p-4 space-y-4 bg-gray-100  ${
        connectionLost ? "pointer-events-none opacity-50" : ""
      }`}
    >
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
                      ${
                        submitted &&
                        (isCorrect
                          ? "bg-green-100 border-green-500"
                          : selected
                          ? "bg-red-100 border-red-500"
                          : "")
                      }
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

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
  //     {/* Top Navigation Bar */}
  //     <div className="max-w-7xl mx-auto mb-6">
  //       <div className="flex items-center justify-between">
  //         <button
  //           onClick={onBack}
  //           className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300"
  //         >
  //           <FaArrowLeft className="text-blue-600" />
  //           <span className="font-medium text-gray-700">Back to Tests</span>
  //         </button>
  //         <div className="text-center">
  //           <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  //             {test.title}
  //           </h1>
  //           <p className="text-gray-600 text-sm mt-1">Online Assessment</p>
  //         </div>
  //         <div className="w-32"></div> {/* Spacer for alignment */}
  //       </div>
  //     </div>

  //     {/* Main Content */}
  //     <div className="max-w-7xl mx-auto">
  //       {/* Test Header with Timer */}
  //       {!submitted && (
  //         <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.005] transition-transform duration-300">
  //           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
  //             <div className="flex-1">
  //               <div className="flex items-center gap-3 mb-2">
  //                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
  //                   <span className="text-xl">⏱️</span>
  //                 </div>
  //                 <div>
  //                   <h2 className="text-xl font-bold">Time Remaining</h2>
  //                   <p className="text-blue-100">
  //                     Complete before time runs out
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="mt-4">
  //                 <div className="flex items-center gap-6">
  //                   <div className="text-center">
  //                     <div className="text-4xl md:text-5xl font-bold tracking-tight">
  //                       {Math.floor(timeLeft / 60)}:
  //                       {String(timeLeft % 60).padStart(2, "0")}
  //                     </div>
  //                     <div className="text-sm text-blue-200 mt-1">MM:SS</div>
  //                   </div>

  //                   {/* Progress Bar */}
  //                   <div className="flex-1">
  //                     <div className="h-3 bg-white/20 rounded-full overflow-hidden">
  //                       <div
  //                         className={`h-full rounded-full transition-all duration-1000 ${
  //                           timeLeft > totalDurationInSeconds * 0.3
  //                             ? "bg-green-400"
  //                             : "bg-red-400"
  //                         }`}
  //                         style={{
  //                           width: `${
  //                             (timeLeft / (test.testDuration * 60)) * 100
  //                           }%`,
  //                         }}
  //                       ></div>
  //                     </div>
  //                     <div className="flex justify-between text-sm text-blue-200 mt-2">
  //                       <span>Started</span>
  //                       <span>Ends in {Math.floor(timeLeft / 60)} min</span>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="flex flex-col items-center gap-3">
  //               <button
  //                 onClick={submitTest}
  //                 className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
  //               >
  //                 Submit Test
  //               </button>
  //               <div className="flex items-center gap-2 text-sm">
  //                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
  //                 <span>Auto-save enabled</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Test Body */}
  //       <div className="flex flex-col lg:flex-row gap-6">
  //         {/* Question Panel */}
  //         <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden">
  //           {/* Question Header */}
  //           <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
  //             <div className="flex items-center justify-between mb-4">
  //               <div className="flex items-center gap-4">
  //                 <div className="relative">
  //                   <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
  //                     <span className="text-white text-xl font-bold">
  //                       {currentQuestion + 1}
  //                     </span>
  //                   </div>
  //                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center">
  //                     <span className="text-xs font-bold text-blue-700">Q</span>
  //                   </div>
  //                 </div>

  //                 <div>
  //                   <div className="flex items-center gap-2 mb-1">
  //                     <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
  //                       Chapter {currentQ.chapterNumber || "N/A"}
  //                     </span>
  //                     <span className="text-gray-500">•</span>
  //                     <span className="text-gray-600 text-sm">
  //                       Difficulty: Medium
  //                     </span>
  //                   </div>
  //                   <h3 className="text-lg font-bold text-gray-800">
  //                     {currentQ.chapterName || "General Question"}
  //                   </h3>
  //                 </div>
  //               </div>

  //               <div className="text-right">
  //                 <div className="text-sm text-gray-500">Marks</div>
  //                 <div className="text-xl font-bold text-blue-600">
  //                   +{currentQ.marks || 1}
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
  //               <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
  //                 {currentQ.question}
  //               </h2>
  //               {currentQ.questionImage && (
  //                 <div className="mt-4 max-w-md mx-auto">
  //                   <img
  //                     src={currentQ.questionImage}
  //                     alt="Question visual"
  //                     className="rounded-lg shadow-md"
  //                   />
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           {/* Options */}
  //           <div className="p-6">
  //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
  //               <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
  //                 ❓
  //               </span>
  //               Select the correct answer:
  //             </h3>

  //             <div className="space-y-3">
  //               {OPTIONS.map((opt) => {
  //                 const optionText = currentQ[`option${opt}`];
  //                 if (!optionText) return null;
  //                 const selected = answers[currentQuestion] === opt;
  //                 const isCorrect = submitted && opt === currentQ.correctAns;
  //                 const isWrong =
  //                   submitted && selected && opt !== currentQ.correctAns;

  //                 return (
  //                   <div
  //                     key={opt}
  //                     className={`relative rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer group
  //                     ${
  //                       selected
  //                         ? "border-blue-500 bg-blue-50"
  //                         : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
  //                     }
  //                     ${
  //                       submitted && isCorrect
  //                         ? "border-green-500 bg-green-50"
  //                         : ""
  //                     }
  //                     ${submitted && isWrong ? "border-red-500 bg-red-50" : ""}
  //                   `}
  //                     onClick={() => !submitted && handleOptionSelect(opt)}
  //                   >
  //                     {/* Option Letter Indicator */}
  //                     <div
  //                       className={`absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md
  //                     ${
  //                       selected
  //                         ? "bg-blue-600 text-white"
  //                         : "bg-gray-100 text-gray-700"
  //                     }
  //                     ${submitted && isCorrect ? "bg-green-600 text-white" : ""}
  //                     ${submitted && isWrong ? "bg-red-600 text-white" : ""}
  //                   `}
  //                     >
  //                       {opt}
  //                     </div>

  //                     <div className="ml-10">
  //                       <div className="flex items-center justify-between">
  //                         <div className="flex-1">
  //                           <p
  //                             className={`font-medium text-gray-800 ${
  //                               selected ? "text-blue-800" : ""
  //                             } ${
  //                               submitted && isCorrect ? "text-green-800" : ""
  //                             } ${submitted && isWrong ? "text-red-800" : ""}`}
  //                           >
  //                             {optionText}
  //                           </p>
  //                         </div>

  //                         {/* Status Indicators */}
  //                         {selected && !submitted && (
  //                           <div className="flex items-center gap-2">
  //                             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
  //                             <span className="text-sm text-blue-600 font-medium">
  //                               Selected
  //                             </span>
  //                           </div>
  //                         )}
  //                         {submitted && isCorrect && (
  //                           <div className="flex items-center gap-2">
  //                             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
  //                               <span className="text-green-600 font-bold">
  //                                 ✓
  //                               </span>
  //                             </div>
  //                             <span className="text-green-600 font-medium">
  //                               Correct
  //                             </span>
  //                           </div>
  //                         )}
  //                         {submitted && isWrong && (
  //                           <div className="flex items-center gap-2">
  //                             <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
  //                               <span className="text-red-600 font-bold">
  //                                 ✗
  //                               </span>
  //                             </div>
  //                             <span className="text-red-600 font-medium">
  //                               Incorrect
  //                             </span>
  //                           </div>
  //                         )}
  //                       </div>

  //                       {currentQ[`option${opt}Image`] && (
  //                         <div className="mt-3 max-w-xs">
  //                           <img
  //                             src={currentQ[`option${opt}Image`]}
  //                             alt={`Option ${opt} visual`}
  //                             className="rounded-lg border border-gray-200"
  //                           />
  //                         </div>
  //                       )}
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>

  //             {/* Navigation Controls */}
  //             <div className="mt-8 pt-6 border-t border-gray-200">
  //               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  //                 <button
  //                   onClick={handlePrevQuestion}
  //                   disabled={currentQuestion === 0}
  //                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
  //                     currentQuestion === 0
  //                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
  //                       : "bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-md"
  //                   }`}
  //                 >
  //                   <FaArrowLeft /> Previous Question
  //                 </button>

  //                 <div className="flex items-center gap-3">
  //                   <button
  //                     onClick={() => {
  //                       if (!answers[currentQuestion]) {
  //                         alert(
  //                           "Please select an option before marking for review"
  //                         );
  //                         return;
  //                       }
  //                       // Implement review marking logic
  //                     }}
  //                     className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
  //                   >
  //                     <span>📌</span> Mark for Review
  //                   </button>

  //                   <button
  //                     onClick={() =>
  //                       setCurrentQuestion((prev) => {
  //                         const nextUnanswered = test.questions.findIndex(
  //                           (q, idx) => !answers[idx] && idx > currentQuestion
  //                         );
  //                         return nextUnanswered !== -1 ? nextUnanswered : prev;
  //                       })
  //                     }
  //                     className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
  //                   >
  //                     <span>↷</span> Skip to Unanswered
  //                   </button>
  //                 </div>

  //                 {currentQuestion < test.questions.length - 1 ? (
  //                   <button
  //                     onClick={handleNextQuestion}
  //                     disabled={!answers[currentQuestion]}
  //                     className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
  //                       !answers[currentQuestion]
  //                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
  //                         : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
  //                     }`}
  //                   >
  //                     Save & Next <FaArrowRight />
  //                   </button>
  //                 ) : (
  //                   <button
  //                     onClick={submitTest}
  //                     disabled={!answers[currentQuestion]}
  //                     className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
  //                       !answers[currentQuestion]
  //                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
  //                         : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
  //                     }`}
  //                   >
  //                     Final Submit <FaCheckCircle />
  //                   </button>
  //                 )}
  //               </div>
  //             </div>

  //             {/* Test Submission Status */}
  //             {submitted && (
  //               <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border border-green-200">
  //                 <div className="flex items-center gap-3">
  //                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
  //                     <span className="text-2xl">✅</span>
  //                   </div>
  //                   <div>
  //                     <h4 className="font-bold text-green-800">
  //                       Test Submitted Successfully!
  //                     </h4>
  //                     <p className="text-green-600">
  //                       Results will be displayed shortly. You can now close
  //                       this window.
  //                     </p>
  //                   </div>
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //         </div>

  //         {/* Sidebar - Question Navigator */}
  //         <div className="lg:w-80 xl:w-96 bg-white rounded-2xl shadow-xl overflow-hidden">
  //           {/* Sidebar Header */}
  //           <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5">
  //             <div className="flex items-center gap-3 mb-2">
  //               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
  //                 <span className="text-xl">📋</span>
  //               </div>
  //               <div>
  //                 <h2 className="text-xl font-bold">Question Navigator</h2>
  //                 <p className="text-indigo-200 text-sm">
  //                   Click to jump between questions
  //                 </p>
  //               </div>
  //             </div>

  //             <div className="mt-4 grid grid-cols-3 gap-2">
  //               <div className="text-center bg-white/10 rounded-lg p-2">
  //                 <div className="text-2xl font-bold">
  //                   {Object.values(answers).filter((a) => a !== "").length}
  //                 </div>
  //                 <div className="text-xs text-indigo-200">Answered</div>
  //               </div>
  //               <div className="text-center bg-white/10 rounded-lg p-2">
  //                 <div className="text-2xl font-bold">
  //                   {Object.values(answers).filter((a) => a === "").length}
  //                 </div>
  //                 <div className="text-xs text-indigo-200">Unanswered</div>
  //               </div>
  //               <div className="text-center bg-white/10 rounded-lg p-2">
  //                 <div className="text-2xl font-bold">0</div>
  //                 <div className="text-xs text-indigo-200">Marked</div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Question Grid */}
  //           <div className="p-5">
  //             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
  //               <span className="text-blue-600">#</span> Question Numbers
  //             </h3>

  //             <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-3 mb-6">
  //               {test.questions.map((q, idx) => {
  //                 const attempted = answers[idx] !== "";
  //                 const isCurrent = idx === currentQuestion;

  //                 return (
  //                   <button
  //                     key={q._id}
  //                     onClick={() => setCurrentQuestion(idx)}
  //                     className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 ${
  //                       isCurrent
  //                         ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg ring-4 ring-blue-200"
  //                         : attempted
  //                         ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md"
  //                         : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
  //                     }`}
  //                   >
  //                     <span className="font-bold text-lg">{idx + 1}</span>
  //                     {isCurrent && (
  //                       <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-blue-500"></div>
  //                     )}
  //                     {attempted && !isCurrent && (
  //                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-emerald-500"></div>
  //                     )}
  //                   </button>
  //                 );
  //               })}
  //             </div>

  //             {/* Legend */}
  //             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
  //               <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
  //                 <span className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
  //                   📊
  //                 </span>
  //                 Status Legend
  //               </h4>
  //               <div className="space-y-3">
  //                 <div className="flex items-center justify-between">
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700"></div>
  //                     <span className="text-sm font-medium text-gray-700">
  //                       Current Question
  //                     </span>
  //                   </div>
  //                   <span className="text-xs font-bold text-blue-600">
  //                     Active
  //                   </span>
  //                 </div>
  //                 <div className="flex items-center justify-between">
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600"></div>
  //                     <span className="text-sm font-medium text-gray-700">
  //                       Answered
  //                     </span>
  //                   </div>
  //                   <span className="text-xs font-bold text-emerald-600">
  //                     Completed
  //                   </span>
  //                 </div>
  //                 <div className="flex items-center justify-between">
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300"></div>
  //                     <span className="text-sm font-medium text-gray-700">
  //                       Unanswered
  //                     </span>
  //                   </div>
  //                   <span className="text-xs font-bold text-gray-500">
  //                     Pending
  //                   </span>
  //                 </div>
  //                 <div className="flex items-center justify-between">
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500"></div>
  //                     <span className="text-sm font-medium text-gray-700">
  //                       Marked for Review
  //                     </span>
  //                   </div>
  //                   <span className="text-xs font-bold text-amber-600">
  //                     Review
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Test Summary */}
  //             <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
  //               <h4 className="font-bold text-gray-800 mb-3">Test Summary</h4>
  //               <div className="space-y-2">
  //                 <div className="flex justify-between text-sm">
  //                   <span className="text-gray-600">Total Questions</span>
  //                   <span className="font-bold text-gray-800">
  //                     {test.questions.length}
  //                   </span>
  //                 </div>
  //                 <div className="flex justify-between text-sm">
  //                   <span className="text-gray-600">Time Allotted</span>
  //                   <span className="font-bold text-gray-800">
  //                     {test.testDuration.minutes}:
  //                     {String(test.testDuration.seconds).padStart(2, "0")}
  //                   </span>

  //                   {/* <span className="font-bold text-gray-800">{test.testDuration} minutes</span> */}
  //                 </div>
  //                 <div className="flex justify-between text-sm">
  //                   <span className="text-gray-600">Total Marks</span>
  //                   <span className="font-bold text-gray-800">
  //                     {test.questions.reduce(
  //                       (sum, q) => sum + (q.marks || 1),
  //                       0
  //                     )}
  //                   </span>
  //                 </div>
  //                 <div className="pt-2 border-t border-blue-200">
  //                   <div className="flex justify-between font-bold">
  //                     <span className="text-gray-800">Progress</span>
  //                     <span className="text-blue-600">
  //                       {Math.round(
  //                         (Object.values(answers).filter((a) => a !== "")
  //                           .length /
  //                           test.questions.length) *
  //                           100
  //                       )}
  //                       %
  //                     </span>
  //                   </div>
  //                   <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
  //                     <div
  //                       className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
  //                       style={{
  //                         width: `${
  //                           (Object.values(answers).filter((a) => a !== "")
  //                             .length /
  //                             test.questions.length) *
  //                           100
  //                         }%`,
  //                       }}
  //                     ></div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Result Popup */}
  //     {showResultPopup && submitResult && (
  //       <ResultPopup
  //         result={submitResult}
  //         onClose={() => {
  //           setShowResultPopup(false);
  //           onBack();
  //         }}
  //       />
  //     )}
  //   </div>
  // );
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
