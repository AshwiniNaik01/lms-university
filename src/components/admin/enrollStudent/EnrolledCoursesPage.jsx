import { useLocation, useNavigate } from "react-router-dom";
import Cards from "../../cards/Cards";
import { COURSE_NAME } from "../../../utils/constants";
// import SimpleCard from "../../cards/SimpleCard"; // Use the new card

const EnrolledCoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courses = location.state?.enrolledCourses || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Enrolled {COURSE_NAME}</h1>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <p className="text-gray-500">No Training enrolled.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <Cards
              key={i}
              title={course.title || course}
              // description={course.description || "No description available."}
              variant="elevated" // choose variant: default, gradient, glass, minimal, elevated
              badge={course.tag} // optional badge if course has a tag
              // actionButtons={[
              //   <button
              //     key="view"
              //     className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              //     onClick={() => navigate(`/courses/${course.id}`)}
              //   >
              //     View Details
              //   </button>,
              //   <button
              //     key="unenroll"
              //     className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              //     onClick={() => console.log("Unenroll", course.id)}
              //   >
              //     Unenroll
              //   </button>,
              // ]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;
