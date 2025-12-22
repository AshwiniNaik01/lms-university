import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ScrollableTable from "../table/ScrollableTable.jsx";
import Modal from "../popupModal/Modal.jsx";
import apiClient from "../../api/axiosConfig.js";
import ToggleSwitch from "../form/ToggleSwitch.jsx";
import Swal from "sweetalert2";
import { usePassword } from "../hooks/usePassword.js";
import { FaLock } from "react-icons/fa";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetUser, setResetUser] = useState(null);
const [confirmPassword, setConfirmPassword] = useState("");


const {
  password: resetPassword,
  setPassword: setResetPassword,
  generate: generateResetPassword,
} = usePassword("");

  // Inside your component
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const { token } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    role: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  // Inside your component
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("admin"); // Role filter
  const { password, setPassword, generate } = usePassword("");

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };
  // Sync password state with formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, password }));
  }, [password]);

  // --- Fetch roles ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/api/role", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data.message || []);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    if (token) fetchRoles();
  }, [token]);

  // --- Fetch users and trainers with optional role filter ---
  const loadUsers = async (roleFilter = "") => {
    setLoading(true);
    try {
      const res = await apiClient.post(
        "/api/users",
        { role: roleFilter },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchedUsers = res.data.data?.users || [];
      const fetchedTrainers = res.data.data?.trainers || [];

      let allItems = roleFilter
        ? [
            ...fetchedUsers.filter((u) => u.role === roleFilter),
            ...fetchedTrainers.filter((t) => t.role === roleFilter),
          ]
        : [...fetchedUsers, ...fetchedTrainers];

      const sortedItems = allItems.sort((a, b) => {
        const nameA = a.firstName ? `${a.firstName} ${a.lastName}` : a.fullName;
        const nameB = b.firstName ? `${b.firstName} ${b.lastName}` : b.fullName;
        return nameA.localeCompare(nameB);
      });

      setUsers(sortedItems);
      setError("");

      // Show the API success message
   
    } catch (err) {
      setError("Failed to load users.");
      console.error(err);

      // ❌ Error message
   
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers(selectedRole);
  }, [token, selectedRole]);

  useEffect(() => {
    if (isModalOpen) {
      setPassword(""); // or generate() if you want a default
    }
  }, [isModalOpen]);

  // --- Handle LoginPermission toggle ---
  const handleToggleLoginPermission = async (user) => {
    try {
      // Call the same logout API for both ON and OFF
      await apiClient.post(
        "/api/auth/logout",
        { _id: user._id, role: user.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Toggle the local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isLogin: !u.isLogin } : u
        )
      );

      Swal.fire(
        "Success",
        `${user.firstName || user.fullName} login permission ${
          user.isLogin ? "revoked" : "activated"
        }`,
        "success"
      );
    } catch (err) {
      console.error("Failed to toggle login permission", err);
      Swal.fire("Error", "Failed to toggle login permission", "error");
    }
  };


const handleResetPassword = async () => {
  if (!resetPassword || !confirmPassword) {
    Swal.fire("Error", "Password fields cannot be empty", "error");
    return;
  }

  if (resetPassword !== confirmPassword) {
    Swal.fire("Error", "Passwords do not match", "error");
    return;
  }

  try {
    await apiClient.put(
      "/api/auth/reset-password",
      {
        email: resetUser.email,
        role: resetUser.role,
        newPassword: resetPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire("Success", "Password reset successfully", "success");

    // ✅ Cleanup
    setResetUser(null);
    setResetPassword("");
    setConfirmPassword("");
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to reset password",
      "error"
    );
  }
};



//   const handleResetPassword = async () => {
//   if (resetPassword !== confirmPassword) {
//     Swal.fire("Error", "Passwords do not match", "error");
//     return;
//   }

//   try {
//     await apiClient.put(
//       "/api/auth/reset-password",
//       {
//         email: resetUser.email,
//         role: resetUser.role,
//         newPassword: resetPassword,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     Swal.fire("Success", "Password reset successfully", "success");
//     setResetUser(null);
//     setResetPassword("");
//     setConfirmPassword("");
//   } catch (err) {
//     Swal.fire(
//       "Error",
//       err.response?.data?.message || "Failed to reset password",
//       "error"
//     );
//   }
// };


  // --- Table columns ---
  const columns = [
    {
      header: "Name",
      accessor: (item) =>
        item.firstName ? `${item.firstName} ${item.lastName}` : item.fullName,
    },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: (item) =>
        item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : "",
    },
    {
      header: "Login Permission",
      accessor: (item) => (
        <ToggleSwitch
          label=""
          name={`login-${item._id}`}
          checked={item.isLogin} // reflects login permission
          onChange={() => handleToggleLoginPermission(item)}
        />
      ),
    },
{
  header: "Password",
  accessor: (item) => {
    const isVisible = visiblePasswords[item._id] || false;

    // Determine which field to show as password (user or trainer)
    const password = item.password || ""; // fallback if missing

    return (
      <div className="flex items-center space-x-2">
        <span>{isVisible ? password : ""}</span>
        <button
          type="button"
          onClick={() => togglePasswordVisibility(item._id)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  },
},


    {
  header: "Reset Password",
  accessor: (item) => (
    <button
      onClick={() => setResetUser(item)}
      className="text-indigo-600 hover:underline text-sm font-medium"
    >
      Reset
    </button>
  ),
},

  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleAddUser = async () => {
  //   setFormLoading(true);
  //   setFormError("");

  //   try {
  //     await apiClient.post("/api/auth/register", formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setIsModalOpen(false);
  //     setFormData({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       password: "",
  //       mobileNo: "",
  //       role: "",
  //     });

  //     await loadUsers(selectedRole);

  //           // Show the API success message
  //   Swal.fire({
  //     icon: "success",
  //     title: "Success",
  //     text: res.data.message || "User added successfully!",
  //     timer: 2000,
  //     showConfirmButton: false,
  //   });
  //   } catch (err) {
  //     setFormError(err.response?.data?.message || "Failed to add user");
  //          // ❌ Error message
  //    Swal.fire({
  //     icon: "error",
  //     title: "Error",
  //     text: err.response?.data?.message || "Failed to add user",
  //   });
  //     console.error(err);
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };


  const handleAddUser = async () => {
  setFormLoading(true);
  setFormError("");

  try {
    const res = await apiClient.post("/api/auth/register", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobileNo: "",
      role: "",
    });

    await loadUsers(selectedRole);

    // Show the API success message
    Swal.fire({
      icon: "success",
      title: "Success",
      text: res.data.message || "User added successfully!", // ✅ now res is defined
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    setFormError(err.response?.data?.message || "Failed to add user");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to add user",
    });
    console.error(err);
  } finally {
    setFormLoading(false);
  }
};


  if (loading)
    return <p className="text-center py-12 animate-pulse">Loading users...</p>;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;

  // return (
  //   <div className="max-h-screen p-2">
  //     <div className="max-w-7xl mx-auto overflow-hidden">
  //       <header className="px-6 py-5 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between">
  //         <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">User Management</h1>

  //         <div className="flex gap-2 items-center">
  //           <label>Filter by Role:</label>
  //           <select
  //             value={selectedRole}
  //             onChange={(e) => setSelectedRole(e.target.value)}
  //             className="border p-2 rounded-md"
  //           >
  //             <option value=""></option>
  //             {roles.map((roleObj) => (
  //               <option key={roleObj._id} value={roleObj.role}>
  //                 {roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1)}
  //               </option>
  //             ))}
  //           </select>
  //         </div>

  //         <button
  //           onClick={() => setIsModalOpen(true)}
  //           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  //         >
  //           Add User
  //         </button>
  //       </header>

  //       <div className="p-2">
  //         {users.length === 0 ? (
  //           <p className="text-center text-gray-500 italic text-lg py-12">No users found.</p>
  //         ) : (
  //           <ScrollableTable columns={columns} data={users} maxHeight="440px" />
  //         )}
  //       </div>
  //     </div>

  //     <Modal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       header="Add New User"
  //       primaryAction={{ label: "Add User", onClick: handleAddUser, loading: formLoading }}
  //     >
  //       <div className="space-y-3">
  //         {formError && <p className="text-red-500">{formError}</p>}
  //         <div className="flex gap-2">
  //           <input
  //             type="text"
  //             name="firstName"
  //             placeholder="First Name"
  //             value={formData.firstName}
  //             onChange={handleChange}
  //             className="flex-1 border p-2 rounded-md"
  //           />
  //           <input
  //             type="text"
  //             name="lastName"
  //             placeholder="Last Name"
  //             value={formData.lastName}
  //             onChange={handleChange}
  //             className="flex-1 border p-2 rounded-md"
  //           />
  //         </div>
  //         <input
  //           type="email"
  //           name="email"
  //           placeholder="Email"
  //           value={formData.email}
  //           onChange={handleChange}
  //           className="w-full border p-2 rounded-md"
  //         />
  //         <input
  //           type="password"
  //           name="password"
  //           placeholder="Password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           className="w-full border p-2 rounded-md"
  //         />
  //         <input
  //           type="text"
  //           name="mobileNo"
  //           placeholder="Mobile Number"
  //           value={formData.mobileNo}
  //           onChange={handleChange}
  //           className="w-full border p-2 rounded-md"
  //         />

  //         <select
  //           name="role"
  //           value={formData.role}
  //           onChange={handleChange}
  //           className="w-full border p-2 rounded-md"
  //         >
  //           <option value="">Select Role</option>
  //           {roles.map((roleObj) => (
  //             <option key={roleObj._id} value={roleObj.role}>
  //               {roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1)}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //     </Modal>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <header className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">
            User Management
          </h1>

          <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700">
      Filter by Role
    </label>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
    >
      {roles.map((roleObj) => (
        <option key={roleObj._id} value={roleObj.role}>
          {roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1)}
        </option>
      ))}
    </select>
  </div>


            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
            >
              + Add User
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4">
          {users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try changing the filter or add a new user
              </p>
            </div>
          ) : (
            <ScrollableTable columns={columns} data={users} maxHeight="460px" />
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Add New User"
        primaryAction={{
          label: "Add User",
          onClick: handleAddUser,
          loading: formLoading,
        }}
      >
        <div className="space-y-6">
          {/* Error message */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {formError}
            </div>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="input border-2 border-blue-100 p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="input border-2 border-blue-100 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              // placeholder="mail id"
              value={formData.email}
              onChange={handleChange}
              className="input border-2 border-blue-100 p-2 rounded-lg"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="flex items-center relative">
                {/* Input field */}
                <input
                  type={showPassword ? "text" : "password"} // toggle visibility
                  name="password"
                  value={password} // from usePassword hook
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="relative right-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

                {/* Generate button */}
                {/* Auto-generate button */}
                <button
                  type="button"
                  onClick={() => generate(6)} // generate 6-char password
                  className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
                >
                  Auto Generate
                </button>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Mobile Number*
              </label>
              <input
                type="text"
                name="mobileNo"
                // placeholder="+91 9876543210"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="flex flex-col w-50">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Role*
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input border-2 border-blue-100 p-2 rounded-lg"
            >
              <option value="">Select Role</option>
              {roles.map((roleObj) => (
                <option key={roleObj._id} value={roleObj.role}>
                  {roleObj.role.charAt(0).toUpperCase() + roleObj.role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

{/* <Modal
  isOpen={!!resetUser}
  // onClose={() => setResetUser(null)}
  onClose={() => {
  setResetUser(null);
  setResetPassword("");       // clear new password
  setConfirmPassword("");     // clear confirm password
  setShowNewPassword(false);  // hide new password
  setShowConfirmPassword(false); // hide confirm password
}}

  header={`Reset Password`}
  primaryAction={{
    label: "Save",
    onClick: handleResetPassword,
  }}
>
  <div className="space-y-4">
    <div className="text-sm text-gray-600">
      Reset password for <b>{resetUser?.email}</b>
    </div>

    {/* New Password */}
    {/* <div className="flex flex-col relative">
      <label className="text-sm font-medium">New Password</label>
      <div className="flex items-center relative">
        <input
          type={showNewPassword ? "text" : "password"}
          value={resetPassword}
          onChange={(e) => setResetPassword(e.target.value)}
          className="w-full border-2 border-blue-100 p-2 rounded-lg pr-10"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-2 text-gray-500 hover:text-gray-700"
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div> */}

    {/* Confirm Password */}
    {/* <div className="flex flex-col relative">
      <label className="text-sm font-medium">Confirm Password</label>
      <div className="flex items-center relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border-2 border-blue-100 p-2 rounded-lg pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div> */}

    {/* Auto Generate */}
    {/* <button
      type="button"
      onClick={() => generateResetPassword(8)}
      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md"
    >
      Auto Generate
    </button>
  </div>
</Modal> */} 


<Modal
  isOpen={!!resetUser}
  onClose={() => {
    setResetUser(null);
    setResetPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }}
  header="Reset Password"
  primaryAction={{
    label: "Save",
    onClick: handleResetPassword,
  }}
>
  <div className="space-y-4">
    <p className="text-sm text-gray-600">
      Reset password for <b>{resetUser?.email}</b>
    </p>

    {/* New Password */}
    <div className="relative">
      <label className="text-sm font-medium">New Password</label>
      <input
        type={showNewPassword ? "text" : "password"}
        value={resetPassword}
        onChange={(e) => setResetPassword(e.target.value)}
        className="w-full border p-2 rounded-lg pr-10"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-9 text-gray-500"
      >
        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

    {/* Confirm Password */}
    <div className="relative">
      <label className="text-sm font-medium">Confirm Password</label>
      <input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border p-2 rounded-lg pr-10"
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-9 text-gray-500"
      >
        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

    {/* Auto Generate */}
    <button
      type="button"
      onClick={() => generateResetPassword(6)}
      className="px-3 py-1 bg-indigo-600 text-white rounded-md"
    >
      Auto Generate
    </button>
  </div>
</Modal>


    </div>
  );
};

export default UserList;
