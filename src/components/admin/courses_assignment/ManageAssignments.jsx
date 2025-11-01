import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/axiosConfig';

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/assignments');
      if (res.data.success) {
        setAssignments(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch assignments');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEdit = (id) => navigate(`/admin/edit-assignment/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await apiClient.delete(`/api/assignments/${id}`);
      alert('Assignment deleted successfully!');
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading assignments...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Manage Assignments</h2>
          <button
            onClick={() => navigate('/admin/add-assignment')}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            + Add Assignment
          </button>
        </div>

        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-5 text-left">Title</th>
                  <th className="py-3 px-5 text-left">Chapter</th>
                  <th className="py-3 px-5 text-left">Deadline</th>
                  <th className="py-3 px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-5">{a.title}</td>
                    <td className="py-3 px-5">{a.chapter?.title || '-'}</td>
                    <td className="py-3 px-5">{a.deadline?.split('T')[0] || '-'}</td>
                    <td className="py-3 px-5 flex gap-2">
                      <button
                        onClick={() => handleEdit(a._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
