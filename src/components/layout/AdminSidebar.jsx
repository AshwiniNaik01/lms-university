
import { useState } from "react";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaFolderOpen,
  FaLayerGroup,
  FaRegFileAlt,
  FaStickyNote,
  FaTasks,
  FaUserCog,
  FaUserTie,
  FaVideo
} from "react-icons/fa";
import { MdOutlineClass, MdOutlineDashboard } from "react-icons/md";
import { RiBook2Line, RiFolderSettingsLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";

/* 
---------------------------------------------
⚙️ Menu Configuration
---------------------------------------------
This design keeps the sidebar dynamic, 
making it easy to expand without touching component logic.
---------------------------------------------
*/
const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdOutlineDashboard />, 
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: <FaUserCog />, 
  },
  {
    label: "Sessions - Upskilling",
    path: "/admin/book-session",
    icon: <FaChalkboardTeacher />,
  },
  {
    label: "Course Management",
    icon: <RiBook2Line />,
    children: [
      {
        label: "Courses",
        icon: <FaFolderOpen />,
        children: [
          { label: "Add Courses", icon: <FaRegFileAlt />, path: "/admin/add-courses" },
          {
            label: "Manage Courses",
            icon: <RiFolderSettingsLine />,
            path: "/admin/manage-courses",
          },
        ],
      },
      {
        label: "Lectures",
        icon: <FaVideo />,
        children: [
          { label: "Add Lectures", icon: <FaRegFileAlt />, path: "/admin/add-course-videos" },
          { label: "Manage Lectures", icon: <FaLayerGroup />, path: "/admin/manage-course-videos" },
        ],
      },
      {
        label: "Curriculum",
        icon: <FaBookOpen />, 
        children: [
          { label: "Add Curriculum", icon: <FaRegFileAlt />, path: "/admin/add-curriculum" },
          {
            label: "Manage Curriculum",
            icon: <FaLayerGroup />,
            path: "/admin/manage-curriculum",
          },
        ],
      },
      {
        label: "Batches",
        icon: <MdOutlineClass />, 
        children: [
          { label: "Add Batch", icon: <FaRegFileAlt />, path: "/admin/add-batch" },
          { label: "Manage Batches", icon: <FaLayerGroup />, path: "/admin/manage-batches" },
        ],
      },
      {
        label: "Assignments",
        icon: <FaTasks />, 
        children: [
          { label: "Add Assignments", icon: <FaRegFileAlt />, path: "/admin/add-assignment" },
          {
            label: "Manage Assignments",
            icon: <FaLayerGroup />,
            path: "/admin/manage-assignments",
          },
        ],
      },
      {
        label: "Study Material",
        icon: <FaStickyNote />, 
        children: [
          { label: "Add Study Material", icon: <FaRegFileAlt />, path: "/admin/add-notes" },
          { label: "Manage Study Material", icon: <FaLayerGroup />, path: "/admin/manage-notes" },
        ],
      },
    ],
  },
  {
    label: "Enrollment Overview",
    path: "/admin/enrollments",
    icon: <FaClipboardList />, 
  },
  {
    label: "Trainer Management",
    path: "/admin/trainer-management",
    icon: <FaUserTie />, 
  },
  // {
  //   label: "Logout",
  //   path: "/login",
  //   icon: <FaSignOutAlt />, 
  // },
];

/* 
---------------------------------------------
📌 SidebarMenuItem Component
---------------------------------------------
- Handles both single links and nested menus recursively.
- `expandedMenus` tracks which menus are open.
- Uses indentation (via `level`) for nested visual hierarchy.
---------------------------------------------
*/
/* 
---------------------------------------------
📌 SidebarMenuItem Component
---------------------------------------------
- Handles both single links and nested menus recursively.
- Supports collapsible sections via `expandedMenus` state.
- Adds indentation levels for nested hierarchy (via `level`).
---------------------------------------------
*/
const SidebarMenuItem = ({ item, expandedMenus, toggleSubmenu, level = 0 }) => {
  const isExpanded = expandedMenus.includes(item.label);
  const paddingLeft = `${level * 16 + 20}px`; // nested indentation

  if (item.children) {
    return (
      <div>
        {/* --- Parent menu button --- */}
        <button
          onClick={() => toggleSubmenu(item.label)}
          className={`w-full flex items-center justify-between text-gray-700 
                      hover:bg-indigo-50 rounded-lg py-2.5 px-3 transition-all 
                      duration-200 font-medium ${
                        isExpanded ? "text-indigo-600 bg-indigo-50" : ""
                      }`}
          style={{ paddingLeft }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </div>
          <span className="text-sm">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>

        {/* --- Collapsible nested section --- */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-fit mt-1" : "max-h-0"
          }`}
        >
          {item.children.map((child, idx) => (
            <SidebarMenuItem
              key={idx}
              item={child}
              expandedMenus={expandedMenus}
              toggleSubmenu={toggleSubmenu}
              level={level + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Simple link menu item ---
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 
         ${
           isActive
             ? "bg-indigo-600 text-white shadow-md"
             : "text-gray-700 hover:bg-indigo-50"
         }`
      }
      style={{ paddingLeft }}
    >
      <span className="text-lg">{item.icon}</span>
      {item.label}
    </NavLink>
  );
};

/* 
---------------------------------------------
🧭 AdminSidebar Component
---------------------------------------------
- Fixed sidebar with a scrollable menu section.
- Header stays sticky.
- Logout button fixed at the bottom.
---------------------------------------------
*/
const AdminSidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState([]);
  const navigate = useNavigate();

  // Toggle nested menu expand/collapse
  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  // Handle logout logic
  const handleLogout = () => {
    // Example: Clear auth token from localStorage or context
    localStorage.removeItem("authToken");

    // Navigate back to login page
    navigate("/login");

    // Optional: You can also trigger a toast notification here
  };

  return (
  <aside className="fixed left-0 w-72 h-screen bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 shadow-md flex flex-col">
  {/* --- Sidebar Header --- */}
  <div className="px-6 py-5 border-b bg-white sticky top-0 z-10 shadow-sm">
    <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
      Admin Panel
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Manage courses, users, and content
    </p>
  </div>

  {/* --- Scrollable Navigation --- */}
  <div
  className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"
  style={{ maxHeight: 500 }}
>
  {/* <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"> */}
    {menuItems.map((item, index) => (
      <SidebarMenuItem
        key={index}
        item={item}
        expandedMenus={expandedMenus}
        toggleSubmenu={toggleSubmenu}
      />
    ))}
  </div>

  {/* --- Footer / Logout Section --- */}
  {/* <div className="px-6 py-4 border-t bg-white sticky bottom-0 z-10">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
    >
      <FaSignOutAlt className="text-lg" />
      Logout
    </button>
  </div> */}
</aside>

  );
};

export default AdminSidebar;