

import { useMemo } from 'react';
import {
  FaArrowRight,
  FaClock
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { unenrollFromCourseApi } from '../../api/enrollments.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { COURSE_NAME } from '../../utils/constants.js';

// do not delete without cheking or comparing 
// const EnrolledCourseCard = ({ enrollment, onUnenrollSuccess }) => {
//   const { token } = useAuth();

//   const progressPercentage = useMemo(() => {
//     if (!enrollment || !enrollment.course) return 0;

//     const totalContent =
//       (enrollment.course.youtubeVideos?.length || 0) +
//       (enrollment.course.notes?.length || 0);

//     if (totalContent === 0) return 0;

//     const completedCount = enrollment.completedContent?.length || 0;
//     return Math.round((completedCount / totalContent) * 100);
//   }, [enrollment]);

//   const getProgressColor = (percentage) => {
//     if (percentage === 0) return 'bg-gray-200';
//     if (percentage < 30) return 'bg-red-500';
//     if (percentage < 70) return 'bg-yellow-500';
//     if (percentage < 100) return 'bg-blue-500';
//     return 'bg-green-500';
//   };

//   const getProgressText = (percentage) => {
//     if (percentage === 0) return 'Not started';
//     if (percentage === 100) return 'Completed';
//     return `${percentage}% complete`;
//   };

//   const handleUnenroll = async () => {
//     if (
//       typeof window !== 'undefined' &&
//       window.confirm(
//         `Are you sure you want to unenroll from "${enrollment.course.title}"?`
//       )
//     ) {
//       try {
//         const response = await unenrollFromCourseApi(enrollment._id, token);
//         if (response.success) {
//           alert('Successfully unenrolled.');
//           if (onUnenrollSuccess) onUnenrollSuccess(enrollment._id);
//         } else {
//           alert(`Failed to unenroll: ${response.message}`);
//         }
//       } catch (error) {
//         alert(
//           `Error unenrolling: ${error.response?.data?.message || error.message}`
//         );
//       }
//     }
//   };

//   if (!enrollment || !enrollment.course) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-center h-48">
//         <p className="text-gray-400 italic">Course data is not available.</p>
//       </div>
//     );
//   }

//    return (
//     <div className="p-[4px] rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:shadow-lg transition-shadow duration-300">
//       <div className="bg-white rounded-xl h-full flex flex-col p-5">

//         {/* 📘 Course Title */}
//         <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//           {enrollment.course.title}
//         </h3>

//         {/* ⏱️ Course Duration */}
//         <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//           <FaClock className="w-4 h-4 text-indigo-500" />
//           <span>{enrollment.course.duration}</span>
//         </div>

//         {/* 🗓️ Enrollment Date */}
//         <p className="text-xs text-gray-400 mb-2">
//           Enrolled on:{' '}
//           <span className="font-medium text-gray-600">
//             {new Date(enrollment.enrolledAt).toLocaleDateString()}
//           </span>
//         </p>

//         {/* Spacer */}
//         <div className="flex-grow"></div>

//         {/* 🚀 Action Button */}
//         <div className="pt-2 border-t border-gray-100 flex justify-end">
//           <Link
//             to={`/courses/${enrollment.course._id}`}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
//           >
//             Continue
//             <FaArrowRight className="w-3 h-3" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };



const EnrolledCourseCard = ({ enrollment, onUnenrollSuccess }) => {
  const { token } = useAuth();

  const progressPercentage = useMemo(() => {
    if (!enrollment) return 0;

    const totalContent =
      (enrollment.youtubeVideos?.length || 0) +
      (enrollment.notes?.length || 0);

    if (totalContent === 0) return 0;

    const completedCount = enrollment.completedContent?.length || 0;
    return Math.round((completedCount / totalContent) * 100);
  }, [enrollment]);

  const getProgressColor = (percentage) => {
    if (percentage === 0) return "bg-gray-200";
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    if (percentage < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const getProgressText = (percentage) => {
    if (percentage === 0) return "Not started";
    if (percentage === 100) return "Completed";
    return `${percentage}% complete`;
  };

  const handleUnenroll = async () => {
    if (
      typeof window !== "undefined" &&
      window.confirm(`Are you sure you want to unenroll from "${enrollment.title}"?`)
    ) {
      try {
        const response = await unenrollFromCourseApi(enrollment._id, token);
        if (response.success) {
          alert("Successfully unenrolled.");
          if (onUnenrollSuccess) onUnenrollSuccess(enrollment._id);
        } else {
          alert(`Failed to unenroll: ${response.message}`);
        }
      } catch (error) {
        alert(
          `Error unenrolling: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };

  // ✅ REMOVE this old check
  // if (!enrollment || !enrollment.course) {
  if (!enrollment) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-center h-48">
        <p className="text-gray-400 italic">{COURSE_NAME} data is not available.</p>
      </div>
    );
  }

  return (
    <div className="p-[4px] rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:shadow-lg transition-shadow duration-300">
      <div className="bg-white rounded-xl h-full flex flex-col p-5">
        {/* 📘 Course Title */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {enrollment.title}
        </h3>

        {/* ⏱️ Course Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <FaClock className="w-4 h-4 text-indigo-500" />
          <span>{enrollment.duration || "Duration not available"}</span>
        </div>

        {/* 🗓️ Enrollment Date */}
        {/* <p className="text-xs text-gray-400 mb-2">
          Enrolled on:{" "}
          <span className="font-medium text-gray-600">
            {new Date(enrollment.enrolledAt).toLocaleDateString()}
          </span>
        </p> */}

        {/* Progress Bar (Optional) */}
        {/* <div className="w-full h-2 rounded-full bg-gray-200 mb-4">
          <div
            className={`h-full rounded-full ${getProgressColor(progressPercentage)}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mb-2 text-right italic">
          {getProgressText(progressPercentage)}
        </p> */}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* 🚀 Action Button */}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
          {/* <button
            onClick={handleUnenroll}
            className="text-sm text-red-500 hover:text-red-600 underline"
          >
            Unenroll
          </button> */}

          <Link
            to={`/courses/${enrollment._id}/study`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;