// For view course without token 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axiosConfig";

// 🔓 View courses WITHOUT token
export const fetchAllCourses = createAsyncThunk(
  "allCourses/fetchAllCourses",
  async () => {
    const res = await apiClient.get("/api/courses/all-course");

    // ✅ RETURN ONLY ARRAY
    return res.data.data;
  }
);

const allCoursesSlice = createSlice({
  name: "allCourses",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // ✅ array of courses
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default allCoursesSlice.reducer;
