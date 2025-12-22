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
  FaVideo,
} from "react-icons/fa";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourseById } from "../../api/courses";
// import AssignmentsTab from "../../components/student-course/AssignmentsTab";
import { fetchActiveBatchById } from "../../api/batch";
import AssignmentsTab from "../../components/student-course/assignmentSection/AssignmentsTab";
import CurriculumTab from "../../components/student-course/CurriculumTab";
import FeedbackList from "../../components/student-course/FeedbackList";
import NotesTab from "../../components/student-course/NotesTab";
import OutcomesTab from "../../components/student-course/OutcomesTab";
import OverviewTab from "../../components/student-course/OverviewTab";
import VideosTab from "../../components/student-course/VideosTab";
import MeetingsDropdown from "../../components/student-course/MeetingsDropdown";
import PrerequisitesTab from "../../components/student-course/PrerequisitesTab";
import TestsTab from "../../components/student-course/TestsTab";
import { COURSE_NAME } from "../../utils/constants";
import CloudLabTab from "../../components/student-course/CloudLabTab";

const StudyCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [activeTab, setActiveTab] = useState("overview");
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [progress, setProgress] = useState(0);
  // inside component
  const [searchParams, setSearchParams] = useSearchParams();
  // const [searchParams] = useSearchParams();
  const batchId = searchParams.get("batchId");
  const [batch, setBatch] = useState(null);
  const [showMeetings, setShowMeetings] = useState(false);

  // Initialize activeTab from URL query param

  const normalizeTab = (tab) =>
    tab?.toLowerCase().replace(/\s+/g, "") || "overview";

  const [activeTab, setActiveTabState] = useState(
    normalizeTab(searchParams.get("activeTab"))
  );

  // const [activeTab, setActiveTabState] = useState(
  //   searchParams.get("activeTab") || "overview"
  // );

  // Handler to change active tab and update query params
  // const handleSetActiveTab = (tabName) => {
  //   const params = Object.fromEntries([...searchParams]);
  //   params.activeTab = tabName;
  //   setActiveTabState(tabName);
  //   setSearchParams(params);
  // };

  const handleSetActiveTab = (tabName) => {
    const params = Object.fromEntries([...searchParams]);

    const normalizedTab = normalizeTab(tabName);

    params.activeTab = normalizedTab;
    setActiveTabState(normalizedTab);
    setSearchParams(params);
  };

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
        setError(error.message || `Failed to load ${COURSE_NAME} content.`);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [courseId]);

  const selectedBatch = course?.batches?.find((batch) => batch._id === batchId);

  // Fetch batch details when course or batchId changes
  useEffect(() => {
    if (!batchId) return;

    const loadBatch = async () => {
      try {
        const batchData = await fetchActiveBatchById(batchId);
        setBatch(batchData);
      } catch (err) {
        console.error("Failed to fetch batch:", err);
        setBatch(null);
      }
    };

    loadBatch();
  }, [batchId]);

  // const hasCloudLab =
  //   batch?.cloudLabs &&
  //   (batch.cloudLabs.link || batch.cloudLabs.students?.length > 0);

 const hasCloudLab =
  Array.isArray(batch?.cloudLabs?.students) &&
  batch.cloudLabs.students.length > 0;



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

  const getLectureCount = (batch) => {
    if (!batch?.lectures) return 0;
    return batch.lectures.length;
  };

  const getAssignmentCount = (batch) => {
    if (!batch?.assignments) return 0;
    return batch.assignments.length;
  };

  const getNotesCount = (batch) => {
    if (!batch?.notes) return 0;
    return batch.notes.length;
  };

  const getFeedbackCount = (batch) => {
    if (!batch?.feedbacks) return 0;
    return batch.feedbacks.length;
  };

  const getOutcomesCount = (course) => {
    if (!course?.learningOutcomes) return 0;
    return course.learningOutcomes.length;
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
        // onClick={() => setActiveTab(name.toLowerCase())}
        onClick={() => handleSetActiveTab(name.toLowerCase())}
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
            Loading {COURSE_NAME} content...
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
            {error
              ? `Error Loading ${COURSE_NAME}`
              : `${COURSE_NAME} Not Found`}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || `The requested ${COURSE_NAME} could not be found.`}
          </p>
          {/* <Link
            to="/my-courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to My {COURSE_NAME}
          </Link> */}
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
                Back to {COURSE_NAME}
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-gray-300 to-transparent"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <FaBook className="w-6 h-6" />
                </div>
                {/* <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                  {course.title}
                </h1> */}

                <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                  {course.title}

                  {selectedBatch && (
                    <span className="text-gray-800 text-lg font-bold ml-3">
                      — {selectedBatch.batchName}
                    </span>
                  )}
                </h1>
              </div>
            </div>

            {/* <div className="flex items-center gap-6 text-sm font-semibold">
              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                <FaStar className="w-4 h-4" />
                <span>{course.rating} Rating</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaClock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div> */}

            {/* <div className="flex items-center gap-6 text-sm font-semibold relative">

               <div className="relative w-full">
                <button
                  onClick={() => setShowMeetings((prev) => !prev)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all"
                >
                  View Meetings & Attendance
                </button>

                {showMeetings && (
                  <div>
                    <MeetingsDropdown
                      batch={batch}
                      onClose={() => setShowMeetings(false)} // <-- pass close handler
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                <FaStar className="w-4 h-4" />
                <span>{course.rating} Rating</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <FaClock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>

              {/* View Meetings & Attendance */}
            {/* <button
                onClick={() => setShowMeetings((prev) => !prev)}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-all relative"
              >
                View Meetings & Attendance
              </button>

              {showMeetings && <MeetingsDropdown batch={batch} />} */}

            {/* </div> */}

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm font-semibold relative">
              {/* Meetings & Attendance */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowMeetings((prev) => !prev)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all shadow-sm hover:shadow-md"
                >
                  <FaClock className="w-4 h-4" />
                  View Sessions & Attendance
                </button>

                {/* {showMeetings && (
                  <div className="absolute top-full left-0 mt-2 w-full sm:w-80 z-50">
                    <MeetingsDropdown
                      batch={batch}
                      onClose={() => setShowMeetings(false)}
                    />
                  </div>
                )} */}

                {showMeetings && (
                  <MeetingsDropdown
                    batch={batch}
                    onClose={() => setShowMeetings(false)}
                  />
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full shadow-sm">
                <FaStar className="w-4 h-4" />
                <span>{course.rating} Rating</span>
              </div>

              {/* Duration */}
              {/* <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full shadow-sm">
                <FaClock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div> */}
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

              {hasCloudLab && (
                <TabButton
                  name="Cloud Lab"
                  icon={<FaVideo className="w-4 h-4" />}
                  isActive={activeTab === "cloudlab"}
                  color="blue"
                />
              )}

              <TabButton
                name="Outcomes"
                icon={<FaCheckCircle className="w-4 h-4" />}
                isActive={activeTab === "outcomes"}
                count={getOutcomesCount(course)}
                color="green"
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
                name="Prerequisites"
                icon={<FaBook className="w-4 h-4" />}
                isActive={activeTab === "prerequisites"}
                count={batch?.prerequisites?.length || 0}
                color="purple"
              />

              <TabButton
                name="Assignments"
                icon={<FaTasks className="w-4 h-4" />}
                isActive={activeTab === "assignments"}
                count={getAssignmentCount(batch)}
                color="orange"
              />

              <TabButton
                name="Assessment"
                icon={<FaTasks className="w-4 h-4" />}
                isActive={activeTab === "assessment"}
                count={batch?.tests?.length || 0}
                color="orange"
              />

              <TabButton
                name="Recording"
                icon={<FaVideo className="w-4 h-4" />}
                isActive={activeTab === "recording"}
                count={getLectureCount(batch)}
                color="green"
              />

              <TabButton
                name="Notes"
                icon={<FaFileAlt className="w-4 h-4" />}
                isActive={activeTab === "notes"}
                count={getNotesCount(batch)}
                color="blue"
              />

              <TabButton
                name="Feedback"
                icon={<FaVideo className="w-4 h-4" />}
                isActive={activeTab === "feedback"}
                count={getFeedbackCount(batch)}
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
            {/* {activeTab === "overview" && (
              <OverviewTab course={course} setActiveTab={setActiveTab} />
            )} */}

            {activeTab === "overview" && (
              <OverviewTab course={course} setActiveTab={handleSetActiveTab} />
            )}

            {activeTab === "cloudlab" && hasCloudLab && (
              <CloudLabTab cloudLabs={batch.cloudLabs} />
            )}

            {activeTab === "curriculum" && (
              <CurriculumTab
                course={course}
                expandedWeeks={expandedWeeks}
                toggleWeek={toggleWeek}
              />
            )}
            {activeTab === "notes" && <NotesTab batch={batch} />}
            {/* {activeTab === "videos" && <VideosTab course={course} />} */}
            {activeTab === "prerequisites" && (
              <PrerequisitesTab batch={batch} />
            )}

            {activeTab === "recording" && <VideosTab batch={batch} />}
            {activeTab === "assessment" && <TestsTab batch={batch} />}

            {activeTab === "assignments" && <AssignmentsTab batch={batch} />}
            {/* {activeTab === "feedback" && <FeedbackTab batch={batch} />} */}
            {activeTab === "feedback" && <FeedbackList batch={batch} />}
            {activeTab === "outcomes" && <OutcomesTab course={course} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudyCoursePage;
