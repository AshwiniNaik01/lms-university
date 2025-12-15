import { useState, useEffect } from "react";
import { FaComments, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import Cookies from "js-cookie";
import apiClient from "../../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FeedbackTab = () => {
  const location = useLocation();
  const { batch, feedback } = location.state || {};
  const navigate = useNavigate();

  const feedbackForm = feedback || batch?.feedbacks?.[0];
  const questions = feedbackForm?.questions.map((q) => q.question) || [];
  const npsQuestion = feedbackForm?.nps?.question;

  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [courseId, setCourseId] = useState(null);

  const emojiToValue = {
    "Strongly Agree": 5,
    Agree: 4,
    "Can't Say": 3,
    Disagree: 1,
  };

  const emojiToEnum = {
    "Strongly Agree": "strongly_agree",
    Agree: "agree",
    "Can't Say": "cant_say",
    Disagree: "disagree",
  };

  // Fetch studentId and courseId from cookies
  useEffect(() => {
    setStudentId(Cookies.get("studentId") || Cookies.get("userId"));
    setCourseId(Cookies.get("courseId") || batch?.courseId);
  }, [batch]);

  const handleEmojiRate = (question, label) => {
    const numeric = emojiToValue[label];
    setResponses((prev) => ({ ...prev, [question]: numeric }));
  };

  const handleNumericRate = (question, value) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const totalQuestions = questions.length + (npsQuestion ? 1 : 0);
  const answeredCount = Object.keys(responses).length;
  const progressPercentage =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const submitFeedback = async () => {
    if (!feedbackForm || !studentId || !courseId) return;

    setError("");

    const formattedQuestions = feedbackForm.questions.map((q) => {
      const selectedValue = Object.keys(emojiToValue).find(
        (key) => emojiToValue[key] === responses[q.question]
      );
      return {
        question: q.question,
        answer: emojiToEnum[selectedValue] || "cant_say",
      };
    });

    const npsScore = responses[npsQuestion] ?? null;

    const payload = {
      courseId,
      batchId: batch._id,
      studentId,
      questions: formattedQuestions,
      npsScore,
    };

    try {
      // await apiClient.post(`/api/feedback`, payload);
      // setSubmitted(true);

      await apiClient.post(`/api/feedback`, payload);

setSubmitted(true);

Swal.fire({
  icon: "success",
  title: "Thank You! 🎉",
  text: "Your feedback has been submitted successfully.",
  confirmButtonText: "OK",
}).then(() => {
  navigate(-1);
});

    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border p-6 mb-6">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition mb-4"
>
  ← Back
</button>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg">
            <FaComments className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch Feedback</h1>
            <p className="text-gray-600 text-lg mt-1">
              Share your experience for <strong>{batch?.batchName}</strong>
            </p>
          </div>
        </div>
        {/* <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm mt-1">{progressPercentage}% completed</p> */}
      </div>

      {/* Feedback Questions */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-100">
          <h2 className="text-2xl font-bold text-gray-900">Your Feedback</h2>
          <p className="text-gray-600">Answer {totalQuestions} questions</p>
        </div>

        <div className="p-6 space-y-6">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div
                key={index}
                className="border p-5 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  {index + 1}. {q}
                </p>

                {/* Emoji Rating */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      label: "Strongly Agree",
                      color: "from-emerald-400 to-emerald-500",
                      emoji: "😊",
                      bg: "bg-emerald-50",
                      text: "text-emerald-700",
                    },
                    {
                      label: "Agree",
                      color: "from-blue-400 to-blue-500",
                      emoji: "👍",
                      bg: "bg-blue-50",
                      text: "text-blue-700",
                    },
                    {
                      label: "Can't Say",
                      color: "from-amber-400 to-amber-500",
                      emoji: "😐",
                      bg: "bg-amber-50",
                      text: "text-amber-700",
                    },
                    {
                      label: "Disagree",
                      color: "from-red-400 to-red-500",
                      emoji: "👎",
                      bg: "bg-red-50",
                      text: "text-red-700",
                    },
                  ].map((option, oIdx) => (
                    <div
                      key={oIdx}
                      onClick={() => handleEmojiRate(q, option.label)}
                      className={`${option.bg} rounded-xl p-2 border transition-all duration-300 transform hover:scale-[1.03] cursor-pointer ${
                        responses[q] === emojiToValue[option.label]
                          ? "border-2 border-blue-600 shadow-lg"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl mb-2 shadow-lg`}
                        >
                          {option.emoji}
                        </div>
                        <span className={`font-semibold ${option.text}`}>{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Feedback Questions Available
              </h3>
              <p className="text-gray-500">Instructor will update the feedback form soon.</p>
            </div>
          )}

          {/* NPS Question */}
          {npsQuestion && (
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-xl border border-indigo-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Net Promoter Score</h3>
                  <p className="text-gray-600">Your honest feedback helps us improve</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-800 mb-6 mt-4">
                How likely are you to recommend this learning program to your colleagues?
              </p>

              <div className="flex justify-between relative">
                {[...Array(11).keys()].map((num) => {
                  const isFilled = responses[npsQuestion] >= num;
                  const bgColor = isFilled
                    ? num <= 6
                      ? "bg-gradient-to-b from-rose-500 to-rose-600"
                      : num <= 8
                      ? "bg-gradient-to-b from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-b from-emerald-500 to-emerald-600"
                    : "bg-gray-300";
                  const textColor = isFilled
                    ? num <= 6
                      ? "text-red-600"
                      : num <= 8
                      ? "text-yellow-600"
                      : "text-emerald-600"
                    : "text-gray-400";

                  return (
                    <div key={num} className="flex flex-col items-center relative">
                      <button
                        onClick={() => handleNumericRate(npsQuestion, num)}
                        className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg transition-all duration-300 cursor-pointer`}
                      >
                        {num}
                      </button>
                      <div className="text-center">
                        <span className={`text-sm font-semibold ${textColor}`}>{num}</span>
                        {num === 0 && <div className="text-xs text-gray-500 mt-1">Not likely</div>}
                        {num === 5 && <div className="text-xs text-gray-500 mt-1">Neutral</div>}
                        {num === 10 && <div className="text-xs text-gray-500 mt-1">Extremely likely</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          disabled={submitted || answeredCount < totalQuestions}
          onClick={submitFeedback}
          className={`px-8 py-3 rounded-xl text-white text-lg font-semibold transition-all shadow-lg flex items-center gap-2 mx-auto ${
            submitted
              ? "bg-green-600 cursor-default"
              : answeredCount === totalQuestions
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {submitted ? (
            <>
              <FaCheckCircle className="w-5 h-5" /> Feedback Submitted
            </>
          ) : (
            <>
              <FaPaperPlane className="w-5 h-5" /> Submit Feedback
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeedbackTab;
