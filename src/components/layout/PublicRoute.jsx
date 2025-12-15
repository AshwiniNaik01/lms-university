import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) return null; // or a loader/spinner

  if (isAuthenticated) {
    const role = currentUser?.user?.role?.toLowerCase();

    if (role === "trainer") {
      return <Navigate to="/trainer/dashboard" replace />;
    }

    if (role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    // fallback for admin or other roles
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;


// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// // import { useAuth } from "../../contexts/AuthContext";

// const PublicRoute = () => {
//   const { isAuthenticated, currentUser, loading } = useAuth();

//   if (loading) return null;

//   if (isAuthenticated) {
//     const role = currentUser?.user?.role?.toLowerCase();

//     if (role === "trainer") {
//       return <Navigate to="/trainer/dashboard" replace />;
//     }

//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default PublicRoute;
