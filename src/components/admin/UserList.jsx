import { useEffect, useState } from "react";
import { fetchAllUsersAdmin } from "../../api/admin.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ScrollableTable from "../table/ScrollableTable.jsx";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch all users for admin side

  const loadUsers = async () => {
    setLoading(true); // Start loading
    try {
      const fetchedUsers = await fetchAllUsersAdmin(token);
      setUsers(fetchedUsers || []);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to load users."); // Display error message
      console.error("Error fetching users:", err);
    }
    setLoading(false); // Done loading
  };

  // triggers user data fetching whenever token changes
  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  // Define table columns with headers and accessors for user data
  const columns = [
    {
      header: "Name",
      accessor: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: (user) =>
        user.role.charAt(0).toUpperCase() + user.role.slice(1),
    },
  ];

  // Render loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading users...</p>
      </div>
    );
  }

  // Render error state UI
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[700px] p-8 bg-gradient-to-r from-pink-200 via-blue-300 to-blue-200">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="relative z-50 flex items-center justify-between px-6 py-5 bg-white border-b border-indigo-200">
          <h1 className="text-3xl font-extrabold text-indigo-900 tracking-wide">
            User Management
          </h1>
        </header>

        {/* show message if no users, else show table */}
        <div>
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg italic">
              No users found.
            </p>
          ) : (
            <ScrollableTable columns={columns} data={users} maxHeight="600px" />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
