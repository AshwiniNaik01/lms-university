import React from "react";
import { FaBook, FaUsers } from "react-icons/fa";

const coursesData = [
  { courseName: "Java", studentsEnrolled: 120 },
  { courseName: "C++", studentsEnrolled: 95 },
  { courseName: "React", studentsEnrolled: 105 },
  { courseName: "C", studentsEnrolled: 88 },
  { courseName: "Typescript", studentsEnrolled: 130 },
  { courseName: "HTML+CSS", studentsEnrolled: 75 },
  { courseName: "MERN", studentsEnrolled: 60 },
  { courseName: "Java Full Stack", studentsEnrolled: 150 },
];

const CourseCard = () => {
  return (
    <div className="w-full max-w-md p-4 rounded-xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
        <FaBook className="text-indigo-600" /> Course Enrollments
      </h2>

      <div className="max-h-72 overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10 text-gray-900">
            <tr>
              <th className="py-2 px-4 border-b w-2/3">Course Name</th>
              <th className="py-2 px-4 border-b text-center w-1/3">Total Students</th>
            </tr>
          </thead>
          <tbody>
            {coursesData.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b flex items-center gap-2">
                  <FaBook className="text-blue-500" /> {course.courseName}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                    <FaUsers className="text-blue-400" /> {course.studentsEnrolled}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseCard;
