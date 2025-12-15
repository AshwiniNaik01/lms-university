import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Cards from "../components/Cards";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { VscOrganization } from "react-icons/vsc";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";

// const BASE_URL = import.meta.env.VITE_BASE_URL; // or process.env.REACT_APP_BASE_URL

const BatchTests = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await apiClient.get(`/api/tests/batch/${batchId}`);

        if (
          response.data.success &&
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setTests(response.data.data);
        } else {
          setTests([]); // No tests found
          Swal.fire({
            icon: "info",
            title: "No tests available",
            text: response.data.message || "No tests found for this batch",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching tests",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Failed to fetch tests. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [batchId]);

  if (loading) {
    return <div className="p-6">Loading tests...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🎓 Batch Assessments
      </h1>

      {tests.length === 0 && (
        <div className="p-6 text-center text-gray-500 text-lg">
          No tests available for this batch.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test._id}
            className="bg-white rounded-lg border-3 border-sky-800 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-blue-700 truncate">
                {test.title}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {test.testDuration?.minutes || 0} min
              </span>
            </div>

            {/* Card Body */}
            <div className="px-6 py-4 space-y-3">
              <p className="flex items-center gap-2 text-gray-600 text-sm">
                <MdOutlineQuiz className="text-blue-500 w-5 h-5" />
                Level: {test.testLevel}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm">
                <FaCheckCircle className="text-green-500 w-5 h-5" />
                Questions: {test.totalQuestions}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm">
                <FaClock className="text-yellow-500 w-5 h-5" />
                Passing Marks: {test.passingMarks}
              </p>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              {/* <span className="text-gray-400 text-sm">
                Created: {new Date(test.createdAt).toLocaleDateString()}
              </span> */}
              <button
                onClick={() => navigate(`/tests/${test._id}/students`)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <VscOrganization />
                View Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchTests;
