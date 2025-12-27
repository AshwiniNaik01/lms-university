// // store/videoSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   courseId: null,
//   courseTitle: "",
//   chapterTitle: "",
//   allLectures: [],
//   selectedVideo: null,
// };

// const videoSlice = createSlice({
//   name: "videos",
//   initialState,
//   reducers: {
//     setCourseInfo: (state, action) => {
//       const { courseId, courseTitle } = action.payload;
//       state.courseId = courseId;
//       state.courseTitle = courseTitle;
//     },
//     setAllLectures: (state, action) => {
//       state.allLectures = action.payload;
//     },
//     setSelectedVideo: (state, action) => {
//       const video = action.payload;
//       state.selectedVideo = video;
//       state.chapterTitle = video.chapterTitle;
//     },
//     clearVideoState: () => initialState,
//   },
// });

// export const {
//   setCourseInfo,
//   setAllLectures,
//   setSelectedVideo,
//   clearVideoState,
// } = videoSlice.actions;

// export default videoSlice.reducer;



// store/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  batchId: null,
  batchName: "",
  chapterTitle: "",
  allLectures: [],
  selectedVideo: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setBatchInfo: (state, action) => {
      const { batchId, batchName } = action.payload;
      state.batchId = batchId;
      state.batchName = batchName;
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
  setBatchInfo,
  setAllLectures,
  setSelectedVideo,
  clearVideoState,
} = videoSlice.actions;

export default videoSlice.reducer;
