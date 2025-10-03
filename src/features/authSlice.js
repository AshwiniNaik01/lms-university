// src/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  token: Cookies.get("accessToken") || null,
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;

      Cookies.set("accessToken", token);
      Cookies.set("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      Cookies.remove("accessToken");
      Cookies.remove("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
