import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaCalendarCheck,
  FaTasks,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";
import { COURSE_NAME } from "../../utils/constants";

/**
 * Dashboard card configurations
 */
const dashboardCards = [
  {
    title: "Training Program Management",
    desc: `Add new ${COURSE_NAME}, update existing ones, and manage curriculum structure.`,
    link: "/manage-courses",
    icon: <FaBook />,
  },
  {
    title: "Participant Management",
    desc: "View all student enrollments, track progress, and manage student data.",
    link: "/enrolled-student-list",
    icon: <FaClipboardList />,
  },
  {
    title: "Trainer Management",
    desc: "Manage trainer profiles, assignments, and performance tracking.",
    link: "/trainer-management",
    icon: <HiOutlineUserGroup />,
  },
  {
    title: "Pre requisite Learning",
    desc: "Manage trainer profiles, assignments, and performance tracking.",
    link: "/manage-prerequisite",
    icon: <HiOutlineUserGroup />,
  },
  {
    title: "Assessment Tests",
    desc: "Create, manage, and evaluate assessment tests and quizzes.",
    link: "/manage-test",
    icon: <FaFileAlt />,
  },
   {
    title: "Reference Materials Repository",
    desc: "Create, manage, and evaluate reference materials.",
    link: "/manage-notes",
    icon: <FaFileAlt />,
  },
  {
    title: "Attendance Tracker",
    desc: "Monitor and manage student attendance across all sessions.",
    link: "/manage-meeting",
    icon: <FaCalendarCheck />,
  },
  {
    title: "Assignment Management",
    desc: "Create assignments, track submissions, and provide feedback.",
    link: "/manage-assignments",
    icon: <FaTasks />,
  },
  {
    title: "Feedback Management",
    desc: "Create assignments, track submissions, and provide feedback.",
    link: "/manage-feedback",
    icon: <FaTasks />,
  },
  {
    title: "Book Session - Upskilling",
    desc: "Schedule and manage upskilling sessions for students or staff.",
    link: "/book-session",
    icon: <FaChalkboardTeacher />,
  },
  {
    title: "User Management",
    desc: "View, edit, and manage all users with role-based access control.",
    link: "/users",
    icon: <FaUsers />,
  },  
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Centralized platform to manage all aspects of your training programs
            </p>
          </div>
        </header>

        {/* Dashboard Cards Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {dashboardCards.map((card, idx) => (
    <div
      key={idx}
      className="
        bg-white 
        rounded-3xl 
        p-8 
        shadow-lg 
        hover:shadow-2xl 
        transition-all 
        duration-500 
        transform 
        hover:scale-[1.04] 
        ease-in-out 
        cursor-pointer 
        group
      "
      style={{ animationDelay: `${idx * 100}ms` }}
      data-aos="fade-up"
    >
      {/* Icon + Title */}
      <div className="flex items-center gap-6 mb-6">
        <div
          className={`${card.iconBg} 
            rounded-2xl 
            p-5 
            shadow-md 
            text-4xl 
            flex items-center justify-center 
            transition-transform duration-300 
            group-hover:scale-110`}
        >
          {card.icon}
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
          {card.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
        {card.desc}
      </p>

      {/* Navigation Button */}
      <Link
        to={card.link}
        className="
          inline-block 
          px-6 py-3 
          bg-gradient-to-r from-indigo-600 to-purple-600 
          hover:from-indigo-700 hover:to-purple-700 
          text-white font-semibold 
          rounded-lg 
          shadow-lg 
          transition duration-300 
          ease-in-out
        "
      >
        View {card.title}
      </Link>
    </div>
  ))}
</div>


   
      </div>
    </div>
  );
};

export default AdminDashboardPage;