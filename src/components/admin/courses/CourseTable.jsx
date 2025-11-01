import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../contexts/AuthContext";
// import apiClient from "../../api/axiosConfig.js";
// import { useAuth } from "../../contexts/AuthContext.jsx";

const CourseTable = ({ onEdit }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ✅ for navigation
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

//   const fetchCourses = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await apiClient.get("/api/courses/all", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//      setCourses(res.data.data); // ✅ CORRECT — this extracts the array of courses

//     } catch (err) {
//       setError(
//         err.response?.data?.message || err.message || "Failed to load courses."
//       );
//     }
//     setLoading(false);
//   };

const fetchCourses = async () => {
  setLoading(true);
  try {
    const res = await apiClient.get("/api/courses/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Fetched courses:", res.data); // Debug

    const courseList = Array.isArray(res.data.data) ? res.data.data : [];
    setCourses(courseList);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch courses.");
  }
  setLoading(false);
};


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setDeletingId(id);
    try {
      await apiClient.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to delete course."
      );
    }
    setDeletingId(null);
  };

  if (loading)
    return <div className="text-center p-4 text-indigo-600">Loading...</div>;

  if (error)
    return (
      <div className="text-center p-4 text-red-600 font-semibold">{error}</div>
    );

  if (courses.length === 0)
    return (
      <div className="text-center p-4 text-gray-600 font-semibold">
        No courses found.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
         <button
          onClick={() => navigate("/admin/add-courses")} // ✅ Navigate to form
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Create New Course
        </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Instructor
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Active</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {courses.map((course) => (
            <tr key={course._id}>
              <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.instructor || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{course.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.isActive ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">

                <button
  onClick={() => navigate(`/admin/courses/edit/${course._id}`)} // 🔁 Navigate to edit form
  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
>
  Edit
</button>

                {/* <button
                  onClick={() => onEdit(course)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                >
                  Edit
                </button> */}
                <button
                  onClick={() => handleDelete(course._id)}
                  disabled={deletingId === course._id}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {deletingId === course._id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
