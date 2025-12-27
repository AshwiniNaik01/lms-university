// pages/profile/edit.jsx
import { useEffect, useState } from "react";
import { updateUserProfileApi } from "../../api/profile";
import { useAuth } from "../../contexts/AuthContext";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";

const StudentEditProfile = () => {
  const { currentUser, updateUserContext } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate  = useNavigate();

  useEffect(() => {
    if (currentUser?.user) {
      const user = currentUser.user;
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    const updatePayload = {
      ...profileData,
      ...(newPassword && { password: newPassword }),
    };

    try {
      const response = await updateUserProfileApi(updatePayload);
      if (response.success) {
        updateUserContext(response.data);
        setMessage("Profile updated successfully!");
        navigate("/profile/view");
      } else {
        setMessage(response.message || "Update failed.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-[#485dac] mb-6">Edit Profile</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#53b8ec] hover:bg-[#485dac] text-white font-semibold px-6 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default StudentEditProfile;
