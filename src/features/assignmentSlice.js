import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  batchId: null,
  batchName: "",
  assignments: [],
};

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // Set batch info (id + name)
    setBatchInfo: (state, action) => {
      const { batchId, batchName } = action.payload;
      state.batchId = batchId;
      state.batchName = batchName;
      console.log("Redux batchId:", batchId);
        console.log("Redux batchName:", batchName);


    },

    // Set all assignments for the batch
    setAssignments: (state, action) => {
      state.assignments = action.payload;

    },

    // Update a specific assignment (like after submission)
    updateAssignment: (state, action) => {
      const updatedAssignment = action.payload;
      const index = state.assignments.findIndex(
        (a) => a._id === updatedAssignment._id
      );
      if (index !== -1) {
        state.assignments[index] = updatedAssignment;
      }
      
    },

    // Clear assignments (like when switching batches)
    clearAssignmentsState: () => initialState,
  },
});

export const {
  setBatchInfo,
  setAssignments,
  updateAssignment,
  clearAssignmentsState,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
