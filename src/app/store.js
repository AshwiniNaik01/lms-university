// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import roleReducer from "../features/roleSlice";
import coursesReducer from "../features/coursesSlice";
import branchesReducer from "../features/branchesSlice";
import videoReducer from "../features/videoSlice";
import curriculumReducer from "../features/curriculumSlice";
import permissionsReducer from "../features/permissionsSlice";
import assignmentReducer from "../features/assignmentSlice";
import allCoursesReducer from "../features/allCoursesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    courses: coursesReducer,
    branches: branchesReducer,
    videos: videoReducer,
    curriculum: curriculumReducer,
    permissions: permissionsReducer,
    assignments: assignmentReducer, // <-- add it here
     allCourses: allCoursesReducer, // ✅ new, no overwrite
  },
});

export default store;
