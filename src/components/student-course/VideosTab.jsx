
// import { useEffect } from "react";
// import { FaClock, FaExternalLinkAlt, FaPlay, FaVideo } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setAllLectures, setCourseInfo, setSelectedVideo } from "../../features/videoSlice";

// const VideosTab = ({ course }) => {
//     const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Extract lectures from deeply nested structure
//   const allLectures = [];

//   if (course?.phases?.length > 0) {
//     course.phases.forEach((phase) => {
//       phase.weeks?.forEach((week) => {
//         week.chapters?.forEach((chapter) => {
//           if (chapter.lectures && chapter.lectures.length > 0) {
//             chapter.lectures.forEach(lecture => {
//               allLectures.push({
//                 ...lecture,
//                 phaseTitle: phase.title,
//                 weekTitle: week.title,
//                 chapterTitle: chapter.title,
//               });
//             });
//           }
//         });
//       });
//     });
//   }

//     // Dispatch all lecture data on mount
//   useEffect(() => {
//     dispatch(setCourseInfo({ courseId: course._id, courseTitle: course.title }));
//     dispatch(setAllLectures(allLectures));
//   }, [course]);

//   // const handleVideoClick = (video) => {
//   //   // Navigate to video player page
//   //   navigate(`/course/${course._id}/video/${video._id}`, {
//   //     state: {
//   //       video,
//   //       courseTitle: course.title,
//   //       chapterTitle: video.chapterTitle
//   //     }
//   //   });
//   // };


//   const handleVideoClick = (video) => {
//     dispatch(setSelectedVideo(video));
//     navigate(`/course/${course._id}/video/${video._id}`);
//   };

//   return (
//     <div className="bg-white rounded-lg">
//       <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
//         <div className="flex items-center gap-4 mb-3">
//           <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white shadow-lg">
//             <FaVideo className="w-6 h-6" />
//           </div>
//           <div>
//             <h4 className="text-2xl font-bold text-gray-900">Video Lectures</h4>
//             <p className="text-gray-600 mt-1 text-lg">
//               {allLectures.length} lectures from expert instructors
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         {allLectures.length > 0 ? (
//           <div className="grid gap-6">
//             {allLectures.map((video, index) => (
//               <div
//                 key={video._id}
//                 className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white group cursor-pointer"
//                 onClick={() => handleVideoClick(video)}
//               >
//                 <div className="p-4">
//                   <div className="flex items-start gap-4">
//                     {/* Video Thumbnail/Icon */}
//                     <div className="flex-shrink-0">
//                       <div className="relative">
//                         <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
//                           <FaPlay className="w-5 h-5" />
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
//                           <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                             <FaVideo className="w-2 h-2 text-white" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Video Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
//                           {video.title}
//                         </h3>
//                         <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2 mt-1" />
//                       </div>

//                       {video.description && (
//                         <p className="text-gray-600 mb-3 line-clamp-2">
//                           {video.description}
//                         </p>
//                       )}

//                       {/* Meta Information */}
//                       <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
//                           <FaClock className="w-3 h-3" />
//                           <span>{video.duration}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
//                           <span>📁</span>
//                           <span>{video.chapterTitle}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
//                           <span>📅</span>
//                           <span>{video.weekTitle}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hover Effect Border */}
//                 <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FaVideo className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No Video Lectures Available
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               Video lectures will be added to this course soon. Check back later or explore other course materials.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideosTab;



import { useEffect, useMemo } from "react";
import { FaClock, FaExternalLinkAlt, FaPlay, FaVideo } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllLectures, setBatchInfo, setSelectedVideo } from "../../features/videoSlice";

const VideosTab = ({ batch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure hooks run even if batch is null
  const allLectures = useMemo(() => {
    return batch?.lectures?.map((lecture) => ({
      ...lecture,
      chapterTitle: lecture.chapter || "N/A",
      weekTitle: lecture.week || "N/A",
    })) || [];
  }, [batch]);

  // Always run useEffect regardless of batch being null
  useEffect(() => {
    if (!batch) return;
    dispatch(setBatchInfo({ batchId: batch._id, batchName: batch.batchName }));
    dispatch(setAllLectures(allLectures));
  }, [batch, allLectures, dispatch]);

  const handleVideoClick = (video) => {
    dispatch(setSelectedVideo(video));

    if (video.type === "youtube") {
      window.open(video.contentUrl, "_blank");
    } else {
      navigate(`/batch/${batch._id}/video/${video._id}`);
    }
  };

  // Early return for UI is fine now
  if (!batch) {
    return <p className="p-6 text-gray-500">Loading batch videos...</p>;
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white shadow-lg">
            <FaVideo className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900">Video Lectures</h4>
            <p className="text-gray-600 mt-1 text-lg">
              {allLectures.length} lectures from expert instructors
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {allLectures.length > 0 ? (
          <div className="grid gap-6">
            {allLectures.map((video) => (
              <div
                key={video._id}
                className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white group cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FaPlay className="w-5 h-5" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <FaVideo className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                        <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2 mt-1" />
                      </div>

                      {video.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaVideo className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Video Lectures Available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Video lectures will be added to this batch soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosTab;



// import { useEffect } from "react";
// import { FaClock, FaExternalLinkAlt, FaPlay, FaVideo } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setAllLectures, setBatchInfo, setSelectedVideo } from "../../features/videoSlice";

// const VideosTab = ({ batch }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   if (!batch) {
//     return <p className="p-6 text-gray-500">Loading batch videos...</p>;
//   }

//   // Extract lectures from batch
//   const allLectures = batch.lectures?.map((lecture) => ({
//     ...lecture,
//     chapterTitle: lecture.chapter || "N/A",
//     weekTitle: lecture.week || "N/A",
//   })) || [];

//   useEffect(() => {
//     // Set batch info in Redux
//     dispatch(setBatchInfo({ batchId: batch._id, batchName: batch.batchName }));
//     dispatch(setAllLectures(allLectures));
//   }, [batch]);

//   const handleVideoClick = (video) => {
//     dispatch(setSelectedVideo(video));

//     if (video.type === "youtube") {
//       // Open YouTube video in new tab
//       window.open(video.contentUrl, "_blank");
//     } else {
//       navigate(`/batch/${batch._id}/video/${video._id}`);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg">
//       <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
//         <div className="flex items-center gap-4 mb-3">
//           <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white shadow-lg">
//             <FaVideo className="w-6 h-6" />
//           </div>
//           <div>
//             <h4 className="text-2xl font-bold text-gray-900">Video Lectures</h4>
//             <p className="text-gray-600 mt-1 text-lg">
//               {allLectures.length} lectures from expert instructors
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         {allLectures.length > 0 ? (
//           <div className="grid gap-6">
//             {allLectures.map((video) => (
//               <div
//                 key={video._id}
//                 className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white group cursor-pointer"
//                 onClick={() => handleVideoClick(video)}
//               >
//                 <div className="p-4">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0">
//                       <div className="relative">
//                         <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
//                           <FaPlay className="w-5 h-5" />
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
//                           <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                             <FaVideo className="w-2 h-2 text-white" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
//                           {video.title}
//                         </h3>
//                         <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2 mt-1" />
//                       </div>

//                       {video.description && (
//                         <p className="text-gray-600 mb-3 line-clamp-2">
//                           {video.description}
//                         </p>
//                       )}

//                       {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
//                           <FaClock className="w-3 h-3" />
//                           <span>{video.duration || "N/A"}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
//                           <span>📁</span>
//                           <span>{video.chapterTitle}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
//                           <span>📅</span>
//                           <span>{video.weekTitle}</span>
//                         </div>
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FaVideo className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No Video Lectures Available
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               Video lectures will be added to this batch soon.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideosTab;
