// // src/contexts/AuthContext.jsx

// import Cookies from 'js-cookie';
// import { createContext, useContext, useEffect, useState } from 'react';
// import * as authApi from '../api/auth';
// import { useDispatch } from "react-redux";
// import { setPermissions  } from '../features/permissionsSlice';
// import apiClient from '../api/axiosConfig';
// // import { fetchPermissions } from "../redux/slices/permissionsSlice";

// export const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();

// // Function to fetch permissions for a given role
//  // ✅ Fetch permissions only once
//   const fetchRolePermissions = async (role) => {
//     try {
//       // Check localStorage first
//       const savedPermissions = JSON.parse(localStorage.getItem("permissions"));
//       if (savedPermissions && Object.keys(savedPermissions).length > 0) {
//         dispatch(setPermissions(savedPermissions));
//         return;
//       }

//       // Only call API if not stored
//       const res = await apiClient.get("/api/role/s");
//       const roles = res?.data?.message || [];
//       const matchedRole = roles.find((r) => r.role === role);

//       let permMap = {};
//       if (matchedRole) {
//         matchedRole.permissions.forEach((p) => {
//           permMap[p.module] = p.actions;
//         });
//       }

//       dispatch(setPermissions(permMap));
//       localStorage.setItem("permissions", JSON.stringify(permMap)); // persist
//     } catch (err) {
//       console.error("Failed to fetch permissions:", err);
//       dispatch(setPermissions({}));
//     }
//   };

//   useEffect(() => {
//   const token = Cookies.get('token');
//   const userCookie = Cookies.get('user');
//   const roleCookie = Cookies.get('role');

//   if (!token) {
//     setCurrentUser(null);
//     setLoading(false);
//     return;
//   }

//   if (userCookie) {
//     try {
//       const parsedUser = JSON.parse(userCookie);

//       setCurrentUser({ token, user: parsedUser });

//       // ✅ Dispatch permissions for this user's role
//       // if (parsedUser.role) {
//       //   dispatch(fetchPermissions(parsedUser.role));
//       // }

//          if (parsedUser.role) {
//           fetchRolePermissions(parsedUser.role); // fetch & store permissions
//         }

//     } catch (err) {
//       console.error('Invalid user cookie JSON', err);
//       Cookies.remove('user');
//       setCurrentUser(null);
//     } finally {
//       setLoading(false);
//     }

//     return; // Important: stop further execution
//   }

//   // No user cookie → Decode token as fallback
//   try {
//     const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
//     const decodedPayload = JSON.parse(atob(base64Payload));

//     const userFromToken = {
//       role: decodedPayload.role || 'unknown',
//       ...decodedPayload,
//     };

//     setCurrentUser({ token, user: userFromToken });

//     // ✅ Dispatch permissions for token role
//    if (userFromToken.role) {
//         fetchRolePermissions(userFromToken.role);
//       }

//   } catch (err) {
//     console.error('Failed to decode token payload', err);
//     setCurrentUser(null);
//   } finally {
//     setLoading(false);
//   }
// }, []);


// // useEffect(() => {
// //   const token = Cookies.get('token');
// //   const userCookie = Cookies.get('user');
// //   const roleCookie = Cookies.get('role');

// //   console.log("🔍 token:", token);
// //   console.log("🔍 user cookie:", userCookie);
// //   console.log("🔍 role cookie:", roleCookie);

// //   if (!token) {
// //     setCurrentUser(null);
// //     setLoading(false);
// //     return;
// //   }

// //   if (userCookie) {
// //     try {
// //       const parsedUser = JSON.parse(userCookie);
// //       setCurrentUser({ token, user: parsedUser });
// //     } catch (err) {
// //       console.error('Invalid user cookie JSON', err);
// //       Cookies.remove('user');
// //       setCurrentUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   } else {
// //     // ✅ Fallback: decode token even if 'role' cookie is missing
// //     try {
// //       const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
// //       const decodedPayload = JSON.parse(atob(base64Payload));

// //       const userFromToken = {
// //         role: decodedPayload.role || 'unknown',
// //         ...decodedPayload,
// //       };

// //       console.log("🧩 Fallback user from token:", userFromToken);

// //       setCurrentUser({ token, user: userFromToken });
// //     } catch (err) {
// //       console.error('Failed to decode token payload', err);
// //       setCurrentUser(null);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   if (parsedUser.role) {
// //     dispatch(fetchPermissions(parsedUser.role));
// // }

// // }, []);


//   const register = async (formData) => {
//     return await authApi.register(formData);
//   };

//   // const login = async (email, password, role) => {
//   //   const response = await authApi.login(email, password, role);

//   //   if (response.success && response.data?.token && response.data?.user) {
//   //     const { token, user } = response.data;

//   //     // Save to cookies
//   //     Cookies.set('token', token, { expires: 1 });
//   //     Cookies.set('user', JSON.stringify(user), { expires: 1 });
//   //     Cookies.set('role', user.role, { expires: 1 });

//   //     // Set state
//   //     setCurrentUser({ token, user });
//   //     return { success: true, user };
//   //   } else {
//   //     return { success: false, message: response.message };
//   //   }
//   // };


// const login = async (email, password, role) => {
//   const response = await authApi.login(email, password, role);




//   if (response.success && response.data?.token && response.data?.user) {
//     const { token, user } = response.data;

//       // dispatch(fetchPermissions(user.role));
//       // Fetch and store permissions
//       if (user.role) {
//         fetchRolePermissions(user.role);
//       }

//     // Store token and user details in cookies
//     Cookies.set('token', token, { expires: 1 });
//     Cookies.set('user', JSON.stringify(user), { expires: 1 });

//     // ⬇️ Store additional user IDs in separate cookies
//     Cookies.set('userId', user._id, { expires: 1 });
//     Cookies.set('role', user.role, { expires: 1 });

//     // Conditionally store based on role
//     if (user.role === 'student') {
//       Cookies.set('studentId', user.studentId, { expires: 1 });
//     }

//     if (user.role === 'trainer') {
//       Cookies.set('trainerId', user.trainerId, { expires: 1 });
//     }

//     // Set in state as well
//     setCurrentUser({ token, user });
//     return { success: true, user };
//   } else {
//     return { success: false, message: response.message };
//   }
// };

// const logout = () => {
//   Cookies.remove('token');
//   Cookies.remove('user');
//   Cookies.remove('role');
//   Cookies.remove('studentId');
//   Cookies.remove('trainerId');
//   Cookies.remove('userId');
//   setCurrentUser(null);
// };


// const updateUserContext = (updatedUser) => {
//   const token = Cookies.get('token'); // Keep existing token
//   setCurrentUser({ token, user: updatedUser });

//   // Update cookies too (optional but useful for persistence)
//   Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });

//   // Also update role-based cookies if needed
//   if (updatedUser.role === 'student') {
//     Cookies.set('studentId', updatedUser.studentId, { expires: 1 });
//   }
//   if (updatedUser.role === 'trainer') {
//     Cookies.set('trainerId', updatedUser.trainerId, { expires: 1 });
//   }
// };


//   const value = {
//     currentUser,
//     loading,
//     register,
//     login,
//     logout,
//     updateUserContext, 
//     isAuthenticated: !!currentUser?.token,
//     isAdmin: currentUser?.user?.role === 'admin',
//     isTrainer: currentUser?.user?.role === 'trainer',
//     token: currentUser?.token || null,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };



// src/contexts/AuthContext.jsx (Fixed Infinite /api/role calls, Re-triggering useEffect by Redux updates, Permissions overwritten on error, StrictMode double-run issues, Fetching permissions multiple times)

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';
import { useDispatch } from "react-redux";
import { setPermissions } from '../features/permissionsSlice';
import apiClient from '../api/axiosConfig';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // ---------------------------------------------------
  // 🔐 Fetch Role Permissions (Memoized to avoid re-renders)
  // ---------------------------------------------------
  const fetchRolePermissions = useCallback(async (role) => {
    try {
      const saved = localStorage.getItem("permissions");
      if (saved) {
        dispatch(setPermissions(JSON.parse(saved)));
        return;
      }

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
      localStorage.setItem("permissions", JSON.stringify(permMap));

    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      // ❗ Do NOT set empty permissions here — avoids infinite loops
    }
  }, [dispatch]);

  // ---------------------------------------------------
  // 🔄 Load user from Cookies on App Load
  // ---------------------------------------------------
  useEffect(() => {
    const token = Cookies.get('token');
    const userCookie = Cookies.get('user');

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    let parsedUser = null;

    if (userCookie) {
      try {
        parsedUser = JSON.parse(userCookie);
      } catch {
        Cookies.remove('user');
      }
    }

    // Fallback: decode token if user cookie missing or invalid
    if (!parsedUser) {
      try {
        const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        parsedUser = JSON.parse(atob(base64Payload));
      } catch (err) {
        console.error('Failed to decode token payload', err);
        setCurrentUser(null);
        setLoading(false);
        return;
      }
    }

    setCurrentUser({ token, user: parsedUser });

    // Load permissions if NOT already in storage
    if (!localStorage.getItem("permissions") && parsedUser.role) {
      fetchRolePermissions(parsedUser.role);
    } else if (localStorage.getItem("permissions")) {
      dispatch(setPermissions(JSON.parse(localStorage.getItem("permissions"))));
    }

    setLoading(false);

  }, [fetchRolePermissions, dispatch]);

  // ---------------------------------------------------
  // 🔐 Login function
  // ---------------------------------------------------
  const login = async (email, password, role) => {
    const response = await authApi.login(email, password, role);

    if (response.success && response.data?.token && response.data?.user) {
      const { token, user } = response.data;

      Cookies.set('token', token, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      Cookies.set('role', user.role, { expires: 1 });
      Cookies.set('userId', user._id, { expires: 1 });
      // ✅ ADD THIS
  Cookies.set("email", user.email, { expires: 1 });

      // if (user.role === 'student') {
      //   Cookies.set('studentId', user.studentId, { expires: 1 });
      // } else if (user.role === 'trainer') {
      //   Cookies.set('trainerId', user._id, { expires: 1 });
      // }

       // -----------------------------
    // ✅ ROLE-SPECIFIC COOKIES
    // -----------------------------
    if (user.role === "student") {
      /**
       * EMAIL LOGIN:
       * studentId DOES NOT exist → use user._id
       *
       * OTP LOGIN:
       * studentId exists → use it
       */
      Cookies.set(
        "studentId",
        user.studentId || user._id, // ⭐ FIX
        { expires: 1 }
      );
    } 
    else if (user.role === "trainer") {
      Cookies.set("trainerId", user._id, { expires: 1 });
    }

      setCurrentUser({ token, user });

      // Fetch permissions once at login
      localStorage.removeItem("permissions");
      fetchRolePermissions(user.role);

      return { success: true, user };
    }

    return { success: false, message: response.message };
  };

const otpLogin = ({ studentId, mobileNo, courseId, role, token, email }) => {
  // Save token and user info in cookies
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("role", role, { expires: 1 });
  Cookies.set("mobileNo", mobileNo, { expires: 1 });
  Cookies.set("studentId", studentId);
  Cookies.set("courseId", courseId);

    // ✅ ADD THIS
  if (email) {
    Cookies.set("email", email, { expires: 1 });
  }

  // Build user object
  const user = { studentId, mobileNo, courseId, role, email };

  Cookies.set("user", JSON.stringify(user), { expires: 1 });

  // Update context state
  setCurrentUser({ token, user });

  // Fetch permissions for this role
  fetchRolePermissions(role);
};


  // ---------------------------------------------------
  // 🔓 Logout
  // ---------------------------------------------------
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('role');
    Cookies.remove('studentId');
    Cookies.remove('trainerId');
    Cookies.remove('userId');
     Cookies.remove("email"); // ✅

    localStorage.removeItem("permissions");

    setCurrentUser(null);
    dispatch(setPermissions({}));
  };

  // ---------------------------------------------------
  // 🔄 Update User Context (Profile edit)
  // ---------------------------------------------------
  const updateUserContext = (updatedUser) => {
    const token = Cookies.get('token');
    setCurrentUser({ token, user: updatedUser });

    Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
  };

  // ---------------------------------------------------
  // Context Value
  // ---------------------------------------------------
  const value = {
    currentUser,
    loading,
    register: authApi.register,
    login,
     otpLogin, // ✅ Add this
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
