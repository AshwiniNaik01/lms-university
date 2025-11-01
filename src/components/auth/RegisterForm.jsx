

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth(); // Your custom auth hook
  const navigate = useNavigate();

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    // Send JSON data, not FormData
    const registrationData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await register(registrationData);

      if (response.success) {
        alert(
          response.message || "Registration successful! Please check your email to verify."
        );
        navigate("/login");
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-7">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white backdrop-blur-lg border border-slate-200 rounded-3xl shadow-2xl p-10 md:p-14 space-y-8 transition-all"
      >
        <h2 className="text-2xl md:text-2xl font-bold text-slate-700 text-center mb-4">
          Register to LMS
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow text-sm">
            {error}
          </div>
        )}

        {/* Name Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChange}
              placeholder="John"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChange}
              placeholder="Doe"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-700 transition-all duration-300 shadow-lg"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-slate-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-700 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
