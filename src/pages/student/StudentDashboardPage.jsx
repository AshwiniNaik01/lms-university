import { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaLightbulb,
  FaPhone,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile as getUserProfile } from "../../api/profile";
// import { BASE_URL } from "../utils/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BatchesComingSoon from "../../components/popupModal/BatchesComingSoon";
import { BASE_URL, COURSE_NAME, STUDENT_PORTAL_URL } from "../../utils/constants";
// import student_dashboard_img from "../../../public/images";

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

const CourseCard = ({ course, onCourseClick }) => {
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

  // const handleCourseClick = () => {
  //   navigate(`/courses/${course._id}/study`);
  // };
  const handleCourseClick = () => {
    onCourseClick(course); // open popup for this course
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
  // Batch selection states
  const [showBatchPopup, setShowBatchPopup] = useState(false);
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourseBatches, setSelectedCourseBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // const courseUrl =
  //   import.meta.env.VITE_ENV === "development"
  //     ? "http://localhost:5001/courses"
  //     : "https://www.codedrift.co/courses";

  const courseUrl = `${STUDENT_PORTAL_URL}courses`;

  const handleCourseSelect = (course) => {
    const batches = course.batches || [];
    setSelectedCourseBatches(batches);

    if (batches.length > 0) {
      setShowBatchPopup(true);
    }
  };

  // Fetch profile function
  // const fetchUserProfile = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const resp = await getUserProfile();
  //     setUserData(resp.data);
  //     setError("");
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //         err.message ||
  //         "Failed to fetch user data"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getUserProfile();
      setUserData(resp.data);
      setError("");

      const allBatches = resp.data.enrolledCourses
        ?.flatMap((c) => c.batches || [])
        ?.filter((b) => b !== null);

      // setAssignedBatches(allBatches);

      // ❗ Only auto-select if exactly one batch exists, otherwise do nothing
      if (allBatches.length === 1) {
        setSelectedBatch(allBatches[0]);
      }
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

  // const BatchSelectionPopup = () => (
  //   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  //     <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
  //       <h2 className="text-xl font-bold mb-4 text-gray-800">
  //         Select Your Batch
  //       </h2>

  //       <div className="space-y-3">
  //         {/* {assignedBatches.map((batch) => (
  //         <button
  //           key={batch._id}
  //           onClick={() => {
  //             setSelectedBatch(batch);
  //             setShowBatchPopup(false);
  //           }}
  //           className="w-full p-4 border rounded-lg hover:bg-indigo-50 text-left"
  //         >
  //           <p className="font-semibold">{batch.batchName}</p>
  //           <p className="text-sm text-gray-600">
  //             Time: {batch.time.start} - {batch.time.end}
  //           </p>
  //           <p className="text-sm text-gray-600">
  //             Days: {batch.days.join(", ")}
  //           </p>
  //         </button>
  //       ))} */}

  //         {selectedCourseBatches.map((batch) => (
  //           <button
  //             key={batch._id}
  //             onClick={() => {
  //               setSelectedBatch(batch);
  //               setShowBatchPopup(false);

  //               // ⬇️ navigate immediately with selected batchId
  //               navigate(
  //                 `/courses/${selectedCourse._id}/study?batchId=${batch._id}`
  //               );
  //             }}
  //             className="w-full p-4 border rounded-lg hover:bg-indigo-50 text-left"
  //           >
  //             <p className="font-semibold">{batch.batchName}</p>
  //             <p className="text-sm text-gray-600">
  //               Time: {batch.time.start} - {batch.time.end}
  //             </p>
  //             <p className="text-sm text-gray-600">
  //               Days: {batch.days.join(", ")}
  //             </p>
  //           </button>
  //         ))}
  //       </div>

  //       <button
  //         onClick={() => setShowBatchPopup(false)}
  //         className="mt-6 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
  //       >
  //         Close
  //       </button>
  //     </div>
  //   </div>
  // );

const BatchSelectionPopup = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden animate-scaleIn">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
        <h2 className="text-xl font-bold text-white">
          Choose Your Batch
        </h2>
        <p className="text-sm text-indigo-100">
          Select a batch to start your learning journey
        </p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
        {selectedCourseBatches.map((batch) => (
          <button
            key={batch._id}
            onClick={() => {
              setSelectedBatch(batch);
              setShowBatchPopup(false);
              navigate(
                `/courses/${selectedCourse._id}/study?batchId=${batch._id}`
              );
            }}
            className="group w-full p-4 border rounded-xl text-left transition-all
                       hover:border-indigo-500 hover:bg-indigo-50
                       hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600">
                {batch.batchName}
              </p>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>
                ⏰ <span className="font-medium">Time:</span>{" "}
                {batch.time.start} – {batch.time.end}
              </p>
              <p>
                📅 <span className="font-medium">Days:</span>{" "}
                {batch.days.join(", ")}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={() => setShowBatchPopup(false)}
          className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200
                     font-medium text-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);


  const ProfileHeader = () => (
    // <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white rounded-2xl p- mb-10 relative overflow-hidden shadow-lg">
    //   <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

    //     {/* 👤 Profile Info Left */}
    //     <div className="flex items-center gap-6 w-full md:w-2/3">
    //       {userData.profilePhotoStudent ? (
    //         <img
    //           src={`${BASE_URL}/uploads/student/student-profilephoto/${userData.profilePhotoStudent}`}
    //           alt="Student"
    //           className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
    //         />
    //       ) : (
    //         <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-md">
    //           <FaUser className="w-10 h-10 text-white/70" />
    //         </div>
    //       )}

    //       <div>
    //         <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
    //           Welcome back, {userData.fullName}!
    //         </h1>
    //         <p className="text-indigo-100 text-sm md:text-base">
    //           Here's a look at your learning journey. Keep pushing forward! 🚀
    //         </p>
    //       </div>
    //     </div>

    //     {/* 🖼️ Image Right */}
    //     <div className="w-full md:w-1/3 flex justify-center md:justify-end">
    //       <img
    //         src="https://studyhub.vinnovateit.com/img/allnighter_img.svg"
    //         alt="Learning Illustration"
    //         className="w-35 md:w-35 lg:w-35"
    //       />
    //     </div>
    //   </div>

    //   {/* 🎨 Subtle background glow effect */}
    //   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

    //   {/* ✨ Animation */}
    //   <style>{`
    //     @keyframes fadeIn {
    //       from { opacity: 0; transform: translateY(20px); }
    //       to { opacity: 1; transform: translateY(0); }
    //     }
    //     .animate-fadeIn {
    //       animation: fadeIn 1s ease-out forwards;
    //     }
    //   `}</style>
    // </div>

    <div className="bg-blue-800 text-white rounded-2xl px-4 md:px-4 flex flex-col md:flex-row items-center justify-between shadow-lg mb-8">
      {/* Text Section */}
      <div className="flex items-center gap-6 w-full md:w-3/3">
        {userData.profilePhotoStudent ? (
          <img
            src={`${BASE_URL}/uploads/student/student-profilephoto/${userData.profilePhotoStudent}`}
            alt="Candidate"
            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center shadow-md">
            <FaUser className="w-10 h-10 text-white/70" />
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {userData.fullName}!
          </h2>

          <p className="text-indigo-100 text-md font-mono leading-relaxed flex items-start gap-2">
            Your journey to mastery starts with showing up. Let’s make today a
            productive one!
            <FaLightbulb className="mt-1 text-yellow-300 w-5 h-5" />
          </p>

          <p className="text-indigo-100 text-md font-mono leading-relaxed flex items-start gap-2">
            You’ve got this — let today be another chapter in your growth story.
            <FaBookOpen className="mt-1 text-green-300 w-5 h-5" />
          </p>
        </div>
      </div>

      {/* Illustration */}
      <div className="w-40 md:w-56 mt-6 md:mt-0">
        <img
          src="/images/student_dashboard_img.svg"
          alt="Learning"
          className="w-full h-auto"
        />
      </div>
    </div>
  );

  const OverviewTab = () => {
    const coursesWithBatch = userData.enrolledCourses?.filter(
      (course) => course.batches && course.batches.length > 0
    );

    const coursesWithoutBatch = userData.enrolledCourses?.filter(
      (course) => !course.batches || course.batches.length === 0
    );

    return (
      <div className="space-y-10">
        {/* Courses with Batches */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My {COURSE_NAME}</h2>
            {/* <a
              href={courseUrl}
              className="text-white bg-indigo-500 hover:bg-blue-600 text-lg font-semibold flex items-center gap-2 border border-blue-600 rounded-md p-3 transition-transform duration-200 hover:scale-105"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Courses <FaArrowRight className="w-4 h-4" />
            </a> */}
          </div>

          {coursesWithBatch.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesWithBatch.map((course) => (
                // <CourseCard key={course._id} course={course} />
                <CourseCard
                  key={course._id}
                  course={course}
                  onCourseClick={(course) => {
                    setSelectedCourse(course);
                    setSelectedCourseBatches(course.batches || []);
                    setShowBatchPopup(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No active {COURSE_NAME} yet.</p>
          )}
        </div>

        {/* Courses Without Batches */}
        {coursesWithoutBatch.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">
              {COURSE_NAME} You're Interested In
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesWithoutBatch.map((course) => (
                <BatchesComingSoon key={course._id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProfileTab = () => {
    const relativeImageUrl =
      "https://img.freepik.com/premium-vector/woman-sits-computer-screen-using-laptop-checking-off-tasks-checklist-screen-is-filled-with-lines-text-green-checkmark-signifying-completion_520881-7879.jpg";

    return (
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden md:flex">
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
    <div className="max-h-fit bg-blue-100 py-6 px-4 sm:px-6 lg:px-6">
      {showBatchPopup && <BatchSelectionPopup />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <ProfileHeader />

      {/* Tab Switcher with Sliding Effect */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-md p-2 shadow-xl flex items-center justify-between mb-6">
        {/* Slider Background */}
        <div
          className={`absolute top-1 bottom-1 w-1/2 bg-blue-800 rounded-md transition-all duration-300 ${
            activeTab === "overview" ? "left-1" : "left-1/2"
          }`}
        />

        {/* Tab Buttons */}
        <button
          onClick={() => setActiveTab("overview")}
          className={`relative z-10 w-1/2 text-center py-2 rounded-full transition-all duration-300 font-semibold ${
            activeTab === "overview" ? "text-white" : "text-blue-800"
          }`}
        >
          <RiDashboardFill className="inline-block mr-1" />
          My {COURSE_NAME}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`relative z-10 w-1/2 text-center py-2 rounded-full transition-all duration-300 font-semibold ${
            activeTab === "profile" ? "text-white" : "text-blue-800"
          }`}
        >
          <FaUser className="inline-block mr-1" />
          Profile
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
