// import { createSlice } from "@reduxjs/toolkit";

// // 🔹 Safe function to get courseId from localStorage
// const getInitialCourseId = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("selectedCourseId") || "";
//   }
//   return "";
// };

// const curriculumSlice = createSlice({
//   name: "curriculum",
//   initialState: {
//     selectedCourseId: getInitialCourseId(), // Use the safe function
//   },
//   reducers: {
//     setSelectedCourseId: (state, action) => {
//       state.selectedCourseId = action.payload;
//       if (typeof window !== "undefined") {
//         localStorage.setItem("selectedCourseId", action.payload);
//       }
//     },
//   },
// });

// export const { setSelectedCourseId } = curriculumSlice.actions;
// export default curriculumSlice.reducer;


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
    clearSelectedCourseId: (state) => {
      state.selectedCourseId = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("selectedCourseId");
      }
    },
  },
});

export const { setSelectedCourseId, clearSelectedCourseId } = curriculumSlice.actions;
export default curriculumSlice.reducer;
