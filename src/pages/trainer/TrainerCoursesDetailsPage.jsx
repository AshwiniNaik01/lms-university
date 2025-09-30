import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseById } from "../../api/courses";
import {
  FaCertificate,
  FaClock,
  FaStar,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaFilePdf,
} from "react-icons/fa";

// ===============================================
// Trainer Courses Detail Page
// ===============================================

const TrainerCourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  // Fetch course data when courseId is available
  useEffect(() => {
    // 📦 Fetch course details when `courseId` changes
    const loadCourseData = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  // Toggle expand/collapse for sections like "Videos", "Notes"
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

    // Loading state
  if (loading)
    return (
      <p className="text-center mt-20 text-xl font-medium text-gray-600">
        Loading course details...
      </p>
    );

  // If course not found
  if (!course)
    return (
      <p className="text-center mt-20 text-red-500 text-xl font-medium">
        Course not found.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">{course.title}</h1>
          <p className="mt-2 text-lg">{course.description}</p>
        </div>

             {/* 📌 Feature Tags */}
        <div className="flex gap-4 mt-4 md:mt-0 text-white">
          {course.features?.certificate && (
            <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm flex items-center gap-1">
              <FaCertificate /> Certificate
            </span>
          )}
          {course.features?.codingExercises && (
            <span className="px-3 py-1 bg-green-600 rounded-full text-sm">
              Coding Exercises
            </span>
          )}
          {course.features?.recordedLectures && (
            <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm">
              Recorded Lectures
            </span>
          )}
        </div>
      </div>

      {/* 📊 Course Stats */}
      
      <div className="flex flex-wrap gap-6 mt-4">
        <div className="flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center">
          <FaClock className="text-indigo-500" /> <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center">
          <FaStar className="text-yellow-400" /> <span>{course.rating}</span>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 rounded-xl shadow text-gray-700 flex-1 justify-center">
          <FaUsers className="text-green-500" />{" "}
          <span>{course.enrolledCount} Students</span>
        </div>
      </div>

      {/* Learning Outcomes */}
      {course.learningOutcomes?.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Learning Outcomes</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {course.learningOutcomes.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {course.benefits?.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {course.benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Features */}
      {course.keyFeatures?.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="space-y-3">
            {course.keyFeatures.map((kf) => (
              <li key={kf._id} className="border-l-4 border-indigo-500 pl-4">
                <p className="font-semibold text-gray-800">
                  {kf.title}:{" "}
                  <span className="font-normal">{kf.description}</span>
                </p>
                {kf.subPoints?.length > 0 && (
                  <ul className="list-disc list-inside ml-6 mt-1 text-gray-700">
                    {kf.subPoints.map((sp, i) => (
                      <li key={i}>{sp}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Video Lectures */}
      {course.videolectures?.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("videos")}
          >
            Video Lectures{" "}
            {openSection === "videos" ? <FaChevronUp /> : <FaChevronDown />}
          </h2>
          {openSection === "videos" && (
            <ul className="space-y-3">
              {course.videolectures.map((video) => (
                <li
                  key={video._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <FaPlayCircle className="text-indigo-500" />
                  <div>
                    <p className="font-semibold">{video.title}</p>
                    <p className="text-sm text-gray-500">
                      {video.duration} - {video.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Notes */}
      {course.notes?.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("notes")}
          >
            Notes{" "}
            {openSection === "notes" ? <FaChevronUp /> : <FaChevronDown />}
          </h2>
          {openSection === "notes" && (
            <ul className="space-y-3">
              {course.notes.map((note) => (
                <li
                  key={note._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <FaFilePdf className="text-red-500" />
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-gray-500">{note.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerCourseDetailsPage;
