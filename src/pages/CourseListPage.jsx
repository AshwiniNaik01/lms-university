import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchBranches } from "../api/branches.js";
import { fetchCourses } from "../api/courses.js";
import { fetchMyEnrollments } from "../api/enrollments.js";
import { useAuth } from "../contexts/AuthContext.jsx";

//  Custom hook to parse query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * CourseListPage Component
 * =============================================================================================
 * Displays a list of courses
 */

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();
  const { isAuthenticated, currentUser, token } = useAuth();
  const initialBranchId = query.get("branchId");

  /**
   * Load initial data when component mounts or dependencies change:
   * - Fetch courses for all
   * - Fetch enrollments for current authenticated student
   */

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch available branches for the filter UI
        const branchesData = await fetchBranches();
        setBranches(branchesData || []);

        // Fetch courses; optionally filtered by branch ID
        const coursesResponse = await fetchCourses(initialBranchId);
        setCourses(coursesResponse?.data || coursesResponse || []);

        // If user is authenticated student, load their enrolled courses to disable enroll button
        if (isAuthenticated && currentUser?.user?.role === "student" && token) {
          const enrollmentsData = await fetchMyEnrollments(token);
          // Store enrolled course IDs in a Set for efficient lookups
          const ids = new Set(enrollmentsData.map((e) => e.course._id));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        setError("Failed to load course data. Please try again later.");
        console.error("Error loading course list data:", err);
      }
      setLoading(false);
    };

    loadInitialData();
  }, [initialBranchId, isAuthenticated, currentUser, token]);

  console.log("Token from course list page ", token);

  //  Handler for successful enrollment
  const handleEnrollSuccess = (enrolledCourseId) => {
    setEnrolledCourseIds((prevIds) => new Set([...prevIds, enrolledCourseId]));
  };

  // Early return to display error message if data loading fails
  if (error) {
    return <p className="text-center text-red-500 mt-6 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-indigo-200 via-purple-100 to-blue-200 pt-[100px] px-6 pb-16">
      {/* Fixed Header with Title and Filter */}
      <div className="fixed top-17 left-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-indigo-200 shadow-md px-6 py-4 md:px-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          {/* Heading Section */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
              🚀 Available Courses
            </h1>
            <p className="mt-1 text-sm md:text-base text-indigo-600">
              Explore and enroll in courses from various branches
            </p>
          </div>
        </div>
      </div>

      {/* Course Cards Area*/}
      {loading ? (
        <p className="text-center text-indigo-700 text-xl mt-12 animate-pulse">
          Loading courses...
        </p>
      ) : courses.length === 0 ? (
        <p className="text-center text-indigo-700 text-lg mt-12">
          No courses available for the selected branch.
        </p>
      ) : (
        // Courses Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4 md:px-20 pb-16 overflow-y-auto">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/70 backdrop-blur-xl border border-indigo-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-1 truncate">
                  {course.title}
                </h3>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {course.description || "No description provided."}
                </p>
              </div>

              {/* Enrollment Button */}
              <button
                disabled={enrolledCourseIds.has(course._id)}
                onClick={() => handleEnrollSuccess(course._id)}
                className={`mt-4  text-white text-sm font-medium text-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  enrolledCourseIds.has(course._id)
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
                }`}
              >
                {enrolledCourseIds.has(course._id) ? "Enrolled" : "Enroll Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
