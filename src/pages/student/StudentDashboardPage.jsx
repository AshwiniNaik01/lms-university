import { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaUser
} from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile as getUserProfile } from "../../api/profile";
// import { BASE_URL } from "../utils/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../utils/constants";

// Single stat card
const StatCard = ({ title, value, icon, bgColor, iconBg }) => (
  <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
  </div>
);

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const progress = course?.progress || 0;

  const getProgressColor = (percentage) => {
    if (percentage === 0) return "bg-gray-300";
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    if (percentage < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const getProgressText = (percentage) => {
    if (percentage === 0) return "Not started";
    if (percentage === 100) return "Completed";
    return `${percentage}% complete`;
  };

  const handleCourseClick = () => {
    navigate(`/courses/${course._id}/study`);
  };

  return (
    <div
      onClick={handleCourseClick}
      className="p-[4px] rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="bg-blue-50 rounded-xl h-full flex flex-col p-5">
        {/* 🧠 Title */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* 📝 Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* 🎨 Divider */}
        <hr className="my-2 h-[2px] border-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 rounded-full shadow-sm" />

        {/* 📊 Duration & Rating (Left + Right aligned) */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4 text-indigo-500" />
            <span>{course.duration || "N/A"}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="w-4 h-4 text-yellow-500" />
            <span>{course.rating || "No rating"}</span>
          </div>
        </div>

        {/* 📈 Progress Bar */}
        <div className="w-full h-2 rounded-full bg-gray-200 mb-2">
          <div
            className={`h-full rounded-full ${getProgressColor(
              progress
            )} transition-all duration-700`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 italic text-right mb-3">
          {getProgressText(progress)}
        </p>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* 🚀 CTA */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-200">
            Continue Learning
            <FaArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const courseUrl =
    import.meta.env.VITE_ENV === "development"
      ? "http://localhost:5001/courses"
      : "https://www.codedrift.co/courses";


  // Fetch profile function
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getUserProfile();
      setUserData(resp.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Refresh on focus
  useEffect(() => {
    const onFocus = () => fetchUserProfile();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 shadow-lg rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-3">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // or a fallback UI
  }

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="flex items-center gap-6">
        {userData.profilePhotoStudent ? (
          <img
            src={`${BASE_URL}/uploads/student/student-profilephoto/${userData.profilePhotoStudent}`}
            alt="Student"
            className="w-20 h-20 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
            <FaUser className="w-10 h-10 text-white/70" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {userData.fullName}!
          </h1>
          <p className="mt-1 text-indigo-100">
            Here's a look at your learning journey
          </p>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-10">
      {/* Courses Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
          {/* <Link
            to="/courses"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1"
          >
            Explore Courses <FaArrowRight className="w-4 h-4" />
          </Link> */}

           <a
      href={courseUrl}
      className="text-indigo-600 hover:text-indigo-800 text-lg font-semibold flex items-center gap-1"
      target="_blank" // Open in same tab
      rel="noopener noreferrer"
    >
      Explore Courses <FaArrowRight className="w-4 h-4" />
    </a>
        </div>

        {userData.enrolledCourses?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.enrolledCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 space-y-4">
            <p>No courses yet. Start learning now!</p>
            <Link
              to="/courses"
              className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const ProfileTab = () => {
    const relativeImageUrl =
      "https://img.freepik.com/premium-vector/woman-sits-computer-screen-using-laptop-checking-off-tasks-checklist-screen-is-filled-with-lines-text-green-checkmark-signifying-completion_520881-7879.jpg";

    return (
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden md:flex">
        {/* Left Side Image with Text Overlay */}
        <div
          className="md:w-1/2 relative bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${relativeImageUrl})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* Text Content */}
          <div className="relative z-10 p-10 text-center md:text-left max-w-md animate-slideInUp">
            <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl">
              Unlock Your Potential
            </h2>
            <p className="text-white text-lg mb-6 drop-shadow-md">
              Your journey to excellence begins here. Discover your progress,
              embrace consistency, and evolve every day.
            </p>
          </div>
        </div>

        {/* Right Side Profile Info */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-blue-50 animate-fadeIn">
          {/* Header */}
          <h2 className="text-3xl font-extrabold mb-8 text-indigo-600 relative inline-block pb-2 border-b-4 border-indigo-300">
            Profile Information
          </h2>

          {/* Notebook paper effect */}
          <div className="bg-white shadow-inner rounded-xl p-6 border-3 border-dashed border-indigo-200 relative overflow-hidden">
            {/* Lined background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-indigo-100 to-transparent bg-[length:100%_2.5rem] [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_39px,#e0e7ff_40px)] pointer-events-none rounded-xl" />

            <div className="relative z-10 grid grid-cols-1 gap-6">
              {[
                {
                  label: "Full Name",
                  value: userData.fullName,
                  icon: <FaUser className="text-indigo-500 w-4 h-4" />,
                },
                {
                  label: "Email",
                  value: userData.email,
                  icon: <FaEnvelope className="text-indigo-500 w-4 h-4" />,
                },
                {
                  label: "Mobile Number",
                  value: userData.mobileNo,
                  icon: <FaPhone className="text-indigo-500 w-4 h-4" />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-start gap-3">
                  {icon}
                  <div>
                    <p className="text-sm font-semibold text-indigo-500">
                      {label}
                    </p>
                    <p className="text-gray-800 text-lg font-medium">
                      {value || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate(`/student-profile/${userData._id}`)}
            className="mt-10 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300"
          >
            Edit Profile
            <FaEdit className="w-5 h-5" />
          </button>

          {/* Animation styles */}
          <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
        </div>

        {/* Fade-in animation (tailwind config required for custom animations or use inline) */}
        <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <ProfileHeader />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-indigo-100"
          }`}
        >
          <RiDashboardFill className="inline-block mr-1" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-indigo-100"
          }`}
        >
          <FaUser className="inline-block mr-1" /> Profile
        </button>
      </div>

      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
