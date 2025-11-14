import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";

const ViewTestQuestions = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (testId) {
      fetchTestQuestions(testId);
    }
  }, [testId]);

  const fetchTestQuestions = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/tests/questions/${id}`);
      console.log("Test Questions:", response.data);

      if (response.data.success && response.data.data) {
        setTest(response.data.data);
      } else {
        setError("No test found.");
        Swal.fire({
          icon: "warning",
          title: "No Tests Available",
          text: "We couldn't find any tests. Please try again later.",
          confirmButtonColor: "#f0ad4e",
        });
      }
    } catch (err) {
      console.error("Error fetching test questions:", err);

      const errorMessage =
        err.response?.data?.message || "Failed to fetch test questions";

      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Failed Fetching Test Questions",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 py-4 px-8 shadow-lg z-20 mb-6">
        <h3 className="text-4xl font-bold text-center text-white tracking-wide leading-tight transition-transform transform hover:scale-110 font-poppins">
          📋 {test?.title || "Test Questions"}
        </h3>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-blue-100 to-purple-100 shadow-xl rounded-lg">
        {loading && <p className="text-blue-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {test?.questions?.length > 0 ? (
          test.questions.map((q, index) => (
            <div
              key={q._id}
              className="mb-4 p-6 bg-white border-l-8 border-blue-500 shadow-md rounded-lg"
            >
              {/* Question Text */}
              <p className="text-lg font-semibold text-gray-900">
                {index + 1}. {q.question}
              </p>

              {q.chapterName && (
                <div className="text-md text-black italic text-right">
                  Chapter: {q.chapterName}
                </div>
              )}

              {/* Options */}
              <div className="mt-3 space-y-2">
                {["optionA", "optionB", "optionC", "optionD"].map((key, i) => {
                  const optionValue = q[key];
                  const optionLetter = String.fromCharCode(65 + i);
                  const isCorrect =
                    q.correctAns === optionLetter ||
                    q.correctAns === optionValue;

                  return (
                    <p
                      key={i}
                      className={`ml-6 p-2 border rounded-md cursor-pointer transition-all duration-300 
                        ${
                          isCorrect
                            ? "bg-green-300 font-bold text-green-900"
                            : "bg-gray-100"
                        }`}
                    >
                      {optionLetter}. {optionValue}
                    </p>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No questions available</p>
        )}
      </div>
    </div>
  );
};

export default ViewTestQuestions;
