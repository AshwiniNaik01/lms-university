import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

const PrivateRoute = ({ roles }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  console.log("PrivateRoute:", { isAuthenticated, currentUser, loading, roles });

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const userRole = currentUser?.user?.role;
    console.log("User role:", userRole);
    if (!userRole || !roles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};


export default PrivateRoute;
