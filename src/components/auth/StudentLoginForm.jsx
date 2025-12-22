import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";
import apiClient from "../../api/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";

export default function StudentLoginForm() {
  const [mode, setMode] = useState("email"); // 'email' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState(null);

  const { login, otpLogin } = useAuth();

  // ================= Email Login =================
  const emailFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      // email: Yup.string().email("Invalid email").required("Required"),
      // password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await login(values.email, values.password, "student");
        if (result.success && result.user) {
          toast.success("Login successful!");
          setTimeout(() => {
            window.location.href = "/student/dashboard";
          }, 100);
        } else {
          toast.error(result.message || "Login failed.");
        }
      } catch (err) {
        toast.error(err.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ================= OTP Send Form =================
  const sendOtpFormik = useFormik({
    initialValues: { mobileNo: "" },
    validationSchema: Yup.object({
      mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be 10 digits")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await apiClient.post("/api/otp/send", {
          mobileNo: values.mobileNo,
        });
        const data = res.data;
        if (data.success) {
          setReferenceId(data.data.reference_id);
          toast.success("OTP sent successfully!");
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to send OTP"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // ================= OTP Verify Form =================

  const verifyOtpFormik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^[0-9]{6}$/, "Must be 6 digits")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await apiClient.post("/api/otp/verify", {
          reference_id: referenceId,
          otp: values.otp,
        });

        if (res.data.success && res.data.data) {
          // Destructure all fields from response
          const { studentId, mobileNo, courseId, role, token, email } = res.data.data;

          // ✅ Use updated otpLogin
          otpLogin({ studentId, mobileNo, courseId, role, token, email });

          toast.success("Login successful!");
          setTimeout(() => {
            window.location.href = "/student/dashboard";
          }, 100);
        } else {
          toast.error(res.data.message || "Invalid OTP");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to verify OTP"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // Reset OTP state when switching mode
  useEffect(() => {
    setReferenceId(null);
    sendOtpFormik.resetForm();
    verifyOtpFormik.resetForm();
  }, [mode]);

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
          <h2 className="text-4xl font-bold mb-4 text-center">
            Welcome back, Participate! 👋
          </h2>
          <p className="text-lg mb-8 text-center max-w-sm">
            Login to access your participate dashboard and manage your account.
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
              Choose Email login to access your account.
            </p>

            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setMode("email")}
                className={`px-4 py-2 rounded-xl font-medium ${
                  mode === "email"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Email
              </button>
              {/* <button
                onClick={() => setMode("otp")}
                className={`px-4 py-2 rounded-xl font-medium ${
                  mode === "otp"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                OTP
              </button> */}
            </div>
          </div>

          {/* Conditional Rendering */}
          {mode === "email" ? (
            <form onSubmit={emailFormik.handleSubmit} className="space-y-6">
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                placeholder="Email"
                {...emailFormik.getFieldProps("email")}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                  placeholder="Password"
                  {...emailFormik.getFieldProps("password")}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer text-lg"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : !referenceId ? (
            <form onSubmit={sendOtpFormik.handleSubmit} className="space-y-6">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                placeholder="Mobile Number"
                {...sendOtpFormik.getFieldProps("mobileNo")}
                maxLength={10}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtpFormik.handleSubmit} className="space-y-6">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed focus:outline-none"
                value={sendOtpFormik.values.mobileNo}
                readOnly
              />
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                placeholder="Enter OTP"
                {...verifyOtpFormik.getFieldProps("otp")}
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-xl text-white shadow-md transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
                }`}
              >
                {loading ? "Verifying..." : "Login with OTP"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
