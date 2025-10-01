import { useEffect, useState } from "react";
// import { fetchMyEnrollments } from "../api/enrollments";
// import { useAuth } from "../contexts/AuthContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
// import EnrolledCourseCard from "../components/student/EnrolledCourseCard.jsx";
import Cookies from "js-cookie";
import { FaBook, FaGraduationCap, FaSearch } from "react-icons/fa";
import EnrolledCourseCard from "../../components/student/EnrolledCourseCard.jsx";
// import { fetchStudentDetails } from "../api/profile.js";
import { fetchStudentDetails } from "../../api/profile.js";
import { STUDENT_PORTAL_URL } from "../../utils/constants.js";

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  // const token = import.meta.env.VITE_TEST_JWT;

  const token = Cookies.get("token");

  // const token = import.meta.env.VITE_ENV === 'local'
  // ? import.meta.env.VITE_TEST_JWT
  // : Cookies.get('token');

  console.log("token:", token);

  if (!token) throw new Error("Authentication token not found.");

  const { isAuthenticated, currentUser } = useAuth();

  // dont delete wihout comparing or checking
  // useEffect(() => {
  //   const loadEnrollments = async () => {
  //     if (isAuthenticated && currentUser?.user?.role === "student") {
  //       setLoading(true);
  //       setError("");
  //       try {
  //         const enrollmentsData = await fetchMyEnrollments(token);
  //         setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
  //       } catch (err) {
  //         setError("Failed to load your courses. Please try again later.");
  //         console.error("Error in MyCoursesPage:", err);
  //       }
  //       setLoading(false);
  //     } else if (!isAuthenticated) {
  //       setError("Please log in to see your courses.");
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //     }
  //   };

  //   loadEnrollments();
  // }, [isAuthenticated, currentUser, token]);

  // useEffect(() => {
  //   const loadStudentData = async () => {
  //     if (isAuthenticated && currentUser?.user?.role === "student") {
  //       setLoading(true);
  //       setError("");
  //       try {
  //         const studentData = await fetchStudentDetails();

  //         if (studentData.success && studentData.data) {
  //           setEnrollments(studentData.data.enrolledCourses || []);
  //         } else {
  //           setEnrollments([]);
  //           setError("No courses found.");
  //         }
  //       } catch (err) {
  //         setError("Failed to load your courses. Please try again later.");
  //         console.error("Error loading student data:", err);
  //         setEnrollments([]);
  //       }
  //       setLoading(false);
  //     } else if (!isAuthenticated) {
  //       setError("Please log in to see your courses.");
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //     }
  //   };

  //   loadStudentData();
  // }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const loadStudentData = async () => {
      if (isAuthenticated && currentUser?.user?.role === "student") {
        setLoading(true);
        setError("");
        try {
          const studentData = await fetchStudentDetails();

          console.log("✅ Student data fetched:", studentData); // ✅ DEBUG

          if (studentData.success && studentData.data) {
            console.log(
              "📘 Enrolled courses:",
              studentData.data.enrolledCourses
            ); // ✅ DEBUG
            setEnrollments(studentData.data.enrolledCourses || []);
          } else {
            console.warn("⚠️ No enrolledCourses found in response"); // ✅ DEBUG
            setEnrollments([]);
            setError("No courses found.");
          }
        } catch (err) {
          console.error("❌ Error loading student data:", err); // ✅ DEBUG
          setError("Failed to load your courses. Please try again later.");
          setEnrollments([]);
        }
        setLoading(false);
      } else if (!isAuthenticated) {
        console.warn("🔒 User not authenticated"); // ✅ DEBUG
        setError("Please log in to see your courses.");
        setLoading(false);
      } else {
        console.warn("ℹ️ User is not a student"); // ✅ DEBUG
        setLoading(false);
      }
    };

    loadStudentData();
  }, [isAuthenticated, currentUser]);

  const handleUnenrollSuccess = (unenrolledCourseId) => {
    setEnrollments((prevEnrollments) =>
      prevEnrollments.filter((e) => e._id !== unenrolledCourseId)
    );
  };

  // Filter courses based on active filter
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in-progress") {
      const progress = calculateProgress(enrollment);
      return progress > 0 && progress < 100;
    }
    if (activeFilter === "completed") {
      const progress = calculateProgress(enrollment);
      return progress === 100;
    }
    if (activeFilter === "not-started") {
      const progress = calculateProgress(enrollment);
      return progress === 0;
    }
    return true;
  });

  //   const calculateProgress = (enrollment) => {
  //     if (!enrollment || !enrollment.course) return 0;

  //     // const totalContent =
  //     //   (enrollment.course.youtubeVideos?.length || 0) +
  //     //   (enrollment.course.notes?.length || 0);

  // const totalContent =
  //   (enrollment.youtubeVideos?.length || 0) +
  //   (enrollment.notes?.length || 0);

  //     if (totalContent === 0) return 0;

  //     const completedCount = enrollment.completedContent?.length || 0;
  //     return Math.round((completedCount / totalContent) * 100);
  //   };

  // const calculateProgress = (enrollment) => {
  //   if (!enrollment) return 0;

  //   const totalContent =
  //     (enrollment.youtubeVideos?.length || 0) +
  //     (enrollment.notes?.length || 0);

  //   if (totalContent === 0) return 0;

  //   const completedCount = enrollment.completedContent?.length || 0;
  //   return Math.round((completedCount / totalContent) * 100);
  // };

  const calculateProgress = (enrollment) => {
    console.log(
      "📊 Calculating progress for:",
      enrollment.title || enrollment._id
    ); // ✅ DEBUG

    if (!enrollment) {
      console.warn("❗ No enrollment object found");
      return 0;
    }

    const youtubeCount = enrollment.youtubeVideos?.length || 0;
    const notesCount = enrollment.notes?.length || 0;
    const completedCount = enrollment.completedContent?.length || 0;
    const totalContent = youtubeCount + notesCount;

    console.log(
      `➡️ Video: ${youtubeCount}, Notes: ${notesCount}, Completed: ${completedCount}, Total: ${totalContent}`
    ); // ✅ DEBUG

    if (totalContent === 0) return 0;

    const progress = Math.round((completedCount / totalContent) * 100);
    console.log(
      `✅ Progress for ${enrollment.title || enrollment._id}: ${progress}%`
    ); // ✅ DEBUG

    return progress;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaBook className="text-indigo-600" />
              My Learning
            </h1>
            <p className="text-gray-600 mt-2">
              {enrollments.length > 0
                ? `You're enrolled in ${enrollments.length} course${
                    enrollments.length !== 1 ? "s" : ""
                  }`
                : "Your enrolled courses will appear here"}
            </p>
          </div>

          {/* 
          <a
  href={
    import.meta.env.VITE_ENV === 'development'
      ? 'http://localhost:5001/courses'
      : 'https://www.codedrift.co/courses'
  }
  className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
  target="_blank"
  rel="noopener noreferrer"
>
  <FaSearch className="w-4 h-4" />
  Browse Courses
</a> */}

          <a
            href={`${STUDENT_PORTAL_URL}courses`}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSearch className="w-4 h-4" />
            Browse Courses
          </a>
        </div>

        {/* Stats Cards */}
        {/* {enrollments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-800">{enrollments.length}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FaBook className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {enrollments.filter(e => {
                      const progress = calculateProgress(e);
                      return progress > 0 && progress < 100;
                    }).length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FaChartLine className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {enrollments.filter(e => calculateProgress(e) === 100).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FaCertificate className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Not Started</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {enrollments.filter(e => calculateProgress(e) === 0).length}
                  </p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  <FaClock className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Filter Tabs */}
        {/* {enrollments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeFilter === "all" 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveFilter("in-progress")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeFilter === "in-progress" 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeFilter === "completed" 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveFilter("not-started")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeFilter === "not-started" 
                  ? 'bg-gray-100 text-gray-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Not Started
            </button>
          </div>
        )} */}

        {/* Course Grid or Empty State */}
        {filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaGraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {enrollments.length === 0
                ? "No courses yet"
                : "No courses match this filter"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {enrollments.length === 0
                ? "You haven't enrolled in any courses yet. Explore our catalog to find courses that interest you."
                : "There are no courses that match your current filter selection."}
            </p>
            {/* <a
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FaSearch className="w-4 h-4" />
              Browse Courses
            </a>  */}

            <a
              href={`${STUDENT_PORTAL_URL}courses`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaSearch className="w-4 h-4" />
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <EnrolledCourseCard
                key={enrollment._id}
                enrollment={enrollment}
                onUnenrollSuccess={handleUnenrollSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
