import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";

/**
 * Dashboard card configurations
 * Each card contains:
 * - title: Label shown on the card
 * - desc: Short description of the feature
 * - link: Route to navigate on button click
 * - icon: Visual icon for the card
 * - iconBg: Tailwind classes for icon container styling
 */
const dashboardCards = [
  {
    title: "User Management",
    desc: "View, edit, and manage all users.",
    link: "/admin/users",
    icon: <FaUsers />,
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    title: "Book Session - Upskilling",
    desc: "Schedule and manage upskilling sessions for students or staff.",
    link: "/admin/book-session",
    icon: <FaChalkboardTeacher />,
    iconBg: "bg-green-100 text-green-600",
  },
  {
    title: "Course Management",
    desc: "Add new courses, update existing ones.",
    link: "/admin/courses",
    icon: <FaBook />,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    title: "Enrollment Overview",
    desc: "View all student enrollments.",
    link: "/admin/enrolled-student-list",
    icon: <FaClipboardList />,
    iconBg: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Trainer Management",
    desc: "View all trainer enrollments.",
    link: "/admin/trainer-management",
    icon: <HiOutlineUserGroup />,
    iconBg: "bg-pink-100 text-pink-600",
  },
];

//  AdminDashboardPage component
const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Manage users, trainer, courses, and view platform activity.
          </p>
        </header>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-500 transform hover:scale-[1.03] ease-in-out cursor-pointer group"
              style={{ animationDelay: `${idx * 100}ms` }}
              data-aos="fade-up"
            >
              {/* Icon and Title Section */}
              <div className="flex items-center gap-5 mb-6">
                <div
                  className={`${card.iconBg} rounded-xl p-4 shadow-md text-4xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">{card.desc}</p>

              {/* Navigation Button */}
              <Link
                to={card.link}
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out"
              >
                Go to {card.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
