// // redux/slices/permissionsSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import apiClient from "../api/axiosConfig";
// // import apiClient from "../../api/axiosConfig";

// // Async thunk to fetch roles & permissions
// export const fetchPermissions = createAsyncThunk(
//   "permissions/fetchPermissions",
//   async (role, thunkAPI) => {
//     try {
//       const res = await apiClient.get("/api/role");
//       const roles = res?.data?.message || [];
//       const matchedRole = roles.find((r) => r.role === role);

//       if (!matchedRole) return {};

//       const permMap = {};
//       matchedRole.permissions.forEach((p) => {
//         permMap[p.module] = p.actions;
//       });

//       return permMap;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const permissionsSlice = createSlice({
//   name: "permissions",
//   initialState: {
//     rolePermissions: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPermissions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPermissions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.rolePermissions = action.payload;
//       })
//       .addCase(fetchPermissions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default permissionsSlice.reducer;

// redux/slices/permissionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    rolePermissions: {}, // permissions for current user role
  },
  reducers: {
    setPermissions: (state, action) => {
      state.rolePermissions = action.payload;
    },
    clearPermissions: (state) => {
      state.rolePermissions = {};
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
