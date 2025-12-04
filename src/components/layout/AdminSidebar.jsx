// ========================= AdminSidebar.jsx ===============================

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaFileAlt,
  FaFolderOpen,
  FaGraduationCap,
  FaLayerGroup,
  FaRegFileAlt,
  FaStickyNote,
  FaTasks,
  FaUserCog,
  FaUserTie,
  FaVideo,
} from "react-icons/fa";
import {
  MdOutlineClass,
  MdOutlineDashboard,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { RiBook2Line, RiFolderSettingsLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import apiClient from "../../api/axiosConfig.js";
// import { fetchPermissions } from "../../redux/slices/permissionsSlice";
import { canAccessModule, canPerformAction } from "../../utils/permissionUtils";
import { useDispatch, useSelector } from "react-redux";
import { setPermissions  } from "../../features/permissionsSlice.js";


// ----------------------- MENU CONFIG ------------------------------
const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <MdOutlineDashboard />,
    module: "*",
    adminOnly: true,  
  },
  {
    label: "User Management",
    path: "/users",
    icon: <FaUserCog />,
    module: "user",
     action: "read",
     adminOnly: true,  
  },
  {
    label: "Role Based Permissions",
    path: "/role-permission",
    icon: <FaUserCog />,
    module: "role",
    adminOnly: true,  
  },
  {
    label: "Sessions - Upskilling",
    path: "/book-session",
    icon: <FaChalkboardTeacher />,
    module: "session",
    action: "read",
  },
  {
    label: "Training Management",
    icon: <RiBook2Line />,
    module: "course",
    children: [
      {
        label: "Training Program Management",
        icon: <FaFolderOpen />,
        module: "course",
        children: [
          {
            label: "Add Training Program",
            icon: <FaRegFileAlt />,
            path: "/add-courses",
            action: "create",
            module: "course",
          },
          {
            label: "Manage Training Program",
            icon: <RiFolderSettingsLine />,
            path: "/manage-courses",
            action: "read",
            module: "course",
          },
        ],
      },

      // LECTURE
      {
        label: "Recordings",
        icon: <FaVideo />,
        module: "lecture",
        children: [
          {
            label: "Add Recording",
            icon: <FaFileAlt />,
            path: "/add-course-videos",
            action: "create",
            module: "lecture",
          },
          {
            label: "Manage Recording",
            icon: <FaLayerGroup />,
            path: "/manage-course-videos",
            action: "read",
            module: "lecture",
          },
        ],
      },

      // CURRICULUM
      {
        label: "Curriculum",
        icon: <FaBookOpen />,
        module: "curriculum",
        children: [
          {
            label: "Add Curriculum",
            icon: <FaRegFileAlt />,
            path: "/add-curriculum",
            action: "create",
            module: "curriculum",
          },
          {
            label: "Manage Curriculum",
            icon: <FaLayerGroup />,
            path: "/manage-curriculum",
            action: "read",
            module: "curriculum",
          },
        ],
      },

      // BATCHES
      {
        label: "Batches",
        icon: <MdOutlineClass />,
        module: "batch",
        children: [
          {
            label: "Add Batch",
            icon: <FaGraduationCap />,
            path: "/add-batch",
            action: "create",
            module: "batch",
          },
          {
            label: "Manage Batches",
            icon: <FaLayerGroup />,
            path: "/manage-batches",
            action: "read",
            module: "batch",
          },
        ],
      },

  {
    label: "Prerequisite",
    icon: <FaTasks />,
    module: "prerequisite",
    children: [
      {
        label: "Add Prerequisite",
        icon: <FaRegFileAlt />,
        path: "/add-prerequisite",
        action: "create",
        module: "prerequisite",
      },
      {
        label: "Manage Prerequisite",
        icon: <FaLayerGroup />,
        path: "/manage-prerequisite",
        action: "read",
        module: "prerequisite",
      },
    ],
  },

      // ASSIGNMENT
      {
        label: "Assignment Management",
        icon: <FaTasks />,
        module: "assignment",
        children: [
          {
            label: "Add Assignment",
            icon: <FaFileAlt />,
            path: "/add-assignment",
            action: "create",
            module: "assignment",
          },
          {
            label: "Manage Assignments",
            icon: <FaLayerGroup />,
            path: "/manage-assignments",
            action: "read",
            module: "assignment",
          },
        ],
      },

      // NOTES
      {
        label: "Reference Materials Repository",
        icon: <FaStickyNote />,
        module: "note",
        children: [
          {
            label: "Add Reference Material Repository",
            icon: <FaRegFileAlt />,
            path: "/add-notes",
            action: "create",
            module: "note",
          },
          {
            label: "Manage Reference Material Repository",
            icon: <FaLayerGroup />,
            path: "/manage-notes",
            action: "read",
            module: "note",
          },
        ],
      },

      // STUDENTS
      {
        label: "Enroll Student",
        icon: <FaClipboardList />,
        module: "enrollment",
        children: [
          {
            label: "Enroll Student",
            icon: <FaRegFileAlt />,
            path: "/enroll-student",
            action: "create",
            module: "enrollment",
          },
          {
            label: "Enrolled Student List",
            icon: <FaLayerGroup />,
            path: "/enrolled-student-list",
            action: "read",
            module: "enrollment",
          },
        ],
      },

      // MEETING
      {
        label: "Meeting Management",
        icon: <MdOutlineMeetingRoom />,
        module: "meeting",
        children: [
          {
            label: "Add Meeting",
            icon: <FaRegFileAlt />,
            path: "/add-meeting",
            action: "create",
            module: "meeting",
          },
          {
            label: "Manage Meeting",
            icon: <FaCalendarAlt />,
            path: "/manage-meeting",
            action: "read",
            module: "meeting",
          },
        ],
      },
      

       // Feedback
      {
        label: "Feedback",
        icon: <FaStickyNote />,
        module: "feedback",
        children: [
          {
            label: "Add Feedback Questions",
            icon: <FaRegFileAlt />,
            path: "/create-feedback",
            action: "create",
            module: "feedback",
          },
          {
            label: "Manage Feedback Questions",
            icon: <FaLayerGroup />,
            path: "/manage-feedback",
            action: "read",
            module: "feedback",
          },
        ],
      },
    ],
  },

  // TESTS
  {
    label: "Assessment Tests",
    icon: <FaTasks />,
    module: "test",
    children: [
      {
        label: "Add Test",
        icon: <FaRegFileAlt />,
        path: "/add-test",
        action: "create",
        module: "test",
      },
      {
        label: "Manage Test",
        icon: <FaLayerGroup />,
        path: "/manage-test",
        action: "read",
        module: "test",
      },
    ],
  },

  // TRAINER
  {
    label: "Trainer Management",
    path: "/trainer-management",
    icon: <FaUserTie />,
    module: "trainer",
     action: "read",
     adminOnly: true,  
  },
];

// --------------------- SIDEBAR COMPONENT -------------------------
const AdminSidebar = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.user?.role;
  

  const dispatch = useDispatch();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [expandedMenus, setExpandedMenus] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (!userRole || Object.keys(rolePermissions).length > 0) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/api/role");
        const roles = res?.data?.message || [];
        const matchedRole = roles.find((r) => r.role === userRole);

        if (!matchedRole) {
          dispatch(setPermissions({}));
        } else {
          const permMap = {};
          matchedRole.permissions.forEach((p) => {
            permMap[p.module] = p.actions;
          });

          dispatch(setPermissions(permMap));
        }
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
        dispatch(setPermissions({}));
      } finally {
        setLoading(false);
      }
    };

    fetchRolePermissions();
  }, [userRole, rolePermissions, dispatch]);

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  if (!userRole || loading || Object.keys(rolePermissions).length === 0) {
    return <div>Loading sidebar...</div>;
  }

  return (
    <aside className="fixed left-0 w-72 h-screen bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 shadow-md flex flex-col">
      {/* Sidebar Header */}
      <div className="px-6 py-5 border-b bg-white sticky top-0 z-10 shadow-sm">
        <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-500 mt-1">Role: {userRole}</p>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 mb-40">
        {menuItems.map((item, idx) => (
          <SidebarItem
            key={idx}
            item={item}
            expandedMenus={expandedMenus}
            toggleSubmenu={toggleSubmenu}
            rolePermissions={rolePermissions}
          />
        ))}
      </div>
    </aside>
  );
};

// ------------------ Sidebar Item (Recursive) -------------------
const SidebarItem = ({ item, expandedMenus, toggleSubmenu, rolePermissions, level = 0 }) => {
 const { currentUser } = useAuth();
  const userRole = currentUser?.user?.role;

  // ⛔ HARD-CODED ADMIN ONLY
  if (item.adminOnly && userRole !== "admin") {
    return null;
  }

  const isExpanded = expandedMenus.includes(item.label);
  const paddingLeft = `${level * 16 + 20}px`;

  if (item.children) {
    const hasAccessibleChild = item.children.some((child) => {
      if (child.children) {
        return child.children.some((nested) =>
          nested.action ? canPerformAction(rolePermissions, nested.module, nested.action) : true
        );
      }
      return child.action ? canPerformAction(rolePermissions, child.module, child.action) : true;
    });

    if (!hasAccessibleChild) return null;

    return (
      <div>
        {/* Parent Menu Button */}
        <button
          onClick={() => toggleSubmenu(item.label)}
          style={{ paddingLeft }}
          className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg font-medium transition-all duration-200
            ${isExpanded ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-indigo-50"}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </div>
          <span className="text-sm">{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-fit mt-1" : "max-h-0"}`}>
          {item.children.map((child, idx) => (
            <SidebarItem
              key={idx}
              item={child}
              expandedMenus={expandedMenus}
              toggleSubmenu={toggleSubmenu}
              rolePermissions={rolePermissions}
              level={level + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  // Leaf menu item: check permissions
  if (!canAccessModule(rolePermissions, item.module)) return null;
  if (item.action && !canPerformAction(rolePermissions, item.module, item.action)) return null;

  return (
    <NavLink
      to={item.path}
      style={{ paddingLeft }}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all duration-200
          ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-indigo-50"}`
      }
    >
      <span className="text-lg">{item.icon}</span>
      {item.label}
    </NavLink>
  );
};


export default AdminSidebar;
