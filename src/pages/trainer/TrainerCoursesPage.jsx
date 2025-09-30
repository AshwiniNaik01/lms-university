// ./pages/TrainerCoursesPage.jsx
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { fetchTrainerById } from "../admin/trainer-management/trainerApi";
import { FaCertificate, FaClock, FaStar, FaUsers } from "react-icons/fa";

// ===============================================
// Trainer Courses Page
// ===============================================

const TrainerCoursesPage = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch trainer data on component mount
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        //  Get the trainer ID from cookie
        const trainerId = Cookies.get("trainerId");

        if (!trainerId) return;
        const trainerData = await fetchTrainerById(trainerId);
        setTrainer(trainerData);
      } catch (error) {
        console.error("Failed to fetch trainer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  // Handle Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-gray-600">Loading Courses...</p>
      </div>
    );
  }

  // handled if trainer not found
  if (!trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-red-500">Trainer not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">{trainer.fullName}</h1>
            <p className="text-lg">{trainer.title}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p>
            Status:{" "}
            <span
              className={
                trainer.isApproved ? "text-green-500" : "text-yellow-500"
              }
            >
              {trainer.approvalStatus}
            </span>
          </p>
          <p>Active: {trainer.isActive ? "✅" : "❌"}</p>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">My Courses</h2>
        {trainer.courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainer.courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md p-6 border-l-8 border-indigo-400 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <FaClock className="text-gray-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <FaUsers className="text-green-500" />
                  <span>{course.enrolledCount} students</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {course.features.certificate && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <FaCertificate /> Certificate
                    </span>
                  )}
                  {course.features.codingExercises && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      Coding Exercises
                    </span>
                  )}
                  {course.features.recordedLectures && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                      Recorded Lectures
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/trainer-courses/${course._id}`)}
                  className="mt-4 w-full bg-indigo-500 text-white font-semibold py-2 rounded hover:bg-indigo-600 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerCoursesPage;
