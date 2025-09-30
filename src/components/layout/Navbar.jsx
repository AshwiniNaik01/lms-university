
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/images/codedrift-main-logo.png";
import { useAuth } from "../../contexts/AuthContext.jsx";


const Navbar = () => {
  const { currentUser, logout, isAdmin, isTrainer } = useAuth();
  const navigate = useNavigate();
  const studentId = Cookies.get("studentId");
  const isLocal = import.meta.env.VITE_ENV === "development";

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  const handleLogout = () => {
    logout();

    if (currentUser?.user?.role === "student") {
      const redirectUrl =
        import.meta.env.VITE_ENV === "development"
          ? "http://localhost:5001/"
          : "https://codedrift.co/";

      // For external redirect:
      window.location.href = redirectUrl;
    } else {
      // For other roles, just navigate inside app
      navigate("/login");
    }
  };

  return (
    <nav className="relative w-full h-16 shadow-md overflow-hidden font-sans">
      {/* Left Side */}
      <div className="absolute top-0 left-0 w-[70%] h-full z-10 flex items-center space-x-6 px-6">
        <img
          src={logo}
          alt="Code Drift Logo"
          className="h-26 max-h-full w-auto object-contain "
        />
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ec2f4] via-[#485DAC] to-[#E9577C]"
        >
          Code Drift's LMS
        </Link>
        {/* <Link to="/" className="text-gray-800 hover:text-[#485DAC] transition">
          Home
        </Link> */}
        {/* <Link to="/courses" className="text-gray-800 hover:text-[#485DAC] transition">
          Courses
        </Link> */}
        {/* <a
          href={
            isLocal
              ? "http://localhost:5001/courses"
              : "https://www.codedrift.co/courses"
          }
          target="_self" // or "_blank" if needed
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-[#485DAC] transition"
        >
          Courses
        </a> */}
      </div>

      {/* Right Side */}
      <div
        className="absolute top-0 right-0 w-[50%] h-full text-white flex items-center justify-end pr-6 space-x-4 z-20"
        style={{
          clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          background: "linear-gradient(to right, #53B8EC, #485DAC, #E9577C)",
        }}
      >
        {currentUser ? (
          <>
            {/* Admin links */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:underline text-white"
                >
                  Admin Dashboard
                </Link>
                <Link to="/profile" className="hover:underline text-white">
                  Admin Profile
                </Link>
              </>
            )}

            {/* Trainer links */}
            {isTrainer && (
              <>
                <Link
                  to="/trainer/dashboard"
                  className="hover:underline text-white"
                >
                  Trainer Dashboard
                </Link>
                <Link
                  to="/trainer-courses"
                  className="hover:underline text-white"
                >
                  My Courses
                </Link>
                <Link
                  to="/trainer-profile"
                  className="hover:underline text-white"
                >
                  Trainer Profile
                </Link>
              </>
            )}

            {/* Student links */}
            {!isAdmin && !isTrainer && (
              <>
                <Link
                  to="/student/dashboard"
                  className="hover:underline text-white"
                >
                  My Dashboard
                </Link>
                 <Link
                  to={`/my-courses`}
                  className="hover:underline text-white"
                >
                  My Courses
                </Link>
                {/* <Link to="/my-results" className="hover:underline text-white">
                  My Results
                </Link> */}
                <Link
                  to={`/student-profile/${studentId}`}
                  className="hover:underline text-white"
                >
                  My Profile
                </Link>
              </>
            )}

            {/* Common for all logged in users */}
            {/* <span className="hidden sm:inline text-white">
              Hi, {currentUser.user.firstName}
            </span> */}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-white text-[#E9577C] rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-[#53B8EC] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-white text-[#485DAC] rounded hover:bg-gray-100 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
