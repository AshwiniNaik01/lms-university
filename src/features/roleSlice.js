import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    selectedRole: "",
  },
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    clearRole: (state) => {
      state.selectedRole = "";
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
