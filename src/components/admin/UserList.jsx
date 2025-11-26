

import { useEffect, useState } from "react";
import { fetchAllUsersAdmin } from "../../api/admin.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ScrollableTable from "../table/ScrollableTable.jsx";

/**
 * UserList Component
 * ------------------
 * Displays all registered users for admin management.
 * Fetches data from API and renders a professional, scrollable table.
 *
 * Features:
 * - Loading state with animation
 * - Error state handling
 * - Scrollable table with sticky header
 * - Responsive and modern UI
 */
const UserList = () => {
  const [users, setUsers] = useState([]); // Stores fetched users
  const [error, setError] = useState(""); // Stores error messages
  const [loading, setLoading] = useState(true); // Loading state
  const { token } = useAuth(); // Auth token for API calls

  /**
   * Fetch all users from the admin API
   */
const loadUsers = async () => {
  setLoading(true); // Start loading
  try {
    const fetchedUsers = await fetchAllUsersAdmin(token);
    // Sort users by role alphabetically
    const sortedUsers = (fetchedUsers || []).sort((a, b) =>
      b.role.localeCompare(a.role)
    );
    setUsers(sortedUsers); // Update users state
    setError(""); // Clear previous errors
  } catch (err) {
    setError("Failed to load users."); // Display error
    console.error("Error fetching users:", err);
  } finally {
    setLoading(false); // Stop loading
  }
};


  // Fetch users whenever the auth token changes
  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  // Define table columns
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

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading users...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  // --- Main UI ---
  return (
    <div className="max-h-screen p-2">
      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* Header */}
        <header className="fiexd px-6 py-5 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">
            User Management
          </h1>
        
        </header>

        {/* Table / Empty State */}
        <div className="p-2">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 italic text-lg py-12">
              No users found.
            </p>
          ) : (
            <ScrollableTable columns={columns} data={users} maxHeight="440px" />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
