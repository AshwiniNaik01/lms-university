import React, { useRef } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";

const ViewQPPopup = ({ test = {}, onClose }) => {
  const attempted = test.attempted === 1;

  const questions = attempted
    ? test.iqtest?.questions || []
    : test.questions || [];

  const popupRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const elem = popupRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div
        ref={popupRef}
        className={`bg-white w-full max-w-3xl rounded-xl p-6 max-h-[85vh] overflow-y-auto transition-all`}
        style={isFullscreen ? { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", borderRadius: 0 } : {}}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Question Paper – {test.title || "Test"}
          </h2>

          <div className="flex items-center gap-3">
            {/* Fullscreen / maximize button */}
            <button
              onClick={toggleFullscreen}
              className="text-xl text-gray-700 hover:text-gray-900"
              title={isFullscreen ? "Exit Fullscreen" : "Maximize"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>

            {/* Close button */}
            <button onClick={onClose} className="text-xl font-bold">
              ✕
            </button>
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
                      className={`p-2 rounded-lg border mb-1
                        ${attempted && isCorrect ? "bg-green-50 border-green-500" : ""}
                        ${attempted && isSelected && !isCorrect ? "bg-red-50 border-red-500" : ""}
                      `}
                    >
                      <span className="font-semibold mr-2">{opt}.</span>
                      {value}

                      {attempted && isCorrect && (
                        <span className="ml-2 text-green-600 font-semibold">✔ Correct</span>
                      )}

                      {attempted && isSelected && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">✖ Your Answer</span>
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
