// ========================== NOT USED TILL NOW ==============================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import apiClient from '../api/axiosConfig.js';
import apiClient from "../../api/axiosConfig";

const TestManagementPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/tests");
      setTests(response.data.data || []); // ✅ access inner 'data'
    } catch (err) {
      setError("Failed to fetch tests. Please try again later.");
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    // --- YEAH MESSAGE ENGLISH MEIN KAR DIYA GAYA HAI ---
    // if (window.confirm('Are you sure you want to delete this test?')) {

    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to delete this test?")
    ) {
      try {
        await apiClient.delete(`/api/tests/${id}`);
        setTests(tests.filter((test) => test._id !== id));
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete the test.";
        setError(errorMessage);
        console.error(`Error deleting test with id ${id}:`, err);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🧪 Test Management</h1>
        <Link
          to="/admin/tests/create"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:from-indigo-600 hover:to-purple-700 transition"
        >
          ➕ Create New Test
        </Link>
      </div>

      {loading && (
        <div className="text-center text-blue-600 font-medium animate-pulse">
          Loading tests...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded shadow">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase text-sm tracking-wider">
              <tr>
                <th className="px-6 py-4">📘 Title</th>
                <th className="px-6 py-4">🎓 Course</th>
                <th className="px-6 py-4">🏫 Branch</th>
                <th className="px-6 py-4">❓ Questions</th>
                <th className="px-6 py-4 text-center">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {test.title}
                    </td>
                    <td className="px-6 py-4">{test.course?.title || "N/A"}</td>
                    <td className="px-6 py-4">{test.branch?.name || "N/A"}</td>
                    <td className="px-6 py-4">{test.questions?.length || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(test._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-6 py-6 text-gray-500"
                  >
                    No tests found. Click <strong>"Create New Test"</strong> to
                    add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestManagementPage;
