// import { useEffect, useState } from 'react';
// // import { fetchAllEnrollmentsAdmin } from '../api/enrollments.js';
// import { fetchAllEnrollmentsAdmin } from '../../api/enrollments.js';
// // import { useAuth } from '../contexts/AuthContext.jsx';
// import { useAuth } from '../../contexts/AuthContext.jsx';

// const AdminEnrollmentManagementPage = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { token } = useAuth();

//   useEffect(() => {
//     const loadEnrollments = async () => {
//       if (token) {
//         setLoading(true);
//         try {
//           const data = await fetchAllEnrollmentsAdmin(token);
//           setEnrollments(data || []);
//           setError('');
//         } catch (err) {
//           setError('Failed to load enrollments.');
//           console.error(err);
//         }
//         setLoading(false);
//       }
//     };
//     loadEnrollments();
//   }, [token]);

//   if (loading)
//     return <p className="text-center text-gray-600 mt-10">Loading enrollments...</p>;

//   if (error)
//     return <p className="text-center text-red-500 font-medium mt-10">{error}</p>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       <h2 className="text-3xl font-bold mb-6 text-gray-900">All Student Enrollments</h2>

//       {enrollments.length === 0 ? (
//         <p className="text-center text-gray-500">No enrollments found.</p>
//       ) : (
//         <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
//           <table className="min-w-full bg-white">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Course Title</th>
//                 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrolled On</th>
//                 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
//                 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Mobile No</th>
//                 <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {enrollments.map((enrollment, idx) => (
//                 <tr key={enrollment._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                   <td className="px-6 py-4 text-gray-900">
//                     {enrollment.course?.title || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {new Date(enrollment.enrolledAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {enrollment.student?.fullName || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {enrollment.student?.mobileNo || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 text-gray-700">
//                     {enrollment.student?.email || 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminEnrollmentManagementPage;



import { useEffect, useState } from "react";
import { fetchAllEnrollmentsAdmin } from "../../api/enrollments.js";
import ScrollableTable from "../../components/table/ScrollableTable.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
// import ScrollableTable from "../components/ScrollableTable.jsx"; // Adjust path

const AdminEnrollmentManagementPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const loadEnrollments = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await fetchAllEnrollmentsAdmin(token);

          // ✅ Fix: use res.data.data which contains the actual array of enrollments
          setEnrollments(res.data?.data || []); 
          setError("");
        } catch (err) {
          setError("Failed to load enrollments.");
          console.error(err);
        }
        setLoading(false);
      }
    };
    loadEnrollments();
  }, [token]);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading enrollments...</p>;

  if (error)
    return <p className="text-center text-red-500 font-medium mt-10">{error}</p>;

  const columns = [
    {
      header: "Course Title",
      accessor: (row) =>
        row.enrollment.enrolledCourses?.map((c) => c.title).join(", ") || "N/A",
    },
    {
      header: "Enrolled On",
      accessor: (row) =>
        row.enrollment.enrolledAt
          ? new Date(row.enrollment.enrolledAt).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Student Name",
      accessor: (row) => row.student?.fullName || "N/A",
    },
    {
      header: "Mobile No",
      accessor: (row) => row.student?.mobileNo || "N/A",
    },
    {
      header: "Email",
      accessor: (row) => row.student?.email || "N/A",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        All Student Enrollments
      </h2>

      <ScrollableTable
        columns={columns}
        data={enrollments} // ✅ now contains actual array of enrollment objects
        maxHeight="600px"
        emptyMessage="No enrollments found"
      />
    </div>
  );
};


export default AdminEnrollmentManagementPage;
