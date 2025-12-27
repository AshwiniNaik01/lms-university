// src/redux/slices/branchesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBranches } from '../api/branches';
// import { getAllBranches } from '../../api/branchApi'; // ✅ Use separated API call

export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async () => {
    const data = await getAllBranches();
    return data;
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default branchesSlice.reducer;
