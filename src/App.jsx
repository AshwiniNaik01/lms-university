import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BatchTests from "./components/admin/batches/BatchTests.jsx";
import StudentsListForTest from "./components/admin/batches/StudentsListForTest.jsx";
import EvaluateAssignment from "./components/admin/courses_assignment/EvaluateAssignment.jsx";
import CreateFeedback from "./components/admin/feedback/CreateFeedback.jsx";
import ManageFeedback from "./components/admin/feedback/ManageFeedback.jsx";
import AddPrerequisite from "./components/admin/prerequisite/AddPrerequisite.jsx";
import ManagePrerequisites from "./components/admin/prerequisite/ManagePrerequisites.jsx";
import StudentLoginForm from "./components/auth/StudentLoginForm.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import PrivateRoute from "./components/layout/PrivateRoute.jsx";
import PublicRoute from "./components/layout/PublicRoute.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import AssignmentsPage from "./components/student-course/assignmentSection/AssignmentPage.jsx";
import FeedbackTab from "./components/student-course/FeedbackTab.jsx";
import TestDetail from "./components/student-course/testSection/TestDetail.jsx";
import SessionCategoryList from "./components/upSkill_sessions/SessionCategoryList.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StartTestGate from "./components/student-course/testSection/StartTestGate.jsx";
// import AssignmentsPage from "./components/student-course/AssignmentPage.jsx";
const CourseForm = lazy(() =>
  import("./components/admin/courses/CourseForm.jsx")
);
const CourseTable = lazy(() =>
  import("./components/admin/courses/CourseTable.jsx")
);
const EnrolledCoursesPage = lazy(() =>
  import("./components/admin/enrollStudent/EnrolledCoursesPage.jsx")
);
const EnrollmentDetails = lazy(() =>
  import("./components/admin/enrollStudent/EnrollmentDetails.jsx")
);
const UploadEnrollmentExcel = lazy(() =>
  import("./components/admin/enrollStudent/UploadEnrollmentExcel.jsx")
);
const RolePermissionManager = lazy(() =>
  import("./components/admin/role-permission/RolePermissionManager.jsx")
);
const AddTest = lazy(() => import("./components/admin/test/AddTest.jsx"));
const ManageTest = lazy(() => import("./components/admin/test/ManageTest.jsx"));
const ViewTestQuestions = lazy(() =>
  import("./components/admin/test/ViewTestQuestions.jsx")
);
const VideoPlayerPage = lazy(() =>
  import("./components/student-course/VideoPlayerPage.jsx")
);
const ManageSessionCategory = lazy(() =>
  import("./components/upSkill_sessions/ManageSessionCategory.jsx")
);
const SessionCategoryForm = lazy(() =>
  import("./components/upSkill_sessions/SessionCategoryForm.jsx")
);
const AddMeetingForm = lazy(() =>
  import("./components/admin/meeting/AddMeetingForm.jsx")
);
const ManageMeeting = lazy(() =>
  import("./components/admin/meeting/ManageMeeting.jsx")
);
const Attendance = lazy(() =>
  import("./components/admin/meeting/Attendance.jsx")
);
const EnrollStudentForm = lazy(() =>
  import("./components/admin/enrollStudent/EnrollStudentForm.jsx")
);
const EnrolledStudentList = lazy(() =>
  import("./components/admin/enrollStudent/EnrolledStudentList.jsx")
);
const BranchListPage = lazy(() => import("./pages/BranchListPage.jsx"));
const CourseListPage = lazy(() => import("./pages/CourseListPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const ResultDetailPage = lazy(() => import("./pages/ResultDetailPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const AdminAllResultsPage = lazy(() =>
  import("./pages/admin/AdminAllResultsPage.jsx")
);
const AdminBranchManagementPage = lazy(() =>
  import("./pages/admin/AdminBranchManagementPage.jsx")
);
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage.jsx")
);
const AdminEnrollmentManagementPage = lazy(() =>
  import("./pages/admin/AdminEnrollmentManagementPage.jsx")
);
const AdminUserManagementPage = lazy(() =>
  import("./pages/admin/AdminUserManagementPage.jsx")
);
const CourseContentManagementPage = lazy(() =>
  import("./pages/admin/CourseContentManagementPage.jsx")
);
const CreateTestPage = lazy(() => import("./pages/admin/CreateTestPage.jsx"));
const EventTablePage = lazy(() => import("./pages/admin/EventTablePage.jsx"));
const ProfilePage = lazy(() => import("./pages/admin/ProfilePage.jsx"));
const RegisterPage = lazy(() => import("./pages/admin/RegisterPage.jsx"));
const TestManagementPage = lazy(() =>
  import("./pages/admin/TestManagementPage.jsx")
);
const TrainerTable = lazy(() =>
  import("./pages/admin/trainer-management/TrainerTable.jsx")
);
const AvailableTests = lazy(() => import("./pages/student/AvailableTests.jsx"));
const CourseDetailPage = lazy(() =>
  import("./pages/student/CourseDetailPage.jsx")
);
const MyCoursesPage = lazy(() => import("./pages/student/MyCoursesPage.jsx"));
const MyResultsPage = lazy(() => import("./pages/student/MyResultsPage.jsx"));
const StudentDashboardPage = lazy(() =>
  import("./pages/student/StudentDashboardPage.jsx")
);
const StudentProfilePage = lazy(() =>
  import("./pages/student/StudentProfilePage.jsx")
);
const StudentRegistrationForm = lazy(() =>
  import("./pages/student/StudentRegistrationForm.jsx")
);
const StudyCoursePage = lazy(() =>
  import("./pages/student/StudyCoursePage.jsx")
);
const TestAttemptPage = lazy(() =>
  import("./pages/student/TestAttemptPage.jsx")
);
const TrainerCourseDetailsPage = lazy(() =>
  import("./pages/trainer/TrainerCoursesDetailsPage.jsx")
);
const TrainerCoursesPage = lazy(() =>
  import("./pages/trainer/TrainerCoursesPage.jsx")
);
const TrainerDashboardPage = lazy(() =>
  import("./pages/trainer/TrainerDashboardPage.jsx")
);
const TrainerProfile = lazy(() => import("./pages/trainer/TrainerProfile.jsx"));
const TrainerRegistrationForm = lazy(() =>
  import("./pages/trainer/TrainerRegistrationForm.jsx")
);
// import AddVideo from "./components/admin/courses_videos/AddVideo.jsx";
const AddBatch = lazy(() => import("./components/admin/batches/AddBatch.jsx"));
const ManageBatch = lazy(() =>
  import("./components/admin/batches/ManageBatch.jsx")
);
const AddAssignment = lazy(() =>
  import("./components/admin/courses_assignment/AddAssignment.jsx")
);
const ManageAssignments = lazy(() =>
  import("./components/admin/courses_assignment/ManageAssignments.jsx")
);
const AddLectures = lazy(() =>
  import("./components/admin/courses_lectures/AddLectures.jsx")
);
const ManageLectures = lazy(() =>
  import("./components/admin/courses_lectures/ManageLectures.jsx")
);
const AddNotes = lazy(() =>
  import("./components/admin/courses_notes/AddNotes.jsx")
);
const ManageNotes = lazy(() =>
  import("./components/admin/courses_notes/ManageNotes.jsx")
);
const AddCurriculum = lazy(() =>
  import("./components/admin/curriculum/AddCurriculum.jsx")
);
const ManageCurriculum = lazy(() =>
  import("./components/admin/curriculum/ManageCurriculum.jsx")
);

// Global Loading Handled
function App() {
  const { loading } = useAuth();
  const location = useLocation();

  const isTestFullscreen = location.pathname.startsWith("/test/");

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Scroll to top on route change */}
        <ScrollToTop />
        {/* Fixed Navbar */}

        {!isTestFullscreen && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
        )}

        {/* <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div> */}

        {/* Scrollable Main Content */}
        {/* <div
          id="main-scroll-container"
          className="flex-1 pt-[64px] overflow-auto bg-blue-50"
        > */}

        <div
          id="main-scroll-container"
          className={`flex-1 overflow-auto bg-blue-50 ${
            isTestFullscreen ? "" : "pt-[64px]"
          }`}
        >
          {" "}
          {/* Adjust margin-top as per your Navbar height */}
          <Suspense fallback={<div>Loading Page...</div>}>
            <Routes>
              {/* Public Routes */}
              {/* Saare Routes jaise the waise hi rahenge */}
              <Route path="/home" element={<HomePage />} />
              {/* <Route path="/" element={<LoginPage />} /> */}
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<PublicRoute />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/student-login" element={<StudentLoginForm />} />
              </Route>

              {/* <Route path="/login" element={<LoginPage />} />
              <Route path="/student-login" element={<StudentLoginForm />} /> */}
              <Route path="/branches" element={<BranchListPage />} />
              <Route path="/courses" element={<CourseListPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route
                path="/verify-email/:token"
                element={<VerifyEmailPage />}
              />
              <Route
                path="/student-register"
                element={<StudentRegistrationForm />}
              />
              {/* <Route
                element={
                  <PrivateRoute
                    requiredModule="trainer"
                    requiredAction="create"
                  />
                }
              > */}
              <Route
                path="/trainer-register"
                element={<TrainerRegistrationForm />}
              />
              {/* </Route> */}

              <Route
                element={
                  <PrivateRoute
                    requiredModule="trainer"
                    requiredAction="update"
                  />
                }
              >
                <Route
                  path="/trainers/update/:id"
                  element={<TrainerRegistrationForm />}
                />
              </Route>

              {/* Shared Protected Routes for Student and Admin*/}
              {/* <Route element={<PrivateRoute roles={["student", "admin"]} />}> */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/results/:resultId"
                  element={<ResultDetailPage />}
                />
              </Route>

              {/* Student Routes */}
              {/* <Route element={<PrivateRoute roles={["student"]} />}> */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/student/dashboard"
                  element={<StudentDashboardPage />}
                />
                <Route path="/my-courses" element={<MyCoursesPage />} />

                <Route
                  path="/batch/:batchId/assignments"
                  element={<AssignmentsPage />}
                />

                <Route path="/test/:testID" element={<TestDetail />} />

                <Route
                  path="/courses/:courseId/study/feedback/:feedbackId"
                  element={<FeedbackTab />}
                />

                {/* // student-portal/src/routes.jsx */}
<Route path="/start-test/:testId" element={<StartTestGate />} />


                <Route
                  path="/courses/:courseId/study"
                  element={<StudyCoursePage />}
                />
                <Route
                  path="/course/:courseId/tests"
                  element={<AvailableTests />}
                />
                <Route
                  path="/test/:testId/attempt"
                  element={<TestAttemptPage />}
                />
                <Route path="/my-results" element={<MyResultsPage />} />
                <Route
                  path="/student-profile/:id"
                  element={<StudentProfilePage />}
                />
                <Route
                  path="/batch/:batchId/video/:videoId"
                  element={<VideoPlayerPage />}
                />
                {/* <Route
              path="/profile/edit"
              element={<StudentEditProfile />}
            /> */}
              </Route>

              {/* <Route element={<PrivateRoute roles={["admin", "trainer"]} />}> */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<AdminLayout />}>
                  {/* <Route path="dashboard" element={<AdminDashboardPage />} /> */}

                  <Route
                    path="dashboard"
                    element={<PrivateRoute adminOnly={true} />}
                  >
                    <Route index element={<AdminDashboardPage />} />
                  </Route>

                  {/* <Route
                    element={
                      <PrivateRoute
                        requiredModule="user"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="users" element={<AdminUserManagementPage />} />
                  </Route> */}

                  <Route
                    path="users"
                    element={<PrivateRoute adminOnly={true} />}
                  >
                    <Route index element={<AdminUserManagementPage />} />
                  </Route>

                  <Route
                    path="role-permission"
                    element={<PrivateRoute adminOnly={true} />}
                  >
                    <Route index element={<RolePermissionManager />} />
                  </Route>

                  {/* <Route
                    element={
                      <PrivateRoute
                        requiredModule="role"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="role-permission"
                      element={<RolePermissionManager />}
                    />
                  </Route> */}
                  {/* <Route
                    path="branches"
                    element={<AdminBranchManagementPage />}
                  /> */}
                  {/* <Route path="manage-courses" element={<CourseTable />} /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="course"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="manage-courses" element={<CourseTable />} />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="course"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-courses" element={<CourseForm />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="course"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route path="courses/edit/:id" element={<CourseForm />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="test"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="/view-tests/batch/:batchId"
                      element={<BatchTests />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="feedback"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route
                      path="create-feedback"
                      element={<CreateFeedback />}
                    />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="feedback"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route
                      path="edit-feedback/:feedbackId"
                      element={<CreateFeedback />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="feedback"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="/manage-feedback"
                      element={<ManageFeedback />}
                    />
                  </Route>

                  <Route
                    path="course/:courseId/content"
                    element={<CourseContentManagementPage />}
                  />
                  <Route
                    path="enrollments"
                    element={<AdminEnrollmentManagementPage />}
                  />
                  <Route path="tests" element={<TestManagementPage />} />
                  <Route path="tests/create" element={<CreateTestPage />} />
                  <Route path="results" element={<AdminAllResultsPage />} />
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="session"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="book-session"
                      element={<SessionCategoryForm />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="session"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="/session-category/:slug/:id/list"
                      element={<SessionCategoryList />}
                    />
                  </Route>

                  {/* <Route
                    element={
                      <PrivateRoute
                        requiredModule="trainer"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="trainer-management"
                      element={<TrainerTable />}
                    />
                  </Route> */}

                  <Route
                    path="trainer-management"
                    element={<PrivateRoute adminOnly={true} />}
                  >
                    <Route index element={<TrainerTable />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="prerequisite"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route
                      path="add-prerequisite"
                      element={<AddPrerequisite />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="prerequisite"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route
                      path="edit-prerequisite/:id"
                      element={<AddPrerequisite />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="prerequisite"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="manage-prerequisite"
                      element={<ManagePrerequisites />}
                    />
                  </Route>
                  {/* <Route
                    path="session-category/:slug/:id/manage"
                    element={<ManageSessionCategory />}
                  /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="session"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="session-category/:slug/:id/manage"
                      element={<ManageSessionCategory />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="session"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="session-category/:id/manage/event"
                      element={<EventTablePage />}
                    />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="lecture"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-course-videos" element={<AddLectures />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="lecture"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route
                      path="edit-lecture/:lectureId"
                      element={<AddLectures />}
                    />
                  </Route>
                  {/* <Route path="add-course-videos" element={<AddLectures />} /> */}

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="lecture"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="manage-course-videos"
                      element={<ManageLectures />}
                    />
                  </Route>
                  {/* Edit Lecture Route */}
                  {/* <Route
                    path="edit-lecture/:lectureId"
                    element={<AddLectures />}
                  /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="curriculum"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-curriculum" element={<AddCurriculum />} />
                  </Route>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="curriculum"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="manage-curriculum"
                      element={<ManageCurriculum />}
                    />
                  </Route>

                  <Route
                    path="/tests/:testId/students"
                    element={<StudentsListForTest />}
                  />

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="batch"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="manage-batches" element={<ManageBatch />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="batch"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-batch" element={<AddBatch />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="batch"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route path="add-batch/:id" element={<AddBatch />} />
                  </Route>
                  {/* For editing */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="assignment"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-assignment" element={<AddAssignment />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="assignment"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route
                      path="edit-assignment/:assignmentId"
                      element={<AddAssignment />}
                    />
                  </Route>
                  {/* <Route path="add-assignment" element={<AddAssignment />} /> */}
                  {/* <Route
                    path="edit-assignment/:assignmentId"
                    element={<AddAssignment />}
                  /> */}
                  {/* <Route
                    path="manage-assignments"
                    element={<ManageAssignments />}
                  /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="assignment"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="manage-assignments"
                      element={<ManageAssignments />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="assignment"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route
                      path="/evaluate-assignment"
                      element={<EvaluateAssignment />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="meeting"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-meeting" element={<AddMeetingForm />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="meeting"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="manage-meeting" element={<ManageMeeting />} />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="attendance"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route
                      path="attendance/:meetingId"
                      element={<Attendance />}
                    />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="note"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-notes" element={<AddNotes />} />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="note"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route path="edit-note/:noteId" element={<AddNotes />} />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="note"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="manage-notes" element={<ManageNotes />} />
                  </Route>
                  {/* <Route path="add-notes" element={<AddNotes />} /> */}

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="test"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route path="add-test" element={<AddTest />} />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="test"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route path="manage-test" element={<ManageTest />} />
                  </Route>
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="test"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="view-excel/:testId"
                      element={<ViewTestQuestions />}
                    />
                  </Route>
                  {/* <Route path="manage-notes" element={<ManageNotes />} /> */}
                  {/* Notes */}
                  {/* <Route path="add-notes" element={<AddNotes />} /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="enrollment"
                        requiredAction="create"
                      />
                    }
                  >
                    <Route
                      path="enroll-student"
                      element={<EnrollStudentForm />}
                    />
                    <Route
                      path="enroll-student/:enrollmentId"
                      element={<EnrollStudentForm />}
                    />
                    <Route
                      path="/enrollments/upload-excel"
                      element={<UploadEnrollmentExcel />}
                    />
                  </Route>

                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="enrollment"
                        requiredAction="update"
                      />
                    }
                  >
                    <Route
                      path="enroll-student/:enrollmentId"
                      element={<EnrollStudentForm />}
                    />
                  </Route>

                  <Route
                    path="/trainer/dashboard"
                    element={<TrainerDashboardPage />}
                  />
                  {/* <Route
                    path="enroll-student"
                    element={<EnrollStudentForm />}
                  /> */}
                  {/* <Route
                    path="enrolled-student-list"
                    element={<EnrolledStudentList />}
                  /> */}
                  {/* <Route
                    path="enroll-student/:enrollmentId"
                    element={<EnrollStudentForm />}
                  /> */}
                  {/* <Route
                    path="enrollments/:enrollmentId/courses"
                    element={<EnrolledCoursesPage />}
                  /> */}
                  {/* <Route
                    path="enrollments/:id"
                    element={<EnrollmentDetails />}
                  />
                  <Route
                    path="/enrollments/upload-excel"
                    element={<UploadEnrollmentExcel />}
                  /> */}
                  <Route
                    element={
                      <PrivateRoute
                        requiredModule="enrollment"
                        requiredAction="read"
                      />
                    }
                  >
                    <Route
                      path="enrolled-student-list"
                      element={<EnrolledStudentList />}
                    />
                    <Route
                      path="enrollments/:enrollmentId/courses"
                      element={<EnrolledCoursesPage />}
                    />
                    <Route
                      path="enrollments/:id"
                      element={<EnrollmentDetails />}
                    />
                  </Route>
                  {/* <Route path="manage-notes" element={<ManageNotes />} /> */}
                </Route>
              </Route>

              <Route path="/trainer-courses" element={<TrainerCoursesPage />} />
              <Route
                path="/trainer-courses/:courseId"
                element={<TrainerCourseDetailsPage />}
              />
              <Route path="/trainer-profile" element={<TrainerProfile />} />
              {/* <Route path="/trainer-profile" element={<TrainerRegistrationForm />} /> */}

              {/* Trainer Routes */}
              <Route element={<PrivateRoute roles={["trainer"]} />} />

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        {/* </main> */}
        {/* Fixed Footer */}
        {/* <div className="fixed bottom-0 left-0 right-0 z-10">
          <Footer />
        </div> */}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
