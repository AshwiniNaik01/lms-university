
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBook,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaListAlt,
  FaStar,
  FaTasks,
  FaVideo
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { fetchCourseById } from "../../api/courses";
// import AssignmentsTab from "../../components/student-course/AssignmentsTab";
import CurriculumTab from "../../components/student-course/CurriculumTab";
import NotesTab from "../../components/student-course/NotesTab";
import OutcomesTab from "../../components/student-course/OutcomesTab";
import OverviewTab from "../../components/student-course/OverviewTab";
import VideosTab from "../../components/student-course/VideosTab";
import AssignmentsTab from "../../components/student-course/assignmentSection/AssignmentsTab";

const StudyCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!courseId) return;

    const loadCourseDetails = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
        setError("");
        // Simulate progress calculation
        calculateProgress(courseData);
      } catch (error) {
        setError(error.message || "Failed to load course content.");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [courseId]);

  const calculateProgress = (courseData) => {
    // Simulate progress calculation based on completed items
    const totalItems =
      courseData.phases?.reduce(
        (total, phase) =>
          total +
          phase.weeks.reduce(
            (weekTotal, week) =>
              weekTotal +
              week.chapters.reduce(
                (chapterTotal, chapter) =>
                  chapterTotal +
                  (chapter.lectures?.length || 0) +
                  (chapter.assignments?.length || 0),
                0
              ),
            0
          ),
        0
      ) || 0;

    // For demo, set progress to 25%
    setProgress(totalItems > 0 ? 25 : 0);
  };

  const getLectureCount = (course) => {
    if (!course?.phases) return 0;

    return course.phases.reduce((total, phase) => {
      if (!phase.weeks) return total;
      return (
        total +
        phase.weeks.reduce((weekTotal, week) => {
          if (!week.chapters) return weekTotal;
          return (
            weekTotal +
            week.chapters.reduce(
              (chapterTotal, chapter) =>
                chapterTotal + (chapter.lectures?.length || 0),
              0
            )
          );
        }, 0)
      );
    }, 0);
  };

  const toggleWeek = (phaseIndex, weekIndex) => {
    const key = `${phaseIndex}-${weekIndex}`;
    setExpandedWeeks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const TabButton = ({ name, icon, isActive, count, color = "blue" }) => {
    const colorClasses = {
      blue: {
        active:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-blue-50 border-blue-200",
        count: "bg-blue-100 text-blue-600",
      },
      green: {
        active:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-green-50 border-green-200",
        count: "bg-green-100 text-green-600",
      },
      purple: {
        active:
          "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-purple-50 border-purple-200",
        count: "bg-purple-100 text-purple-600",
      },
      orange: {
        active:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
        inactive: "text-gray-700 hover:bg-orange-50 border-orange-200",
        count: "bg-orange-100 text-orange-600",
      },
    };

    const colors = colorClasses[color];

    return (
      <button
        onClick={() => setActiveTab(name.toLowerCase())}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
          isActive
            ? `${colors.active} shadow-lg`
            : `${colors.inactive} border hover:shadow-md`
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            isActive ? "bg-white/20" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
        <span className="font-semibold flex-1 text-left">{name}</span>
        {count > 0 && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              isActive ? "bg-white/20 text-white" : colors.count
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 animate-pulse">
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FaBook className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {error ? "Error Loading Course" : "Course Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested course could not be found."}
          </p>
          <Link
            to="/my-courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/student/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-3"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Courses
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <FaBook className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                  {course.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-semibold">
              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                <FaStar className="w-4 h-4" />
                <span>{course.rating} Rating</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaClock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Enhanced Sidebar Navigation */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-28 space-y-6 backdrop-blur-sm">
            {/* Navigation */}
            <nav className="space-y-3">
              <TabButton
                name="Overview"
                icon={<FaListAlt className="w-4 h-4" />}
                isActive={activeTab === "overview"}
                count={0}
                color="blue"
              />
              <TabButton
                name="Curriculum"
                icon={<FaBook className="w-4 h-4" />}
                isActive={activeTab === "curriculum"}
                color="purple"
              />
              {/* <TabButton
                name="Lectures"
                icon={<FaVideo className="w-4 h-4" />}
                isActive={activeTab === "videos"}
                count={
                  course.phases?.reduce((total, phase) => 
                    total + phase.weeks.reduce((weekTotal, week) => 
                      weekTotal + week.chapters.reduce((chapterTotal, chapter) => 
                        chapterTotal + (chapter.lectures?.length || 0), 0), 0), 0) || 0
                }
                color="green"
              /> */}

              <TabButton
                name="Videos"
                icon={<FaVideo className="w-4 h-4" />}
                isActive={activeTab === "videos"}
                count={getLectureCount(course)}
                color="green"
              />

              <TabButton
                name="Assignments"
                icon={<FaTasks className="w-4 h-4" />}
                isActive={activeTab === "assignments"}
                count={
                  course.phases?.reduce(
                    (total, phase) =>
                      total +
                      phase.weeks.reduce(
                        (weekTotal, week) =>
                          weekTotal +
                          week.chapters.reduce(
                            (chapterTotal, chapter) =>
                              chapterTotal + (chapter.assignments?.length || 0),
                            0
                          ),
                        0
                      ),
                    0
                  ) || 0
                }
                color="orange"
              />
              <TabButton
                name="Notes"
                icon={<FaFileAlt className="w-4 h-4" />}
                isActive={activeTab === "notes"}
                count={course.notes?.length || 0}
                color="blue"
              />
              <TabButton
                name="Outcomes"
                icon={<FaCheckCircle className="w-4 h-4" />}
                isActive={activeTab === "outcomes"}
                count={course.learningOutcomes?.length || 0}
                color="green"
              />
            </nav>

            {/* Enhanced Progress Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-700">
                  Your Progress
                </div>
                <div className="text-sm font-bold text-blue-600">
                  {progress}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start Learning</span>
                <span>Complete</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[70vh]">
            {activeTab === "overview" && (
              <OverviewTab course={course} setActiveTab={setActiveTab} />
            )}
            {activeTab === "curriculum" && (
              <CurriculumTab
                course={course}
                expandedWeeks={expandedWeeks}
                toggleWeek={toggleWeek}
              />
            )}
            {activeTab === "notes" && <NotesTab course={course} />}
            {activeTab === "videos" && <VideosTab course={course} />}
            {activeTab === "assignments" && <AssignmentsTab course={course} />}
            {activeTab === "outcomes" && <OutcomesTab course={course} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudyCoursePage;
