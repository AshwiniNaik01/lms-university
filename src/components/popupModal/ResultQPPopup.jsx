import Modal from "./Modal";

const ResultQPPopup = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const {
    title,
    questions = [],
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    marksGained,
    totalMarks,
  } = result;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={`Question Paper – ${title}`}
      showCancel={true}
    >
      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="font-semibold text-blue-700">Questions</p>
          <p>{totalQuestions}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="font-semibold text-green-700">Correct</p>
          <p>{correctAnswers}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="font-semibold text-red-700">Wrong</p>
          <p>{wrongAnswers}</p>
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg text-center">
          <p className="font-semibold text-indigo-700">Score</p>
          <p>
            {marksGained} / {totalMarks}
          </p>
        </div>
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
                    className={`p-2 rounded-lg border mb-1 flex justify-between items-center
                      ${isCorrect ? "bg-green-50 border-green-500" : ""}
                      ${isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
                    `}
                  >
                    <div>
                      <span className="font-semibold mr-2">{opt}.</span>
                      {value}
                    </div>

                    <div className="text-sm font-semibold">
                      {isCorrect && (
                        <span className="text-green-600">✔ Correct</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="text-red-600">✖ Your Answer</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">
          No questions available
        </p>
      )}
    </Modal>
  );
};

export default ResultQPPopup;
