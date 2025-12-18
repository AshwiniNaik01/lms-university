// import { useFormik } from "formik";
// import { useAuth } from "../../../contexts/AuthContext";
// import { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// export default function StudentEmailLogin({ redirectTestId }) {
//   const { login } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     onSubmit: async (values) => {
//       const res = await login(values.email, values.password, "student");
//       if (res.success) {
//         window.location.href = `/start-test/${redirectTestId}`;
//       }
//     },
//   });

//  return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
//       style={{
//         backgroundImage:
//           "url('https://static.vecteezy.com/system/resources/previews/011/635/825/non_2x/abstract-square-interface-modern-background-concept-fingerprint-digital-scanning-visual-security-system-authentication-login-vector.jpg')",
//       }}
//     >
//       {/* Dark overlay for better contrast */}
//       <div className="absolute inset-0 bg-black/60"></div>

//       <form
//         onSubmit={formik.handleSubmit}
//         className="relative z-10 w-full max-w-lg bg-white/20 backdrop-blur-md p-8 rounded-lg shadow-2xl flex flex-col border border-white/30"
//       >
//         <h2 className="text-3xl font-bold mb-8 text-white text-center">
//           Student Login
//         </h2>

//         {/* Email Field */}
//         <div className="w-full mb-6 flex flex-col">
//           <label htmlFor="email" className="text-white font-medium mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             {...formik.getFieldProps("email")}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="Enter your email"
//           />
//         </div>

//         {/* Password Field */}
//         <div className="w-full mb-6 flex flex-col relative">
//           <label htmlFor="password" className="text-white font-medium mb-2">
//             Password
//           </label>
//           <input
//             type={showPassword ? "text" : "password"}
//             id="password"
//             {...formik.getFieldProps("password")}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="Enter your password"
//           />
//           {/* Toggle Show/Hide */}

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-12 text-white hover:text-white focus:outline-none"
//           >
//             {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//           </button>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );

// }



import { useFormik } from "formik";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

export default function StudentEmailLogin({ redirectTestId }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      try {
        const res = await login(values.email, values.password, "student");

        if (res.success) {
          await Swal.fire({
            icon: "success",
            title: "Login Successful!",
            // text: "Redirecting to the test...",
            timer: 1000,
            showConfirmButton: false,
          });
          window.location.href = `/start-test/${redirectTestId}`;
        } 
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: err.message || "Please try again.",
          confirmButtonColor: "#3085d6",
        });
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/011/635/825/non_2x/abstract-square-interface-modern-background-concept-fingerprint-digital-scanning-visual-security-system-authentication-login-vector.jpg')",
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      <form
        onSubmit={formik.handleSubmit}
        className="relative z-10 w-full max-w-lg bg-white/20 backdrop-blur-md p-8 rounded-lg shadow-2xl flex flex-col border border-white/30"
      >
        <h2 className="text-3xl font-bold mb-8 text-white text-center">
          Student Login
        </h2>

        {/* Email Field */}
        <div className="w-full mb-6 flex flex-col">
          <label htmlFor="email" className="text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...formik.getFieldProps("email")}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="w-full mb-6 flex flex-col relative">
          <label htmlFor="password" className="text-white font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...formik.getFieldProps("password")}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your password"
          />
          {/* Toggle Show/Hide */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-12 text-white hover:text-white focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
