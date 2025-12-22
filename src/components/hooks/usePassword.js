// import { useState } from "react";

// export const usePassword = (initial = "") => {
//   const [password, setPassword] = useState(initial);

//   const generate = (length = 6) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let pass = "";
//     for (let i = 0; i < length; i++) {
//       pass += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setPassword(pass);
//   };

//   return { password, setPassword, generate };
// };



import { useState } from "react";

export const usePassword = (initial = "") => {
  const [password, setPassword] = useState(initial);

  const generate = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    return pass; // ✅ return the password while keeping setPassword
  };

  return { password, setPassword, generate };
};
