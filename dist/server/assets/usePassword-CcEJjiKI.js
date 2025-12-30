import { useState } from "react";
const usePassword = (initial = "") => {
  const [password, setPassword] = useState(initial);
  const generate = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    return pass;
  };
  return { password, setPassword, generate };
};
export {
  usePassword as u
};
