// src/contexts/AuthContext.jsx

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';
import { useDispatch } from "react-redux";
import { setPermissions  } from '../features/permissionsSlice';
import apiClient from '../api/axiosConfig';
// import { fetchPermissions } from "../redux/slices/permissionsSlice";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

// Function to fetch permissions for a given role
 // ✅ Fetch permissions only once
  const fetchRolePermissions = async (role) => {
    try {
      // Check localStorage first
      const savedPermissions = JSON.parse(localStorage.getItem("permissions"));
      if (savedPermissions && Object.keys(savedPermissions).length > 0) {
        dispatch(setPermissions(savedPermissions));
        return;
      }

      // Only call API if not stored
      const res = await apiClient.get("/api/role");
      const roles = res?.data?.message || [];
      const matchedRole = roles.find((r) => r.role === role);

      let permMap = {};
      if (matchedRole) {
        matchedRole.permissions.forEach((p) => {
          permMap[p.module] = p.actions;
        });
      }

      dispatch(setPermissions(permMap));
      localStorage.setItem("permissions", JSON.stringify(permMap)); // persist
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      dispatch(setPermissions({}));
    }
  };

  useEffect(() => {
  const token = Cookies.get('token');
  const userCookie = Cookies.get('user');
  const roleCookie = Cookies.get('role');

  if (!token) {
    setCurrentUser(null);
    setLoading(false);
    return;
  }

  if (userCookie) {
    try {
      const parsedUser = JSON.parse(userCookie);

      setCurrentUser({ token, user: parsedUser });

      // ✅ Dispatch permissions for this user's role
      // if (parsedUser.role) {
      //   dispatch(fetchPermissions(parsedUser.role));
      // }

         if (parsedUser.role) {
          fetchRolePermissions(parsedUser.role); // fetch & store permissions
        }

    } catch (err) {
      console.error('Invalid user cookie JSON', err);
      Cookies.remove('user');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }

    return; // Important: stop further execution
  }

  // No user cookie → Decode token as fallback
  try {
    const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(base64Payload));

    const userFromToken = {
      role: decodedPayload.role || 'unknown',
      ...decodedPayload,
    };

    setCurrentUser({ token, user: userFromToken });

    // ✅ Dispatch permissions for token role
   if (userFromToken.role) {
        fetchRolePermissions(userFromToken.role);
      }

  } catch (err) {
    console.error('Failed to decode token payload', err);
    setCurrentUser(null);
  } finally {
    setLoading(false);
  }
}, []);


// useEffect(() => {
//   const token = Cookies.get('token');
//   const userCookie = Cookies.get('user');
//   const roleCookie = Cookies.get('role');

//   console.log("🔍 token:", token);
//   console.log("🔍 user cookie:", userCookie);
//   console.log("🔍 role cookie:", roleCookie);

//   if (!token) {
//     setCurrentUser(null);
//     setLoading(false);
//     return;
//   }

//   if (userCookie) {
//     try {
//       const parsedUser = JSON.parse(userCookie);
//       setCurrentUser({ token, user: parsedUser });
//     } catch (err) {
//       console.error('Invalid user cookie JSON', err);
//       Cookies.remove('user');
//       setCurrentUser(null);
//     } finally {
//       setLoading(false);
//     }
//   } else {
//     // ✅ Fallback: decode token even if 'role' cookie is missing
//     try {
//       const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
//       const decodedPayload = JSON.parse(atob(base64Payload));

//       const userFromToken = {
//         role: decodedPayload.role || 'unknown',
//         ...decodedPayload,
//       };

//       console.log("🧩 Fallback user from token:", userFromToken);

//       setCurrentUser({ token, user: userFromToken });
//     } catch (err) {
//       console.error('Failed to decode token payload', err);
//       setCurrentUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (parsedUser.role) {
//     dispatch(fetchPermissions(parsedUser.role));
// }

// }, []);


  const register = async (formData) => {
    return await authApi.register(formData);
  };

  // const login = async (email, password, role) => {
  //   const response = await authApi.login(email, password, role);

  //   if (response.success && response.data?.token && response.data?.user) {
  //     const { token, user } = response.data;

  //     // Save to cookies
  //     Cookies.set('token', token, { expires: 1 });
  //     Cookies.set('user', JSON.stringify(user), { expires: 1 });
  //     Cookies.set('role', user.role, { expires: 1 });

  //     // Set state
  //     setCurrentUser({ token, user });
  //     return { success: true, user };
  //   } else {
  //     return { success: false, message: response.message };
  //   }
  // };


const login = async (email, password, role) => {
  const response = await authApi.login(email, password, role);




  if (response.success && response.data?.token && response.data?.user) {
    const { token, user } = response.data;

      // dispatch(fetchPermissions(user.role));
      // Fetch and store permissions
      if (user.role) {
        fetchRolePermissions(user.role);
      }

    // Store token and user details in cookies
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('user', JSON.stringify(user), { expires: 1 });

    // ⬇️ Store additional user IDs in separate cookies
    Cookies.set('userId', user._id, { expires: 1 });
    Cookies.set('role', user.role, { expires: 1 });

    // Conditionally store based on role
    if (user.role === 'student') {
      Cookies.set('studentId', user.studentId, { expires: 1 });
    }

    if (user.role === 'trainer') {
      Cookies.set('trainerId', user.trainerId, { expires: 1 });
    }

    // Set in state as well
    setCurrentUser({ token, user });
    return { success: true, user };
  } else {
    return { success: false, message: response.message };
  }
};

const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('role');
  Cookies.remove('studentId');
  Cookies.remove('trainerId');
  Cookies.remove('userId');
  setCurrentUser(null);
};


const updateUserContext = (updatedUser) => {
  const token = Cookies.get('token'); // Keep existing token
  setCurrentUser({ token, user: updatedUser });

  // Update cookies too (optional but useful for persistence)
  Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });

  // Also update role-based cookies if needed
  if (updatedUser.role === 'student') {
    Cookies.set('studentId', updatedUser.studentId, { expires: 1 });
  }
  if (updatedUser.role === 'trainer') {
    Cookies.set('trainerId', updatedUser.trainerId, { expires: 1 });
  }
};


  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUserContext, 
    isAuthenticated: !!currentUser?.token,
    isAdmin: currentUser?.user?.role === 'admin',
    isTrainer: currentUser?.user?.role === 'trainer',
    token: currentUser?.token || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
