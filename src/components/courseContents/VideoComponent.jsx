const VideoComponent = ({ video, setSelectedVideo }) => (
  <div
    key={video._id}
    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h5 className="font-medium text-gray-900 text-sm mb-1">{video.title}</h5>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{video.type}</span>
          <span>⏱️ {video.duration}</span>
        </div>
        {video.description && <p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>}
      </div>
      <button
        onClick={() => setSelectedVideo(video)}
        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
      >
        ▶ Play
      </button>
    </div>
  </div>
);

export default VideoComponent;
