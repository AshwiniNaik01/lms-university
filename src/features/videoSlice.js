// store/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseId: null,
  courseTitle: "",
  chapterTitle: "",
  allLectures: [],
  selectedVideo: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setCourseInfo: (state, action) => {
      const { courseId, courseTitle } = action.payload;
      state.courseId = courseId;
      state.courseTitle = courseTitle;
    },
    setAllLectures: (state, action) => {
      state.allLectures = action.payload;
    },
    setSelectedVideo: (state, action) => {
      const video = action.payload;
      state.selectedVideo = video;
      state.chapterTitle = video.chapterTitle;
    },
    clearVideoState: () => initialState,
  },
});

export const {
  setCourseInfo,
  setAllLectures,
  setSelectedVideo,
  clearVideoState,
} = videoSlice.actions;

export default videoSlice.reducer;
