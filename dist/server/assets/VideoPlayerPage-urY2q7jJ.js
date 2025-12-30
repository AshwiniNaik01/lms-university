import { jsx, jsxs } from "react/jsx-runtime";
import { VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaFileVideo, FaArrowLeft, FaYoutube, FaStepBackward, FaPause, FaPlay, FaStepForward, FaVolumeMute, FaVolumeUp, FaCompress, FaExpand } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { s as setSelectedVideo, d as DIR } from "../entry-server.js";
import "react-dom/server";
import "react-toastify";
import "react-icons/md";
import "react-icons/vsc";
import "sweetalert2";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "react-hot-toast";
import "react-icons/fi";
const VideoPlayerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, videoId, batchId } = useParams();
  const { selectedVideo, allLectures, courseTitle } = useSelector(
    (state) => state.videos
  );
  useEffect(() => {
    if (videoId && allLectures.length > 0) {
      const video = allLectures.find((v) => v._id === videoId);
      if (video && video._id !== selectedVideo?._id) {
        dispatch(setSelectedVideo(video));
      }
    }
  }, [videoId, allLectures, dispatch, selectedVideo]);
  if (!selectedVideo) {
    return /* @__PURE__ */ jsx(LoadingScreen, { message: "Loading video content..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-h-screen bg-gradient-to-br from-gray-900 to-black text-white", children: [
    /* @__PURE__ */ jsx(
      Header,
      {
        courseTitle,
        chapterTitle: selectedVideo.title,
        navigateBack: () => navigate(-1)
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsx(VideoPlayer, { video: selectedVideo }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
          /* @__PURE__ */ jsx(VideoIcon, { className: "w-6 h-6" }),
          /* @__PURE__ */ jsx("span", { children: selectedVideo.title })
        ] })
      ] }),
      /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1 space-y-3", children: allLectures.map((v) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => navigate(`/batch/${batchId}/video/${v._id}`),
          className: `flex items-center gap-3 p-3 rounded-lg cursor-pointer
        ${selectedVideo._id === v._id ? "bg-blue-600" : "bg-gray-800"}`,
          children: [
            /* @__PURE__ */ jsx(FaFileVideo, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { children: v.title })
          ]
        },
        v._id
      )) })
    ] })
  ] });
};
const LoadingScreen = ({ message }) => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center text-white", children: [
  /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" }),
  /* @__PURE__ */ jsx("p", { className: "text-xl", children: message })
] }) });
const Header = ({ courseTitle, chapterTitle, navigateBack }) => /* @__PURE__ */ jsx("header", { className: "bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
  /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: navigateBack,
      className: "flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800",
      children: [
        /* @__PURE__ */ jsx(FaArrowLeft, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: "Back" })
      ]
    }
  ),
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold line-clamp-1", children: courseTitle }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: chapterTitle })
  ] })
] }) }) });
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};
const SharePointVideo = ({ embedUrl }) => {
  return /* @__PURE__ */ jsx("div", { className: "w-full aspect-video rounded-2xl overflow-hidden bg-black", children: /* @__PURE__ */ jsx(
    "iframe",
    {
      src: embedUrl,
      className: "w-full h-full",
      frameBorder: "0",
      allow: "autoplay; fullscreen",
      allowFullScreen: true,
      sandbox: "allow-scripts allow-same-origin allow-presentation",
      referrerPolicy: "strict-origin-when-cross-origin",
      title: "SharePoint Video"
    }
  ) });
};
const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const videoId = getYouTubeId(video.contentUrl);
  const isYouTube = !!videoId;
  const isSharePoint = video.contentUrl?.includes("sharepoint.com") || video.contentUrl?.includes("embed.aspx");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
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
          func: isPlaying ? "pauseVideo" : "playVideo"
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative bg-black rounded-2xl overflow-hidden shadow-2xl group",
      onMouseEnter: () => setShowControls(true),
      onMouseLeave: () => setShowControls(false),
      children: [
        isYouTube ? /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full aspect-video flex items-center justify-center bg-black rounded-2xl cursor-pointer",
            onClick: () => window.open(video.contentUrl, "_blank"),
            children: [
              /* @__PURE__ */ jsx(FaYoutube, { className: "text-red-600 text-4xl mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "text-white text-lg", children: "Watch on YouTube" })
            ]
          }
        ) : isSharePoint ? /* @__PURE__ */ jsx(SharePointVideo, { embedUrl: video.contentUrl }) : /* @__PURE__ */ jsx(
          "video",
          {
            ref: videoRef,
            className: "w-full aspect-video",
            src: `${DIR.LECTURE_CONTENT}${video.contentUrl}`,
            onClick: togglePlay,
            controls: false
          }
        ),
        showControls && !isYouTube && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => videoRef.current.currentTime -= 10, children: /* @__PURE__ */ jsx(FaStepBackward, {}) }),
            /* @__PURE__ */ jsx("button", { onClick: togglePlay, children: isPlaying ? /* @__PURE__ */ jsx(FaPause, {}) : /* @__PURE__ */ jsx(FaPlay, {}) }),
            /* @__PURE__ */ jsx("button", { onClick: () => videoRef.current.currentTime += 10, children: /* @__PURE__ */ jsx(FaStepForward, {}) }),
            /* @__PURE__ */ jsxs("span", { children: [
              formatTime(currentTime),
              " / ",
              formatTime(duration)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("button", { onClick: toggleMute, children: isMuted ? /* @__PURE__ */ jsx(FaVolumeMute, {}) : /* @__PURE__ */ jsx(FaVolumeUp, {}) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: "0",
                max: "1",
                step: "0.01",
                value: volume,
                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) videoRef.current.volume = val;
                  setIsMuted(val === 0);
                }
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: toggleFullscreen, children: isFullscreen ? /* @__PURE__ */ jsx(FaCompress, {}) : /* @__PURE__ */ jsx(FaExpand, {}) })
          ] })
        ] }) })
      ]
    }
  );
};
export {
  VideoPlayerPage as default
};
