// import { useState } from "react";
// import {
//   FaBookOpen,
//   FaChalkboardTeacher,
//   FaChevronDown,
//   FaChevronUp,
//   FaClipboardList,
//   FaFolderOpen,
//   FaLayerGroup,
//   FaRegFileAlt,
//   FaStickyNote,
//   FaTasks,
//   FaUserCog,
//   FaUserTie,
//   FaVideo,
//   FaGraduationCap,
//   FaCalendarAlt,
//   FaFileAlt,
// } from "react-icons/fa";
// import {
//   MdOutlineClass,
//   MdOutlineDashboard,
//   MdOutlineMeetingRoom,
// } from "react-icons/md";
// import { RiBook2Line, RiFolderSettingsLine } from "react-icons/ri";
// import { NavLink, useNavigate } from "react-router-dom";
// // import {   MdOutlineMeetingRoom } from "react-icons/md";

// /*
// ---------------------------------------------
// ⚙️ Menu Configuration
// ---------------------------------------------
// This design keeps the sidebar dynamic,
// making it easy to expand without touching component logic.
// ---------------------------------------------
// */

// const menuItems = [
//   {
//     label: "Dashboard",
//     path: "/admin/dashboard",
//     icon: <MdOutlineDashboard />,
//   },
//   {
//     label: "User Management",
//     path: "/admin/users",
//     icon: <FaUserCog />,
//   },
//   {
//     label: "Sessions - Upskilling",
//     path: "/admin/book-session",
//     icon: <FaChalkboardTeacher />,
//   },
//   {
//     label: "Training Management",
//     icon: <RiBook2Line />,
//     children: [
//       {
//         label: "Training Program Management",
//         icon: <FaFolderOpen />,
//         children: [
//           { label: "Add Training Program", icon: <FaRegFileAlt />, path: "/admin/add-courses" },
//           { label: "Manage Training Program", icon: <RiFolderSettingsLine />, path: "/admin/manage-courses" },
//         ],
//       },
//       {
//         label: "Recordings",
//         icon: <FaVideo />,
//         children: [
//           { label: "Add Recording", icon: <FaFileAlt />, path: "/admin/add-course-videos" },
//           { label: "Manage Recording", icon: <FaLayerGroup />, path: "/admin/manage-course-videos" },
//         ],
//       },
//       {
//         label: "Curriculum",
//         icon: <FaBookOpen />,
//         children: [
//           { label: "Add Curriculum", icon: <FaRegFileAlt />, path: "/admin/add-curriculum" },
//           { label: "Manage Curriculum", icon: <FaLayerGroup />, path: "/admin/manage-curriculum" },
//         ],
//       },
//       {
//         label: "Batches",
//         icon: <MdOutlineClass />,
//         children: [
//           { label: "Add Batch", icon: <FaGraduationCap />, path: "/admin/add-batch" },
//           { label: "Manage Batches", icon: <FaLayerGroup />, path: "/admin/manage-batches" },
//         ],
//       },
//       {
//         label: "Assignment Management",
//         icon: <FaTasks />,
//         children: [
//           { label: "Add Assignment", icon: <FaFileAlt />, path: "/admin/add-assignment" },
//           { label: "Manage Assignments", icon: <FaLayerGroup />, path: "/admin/manage-assignments" },
//         ],
//       },
//       {
//         label: "Reference Materials Repository",
//         icon: <FaStickyNote />,
//         children: [
//           { label: "Add Reference Material Repository", icon: <FaRegFileAlt />, path: "/admin/add-notes" },
//           { label: "Manage Reference Material Repository", icon: <FaLayerGroup />, path: "/admin/manage-notes" },
//         ],
//       },
//       {
//         label: "Enroll Student",
//         icon: <FaClipboardList />,
//         children: [
//           { label: "Enroll Student", icon: <FaRegFileAlt />, path: "/admin/enroll-student" },
//           { label: "Enrolled Student List", icon: <FaLayerGroup />, path: "/admin/enrolled-student-list" },
//         ],
//       },
//       {
//         label: "Meeting Management",
//         icon: <MdOutlineMeetingRoom />,
//         children: [
//           { label: "Add Meeting", icon: <FaRegFileAlt />, path: "/admin/add-meeting" },
//           { label: "Manage Meeting", icon: <FaCalendarAlt />, path: "/admin/manage-meeting" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Assessment Tests",
//     icon: <FaTasks />,
//     children: [
//       { label: "Add Test", icon: <FaRegFileAlt />, path: "/admin/add-test" },
//       { label: "Manage Test", icon: <FaLayerGroup />, path: "/admin/manage-test" },
//     ],
//   },
//   {
//     label: "Trainer Management",
//     path: "/admin/trainer-management",
//     icon: <FaUserTie />,
//   },
// ];

// /*
// ---------------------------------------------
// 📌 SidebarMenuItem Component
// ---------------------------------------------
// - Handles both single links and nested menus recursively.
// - Supports collapsible sections via `expandedMenus` state.
// - Adds indentation levels for nested hierarchy (via `level`).
// ---------------------------------------------
// */
// const SidebarMenuItem = ({ item, expandedMenus, toggleSubmenu, level = 0 }) => {
//   const isExpanded = expandedMenus.includes(item.label);
//   const paddingLeft = `${level * 16 + 20}px`; // nested indentation

//   if (item.children) {
//     return (
//       <div>
//         {/* --- Parent menu button --- */}
//         <button
//           onClick={() => toggleSubmenu(item.label)}
//           className={`w-full flex items-center justify-between text-gray-700
//                       hover:bg-indigo-50 rounded-lg py-2.5 px-3 transition-all
//                       duration-200 font-medium ${
//                         isExpanded ? "text-indigo-600 bg-indigo-50" : ""
//                       }`}
//           style={{ paddingLeft }}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-lg">{item.icon}</span>
//             {item.label}
//           </div>
//           <span className="text-sm">
//             {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//           </span>
//         </button>

//         {/* --- Collapsible nested section --- */}
//         <div
//           className={`overflow-hidden transition-all duration-300 ease-in-out ${
//             isExpanded ? "max-h-fit mt-1" : "max-h-0"
//           }`}
//         >
//           {item.children.map((child, idx) => (
//             <SidebarMenuItem
//               key={idx}
//               item={child}
//               expandedMenus={expandedMenus}
//               toggleSubmenu={toggleSubmenu}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // --- Simple link menu item ---
//   return (
//     <NavLink
//       to={item.path}
//       className={({ isActive }) =>
//         `flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all duration-200
//          ${
//            isActive
//              ? "bg-indigo-600 text-white shadow-md"
//              : "text-gray-700 hover:bg-indigo-50"
//          }`
//       }
//       style={{ paddingLeft }}
//     >
//       <span className="text-lg">{item.icon}</span>
//       {item.label}
//     </NavLink>
//   );
// };

// /*
// ---------------------------------------------
// 🧭 AdminSidebar Component
// ---------------------------------------------
// - Fixed sidebar with a scrollable menu section.
// - Header stays sticky.
// - Logout button fixed at the bottom.
// ---------------------------------------------
// */
// const AdminSidebar = () => {
//   const [expandedMenus, setExpandedMenus] = useState([]);
//   const navigate = useNavigate();

//   // Toggle nested menu expand/collapse
//   const toggleSubmenu = (label) => {
//     setExpandedMenus((prev) =>
//       prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
//     );
//   };

//   // Handle logout logic
//   const handleLogout = () => {
//     // Example: Clear auth token from localStorage or context
//     localStorage.removeItem("authToken");

//     // Navigate back to login page
//     navigate("/login");

//     // Optional: You can also trigger a toast notification here
//   };

//   return (
//     <aside className="fixed left-0 w-72 h-screen bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 shadow-md flex flex-col">
//       {/* --- Sidebar Header --- */}
//       <div className="px-6 py-5 border-b bg-white sticky top-0 z-10 shadow-sm">
//         <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
//           Admin Panel
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage training, users, and content
//         </p>
//       </div>

//       {/* --- Scrollable Navigation --- */}
//       <div
//         className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"
//         style={{ maxHeight: 500 }}
//       >
//         {/* <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100"> */}
//         {menuItems.map((item, index) => (
//           <SidebarMenuItem
//             key={index}
//             item={item}
//             expandedMenus={expandedMenus}
//             toggleSubmenu={toggleSubmenu}
//           />
//         ))}
//       </div>

//       {/* --- Footer / Logout Section --- */}
//       {/* <div className="px-6 py-4 border-t bg-white sticky bottom-0 z-10">
//     <button
//       onClick={handleLogout}
//       className="w-full flex items-center gap-2 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition"
//     >
//       <FaSignOutAlt className="text-lg" />
//       Logout
//     </button>
//   </div> */}
//     </aside>
//   );
// };

// export default AdminSidebar;


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
  },
  {
    label: "User Management",
    path: "/users",
    icon: <FaUserCog />,
    module: "user",
  },
  {
    label: "Role Based Permissions",
    path: "/role-permission",
    icon: <FaUserCog />,
    module: "user",
  },
  {
    label: "Sessions - Upskilling",
    path: "/book-session",
    icon: <FaChalkboardTeacher />,
    module: "session",
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
        module: "batches",
        children: [
          {
            label: "Add Batch",
            icon: <FaGraduationCap />,
            path: "/add-batch",
            action: "create",
            module: "batches",
          },
          {
            label: "Manage Batches",
            icon: <FaLayerGroup />,
            path: "/manage-batches",
            action: "read",
            module: "batches",
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
        module: "notes",
        children: [
          {
            label: "Add Reference Material Repository",
            icon: <FaRegFileAlt />,
            path: "/add-notes",
            action: "create",
            module: "notes",
          },
          {
            label: "Manage Reference Material Repository",
            icon: <FaLayerGroup />,
            path: "/manage-notes",
            action: "read",
            module: "notes",
          },
        ],
      },

      // STUDENTS
      {
        label: "Enroll Student",
        icon: <FaClipboardList />,
        module: "student",
        children: [
          {
            label: "Enroll Student",
            icon: <FaRegFileAlt />,
            path: "/enroll-student",
            action: "create",
            module: "student",
          },
          {
            label: "Enrolled Student List",
            icon: <FaLayerGroup />,
            path: "/enrolled-student-list",
            action: "read",
            module: "student",
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
  },
];

// --------------------- SIDEBAR LOGIC -------------------------

// const AdminSidebar = () => {
//   const { currentUser } = useAuth();
//   const userRole = currentUser?.user?.role;
//   const [rolePermissions, setRolePermissions] = useState({});
//   const [expandedMenus, setExpandedMenus] = useState([]);

// useEffect(() => {
//   const fetchPermissions = async () => {
//     try {
//       const res = await apiClient.get("/api/role");
//       const roles = res?.data?.message || [];
//       console.log("All roles:", roles);

//       const matchedRole = roles.find((r) => r.role === userRole);
//       console.log("Matched Role:", matchedRole);

//       if (matchedRole) {
//         const permMap = {};
//         matchedRole.permissions.forEach((p) => {
//           permMap[p.module] = p.actions;
//         });
//         console.log("Mapped Permissions:", permMap);
//         setRolePermissions(permMap);
//       }
//     } catch (err) {
//       console.error("Failed to fetch role permissions", err);
//     }
//   };

//   if (userRole) fetchPermissions();
// }, [userRole]);


//   // ✅ Wait until rolePermissions is loaded
//   if (!userRole || Object.keys(rolePermissions).length === 0) {
//     return <div>Loading sidebar...</div>;
//   }
// const canAccessModule = (module) => {
//   if (!module) return false;
//   return !!rolePermissions[module] || !!rolePermissions["*"];
// };

// const canPerformAction = (module, action) => {
//   if (!module || !action) return false;
//   return rolePermissions["*"]?.includes(action) || rolePermissions[module]?.includes(action);
// };

//   const toggleSubmenu = (label) => {
//     setExpandedMenus((prev) =>
//       prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
//     );
//   };

//   if (!userRole) return null;

//   // return (
//   //   <aside className="fixed left-0 w-72 h-screen bg-white shadow-lg border-r">
//   //     <div className="px-6 py-5 border-b bg-white sticky top-0 z-10">
//   //       <h2 className="text-2xl font-extrabold text-indigo-600">
//   //         Admin Panel
//   //       </h2>
//   //       <p className="text-sm text-gray-500">Role: {userRole}</p>
//   //     </div>

//   //     <div className="overflow-y-auto px-3 py-4">
//   //       {menuItems.map((item, idx) => (
//   //         <SidebarItem
//   //           key={idx}
//   //           item={item}
//   //           expandedMenus={expandedMenus}
//   //           toggleSubmenu={toggleSubmenu}
//   //           canAccessModule={canAccessModule}
//   //           canPerformAction={canPerformAction}
//   //         />
//   //       ))}
//   //     </div>
//   //   </aside>
//   // );

//  return (
//     <aside className="fixed left-0 w-72 h-screen bg-gradient-to-b from-white to-indigo-50 border-r border-gray-200 shadow-md flex flex-col">
//       {/* Sidebar Header */}
//       <div className="px-6 py-5 border-b bg-white sticky top-0 z-10 shadow-sm">
//         <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
//           Admin Panel
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">Role: {userRole}</p>
//       </div>

//       {/* Scrollable Menu */}
//       <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 mb-40">
//         {menuItems.map((item, idx) => (
//           <SidebarItem
//             key={idx}
//             item={item}
//             expandedMenus={expandedMenus}
//             toggleSubmenu={toggleSubmenu}
//             canAccessModule={canAccessModule}
//             canPerformAction={canPerformAction}
//           />
//         ))}
//       </div>
//     </aside>
//   );

// };

// // ------------------ Sidebar Item (Recursive) -------------------

// const SidebarItem = ({
//   item,
//   expandedMenus,
//   toggleSubmenu,
//   canAccessModule,
//   canPerformAction,
//   level = 0,
// }) => {
//   const isExpanded = expandedMenus.includes(item.label);
//   const paddingLeft = `${level * 16 + 20}px`;

//   if (item.children) {
//     // Check if any child (or nested child) is accessible
//     const hasAccessibleChild = item.children.some((child) => {
//       if (child.children) {
//         return child.children.some((nested) =>
//           nested.action
//             ? canPerformAction(nested.module, nested.action)
//             : true
//         );
//       }
//       return child.action
//         ? canPerformAction(child.module, child.action)
//         : true;
//     });

//     if (!hasAccessibleChild) return null;

//     // return (
//     //   <div>
//     //     <button
//     //       onClick={() => toggleSubmenu(item.label)}
//     //       style={{ paddingLeft }}
//     //       className={`w-full flex items-center justify-between
//     //       py-2.5 px-3 rounded-lg font-medium
//     //       ${isExpanded ? "bg-indigo-50 text-indigo-600" : "text-gray-700"}`}
//     //     >
//     //       <div className="flex items-center gap-3">
//     //         {item.icon} {item.label}
//     //       </div>
//     //       {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//     //     </button>

//     //     <div
//     //       className={`transition-all ${
//     //         isExpanded ? "max-h-fit" : "max-h-0 overflow-hidden"
//     //       }`}
//     //     >
//     //       {item.children.map((child, idx) => (
//     //         <SidebarItem
//     //           key={idx}
//     //           item={child}
//     //           expandedMenus={expandedMenus}
//     //           toggleSubmenu={toggleSubmenu}
//     //           level={level + 1}
//     //           canAccessModule={canAccessModule}
//     //           canPerformAction={canPerformAction}
//     //         />
//     //       ))}
//     //     </div>
//     //   </div>
//     // );
  
//    return (
//       <div>
//         {/* Parent Menu Button */}
//         <button
//           onClick={() => toggleSubmenu(item.label)}
//           style={{ paddingLeft }}
//           className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg font-medium transition-all duration-200
//             ${isExpanded ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-indigo-50"}`}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-lg">{item.icon}</span>
//             {item.label}
//           </div>
//           <span className="text-sm">
//             {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//           </span>
//         </button>

//         {/* Collapsible Nested Section */}
//         <div
//           className={`overflow-hidden transition-all duration-300 ease-in-out ${
//             isExpanded ? "max-h-fit mt-1" : "max-h-0"
//           }`}
//         >
//           {item.children.map((child, idx) => (
//             <SidebarItem
//               key={idx}
//               item={child}
//               expandedMenus={expandedMenus}
//               toggleSubmenu={toggleSubmenu}
//               canAccessModule={canAccessModule}
//               canPerformAction={canPerformAction}
//               level={level + 1}
//             />
//           ))}
//         </div>
//       </div>
//     )
  
//   }

//   // **Leaf items:** check permission for module/action
//   if (!canAccessModule(item.module)) return null;
//   if (item.action && !canPerformAction(item.module, item.action)) return null;

//   // return (
//   //   <NavLink
//   //     to={item.path}
//   //     style={{ paddingLeft }}
//   //     className={({ isActive }) =>
//   //       `flex items-center gap-3 py-2.5 px-3 rounded-lg ${
//   //         isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-indigo-50"
//   //       }`
//   //     }
//   //   >
//   //     {item.icon} {item.label}
//   //   </NavLink>


  
//   return (
//     <NavLink
//       to={item.path}
//       style={{ paddingLeft }}
//       className={({ isActive }) =>
//         `flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all duration-200
//           ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-indigo-50"}`
//       }
//     >
//       <span className="text-lg">{item.icon}</span>
//       {item.label}
//     </NavLink>
  
//   );
// };



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
