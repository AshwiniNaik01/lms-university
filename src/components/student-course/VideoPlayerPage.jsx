// import { VideoIcon } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import {
//   FaArrowLeft,
//   FaCompress,
//   FaDownload,
//   FaExpand,
//   FaFileVideo,
//   FaHeart,
//   FaPause,
//   FaPlay,
//   FaRegHeart,
//   FaShare,
//   FaStepBackward,
//   FaStepForward,
//   FaVolumeMute,
//   FaVolumeUp,
//   FaYoutube,
// } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { setSelectedVideo } from "../../features/videoSlice";

// // import { useEffect, useRef, useState } from "react";
// // import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from "react-icons/fa";

// import { DIR } from "../../utils/constants";

// // ---------------------------
// // Main Video Player Page
// // ---------------------------
// const VideoPlayerPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { courseId, videoId } = useParams();

//   // Redux state selectors
//   const { selectedVideo, courseTitle, chapterTitle, allLectures } = useSelector(
//     (state) => state.videos
//   );

//   // On videoId or lectures change, update selected video
//   useEffect(() => {
//     if (videoId && allLectures.length > 0) {
//       const video = allLectures.find((v) => v._id === videoId);
//       if (video && video._id !== selectedVideo?._id) {
//         dispatch(setSelectedVideo(video));
//       }
//     }
//   }, [videoId, allLectures, dispatch, selectedVideo]);

//   if (!selectedVideo) {
//     return <LoadingScreen message="Loading video content..." />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       <Header
//         courseTitle={courseTitle}
//         chapterTitle={chapterTitle}
//         navigateBack={() => navigate(-1)}
//         isLikedInitial={false}
//       />

//       <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6">
//         <section className="lg:col-span-3">
//           <VideoPlayer video={selectedVideo} />
//           {/* <VideoIcon video={selectedVideo} chapterTitle={chapterTitle} /> */}
//           <div className="flex items-center gap-2 mt-4">
//             <VideoIcon className="w-6 h-6" />
//             <span>{chapterTitle}</span>
//           </div>
//         </section>

//         <aside className="lg:col-span-1">
//           {/* <FaFileVideo
//             videos={allLectures}
//             currentVideo={selectedVideo}
//             onVideoSelect={(vid) =>
//               navigate(`/course/${courseId}/video/${vid._id}`, {
//                 state: { courseTitle, chapterTitle },
//               })
//             }
//           /> */}

//           <aside className="lg:col-span-1 space-y-3">
//             {allLectures.map((v) => (
//               <div
//                 key={v._id}
//                 onClick={() =>
//                   navigate(`/course/${courseId}/video/${v._id}`, {
//                     state: { courseTitle, chapterTitle },
//                   })
//                 }
//                 className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
//         ${selectedVideo._id === v._id ? "bg-blue-600" : "bg-gray-800"}
//       `}
//               >
//                 <FaFileVideo className="w-5 h-5" />
//                 <span>{v.title}</span>
//               </div>
//             ))}
//           </aside>
//         </aside>
//       </main>
//     </div>
//   );
// };

// export default VideoPlayerPage;

// // ---------------------------
// // Loading Screen Component
// // ---------------------------
// const LoadingScreen = ({ message }) => (
//   <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
//     <div className="text-center text-white">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//       <p className="text-xl">{message}</p>
//     </div>
//   </div>
// );

// // ---------------------------
// // Header Component with Back and Actions
// // ---------------------------
// const Header = ({
//   courseTitle,
//   chapterTitle,
//   navigateBack,
//   isLikedInitial,
// }) => {
//   const [isLiked, setIsLiked] = useState(isLikedInitial);

//   return (
//     <header className="bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {/* <button
//             onClick={navigateBack}
//             className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
//           >
//             <FaArrowLeft className="w-5 h-5" />
//             <span className="hidden sm:block">Back to Course</span>
//           </button> */}
//           {/* <div className="h-6 w-px bg-gray-700"></div> */}
//           <div>
//             <h1 className="text-lg font-semibold line-clamp-1">
//               {courseTitle}
//             </h1>
//             <p className="text-sm text-gray-400">{chapterTitle}</p>
//           </div>
//         </div>

//         {/* <div className="flex items-center gap-3">
//           <button
//             onClick={() => setIsLiked(!isLiked)}
//             className="p-2 text-gray-400 hover:text-red-500 transition-colors"
//           >
//             {isLiked ? (
//               <FaHeart className="w-5 h-5 text-red-500" />
//             ) : (
//               <FaRegHeart className="w-5 h-5" />
//             )}
//           </button>
//           <button className="p-2 text-gray-400 hover:text-white transition-colors">
//             <FaShare className="w-5 h-5" />
//           </button>
//           <button className="p-2 text-gray-400 hover:text-white transition-colors">
//             <FaDownload className="w-5 h-5" />
//           </button>
//         </div> */}
//       </div>
//     </header>
//   );
// };

// // ---------------------------
// // Video Player Component
// // Handles video playback and controls
// // ---------------------------
// // const VideoPlayer = ({ video }) => {
// //   const videoRef = useRef(null);

// //   // Player state
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [currentTime, setCurrentTime] = useState(0);
// //   const [duration, setDuration] = useState(0);
// //   const [volume, setVolume] = useState(1);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const [playbackRate, setPlaybackRate] = useState(1);
// //   const [showControls, setShowControls] = useState(true);
// //   const [buffered, setBuffered] = useState(0);

// //   // Setup video event listeners on mount
// //   useEffect(() => {
// //     const videoEl = videoRef.current;
// //     if (!videoEl) return;

// //     const updateTime = () => setCurrentTime(videoEl.currentTime);
// //     const updateDuration = () => setDuration(videoEl.duration);
// //     const updateBuffered = () => {
// //       if (videoEl.buffered.length > 0) {
// //         setBuffered(videoEl.buffered.end(0));
// //       }
// //     };

// //     const onEnded = () => setIsPlaying(false);

// //     videoEl.addEventListener("timeupdate", updateTime);
// //     videoEl.addEventListener("loadedmetadata", updateDuration);
// //     videoEl.addEventListener("progress", updateBuffered);
// //     videoEl.addEventListener("ended", onEnded);

// //     return () => {
// //       videoEl.removeEventListener("timeupdate", updateTime);
// //       videoEl.removeEventListener("loadedmetadata", updateDuration);
// //       videoEl.removeEventListener("progress", updateBuffered);
// //       videoEl.removeEventListener("ended", onEnded);
// //     };
// //   }, [video]);

// //   // Reset play state when video changes
// //   useEffect(() => {
// //     if (videoRef.current) {
// //       videoRef.current.pause();
// //       videoRef.current.currentTime = 0;
// //       setIsPlaying(false);
// //       setCurrentTime(0);
// //     }
// //   }, [video]);

// //   // Play/pause toggle handler
// //   const togglePlay = () => {
// //     if (!videoRef.current) return;

// //     if (isPlaying) {
// //       videoRef.current.pause();
// //     } else {
// //       videoRef.current.play();
// //     }
// //     setIsPlaying(!isPlaying);
// //   };

// //   // Seek bar click handler
// //   const handleSeek = (e) => {
// //     const seekTime =
// //       (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
// //     if (videoRef.current) {
// //       videoRef.current.currentTime = seekTime;
// //       setCurrentTime(seekTime);
// //     }
// //   };

// //   // Volume change handler
// //   const handleVolumeChange = (e) => {
// //     const newVolume = parseFloat(e.target.value);
// //     setVolume(newVolume);
// //     if (videoRef.current) {
// //       videoRef.current.volume = newVolume;
// //       setIsMuted(newVolume === 0);
// //     }
// //   };

// //   // Mute toggle handler
// //   const toggleMute = () => {
// //     if (videoRef.current) {
// //       videoRef.current.muted = !isMuted;
// //       setIsMuted(!isMuted);
// //     }
// //   };

// //   // Fullscreen toggle handler
// //   const toggleFullscreen = () => {
// //     if (!document.fullscreenElement) {
// //       videoRef.current.requestFullscreen().catch((err) => {
// //         console.error(`Error enabling fullscreen: ${err.message}`);
// //       });
// //       setIsFullscreen(true);
// //     } else {
// //       document.exitFullscreen();
// //       setIsFullscreen(false);
// //     }
// //   };

// //   // Change playback speed
// //   const handlePlaybackRateChange = (rate) => {
// //     setPlaybackRate(rate);
// //     if (videoRef.current) {
// //       videoRef.current.playbackRate = rate;
// //     }
// //   };

// //   // Skip forward/backward by seconds
// //   const skip = (seconds) => {
// //     if (videoRef.current) {
// //       videoRef.current.currentTime += seconds;
// //     }
// //   };

// //   // Format seconds to mm:ss
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60) || 0;
// //     const secs = Math.floor(seconds % 60) || 0;
// //     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
// //   };

// //   return (
// //     <div
// //       className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
// //       onMouseEnter={() => setShowControls(true)}
// //       onMouseLeave={() => setShowControls(false)}
// //     >
// //       {/* Video Element */}
// //       <video
// //         ref={videoRef}
// //         className="w-full aspect-video"
// //         src={`${DIR.LECTURE_CONTENT}${video.contentUrl}`}
// //         onClick={togglePlay}
// //         controls={false} // We implement custom controls
// //       >
// //         Your browser does not support the video tag.
// //       </video>

// //       {/* Custom Controls */}
// //       {showControls && (
// //         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300">
// //           {/* Progress Bar */}
// //           <div
// //             className="w-full bg-gray-700 h-2 rounded-full mb-4 cursor-pointer"
// //             onClick={handleSeek}
// //           >
// //             <div
// //               className="bg-blue-600 h-2 rounded-full"
// //               style={{ width: `${(currentTime / duration) * 100}%` }}
// //             ></div>
// //             <div
// //               className="bg-gray-500 h-2 rounded-full absolute top-0 left-0 pointer-events-none"
// //               style={{ width: `${(buffered / duration) * 100}%`, opacity: 0.5 }}
// //             ></div>
// //           </div>

// //           {/* Controls Row */}
// //           <div className="flex items-center justify-between text-white">
// //             {/* Left controls: Play/Pause, skip backward, skip forward */}
// //             <div className="flex items-center gap-4">
// //               <button
// //                 onClick={() => skip(-10)}
// //                 className="p-2 hover:text-blue-400 transition-colors"
// //                 title="Rewind 10 seconds"
// //               >
// //                 <FaStepBackward className="w-5 h-5" />
// //               </button>

// //               <button
// //                 onClick={togglePlay}
// //                 className="p-2 hover:text-blue-400 transition-colors"
// //                 title={isPlaying ? "Pause" : "Play"}
// //               >
// //                 {isPlaying ? (
// //                   <FaPause className="w-6 h-6" />
// //                 ) : (
// //                   <FaPlay className="w-6 h-6" />
// //                 )}
// //               </button>

// //               <button
// //                 onClick={() => skip(10)}
// //                 className="p-2 hover:text-blue-400 transition-colors"
// //                 title="Forward 10 seconds"
// //               >
// //                 <FaStepForward className="w-5 h-5" />
// //               </button>

// //               {/* Current Time / Duration */}
// //               <span className="text-sm font-mono">
// //                 {formatTime(currentTime)} / {formatTime(duration)}
// //               </span>
// //             </div>

// //             {/* Right controls: volume, playback speed, fullscreen */}
// //             <div className="flex items-center gap-4">
// //               {/* Volume control */}
// //               <button
// //                 onClick={toggleMute}
// //                 className="p-2 hover:text-blue-400 transition-colors"
// //                 title={isMuted ? "Unmute" : "Mute"}
// //               >
// //                 {isMuted || volume === 0 ? (
// //                   <FaVolumeMute className="w-5 h-5" />
// //                 ) : (
// //                   <FaVolumeUp className="w-5 h-5" />
// //                 )}
// //               </button>

// //               <input
// //                 type="range"
// //                 min="0"
// //                 max="1"
// //                 step="0.01"
// //                 value={volume}
// //                 onChange={handleVolumeChange}
// //                 className="w-24"
// //                 title="Volume"
// //               />

// //               {/* Playback rate selector */}
// //               <select
// //                 value={playbackRate}
// //                 onChange={(e) =>
// //                   handlePlaybackRateChange(Number(e.target.value))
// //                 }
// //                 className="bg-black border border-gray-700 rounded px-2 py-1 text-sm"
// //                 title="Playback speed"
// //               >
// //                 {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
// //                   <option key={rate} value={rate}>
// //                     {rate}x
// //                   </option>
// //                 ))}
// //               </select>

// //               {/* Fullscreen toggle */}
// //               <button
// //                 onClick={toggleFullscreen}
// //                 className="p-2 hover:text-blue-400 transition-colors"
// //                 title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
// //               >
// //                 {isFullscreen ? (
// //                   <FaCompress className="w-5 h-5" />
// //                 ) : (
// //                   <FaExpand className="w-5 h-5" />
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // Helper to detect YouTube URL
// const isYouTubeUrl = (url) => /youtube\.com\/watch\?v=|youtu\.be\//.test(url);
// const getYouTubeId = (url) => {
//   if (!url) return null;
//   const regExp =
//     /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
//   const match = url.match(regExp);
//   return match && match[7].length === 11 ? match[7] : null;
// };


// const VideoPlayer = ({ video }) => {
//   const videoRef = useRef(null);
//   const iframeRef = useRef(null);
//   const videoId = getYouTubeId(video.contentUrl);
// const isYouTube = !!videoId;


//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);

//   // const isYouTube = isYouTubeUrl(video.contentUrl);

//   // ---------------------------
//   // Local Video Player Handlers
//   // ---------------------------
//   useEffect(() => {
//     if (!isYouTube && videoRef.current) {
//       const vid = videoRef.current;

//       const updateTime = () => setCurrentTime(vid.currentTime);
//       const updateDuration = () => setDuration(vid.duration);
//       const onEnded = () => setIsPlaying(false);

//       vid.addEventListener("timeupdate", updateTime);
//       vid.addEventListener("loadedmetadata", updateDuration);
//       vid.addEventListener("ended", onEnded);

//       return () => {
//         vid.removeEventListener("timeupdate", updateTime);
//         vid.removeEventListener("loadedmetadata", updateDuration);
//         vid.removeEventListener("ended", onEnded);
//       };
//     }
//   }, [video, isYouTube]);

//   const togglePlay = () => {
//     if (isYouTube) {
//       // Send play/pause message to YouTube iframe
//       if (!iframeRef.current) return;
//       iframeRef.current.contentWindow.postMessage(
//         JSON.stringify({
//           event: "command",
//           func: isPlaying ? "pauseVideo" : "playVideo",
//         }),
//         "*"
//       );
//       setIsPlaying(!isPlaying);
//     } else if (videoRef.current) {
//       if (isPlaying) videoRef.current.pause();
//       else videoRef.current.play();
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (isYouTube) {
//       if (!iframeRef.current) return;
//       iframeRef.current.contentWindow.postMessage(
//         JSON.stringify({ event: "command", func: isMuted ? "unMute" : "mute" }),
//         "*"
//       );
//       setIsMuted(!isMuted);
//     } else if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleFullscreen = () => {
//     const elem = isYouTube ? iframeRef.current : videoRef.current;
//     if (!document.fullscreenElement) {
//       elem.requestFullscreen().catch(console.error);
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60) || 0;
//     const secs = Math.floor(seconds % 60) || 0;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   return (
//     <div
//       className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
//       onMouseEnter={() => setShowControls(true)}
//       onMouseLeave={() => setShowControls(false)}
//     >
//       {/* Video or YouTube iframe */}
//  {isYouTube ? (
//   // <iframe
//   //   ref={iframeRef}
//   //   className="w-full aspect-video"
//   //   src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&modestbranding=1`}
//   //   title="YouTube video player"
//   //   frameBorder="0"
//   //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//   //   allowFullScreen
//   // />

//   // import { FaYoutube } from "react-icons/fa";

// <div className="w-full aspect-video flex items-center justify-center bg-black rounded-2xl cursor-pointer"
//      onClick={() => window.open(video.contentUrl, "_blank")}>
//   <FaYoutube className="text-red-600 text-4xl mr-2" />
//   <span className="text-white text-lg">Watch on YouTube</span>
// </div>

// ) : (
//   <video
//     ref={videoRef}
//     className="w-full aspect-video"
//     src={`${DIR.LECTURE_CONTENT}${video.contentUrl}`}
//     onClick={togglePlay}
//     controls={false}
//   />
// )}


//       {/* Custom Controls */}
//       {showControls && !isYouTube && (
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300">
//           <div className="flex items-center justify-between text-white">
//             <div className="flex items-center gap-4">
//               <button onClick={() => (videoRef.current.currentTime -= 10)}>
//                 <FaStepBackward />
//               </button>
//               <button onClick={togglePlay}>
//                 {isPlaying ? <FaPause /> : <FaPlay />}
//               </button>
//               <button onClick={() => (videoRef.current.currentTime += 10)}>
//                 <FaStepForward />
//               </button>
//               <span>
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>
//             <div className="flex items-center gap-4">
//               <button onClick={toggleMute}>
//                 {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
//               </button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={volume}
//                 onChange={(e) => {
//                   const val = parseFloat(e.target.value);
//                   setVolume(val);
//                   if (videoRef.current) videoRef.current.volume = val;
//                   setIsMuted(val === 0);
//                 }}
//               />
//               <button onClick={toggleFullscreen}>
//                 {isFullscreen ? <FaCompress /> : <FaExpand />}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



import { VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCompress,
  FaExpand,
  FaFileVideo,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
  FaYoutube,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedVideo } from "../../features/videoSlice";
import { DIR } from "../../utils/constants";

// ---------------------------
// Video Player Page
// ---------------------------
const VideoPlayerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, videoId, batchId } = useParams();

  const { selectedVideo, allLectures, courseTitle } = useSelector(
    (state) => state.videos
  );

  // Update selected video based on URL param
  useEffect(() => {
    if (videoId && allLectures.length > 0) {
      const video = allLectures.find((v) => v._id === videoId);
      if (video && video._id !== selectedVideo?._id) {
        dispatch(setSelectedVideo(video));
      }
    }
  }, [videoId, allLectures, dispatch, selectedVideo]);

  if (!selectedVideo) {
    return <LoadingScreen message="Loading video content..." />;
  }

  return (
    <div className="max-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header
        courseTitle={courseTitle}
        chapterTitle={selectedVideo.title}
        navigateBack={() => navigate(-1)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3">
          <VideoPlayer video={selectedVideo} />
          <div className="flex items-center gap-2 mt-4">
            <VideoIcon className="w-6 h-6" />
            <span>{selectedVideo.title}</span>
          </div>
        </section>

        <aside className="lg:col-span-1 space-y-3">
          {allLectures.map((v) => (
            <div
              key={v._id}
              onClick={() =>
                navigate(`/batch/${batchId}/video/${v._id}`)
              }
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
        ${selectedVideo._id === v._id ? "bg-blue-600" : "bg-gray-800"}`}
            >
              <FaFileVideo className="w-5 h-5" />
              <span>{v.title}</span>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
};

export default VideoPlayerPage;

// ---------------------------
// Loading Screen
// ---------------------------
const LoadingScreen = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-xl">{message}</p>
    </div>
  </div>
);

// ---------------------------
// Header Component
// ---------------------------
const Header = ({ courseTitle, chapterTitle, navigateBack }) => (
  <header className="bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={navigateBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
        >
          <FaArrowLeft className="w-5 h-5" />
          <span className="hidden sm:block">Back</span>
        </button>
        <div>
          <h1 className="text-lg font-semibold line-clamp-1">{courseTitle}</h1>
          <p className="text-sm text-gray-400">{chapterTitle}</p>
        </div>
      </div>
    </div>
  </header>
);

// ---------------------------
// Video Player Component
// Supports YouTube and local videos
// ---------------------------
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const videoId = getYouTubeId(video.contentUrl);
  const isYouTube = !!videoId;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Local video event handlers
  useEffect(() => {
    if (!isYouTube && videoRef.current) {
      const vid = videoRef.current;
      const updateTime = () => setCurrentTime(vid.currentTime);
      const updateDuration = () => setDuration(vid.duration);
      const onEnded = () => setIsPlaying(false);

      vid.addEventListener("timeupdate", updateTime);
      vid.addEventListener("loadedmetadata", updateDuration);
      vid.addEventListener("ended", onEnded);

      return () => {
        vid.removeEventListener("timeupdate", updateTime);
        vid.removeEventListener("loadedmetadata", updateDuration);
        vid.removeEventListener("ended", onEnded);
      };
    }
  }, [video, isYouTube]);

  const togglePlay = () => {
    if (isYouTube) {
      if (!iframeRef.current) return;
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isPlaying ? "pauseVideo" : "playVideo",
        }),
        "*"
      );
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isYouTube) {
      if (!iframeRef.current) return;
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: isMuted ? "unMute" : "mute" }),
        "*"
      );
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const elem = isYouTube ? iframeRef.current : videoRef.current;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isYouTube ? (
        <div
          className="w-full aspect-video flex items-center justify-center bg-black rounded-2xl cursor-pointer"
          onClick={() => window.open(video.contentUrl, "_blank")}
        >
          <FaYoutube className="text-red-600 text-4xl mr-2" />
          <span className="text-white text-lg">Watch on YouTube</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={`${DIR.LECTURE_CONTENT}${video.contentUrl}`}
          onClick={togglePlay}
          controls={false}
        />
      )}

      {/* Custom Controls */}
      {showControls && !isYouTube && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={() => (videoRef.current.currentTime -= 10)}>
                <FaStepBackward />
              </button>
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={() => (videoRef.current.currentTime += 10)}>
                <FaStepForward />
              </button>
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) videoRef.current.volume = val;
                  setIsMuted(val === 0);
                }}
              />
              <button onClick={toggleFullscreen}>
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
