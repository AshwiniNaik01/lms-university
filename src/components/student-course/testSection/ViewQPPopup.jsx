// const ViewQPPopup = ({ test, onClose }) => {
//   const attempted = test.attempted === 1;
//   const answeredMap = {};

//   if (attempted) {
//     test.iqtest.questions.forEach(q => {
//       answeredMap[q._id] = q.selectedOption;
//     });
//   }

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//       <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto">

//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">
//             Question Paper – {test.title}
//           </h2>
//           <button onClick={onClose} className="text-xl font-bold">✕</button>
//         </div>

//         {test.questions.map((q, index) => {
//           const selected = answeredMap[q._id];
//           const correct = q.correctAns;

//           return (
//             <div key={q._id} className="mb-6 border-b pb-4">
//               <p className="font-semibold mb-2">
//                 {index + 1}. {q.question}
//               </p>

//               {["A", "B", "C", "D"].map((opt) => {
//                 const value = q[`option${opt}`];
//                 const isCorrect = opt === correct;
//                 const isSelected = opt === selected;

//                 return (
//                   <div
//                     key={opt}
//                     className={`p-2 rounded-lg border mb-1
//                       ${isCorrect ? "bg-green-50 border-green-500" : ""}
//                       ${isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
//                     `}
//                   >
//                     <span className="font-semibold mr-2">{opt}.</span>
//                     {value}

//                     {attempted && isCorrect && (
//                       <span className="ml-2 text-green-600 font-semibold">
//                         ✔ Correct
//                       </span>
//                     )}

//                     {attempted && isSelected && !isCorrect && (
//                       <span className="ml-2 text-red-600 font-semibold">
//                         ✖ Your Answer
//                       </span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
// export default ViewQPPopup;

const ViewQPPopup = ({ test = {}, onClose }) => {
  const attempted = test.attempted === 1;

  // ✅ pick correct source
  const questions = attempted
    ? test.iqtest?.questions || []
    : test.questions || [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Question Paper – {test.title || "Test"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">✕</button>
        </div>

        {/* Questions */}
        {questions.length > 0 ? (
          questions.map((q, index) => {
            const selected = q.selectedOption;
            const correct = q.correctAns;

            return (
              <div key={q._id} className="mb-6 border-b pb-4">
                <p className="font-semibold mb-2">
                  {index + 1}. {q.question}
                </p>

                {["A", "B", "C", "D"].map((opt) => {
                  const value = q[`option${opt}`];
                  const isCorrect = opt === correct;
                  const isSelected = opt === selected;

                  return (
                    <div
                      key={opt}
                      className={`p-2 rounded-lg border mb-1
                        ${attempted && isCorrect ? "bg-green-50 border-green-500" : ""}
                        ${attempted && isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
                      `}
                    >
                      <span className="font-semibold mr-2">{opt}.</span>
                      {value}

                      {attempted && isCorrect && (
                        <span className="ml-2 text-green-600 font-semibold">
                          ✔ Correct
                        </span>
                      )}

                      {attempted && isSelected && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">
                          ✖ Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No questions available</p>
        )}
      </div>
    </div>
  );
};

export default ViewQPPopup;
