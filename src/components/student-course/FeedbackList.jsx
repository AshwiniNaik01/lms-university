import { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // for navigation
import Cookies from "js-cookie";
import apiClient from "../../api/axiosConfig";

const FeedbackList = ({ batch }) => {
  const navigate = useNavigate();
   const { courseId } = useParams(); // ✅ FIX

  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(null);
  // const [courseId, setCourseId] = useState(null);

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
    // setCourseId(Cookies.get("courseId") || batch?.courseId);
  }, [batch?.courseId]);

  const handleEmojiRate = (question, label) => {
    const numeric = emojiToValue[label];
    setResponses((prev) => ({ ...prev, [question]: numeric }));
  };

  const handleNumericRate = (question, value) => {
    setResponses((prev) => ({ ...prev, [question]: value }));
  };

  const submitFeedback = async (feedbackForm) => {
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

    const npsScore = responses[feedbackForm.nps?.question] ?? null;

    const payload = {
      courseId,
      batchId: batch._id,
      studentId,
      questions: formattedQuestions,
      npsScore,
    };

    try {
      await apiClient.post(`/api/feedback`, payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg">
            <FaComments className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch Feedback</h1>
            <p className="text-gray-600 text-lg mt-1">
              Feedbacks for <strong>{batch?.batchName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Cards */}
      {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batch?.feedbacks?.length > 0 ? (
          batch.feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              onClick={() =>
                navigate(`/courses/${batch.courseId}/study/feedback/${feedback._id}`, {
                  state: { batch, feedback },
                })
              }
              className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg border hover:shadow-2xl transition-all"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {feedback.title || "Feedback Form"}
              </h2>
              <p className="text-gray-600 mb-4">{feedback.questions?.length || 0} Questions</p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <FaComments /> Give Feedback
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Feedback Available</h3>
            <p className="text-gray-500">Instructor will update feedback forms soon.</p>
          </div>
        )}
      </div> */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {batch?.feedbacks?.length > 0 ? (
    batch.feedbacks.map((feedback) => {
      const isDisabled = feedback.status === 1;

      return (
        <div
          key={feedback._id}
          onClick={() => {
            if (!isDisabled) {
              navigate(
                `/courses/${courseId}/study/feedback/${feedback._id}`,
                { state: { batch, feedback } }
              );
            }
          }}
          className={`p-6 rounded-2xl shadow-lg border transition-all
            ${
              isDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white cursor-pointer hover:shadow-2xl"
            }
          `}
        >
          <h2 className="text-xl font-bold mb-2">
            {feedback.title || "Feedback Form"}
          </h2>

          <p className="mb-4">
            {feedback.questions?.length || 0} Questions
          </p>

          <div
            className={`flex items-center gap-2 font-semibold
              ${isDisabled ? "text-gray-400" : "text-blue-600"}
            `}
          >
            <FaComments />
            {isDisabled ? "Feedback Submitted" : "Give Feedback"}
          </div>
        </div>
      );
    })
  ) : (
    <div className="col-span-full text-center py-16">
      <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">
        No Feedback Available
      </h3>
      <p className="text-gray-500">
        Instructor will update feedback forms soon.
      </p>
    </div>
  )}
</div>


      {/* Optional: Error / Success Messages */}
      {error && (
        <div className="mt-6 text-center text-red-500 font-semibold">{error}</div>
      )}
      {submitted && (
        <div className="mt-6 text-center text-green-600 font-semibold">
          Feedback submitted successfully!
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
