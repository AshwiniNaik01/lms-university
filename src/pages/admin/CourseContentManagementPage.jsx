import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addNoteToCourse,
  addVideoToCourse,
  fetchCourseById,
} from "../../api/courses.js";
// import { useAuth } from "../contexts/AuthContext.jsx";
import { HiArrowLeft } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext.jsx";

// Components
// import NoteComponent from "../components/courseContents/NoteComponent.jsx";
import NoteComponent from "../../components/courseContents/NoteComponent.jsx";

import AddNoteForm from "../../components/courseContents/AddNoteForm.jsx";
import AddVideoForm from "../../components/courseContents/AddVideoForm.jsx";
import VideoComponent from "../../components/courseContents/VideoComponent.jsx";
// import { fetchCourseById } from "../../api/courses.js";

const CourseContentManagementPage = () => {
  const { courseId } = useParams();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch course details from API
  const loadCourseDetails = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError("Failed to load course details.");
      console.error("Error fetching course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount or when courseId changes
  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  // Early return for loading and error states
  if (isLoading) return <p>Loading course details...</p>;
  if (error && !course) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6"
        >
          <HiArrowLeft className="w-5 h-5 mr-2" />
          Back to Course List
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Content Manager
          </h1>
          <h2 className="text-xl text-blue-700 font-semibold">
            {course?.title}
          </h2>
          <p className="text-gray-600 mt-2">{course?.description}</p>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-700 font-medium">
                Videos:{" "}
              </span>
              <span className="font-bold">
                {course?.videolectures?.length || 0}
              </span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-sm text-green-700 font-medium">
                Notes:{" "}
              </span>
              <span className="font-bold">{course?.notes?.length || 0}</span>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
              <span className="text-sm text-purple-700 font-medium">
                Duration:{" "}
              </span>
              <span className="font-bold">{course?.duration || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        <div className="mb-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          )}
        </div>

        {/* Add Video & Note Forms */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Add Video */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Add New Video
            </h3>
            <AddVideoForm
              courseId={courseId}
              token={token}
              onSuccess={setSuccess}
              onError={setError}
              addVideoToCourse={async (courseId, payload, token) => {
                const res = await addVideoToCourse(courseId, payload, token);
                if (res.success) await loadCourseDetails();
                return res;
              }}
            />
          </div>

          {/* Add Note */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Add New Note
            </h3>
            <AddNoteForm
              courseId={courseId}
              token={token}
              onSuccess={setSuccess}
              onError={setError}
              addNoteToCourse={async (courseId, payload, token) => {
                const res = await addNoteToCourse(courseId, payload, token);
                if (res.success) await loadCourseDetails();
                return res;
              }}
            />
          </div>
        </div>

        {/* Existing Course Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Existing Course Content
            </h3>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {course?.videolectures?.length || 0} Videos
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {course?.notes?.length || 0} Notes
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Videos */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 w-5 h-5 inline-block bg-blue-600 rounded"></span>
                Video Lectures
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {course?.videolectures?.length > 0 ? (
                  course.videolectures.map((video) => (
                    <VideoComponent key={video._id} video={video} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No videos available</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 w-5 h-5 inline-block bg-green-600 rounded"></span>
                Study Notes
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {course?.notes?.length > 0 ? (
                  course.notes.map((note) => (
                    <NoteComponent key={note._id} note={note} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No notes available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900">
                  {selectedVideo.title}
                </h4>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <video
                  src={selectedVideo.url}
                  controls
                  className="w-full h-auto rounded-lg"
                  autoPlay
                />
                <p className="mt-4 text-gray-700">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentManagementPage;
