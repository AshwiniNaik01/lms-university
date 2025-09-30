// pages/profile/view.jsx
import { useAuth } from "../../contexts/AuthContext";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";

const StudentViewProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser?.user) {
    return <p>Please log in to view your profile.</p>;
  }

  const user = currentUser.user;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#485dac]">Your Profile</h1>
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-[#53b8ec] hover:bg-[#485dac] text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-gray-600 text-sm">First Name</h2>
          <p className="text-lg font-medium">{user.firstName}</p>
        </div>
        <div>
          <h2 className="text-gray-600 text-sm">Last Name</h2>
          <p className="text-lg font-medium">{user.lastName}</p>
        </div>
        <div className="sm:col-span-2">
          <h2 className="text-gray-600 text-sm">Email</h2>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
        {/* Add more fields here if needed */}
      </div>
    </div>
  );
};

export default StudentViewProfile;
