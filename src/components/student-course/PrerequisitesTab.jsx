import { FaFileAlt, FaPlayCircle } from "react-icons/fa";
import { COURSE_NAME, DIR } from "../../utils/constants";

/* ---------- Helper: Normalize YouTube URLs ---------- */
const getPlayableVideoUrl = (url) => {
  if (!url) return "";

  let finalUrl = url.trim();

  if (!finalUrl.startsWith("http")) {
    finalUrl = `https://${finalUrl}`;
  }

  if (finalUrl.includes("youtube.com/embed/")) {
    const videoId = finalUrl.split("/embed/")[1]?.split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  if (finalUrl.includes("youtu.be/")) {
    const videoId = finalUrl.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return finalUrl;
};

const PrerequisitesTab = ({ batch }) => {
  const prerequisites = batch?.prerequisites;

  if (!prerequisites || prerequisites.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        No prerequisites available for this {COURSE_NAME}.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Prerequisites</h2>

      <div className="space-y-8">
        {prerequisites.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl border p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-blue-700">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>

            <div className="space-y-6">
              {item.topics?.map((topic) => (
                <div
                  key={topic._id}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    {topic.name}
                  </h4>

                  {/* ---------- Video (Open YouTube in New Tab) ---------- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Video Link */}
                    {topic.videoLinks && (
                      <a
                        href={getPlayableVideoUrl(topic.videoLinks)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-red-600 font-semibold hover:underline p-4 bg-red-50 rounded-lg transition"
                      >
                        <FaPlayCircle className="w-6 h-6" />
                        Watch video
                      </a>
                    )}

                    {/* Materials */}
                    {topic.materialFiles?.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-700 mb-2">
                          Materials:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {topic.materialFiles.map((file, index) => (
                            <a
                              key={index}
                              href={`${DIR.PREREQUISITE_MATERIALS}${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition"
                            >
                              <FaFileAlt className="w-4 h-4" />
                              Open File {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrerequisitesTab;
