// src/contexts/AuthContext.jsx

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // actual working code commented just for testing
  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   const user = Cookies.get('user');

  //   if (token && user) {
  //     try {
  //       const parsedUser = JSON.parse(user);
  //       setCurrentUser({ token, user: parsedUser });

  //       // Re-fetch fresh profile
  //       fetchUserProfile()
  //         .then(data => {
  //           if (data.user) {
  //             setCurrentUser(prev => ({
  //               ...prev,
  //               user: data.user,
  //             }));
  //           }
  //         })
  //         .catch(() => {
  //           // Cleanup on failure
  //           Cookies.remove('token');
  //           Cookies.remove('user');
  //           setCurrentUser(null);
  //         })
  //         .finally(() => setLoading(false));
  //     } catch (err) {
  //       Cookies.remove('token');
  //       Cookies.remove('user');
  //       setCurrentUser(null);
  //       setLoading(false);
  //     }
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

// use only for texting the subdomain working
// dont delete without checking or comparing
// useEffect(() => {
//   const token = Cookies.get('token');

//   // const token = import.meta.env.VITE_ENV === 'local' 
//   // ? import.meta.env.VITE_TEST_JWT 
//   // : Cookies.get('token');

// console.log("token:", token);

// if (!token) throw new Error('Authentication token not found.');

//   const user = Cookies.get('user');

//   if (token && user) {
//     try {
//       const parsedUser = JSON.parse(user);
//       setCurrentUser({ token, user: parsedUser });

//       fetchUserProfile()
//         .then(data => {
//           if (data.user) {
//             setCurrentUser(prev => ({
//               ...prev,
//               user: data.user,
//             }));
//           }
//         })
//         .catch(() => {
//           Cookies.remove('token');
//           Cookies.remove('user');
//           setCurrentUser(null);
//         })
//         .finally(() => setLoading(false));
//     } catch (err) {
//       Cookies.remove('token');
//       Cookies.remove('user');
//       setCurrentUser(null);
//       setLoading(false);
//     }
//   } else {
//     // ✅ No cookies found — fallback to dummy token (from env)
//     const devToken = import.meta.env.VITE_TEST_JWT;
//     if (devToken) {
//       try {
//         const decoded = JSON.parse(
//           atob(devToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
//         );
//         setCurrentUser({ token: devToken, user: decoded });
//       } catch (err) {
//         console.error('Invalid dummy token in env:', err);
//         setCurrentUser(null);
//       }
//     }

//     setLoading(false);
//   }
// }, []);


// useEffect(() => {
//   const token = Cookies.get('token');
//   const userCookie = Cookies.get('user');
//   const roleCookie = Cookies.get('role');

//  console.log("🔍 token:", token);
//   console.log("🔍 user cookie:", userCookie);
//   console.log("🔍 role cookie:", roleCookie);


//   if (!token) {
//     setLoading(false);
//     setCurrentUser(null);
//     return;
//   }

//   if (userCookie) {
//     try {
//       const parsedUser = JSON.parse(userCookie);
//       setCurrentUser({ token, user: parsedUser });
//       setLoading(false);
//     } catch (err) {
//       console.error('Invalid user cookie JSON', err);
//       Cookies.remove('user');
//       setCurrentUser(null);
//       setLoading(false);
//     }
//   } else if (roleCookie) {
//     // Decode token payload to get minimal user info + role from cookie
//     try {
//       const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
//       const decodedPayload = JSON.parse(atob(base64Payload));
      
//       // Construct user with role from cookie (or fallback to token role)
//       const userFromToken = {
//         role: roleCookie || decodedPayload.role || 'unknown',
//         ...decodedPayload,  // optional: other info from token payload
//       };

//       setCurrentUser({ token, user: userFromToken });
//       setLoading(false);
//     } catch (err) {
//       console.error('Failed to decode token payload', err);
//       setCurrentUser(null);
//       setLoading(false);
//     }
//   } else {
//     // No user or role cookie, treat as logged out
//     setCurrentUser(null);
//     setLoading(false);
//   }
// }, []);


useEffect(() => {
  const token = Cookies.get('token');
  const userCookie = Cookies.get('user');
  const roleCookie = Cookies.get('role');

  console.log("🔍 token:", token);
  console.log("🔍 user cookie:", userCookie);
  console.log("🔍 role cookie:", roleCookie);

  if (!token) {
    setCurrentUser(null);
    setLoading(false);
    return;
  }

  if (userCookie) {
    try {
      const parsedUser = JSON.parse(userCookie);
      setCurrentUser({ token, user: parsedUser });
    } catch (err) {
      console.error('Invalid user cookie JSON', err);
      Cookies.remove('user');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  } else {
    // ✅ Fallback: decode token even if 'role' cookie is missing
    try {
      const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64Payload));

      const userFromToken = {
        role: decodedPayload.role || 'unknown',
        ...decodedPayload,
      };

      console.log("🧩 Fallback user from token:", userFromToken);

      setCurrentUser({ token, user: userFromToken });
    } catch (err) {
      console.error('Failed to decode token payload', err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }
}, []);


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
