import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

/**
 * ------------------------------------------------------------------------
 * AdminLayout Component
 * ------------------------------------------------------------------------
 * 🔹 This is the master layout wrapper for all admin pages.
 * 🔹 The sidebar remains fixed on the left side of the screen.
 * 🔹 The right side (main content area) is fully scrollable.
 * 🔹 Every nested route (e.g., Add Course, Manage Lectures, etc.)
 *     will be rendered inside the <Outlet /> component.
 * ------------------------------------------------------------------------
 */

const AdminLayout = () => {
  return (
    <div className="flex h-[600px] overflow-hidden">
      {/* =================== Fixed Sidebar =================== */}
      <aside className="w-64 bg-white border-r shadow-md fixed h-full left-0 z-20">
        <AdminSidebar />
      </aside>

      {/* =================== Scrollable Main Section =================== */}
      <main
        className="flex-1 ml-67 bg-blue-50 max-h-[600px] overflow-y-auto p-6 transition-all duration-300">
        {/* 
          <Outlet /> dynamically renders the nested route component.
          Example: AddNotes, ManageLectures, etc.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
