import { useEffect, useState } from "react";
import { FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import { updateUserProfileApi } from "../../api/profile";
import { useAuth } from "../../contexts/AuthContext";


const ProfilePage = () => {
  const { currentUser, updateUserContext } = useAuth();

  // === State Management ===
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // branchId: "", // Only relevant if role is 'student'
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  //   const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentUser?.user) return;

    const user = currentUser.user;

    setProfileData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });

    setLoading(false);
  }, [currentUser]);

  // Handle text input changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  //   Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmNewPassword") setConfirmNewPassword(value);
  };

  // Handle profile update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("handleSubmit triggered");

    setError("");
    setSuccess("");
    setLoading(true);

    const updatePayload = { ...profileData };

    // === Password validation ===
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        setLoading(false);
        return;
      }
      // if (newPassword.length < 6) {
      //   setError("New password must be at least 6 characters.");
      //   setLoading(false);
      //   return;
      // }
      updatePayload.password = newPassword;
    }

    // === API call to update profile ===
    try {
      const response = await updateUserProfileApi(updatePayload);
      console.log("API response:", response);

      if (response.success) {
        setSuccess("Profile updated successfully!");
        updateUserContext(response.data); // Update global user context
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err.response || err);
      setError(
        err.response?.data?.message || err.message || "Error updating profile."
      );
    }

    setLoading(false);
  };

  // === Conditional Rendering ===
  if (loading && !profileData.email) return <p>Loading profile...</p>;
  if (!currentUser) return <p>Please log in to view your profile.</p>;

  return (
    <section className="bg-gradient-to-r from-pink-200 via-blue-100 to-blue-100 py-5 max-h-fit">
      <div className="max-w-6xl mx-auto bg-white backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-[#53b8ec]/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* === Left Column: Info Card === */}
          <div className="bg-gradient-to-tr from-blue-100 via-indigo-100 to-purple-100 rounded-2xl shadow-md p-8 border border-gray-200 flex flex-col justify-between h-full">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Admin illustration"
              className="w-48 h-48 object-contain mx-auto mb-6"
            />
            <div>
              <h3 className="text-2xl font-bold text-[#485dac] text-center mb-2">
                Welcome, Admin!
              </h3>
              <p className="text-gray-600 text-center">
                Keep your profile updated to ensure secure access and
                personalized experience across the platform.
              </p>
              <ul className="mt-6 text-sm text-gray-500 list-disc pl-5 space-y-1">
                <li>Secure your account with a strong password.</li>
                <li>Ensure your name is accurate for certifications.</li>
                <li>Email is fixed and used for login.</li>
              </ul>
            </div>
          </div>

          {/* === Right Column: Profile Form === */}
          <div>
            <h2 className="text-4xl font-extrabold text-[#485dac] mb-8 text-center lg:text-left">
              Admin Profile
            </h2>

            {/* === Feedback Messages === */}
            {success && (
              <p className="text-green-600 text-center mb-4 animate-fade-in">
                {success}
              </p>
            )}
            {error && (
              <p className="text-red-600 text-center mb-4 animate-fade-in">
                {error}
              </p>
            )}

            {/* === Profile Form === */}
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                    <FaUser /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#53b8ec]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53b8ec] bg-white shadow-sm"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                    <FaUser /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#53b8ec]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53b8ec] bg-white shadow-sm"
                    required
                  />
                </div>

                {/* Email (read-only) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg shadow-inner"
                  />
                </div>

                {/* Branch (Student only) */}
                {/* {currentUser?.user?.role === "student" && branches.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                      <FaGraduationCap /> Branch/Stream
                    </label>
                    <select
                      name="branchId"
                      value={profileData.branchId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#C7DA40]/40 rounded-lg focus:ring-2 focus:ring-[#C7DA40] bg-white shadow-sm"
                    >
                      <option value="">-- Select Branch --</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}
              </div>

              {/* === Password Section === */}
              <div className="pt-8 border-t border-[#e9577c]/30">
                <h4 className="text-xl font-semibold text-[#e9577c] mb-6">
                  Change Password{" "}
                  <span className="text-sm text-gray-500">(optional)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div>
                    <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                      <FaKey /> New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-[#e9577c]/40 rounded-lg focus:ring-2 focus:ring-[#e9577c] bg-white shadow-sm"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="flex items-center gap-2 text-[#485dac] font-medium mb-1">
                      <FaKey /> Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-[#e9577c]/40 rounded-lg focus:ring-2 focus:ring-[#e9577c] bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* === Submit Button === */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-6 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.01] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #53B8EC, #485DAC, #E9577C)",
                }}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
