// import UserList from '../components/admin/UserList.jsx'; // Assuming UserList is comprehensive
import UserList from "../../components/admin/UserList";

const AdminUserManagementPage = () => {
    return (
        <div>
            {/* You might have more components here like a form to create a new user by admin */}
            <UserList />
        </div>
    );
};
export default AdminUserManagementPage;