
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { fetchCourseById } from "../api/courses";
// import { fetchMyEnrollments } from "../api/enrollments";
// import { useAuth } from "../contexts/AuthContext.jsx";

import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaClock,
  FaPlay,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { fetchCourseById } from "../../api/courses.js";
import { fetchMyEnrollments } from "../../api/enrollments.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, token, currentUser } = useAuth();

  const loadCourseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const courseResponse = await fetchCourseById(courseId);
      setCourse(courseResponse);

      if (
        isAuthenticated &&
        currentUser?.user?.role === "student" &&
        courseResponse
      ) {
        const enrollmentsData = await fetchMyEnrollments(token);
        const enrollment = (enrollmentsData ?? []).find(
          (e) => e.course._id === courseResponse._id
        );
        setCurrentEnrollment(enrollment || null);
      }
    } catch (err) {
      setError("Failed to load course details.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCourseDetails();
  }, [courseId, isAuthenticated, token, currentUser]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-pulse">
        <p className="text-gray-500 text-lg">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-700">Course not found.</p>
      </div>
    );
  }

  const isEnrolled = !!currentEnrollment;

  const handleStart = () => {
    navigate(`/courses/${courseId}/study`);
  };

  return (
    <div className="max-w-8xl bg-gradient-to-r from-blue-100 via-blue-200 to-pink-100 mx-auto px-10 py-10 space-y-12 animate-fadeIn">
      {/* Course Title & Info */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-indigo-800 flex items-center gap-3">
          <HiOutlineInformationCircle className="text-indigo-600 text-4xl" />
          {course.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-gray-600 text-sm mt-4">
          {course.trainer && (
            <span className="flex items-center gap-2">
              <FaChalkboardTeacher className="text-indigo-500" />
              <strong>Instructor:</strong> {course.trainer.fullName}
            </span>
          )}
          <span className="flex items-center gap-2">
            <FaClock className="text-indigo-500" />
            <strong>Duration:</strong> {course.duration}
          </span>
          {course.enrolledCount !== undefined && (
            <span className="flex items-center gap-2">
              <FaUsers className="text-indigo-500" />
              <strong>Enrolled:</strong> {course.enrolledCount.toLocaleString()}
            </span>
          )}
          <span className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            <strong>Rating:</strong> {course.rating?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800 flex items-center gap-2">
          <HiOutlineInformationCircle /> About the Course
        </h2>
        <p className="text-gray-700 leading-relaxed">{course.description}</p>
      </section>

      {/* What You'll Learn */}
      <section className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
          <GiProgression /> What You'll Learn
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {course.learningOutcomes?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Benefits */}
      <section className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100">
        <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center gap-2">
          <MdOutlineEmojiEvents /> Why Join This Course?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {course.benefits?.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </section>

      {/* Enrollment & Action */}
      <section className="space-y-6 text-center">
        {isAuthenticated && currentUser?.user?.role === "student" ? (
          isEnrolled ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:scale-105 duration-200"
            >
              <FaPlay /> Start Learning
            </button>
          ) : (
            <p className="text-red-600 font-semibold text-center">
              You are not enrolled in this course.
            </p>
          )
        ) : (
          <p className="text-gray-600 italic text-center">
            Please log in as a student to start learning.
          </p>
        )}
      </section>

      {/* Enrollment Details */}
      {/* {isEnrolled && currentEnrollment?.student && (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">📋 Your Enrollment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Name:</strong> {currentEnrollment.student.fullName}</p>
            <p><strong>Email:</strong> {currentEnrollment.student.email}</p>
            <p><strong>Mobile:</strong> {currentEnrollment.student.mobileNo}</p>
            <p>
              <strong>Enrolled At:</strong>{' '}
              {new Date(currentEnrollment.enrolledAt).toLocaleDateString()}
            </p>
          </div>
        </section>
      )} */}

      {/* Back Button */}
      {/* <div className="pt-6 text-center">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <FaArrowLeft /> Back to Courses
        </Link>
      </div> */}

      <div className="pt-6 text-center">
        <a
          href={
            import.meta.env.VITE_ENV === "development"
              ? "http://localhost:5001/courses"
              : "https://www.codedrift.co/courses"
          }
          className="inline-flex items-center gap-2 py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          target="_self"
          rel="noopener noreferrer"
        >
          <FaArrowLeft /> Back to Courses
        </a>
      </div>
    </div>
  );
};

export default CourseDetailPage;
