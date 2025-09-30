// import CourseManagement from '../components/admin/CourseManagement.jsx'; // Import the new component
import CourseManagement from "../../components/admin/CourseManagement";


const AdminCourseManagementPage = () => {
    return (
        <div>
            <h2>Course Management (Admin)</h2>
            <CourseManagement /> {/* Use the actual component here */}
        </div>
    );
};

export default AdminCourseManagementPage;