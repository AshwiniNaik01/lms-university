

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx";

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { register } = useAuth(); // Your custom auth hook
//   const navigate = useNavigate();

//   const { firstName, lastName, email, password, confirmPassword } = formData;

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     setLoading(true);

//     // Send JSON data, not FormData
//     const registrationData = {
//       firstName,
//       lastName,
//       email,
//       password,
//     };

//     try {
//       const response = await register(registrationData);

//       if (response.success) {
//         alert(
//           response.message || "Registration successful! Please check your email to verify."
//         );
//         navigate("/login");
//       } else {
//         setError(response.message || "Registration failed.");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "An unexpected error occurred."
//       );
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-7">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-3xl bg-white backdrop-blur-lg border border-slate-200 rounded-3xl shadow-2xl p-10 md:p-14 space-y-8 transition-all"
//       >
//         <h2 className="text-2xl md:text-2xl font-bold text-slate-700 text-center mb-4">
//           Register to LMS
//         </h2>

//         {error && (
//           <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow text-sm">
//             {error}
//           </div>
//         )}

//         {/* Name Inputs */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={firstName}
//               onChange={onChange}
//               placeholder="John"
//               className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={lastName}
//               onChange={onChange}
//               placeholder="Doe"
//               className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
//               required
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={email}
//             onChange={onChange}
//             placeholder="you@example.com"
//             className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
//             required
//           />
//         </div>

//         {/* Passwords */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={password}
//               onChange={onChange}
//               placeholder="Enter password"
//               className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={confirmPassword}
//               onChange={onChange}
//               placeholder="Re-enter password"
//               className="w-full px-4 py-3 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
//               required
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-lg hover:bg-violet-700 transition-all duration-300 shadow-lg"
//           disabled={loading}
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         {/* Login Link */}
//         <p className="text-center text-slate-600 text-sm mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-violet-700 font-semibold hover:underline">
//             Login here
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;



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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register } = useAuth();
  const navigate = useNavigate();

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (currentStep === 1 && firstName && lastName) {
      setCurrentStep(2);
    } else if (currentStep === 2 && email) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    const registrationData = { firstName, lastName, email, password };

    try {
      const response = await register(registrationData);
      if (response.success) {
        alert(response.message || "Registration successful! Please check your email.");
        navigate("/login");
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-2 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10">
        
        {/* Left Side - Branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <h1 className="text-2xl font-bold">EduPlatform</h1>
              </div>

              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Start Your Learning Journey
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Join thousands mastering new skills with interactive training program
              </p>
            </div>

            <div className="space-y-4">
              <Feature icon="⚡" title="Interactive Training Program" desc="Learn by doing with projects" />
              <Feature icon="👥" title="Expert Community" desc="Connect with mentors" />
              <Feature icon="📊" title="Progress Tracking" desc="Monitor your journey" />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 bg-white p-8 md:p-12">
          {/* Progress Steps */}
          <StepProgress currentStep={currentStep} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <ErrorMessageBox message={error} />
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <Step1
                firstName={firstName}
                lastName={lastName}
                onChange={onChange}
                nextStep={nextStep}
              />
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <Step2
                email={email}
                onChange={onChange}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}

            {/* Step 3: Password */}
            {currentStep === 3 && (
              <Step3
                password={password}
                confirmPassword={confirmPassword}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                onChange={onChange}
                prevStep={prevStep}
                loading={loading}
              />
            )}

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 font-bold hover:text-purple-700 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ========== SMALL COMPONENTS ========== */
const Feature = ({ icon, title, desc }) => (
  <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-blue-100 text-sm">{desc}</p>
    </div>
  </div>
);

const StepProgress = ({ currentStep }) => (
  <div className="flex items-center justify-between mb-8">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            step === currentStep
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-110"
              : step < currentStep
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {step < currentStep ? "✓" : step}
        </div>
        {step < 3 && (
          <div
            className={`w-16 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          ></div>
        )}
      </div>
    ))}
  </div>
);

const ErrorMessageBox = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
      <span className="text-red-500 text-lg">⚠️</span>
    </div>
    <div>
      <h3 className="font-semibold text-red-800">Registration Error</h3>
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  </div>
);

const Step1 = ({ firstName, lastName, onChange, nextStep }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
      Personal Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="First Name" name="firstName" value={firstName} onChange={onChange} icon="👤" />
      <Input label="Last Name" name="lastName" value={lastName} onChange={onChange} icon="👥" />
    </div>
    <button
      type="button"
      onClick={nextStep}
      disabled={!firstName || !lastName}
      className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
    >
      Continue to Email
    </button>
  </div>
);

const Step2 = ({ email, onChange, prevStep, nextStep }) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
      Email Address
    </h3>
    <Input label="Email" name="email" type="email" value={email} onChange={onChange} icon="📧" />
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={prevStep}
        className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-purple-500 hover:text-purple-700 transition-all"
      >
        Back
      </button>
      <button
        type="button"
        onClick={nextStep}
        disabled={!email}
        className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        Continue to Password
      </button>
    </div>
  </div>
);

const Step3 = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  onChange,
  prevStep,
  loading,
}) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
      Secure Your Account
    </h3>

    <Input
      label="Password"
      name="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={onChange}
      icon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-500 hover:text-purple-500"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      }
    />

    <Input
      label="Confirm Password"
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={onChange}
      icon={
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="text-gray-500 hover:text-purple-500"
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      }
    />

    {confirmPassword && (
      <div
        className={`flex items-center space-x-2 text-sm font-semibold ${
          password === confirmPassword ? "text-green-600" : "text-red-600"
        }`}
      >
        <span>{password === confirmPassword ? "✅" : "❌"}</span>
        <span>
          {password === confirmPassword
            ? "Passwords match perfectly!"
            : "Passwords don't match"}
        </span>
      </div>
    )}

    <div className="flex space-x-4">
      <button
        type="button"
        onClick={prevStep}
        className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-purple-500 hover:text-purple-700"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={loading || !password || !confirmPassword || password !== confirmPassword}
        className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          <span>🚀 Launch My Account</span>
        )}
      </button>
    </div>
  </div>
);

const Input = ({ label, name, type = "text", value, onChange, icon }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300 pr-12"
        required
      />
      <div className="absolute right-3 top-3 text-purple-500">{icon}</div>
    </div>
  </div>
);

// export default RegisterForm;

export default RegisterForm;