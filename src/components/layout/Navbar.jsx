import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/images/codedrift-main-logo.png";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { STUDENT_PORTAL_URL } from "../../utils/constants.js";
import { useEffect, useState } from "react";
import { DIR } from "../../utils/constants.js";
import apiClient from "../../api/axiosConfig.js";

const Navbar = () => {
  const { currentUser, logout, isAdmin, isTrainer } = useAuth();
  const navigate = useNavigate();
  const studentId = Cookies.get("studentId");
  const isLocal = import.meta.env.VITE_ENV === "development";
  const courseUrl = `${STUDENT_PORTAL_URL}courses`;
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await apiClient.get("/api/contactinfo");
        const data = res.data?.data?.[0];
        if (data) setContactInfo(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }
    };

    fetchContactInfo();
  }, []);

  // const handleLogout = () => {
  //   logout();

  //   if (currentUser?.user?.role === "student") {
  //     const redirectUrl =
  //       import.meta.env.VITE_ENV === "development"
  //         ? "http://localhost:5001/"
  //         : "https://codedrift.co/";

  //     // For external redirect:
  //     window.location.href = redirectUrl;
  //   } else {
  //     // For other roles, just navigate inside app
  //     navigate("/login");
  //   }
  // };

  const handleLogout = () => {
    // 1️⃣ Clear cookies & reset auth state
    logout(); // clears cookies and sets currentUser to null

    // 2️⃣ Redirect based on previous role
    // Note: currentUser is still available in closure here
    if (currentUser?.user?.role === "student") {
      // Student → redirect to external portal
      window.location.href = STUDENT_PORTAL_URL;
    } else {
      // Admin/Trainer → navigate inside app
      navigate("/login");
    }
  };

  // const handleLogout = () => {
  //   logout();

  //   if (currentUser?.user?.role === "student") {
  //     window.location.href = STUDENT_PORTAL_URL; // ← Clean and centralized
  //   } else {
  //     navigate("/login");
  //   }
  // };

  return (
    <nav className="relative w-full h-16 shadow-md overflow-hidden font-sans">
      {/* Left Side */}
      <div className="absolute top-0 left-0 w-[70%] h-full z-10 flex items-center space-x-6 px-6 py-2">
        {/* <img
          src={logo}
          alt="Code Drift Logo"
          className="h-13 w-auto object-contain"
        /> */}

        <img
          src={
            contactInfo?.logo ? `${DIR.LOGO}${contactInfo.logo}` : logo // fallback to default logo
          }
          alt={contactInfo?.companyName || "Code Drift Logo"}
          className="h-13 w-auto object-contain"
        />

        <Link className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5ec2f4] via-[#485DAC] to-[#E9577C]">
          {contactInfo?.companyName || "Code Drift's Falcon"}
        </Link>
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
                <Link to="/dashboard" className="hover:underline text-white">
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
                <a
                  href={courseUrl}
                  className="hover:underline text-white font-bold text-xl animate-bounce"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore Courses
                </a>
                <Link
                  to="/student/dashboard"
                  className="hover:underline text-white"
                >
                  My Dashboard
                </Link>

                {/* <Link to={`/my-courses`} className="hover:underline text-white">
                  My Courses
                </Link> */}

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
            {/* <Link
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
            </Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
