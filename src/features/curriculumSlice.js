import { createSlice } from "@reduxjs/toolkit";

// 🔹 Safe function to get courseId from localStorage
const getInitialCourseId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedCourseId") || "";
  }
  return "";
};

const curriculumSlice = createSlice({
  name: "curriculum",
  initialState: {
    selectedCourseId: getInitialCourseId(), // Use the safe function
  },
  reducers: {
    setSelectedCourseId: (state, action) => {
      state.selectedCourseId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCourseId", action.payload);
      }
    },
  },
});

export const { setSelectedCourseId } = curriculumSlice.actions;
export default curriculumSlice.reducer;
