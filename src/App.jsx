import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseForm from "./components/admin/courses/CourseForm.jsx";
import CourseTable from "./components/admin/courses/CourseTable.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import PrivateRoute from "./components/layout/PrivateRoute.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import VideoPlayerPage from "./components/student-course/VideoPlayerPage.jsx";
import ManageSessionCategory from "./components/upSkill_sessions/ManageSessionCategory.jsx";
import SessionCategoryForm from "./components/upSkill_sessions/SessionCategoryForm.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import BranchListPage from "./pages/BranchListPage.jsx";
import CourseListPage from "./pages/CourseListPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ResultDetailPage from "./pages/ResultDetailPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminAllResultsPage from "./pages/admin/AdminAllResultsPage.jsx";
import AdminBranchManagementPage from "./pages/admin/AdminBranchManagementPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminEnrollmentManagementPage from "./pages/admin/AdminEnrollmentManagementPage.jsx";
import AdminUserManagementPage from "./pages/admin/AdminUserManagementPage.jsx";
import CourseContentManagementPage from "./pages/admin/CourseContentManagementPage.jsx";
import CreateTestPage from "./pages/admin/CreateTestPage.jsx";
import EventTablePage from "./pages/admin/EventTablePage.jsx";
import ProfilePage from "./pages/admin/ProfilePage.jsx";
import RegisterPage from "./pages/admin/RegisterPage.jsx";
import TestManagementPage from "./pages/admin/TestManagementPage.jsx";
import TrainerTable from "./pages/admin/trainer-management/TrainerTable.jsx";
import AvailableTests from "./pages/student/AvailableTests.jsx";
import CourseDetailPage from "./pages/student/CourseDetailPage.jsx";
import MyCoursesPage from "./pages/student/MyCoursesPage.jsx";
import MyResultsPage from "./pages/student/MyResultsPage.jsx";
import StudentDashboardPage from "./pages/student/StudentDashboardPage.jsx";
import StudentProfilePage from "./pages/student/StudentProfilePage.jsx";
import StudentRegistrationForm from "./pages/student/StudentRegistrationForm.jsx";
import StudyCoursePage from "./pages/student/StudyCoursePage.jsx";
import TestAttemptPage from "./pages/student/TestAttemptPage.jsx";
import TrainerCourseDetailsPage from "./pages/trainer/TrainerCoursesDetailsPage.jsx";
import TrainerCoursesPage from "./pages/trainer/TrainerCoursesPage.jsx";
import TrainerDashboardPage from "./pages/trainer/TrainerDashboardPage.jsx";
import TrainerProfile from "./pages/trainer/TrainerProfile.jsx";
import TrainerRegistrationForm from "./pages/trainer/TrainerRegistrationForm.jsx";
// import AddVideo from "./components/admin/courses_videos/AddVideo.jsx";
import AddBatch from "./components/admin/batches/AddBatch.jsx";
import ManageBatch from "./components/admin/batches/ManageBatch.jsx";
import AddAssignment from "./components/admin/courses_assignment/AddAssignment.jsx";
import ManageAssignments from "./components/admin/courses_assignment/ManageAssignments.jsx";
import AddLectures from "./components/admin/courses_lectures/AddLectures.jsx";
import ManageLectures from "./components/admin/courses_lectures/ManageLectures.jsx";
import AddNotes from "./components/admin/courses_notes/AddNotes.jsx";
import ManageNotes from "./components/admin/courses_notes/ManageNotes.jsx";
import AddCurriculum from "./components/admin/curriculum/AddCurriculum.jsx";
import ManageCurriculum from "./components/admin/curriculum/ManageCurriculum.jsx";

// Global Loading Handled
function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Scroll to top on route change */}
        <ScrollToTop />
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* Scrollable Main Content */}
        <div
          id="main-scroll-container"
          className="flex-1 my-[64px] overflow-auto"
        >
          {" "}
          {/* Adjust margin-top as per your Navbar height */}
          <Routes>
            {/* Public Routes */}
            {/* Saare Routes jaise the waise hi rahenge */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/branches" element={<BranchListPage />} />
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route
              path="/student-register"
              element={<StudentRegistrationForm />}
            />
            <Route
              path="/trainer-register"
              element={<TrainerRegistrationForm />}
            />
            <Route
              path="/admin/trainers/update/:id"
              element={<TrainerRegistrationForm />}
            />
            {/* <Route element={<PrivateRoute />}>
                      
                    </Route> */}

            {/* Shared Protected Routes for Student and Admin*/}
            <Route element={<PrivateRoute roles={["student", "admin"]} />}>
              <Route path="/results/:resultId" element={<ResultDetailPage />} />
            </Route>

            {/* Student Routes */}
            <Route element={<PrivateRoute roles={["student"]} />}>
              <Route
                path="/student/dashboard"
                element={<StudentDashboardPage />}
              />
              <Route path="/my-courses" element={<MyCoursesPage />} />
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
                path="/course/:courseId/video/:videoId"
                element={<VideoPlayerPage />}
              />
              {/* <Route
              path="/profile/edit"
              element={<StudentEditProfile />}
            /> */}
            </Route>

            <Route element={<PrivateRoute roles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUserManagementPage />} />
                <Route
                  path="branches"
                  element={<AdminBranchManagementPage />}
                />
                <Route path="manage-courses" element={<CourseTable />} />
                <Route path="add-courses" element={<CourseForm />} />
                <Route path="courses/edit/:id" element={<CourseForm />} />
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
                <Route path="book-session" element={<SessionCategoryForm />} />
                <Route path="trainer-management" element={<TrainerTable />} />
                <Route
                  path="session-category/:id/manage"
                  element={<ManageSessionCategory />}
                />
                <Route
                  path="session-category/:id/manage/event"
                  element={<EventTablePage />}
                />
                <Route path="add-course-videos" element={<AddLectures />} />
                <Route
                  path="manage-course-videos"
                  element={<ManageLectures />}
                />
                {/* Edit Lecture Route */}
                <Route
                  path="edit-lecture/:lectureId"
                  element={<AddLectures />}
                />
                <Route path="add-curriculum" element={<AddCurriculum />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route
                  path="manage-curriculum"
                  element={<ManageCurriculum />}
                />
                <Route path="manage-batches" element={<ManageBatch />} />
                <Route path="add-batch" element={<AddBatch />} />
                <Route path="add-batch/:id" element={<AddBatch />} />{" "}
                {/* For editing */}
                <Route path="add-assignment" element={<AddAssignment />} />
                <Route
                  path="edit-assignment/:assignmentId"
                  element={<AddAssignment />}
                />
                <Route
                  path="manage-assignments"
                  element={<ManageAssignments />}
                />
                <Route path="add-notes" element={<AddNotes />} />
                <Route path="manage-notes" element={<ManageNotes />} />
                {/* Notes */}
                {/* <Route path="add-notes" element={<AddNotes />} /> */}
                <Route path="edit-note/:noteId" element={<AddNotes />} />
                {/* <Route path="manage-notes" element={<ManageNotes />} /> */}
              </Route>
            </Route>

            {/* Trainer Routes */}
            <Route element={<PrivateRoute roles={["trainer"]} />}>
              <Route
                path="/trainer/dashboard"
                element={<TrainerDashboardPage />}
              />
              <Route path="/trainer-courses" element={<TrainerCoursesPage />} />
              <Route
                path="/trainer-courses/:courseId"
                element={<TrainerCourseDetailsPage />}
              />
              <Route path="/trainer-profile" element={<TrainerProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        {/* </main> */}
        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Footer />
        </div>
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
