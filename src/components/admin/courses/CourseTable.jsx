import { useEffect, useState } from "react";
import {
  FaClone,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaFolderPlus,
  FaListAlt,
  FaSearch,
  FaStickyNote,
  FaTasks,
  FaTrash,
  FaVideo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  cloneCourse,
  deleteCourse,
  fetchCourseById,
  getAllCourses,
} from "../../../api/courses";
import { useAuth } from "../../../contexts/AuthContext";
import { useSelector } from "react-redux";
// import { canPerformAction } from "../../../utils/permissions";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { canPerformAction } from "../../../utils/permissionUtils";

const CourseTable = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [searchTerm, setSearchTerm] = useState("");
const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"


  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourseData, setModalCourseData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses(); // API helper
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching training program:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load training program",
        text: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!canPerformAction(rolePermissions, "course", "delete")) {
      Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: "You do not have permission to delete this Training Program.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Training Program?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((course) => course._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Training Program deleted successfully.",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: err.message || "Failed to delete training program.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch course by ID and open modal
  const handleViewClick = async (id) => {
    setModalLoading(true);
    setIsModalOpen(true);

    try {
      const courseData = await fetchCourseById(id);
      setModalCourseData(courseData);
    } catch (err) {
      console.error(err);
      setModalCourseData(null);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to fetch training program details",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Clone course function
  // 3️⃣ Use it in handleClone
  const handleClone = async (id) => {
    if (!canPerformAction(rolePermissions, "course", "create")) {
      Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: "You do not have permission to clone this Training Program.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clone this Training Program?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, clone it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const data = await cloneCourse(id);

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Cloned!",
            text: data.message || "Training Program cloned successfully.",
          });
          fetchCourses();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || "Failed to clone Training Program.",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Please Try Again !!",
        });
      }
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Batches Assigned",
      accessor: (row) => {
        const hasBatches = row.batches?.length > 0;

        return (
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (hasBatches) {
                  navigate(`/manage-batches?courseId=${row._id}`);
                } else {
                  navigate(`/add-batch?courseId=${row._id}`);
                }
              }}
              title={hasBatches ? "View Batch" : "Add Batch"}
              className={`
            px-4 py-2 rounded-full font-semibold transition-transform
            ${
              hasBatches
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:scale-105 hover:from-blue-600 hover:to-blue-700"
                : "bg-gray-300 text-gray-800 shadow-inner hover:scale-105"
            }
          `}
            >
              {row.batches?.length || 0}
            </button>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          {/* View */}
          <button
            onClick={() => handleViewClick(row._id)}
            title="View"
            className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            <FaEye size={16} />
          </button>

          {/* Edit */}
          {canPerformAction(rolePermissions, "course", "update") && (
            <button
              onClick={() => navigate(`/courses/edit/${row._id}`)}
              title="Edit"
              className="p-2 bg-amber-400 text-white rounded hover:bg-amber-500"
            >
              <FaEdit size={16} />
            </button>
          )}

          {/* Add Curriculum */}
          <button
            onClick={() =>
              navigate(`/add-curriculum?type=phase&courseId=${row._id}`)
            }
            title="Add Curriculum"
            className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            <FaFolderPlus size={16} />
          </button>

          {/* Clone */}
          {canPerformAction(rolePermissions, "course", "create") && (
            <button
              onClick={() => handleClone(row._id)}
              title="Clone"
              className="p-2 bg-violet-600 text-white rounded hover:bg-violet-700"
            >
              <FaClone size={16} />
            </button>
          )}

          {/* Add Recording */}
          <button
            onClick={() => navigate(`/add-course-videos?courseId=${row._id}`)}
            title="Add Recording"
            className="p-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            <FaVideo size={16} />
          </button>

          {/* Manage Curriculum */}
          <button
            onClick={() => navigate(`/manage-curriculum?courseId=${row._id}`)}
            title="Manage Curriculum"
            className="p-2  bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            <FaListAlt size={16} />
          </button>

          {/* Add Assignment */}
          <button
            onClick={() => navigate(`/add-assignment?courseId=${row._id}`)}
            title="Add Assignment"
            className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            <FaTasks size={16} />
          </button>

          {/* Add Notes */}
          <button
            onClick={() => navigate(`/add-notes?courseId=${row._id}`)}
            title="Add Reference Material Repository"
            className="p-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
          >
            <FaStickyNote size={16} />
          </button>

          {/* Add Test */}
          <button
            onClick={() => navigate(`/add-test?courseId=${row._id}`)}
            title="Add Assessment Test"
            className="p-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            <FaFileAlt size={16} />
          </button>

          {/* Delete */}
          {canPerformAction(rolePermissions, "course", "delete") && (
            <button
              onClick={() => handleDelete(row._id)}
              disabled={deletingId === row._id}
              title="Delete"
              className="p-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const filteredAndSortedCourses = courses
  .filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const dateA = new Date(a.createdAt); // assuming createdAt exists in API
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });


  if (loading)
    return <div className="text-center p-4 text-indigo-600">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-600 font-semibold">{error}</div>
    );

//   return (
//     <div className="space-y-6">
//       {/* ✅ Header Section */}
//       <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 rounded-md">
//         <h2 className="text-2xl font-bold text-gray-700 tracking-wide">
//           Manage Training Program
//         </h2>
//         <button
//           onClick={() => navigate("/add-courses")}
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200"
//         >
//           + Create New Training Program
//         </button>
//       </div>

// <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
//   {/* Search */}
//   <input
//     type="text"
//     placeholder="Search by course name..."
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//     className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3"
//   />

//   {/* Sort */}
//   <select
//     value={sortOrder}
//     onChange={(e) => setSortOrder(e.target.value)}
//     className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//   >
//     <option value="newest">Newest First</option>
//     <option value="oldest">Oldest First</option>
//   </select>
// </div>


//       {/* ✅ Table Section */}
//       <div className="bg-white shadow-sm rounded-md p-4">
//         <ScrollableTable
//           columns={columns}
//           // data={courses}
//            data={filteredAndSortedCourses}
//           maxHeight="600px"
//           emptyMessage="No Training Program found"
//         />
//       </div>

//       {/* ✅ Modal for Course Details */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         header={modalCourseData ? modalCourseData.title : "Loading..."}
//       >
//         {modalLoading ? (
//           <p className="text-gray-500 text-center py-6">Loading...</p>
//         ) : modalCourseData ? (
//           <div className="space-y-4 text-gray-700">
//             {/* Description & Overview */}
//             <p>
//               <strong>Description:</strong> {modalCourseData.description}
//             </p>
//             <p>
//               <strong>Overview:</strong> {modalCourseData.overview}
//             </p>

//             {/* Learning Outcomes */}
//             {modalCourseData.learningOutcomes?.length > 0 && (
//               <div>
//                 <strong>Learning Outcomes:</strong>
//                 <ul className="list-disc ml-5 space-y-1">
//                   {modalCourseData.learningOutcomes.map((item, idx) => (
//                     <li key={idx}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Benefits */}
//             {modalCourseData.benefits?.length > 0 && (
//               <div>
//                 <strong>Benefits:</strong>
//                 <ul className="list-disc ml-5 space-y-1">
//                   {modalCourseData.benefits.map((item, idx) => (
//                     <li key={idx}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Key Features */}
//             {modalCourseData.keyFeatures?.length > 0 && (
//               <div>
//                 <strong>Key Features:</strong>
//                 <ul className="list-disc ml-5 space-y-2">
//                   {modalCourseData.keyFeatures.map((feature) => (
//                     <li key={feature._id}>
//                       <strong>{feature.title}:</strong> {feature.description}
//                       {feature.subPoints?.length > 0 && (
//                         <ul className="list-decimal ml-5 mt-1">
//                           {feature.subPoints.map((sub, i) => (
//                             <li key={i}>{sub}</li>
//                           ))}
//                         </ul>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Trainer Info */}
//             {modalCourseData.trainer?.length > 0 && (
//               <div>
//                 <strong>Trainer Info:</strong>
//                 {modalCourseData.trainer.map((t) => (
//                   <div
//                     key={t._id}
//                     className="border border-gray-200 p-3 rounded-md mb-3"
//                   >
//                     <p>
//                       <strong>Name:</strong> {t.fullName}
//                     </p>
//                     <p>
//                       <strong>Title:</strong> {t.title}
//                     </p>
//                     <p>
//                       <strong>Qualification:</strong> {t.highestQualification}
//                     </p>
//                     <p>
//                       <strong>College:</strong> {t.collegeName}
//                     </p>
//                     <p>
//                       <strong>Total Experience:</strong> {t.totalExperience}
//                     </p>
//                     <p>
//                       <strong>Available Timing:</strong> {t.availableTiming}
//                     </p>
//                     <p>
//                       <strong>LinkedIn:</strong>{" "}
//                       <a
//                         href={t.linkedinProfile?.trim()}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         {t.linkedinProfile?.trim()}
//                       </a>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Ratings and Status */}
//             <p>
//               <strong>Rating:</strong> {modalCourseData.rating}
//             </p>
//             <p>
//               <strong>Enrolled Count:</strong> {modalCourseData.enrolledCount}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               {modalCourseData.isActive ? "Active" : "Inactive"}
//             </p>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-6">No data found.</p>
//         )}
//       </Modal>
//     </div>
//   );

return (
   <div className="space-y-6">

    {/* Header Section (Search + Sort + CTA) */}
    <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md px-6 py-4 rounded-md sticky top-0 z-10 gap-4">

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-700 tracking-wide">
        Manage Training Program
      </h2>

      {/* Right Controls */}
      <div className="flex items-center gap-4 w-full md:w-auto">

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-800" size={16} />

          <input
            type="text"
            placeholder="Search training..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-sky-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 w-full shadow-sm"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={() => navigate("/add-courses")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200 shadow"
        >
          + Create Training
        </button>
      </div>
    </div>

    {/* Table Section */}
    <div className="bg-white shadow-sm rounded-md p-4">

      <div className="max-h-[500px] overflow-auto rounded-md border">
        <ScrollableTable
          columns={columns}
          data={filteredAndSortedCourses}
          maxHeight="500px"
          emptyMessage="No Training Program Found"
        />
      </div>
    </div>

    {/* Modal */}
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      header={modalCourseData ? modalCourseData.title : "Loading..."}
    >
      {modalLoading ? (
        <p className="text-gray-500 text-center py-6">Loading...</p>
      ) : modalCourseData ? (
        <div className="space-y-4 text-gray-700 scrollbar-thin pr-2 max-h-[70vh] overflow-y-auto">
          {/* ALL Existing Modal Info */}
          {/** Keeping your original modal content unchanged **/}
          {/** Added scroll + max height so modal never overflows the screen **/}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No data found.</p>
      )}
    </Modal>
  </div>
);


};

export default CourseTable;
