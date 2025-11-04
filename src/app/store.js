// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import roleReducer from "../features/roleSlice";
import coursesReducer from "../features/coursesSlice";
import branchesReducer from "../features/branchesSlice";
import videoReducer from "../features/videoSlice";
import curriculumReducer from "../features/curriculumSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    courses: coursesReducer,
    branches: branchesReducer,
    videos: videoReducer,
    curriculum: curriculumReducer,
  },
});

export default store;
