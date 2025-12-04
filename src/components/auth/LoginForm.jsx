
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { setRole } from "../../features/roleSlice";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const role = useSelector((state) => state.role.selectedRole);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password, role);

      if (result.success && result.user) {
        const userRole = result.user.role?.toLowerCase();

        // Single dashboard route for all roles
        // navigate("/dashboard");

         // ✔ Role Based Navigation
      if (userRole === "trainer") {
        navigate("/trainer/dashboard");
      } else {
        navigate("/dashboard"); // admin, manager, student, etc.
      }

      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-[#e0ecfc] via-[#f5f7fa] to-[#e2e2e2] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row w-full max-w-5xl backdrop-blur-lg bg-white/30 shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="md:w-1/2 p-10 bg-white/10 text-gray-800 flex flex-col items-center justify-center backdrop-blur-md">
          <h2 className="text-4xl font-bold mb-4 text-center">Welcome Back 👋</h2>
          <p className="text-lg mb-8 text-center max-w-sm">
            Login to access your dashboard and manage your account.
          </p>
          <img
            src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-3875.jpg"
            alt="Login Illustration"
            className="w-full max-w-xs rounded-xl shadow-lg"
          />
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 bg-white px-10 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Login</h1>
            <p className="text-sm text-gray-600 mt-2">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                placeholder="Enter your email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Select Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => dispatch(setRole(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                required
              >
                <option value="">Choose a role</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                {/* <option value="student">Student</option> */}
              </select>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-600 transition-all"
            >
              Login
            </motion.button>

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm text-center pt-2">
                {error}
              </div>
            )}
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Register here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

