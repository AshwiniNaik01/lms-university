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


// export default PrivateRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useSelector } from "react-redux";
import NoAccessPage from "../../pages/NoAccessPage.jsx";
import { canAccessModule, canPerformAction } from "../../utils/permissionUtils";

const PrivateRoute = ({ roles = [], requiredModule = null, requiredAction = null }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const rolePermissions = useSelector((state) => state.permissions.rolePermissions);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser?.user?.role?.toLowerCase();

  // ---- ROLE CHECK ----
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <NoAccessPage />;
  }

  // ---- MODULE / ACTION PERMISSION CHECK ----
  if (requiredModule && requiredAction) {
    const canAccess = canPerformAction(rolePermissions, requiredModule.toLowerCase(), requiredAction.toLowerCase());

    if (!canAccess) {
      return <NoAccessPage />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
