import { VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCompress,
  FaExpand,
  FaFileVideo,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp,
  FaYoutube,
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


const SharePointVideo = ({ embedUrl }) => {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        referrerPolicy="strict-origin-when-cross-origin"
        title="SharePoint Video"
      />
    </div>
  );
};


const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const videoId = getYouTubeId(video.contentUrl);
  const isYouTube = !!videoId;
  const isSharePoint =
  video.contentUrl?.includes("sharepoint.com") ||
  video.contentUrl?.includes("embed.aspx");


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
      {/* {isYouTube ? (
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
      )} */}


      {isYouTube ? (
  <div
    className="w-full aspect-video flex items-center justify-center bg-black rounded-2xl cursor-pointer"
    onClick={() => window.open(video.contentUrl, "_blank")}
  >
    <FaYoutube className="text-red-600 text-4xl mr-2" />
    <span className="text-white text-lg">Watch on YouTube</span>
  </div>
) : isSharePoint ? (
  <SharePointVideo embedUrl={video.contentUrl} />
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
