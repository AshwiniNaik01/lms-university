// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx";

// const PrivateRoute = ({ roles }) => {
//   const { isAuthenticated, currentUser, loading } = useAuth();

//   console.log("PrivateRoute:", { isAuthenticated, currentUser, loading, roles });

//   if (loading) return null;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && roles.length > 0) {
//     const userRole = currentUser?.user?.role;
//     console.log("User role:", userRole);
//     if (!userRole || !roles.includes(userRole)) {
//       return <Navigate to="/" replace />;
//     }
//   }

//   return <Outlet />;
// };


// src/components/PrivateRoute/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useSelector } from "react-redux";
import NoAccessPage from "../../pages/NoAccessPage.jsx";
import { canPerformAction } from "../../utils/permissionUtils";

const PrivateRoute = ({ roles = [], requiredModule = null, requiredAction = null }) => {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const rolePermissions = useSelector((state) => state.permissions.rolePermissions);

  // ---- Show loading indicator while auth state is loading ----
  if (authLoading) return <div>Loading...</div>;

  // ---- Redirect if not authenticated ----
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser?.user?.role?.toLowerCase();

  // ---- ROLE CHECK (optional) ----
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <NoAccessPage />;
  }

  // ---- MODULE / ACTION PERMISSION CHECK (optional) ----
  if (requiredModule && requiredAction) {
    const canAccess = canPerformAction(
      rolePermissions || [],
      requiredModule.toLowerCase(),
      requiredAction.toLowerCase()
    );

    if (!canAccess) {
      return <NoAccessPage />;
    }
  }

  // ---- If all checks pass, render nested routes ----
  return <Outlet />;
};

export default PrivateRoute;



// // export default PrivateRoute;
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx";
// import { useSelector } from "react-redux";
// import NoAccessPage from "../../pages/NoAccessPage.jsx";
// import { canAccessModule, canPerformAction } from "../../utils/permissionUtils";

// const PrivateRoute = ({ roles = [], requiredModule = null, requiredAction = null }) => {
//   const { isAuthenticated, currentUser, loading } = useAuth();
//   const rolePermissions = useSelector((state) => state.permissions.rolePermissions);

//   if (loading) return null;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = currentUser?.user?.role?.toLowerCase();

//   // ---- ROLE CHECK ----
//   if (roles.length > 0 && !roles.includes(userRole)) {
//     return <NoAccessPage />;
//   }

//   // ---- MODULE / ACTION PERMISSION CHECK ----
//   if (requiredModule && requiredAction) {
//     const canAccess = canPerformAction(rolePermissions, requiredModule.toLowerCase(), requiredAction.toLowerCase());

//     if (!canAccess) {
//       return <NoAccessPage />;
//     }
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;
