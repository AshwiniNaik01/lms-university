import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCourses } from '../api/courses';
// import { getAllCourses } from '../../api/courseApi'; // ✅ Import here

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const data = await getAllCourses(); // ✅ Use the API function
    return data;
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default coursesSlice.reducer;
