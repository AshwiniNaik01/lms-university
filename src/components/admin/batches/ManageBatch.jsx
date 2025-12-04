// src/components/Admin/Batch/ManageBatches.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteBatch,
  fetchActiveBatchById,
  fetchAllBatches,
  fetchBatchesByCourseId,
} from "../../../api/batch";
import { getAllCourses } from "../../../api/courses";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [noBatchesMessage, setNoBatchesMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const navigate = useNavigate();
  const location = useLocation(); // for query params

  // -------------------- Fetch All Batches --------------------
  const fetchBatches = async () => {
    try {
      const data = await fetchAllBatches();
      setBatches(data);
      setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
    } catch (err) {
      setNoBatchesMessage(err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Batches",
        text: err.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // -------------------- Fetch Batches by Course ID --------------------
  const loadBatchesByCourse = async (courseId) => {
    try {
      if (courseId === "all") {
        const data = await fetchAllBatches();
        setBatches(data);
        setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
        return;
      }

      const data = await fetchBatchesByCourseId(courseId);
      if (data.length > 0) {
        setBatches(data);
        setNoBatchesMessage("");
      } else {
        setBatches([]);
        setNoBatchesMessage("No batches found for this Training Program");
        Swal.fire({
          icon: "info",
          title: "No Batches Found",
          text: "No batches found for this selected Training Program.",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (err) {
      setBatches([]);
      setNoBatchesMessage(err.message);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Course Batches",
        text: err.message,
        confirmButtonColor: "#d33",
      });
    }
  };


   // -------------------- Fetch Courses --------------------
  // const loadCourses = async () => {
  //   try {
  //     const coursesData = await getAllCourses(); 
  //     setCourses(coursesData || []);

  //     // -------------------- Handle URL param pre-fill --------------------
  //     const queryParams = new URLSearchParams(location.search);
  //     const courseIdFromURL = queryParams.get("courseId");
  //     if (courseIdFromURL && coursesData.some(c => c._id === courseIdFromURL)) {
  //       setSelectedCourseId(courseIdFromURL);
  //       loadBatchesByCourse(courseIdFromURL);
  //     } else {
  //       setSelectedCourseId("all");
  //       fetchBatches();
  //     }

  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || "Failed to fetch Training Programs";
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error Fetching Training Programs",
  //       text: errorMessage,
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  useEffect(() => {
  const initialize = async () => {
    try {
      // Fetch courses
      const coursesData = await getAllCourses();
      setCourses(coursesData || []);

      // Get query param
      const queryParams = new URLSearchParams(location.search);
      const courseIdFromURL = queryParams.get("courseId");

      if (courseIdFromURL && coursesData.some(c => c._id === courseIdFromURL)) {
        setSelectedCourseId(courseIdFromURL);
        await loadBatchesByCourse(courseIdFromURL);
      } else {
        setSelectedCourseId("all");
        await fetchBatches();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Training Programs",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  initialize();
}, [location.search]); // optional dependency if you want it to respond to URL changes



  // -------------------- Handle Delete --------------------
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the batch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await deleteBatch(id);
      fetchBatches();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Batch has been deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete batch";

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: errorMessage,
      });
    }
  };

  // -------------------- Handle View --------------------
  const handleView = async (batchId) => {
    try {
      const batch = await fetchActiveBatchById(batchId);
      setSelectedBatch(batch);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch batch details";

      Swal.fire({
        icon: "warning",
        title: "Error Fetching Details",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // -------------------- Navigation Handler --------------------
  const handleEdit = (batchId) => navigate(`/add-batch/${batchId}`);


  
  // -------------------- Handle Course Filter --------------------
  const handleCourseFilterChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    loadBatchesByCourse(courseId);
  };

  // -------------------- Fetch on Mount --------------------
  // useEffect(() => {
  //   fetchBatches();
  //   loadCourses();
  // }, []);

  // -------------------- Table Columns --------------------
  const columns = [
    { header: "Batch Name", accessor: (row) => row.batchName || "-" },
    {
      header: "Time",
      accessor: (row) => `${row.time?.start || "-"} - ${row.time?.end || "-"}`,
    },
    { header: "Mode", accessor: (row) => row.mode || "-" },
    {
      header: "Trainers",
      accessor: (row) =>
        row.trainersAssigned?.map((t) => t?.fullName).join(", ") || "-",
    },
    { header: "Status", accessor: (row) => row.status || "-" },
    // {
    //   header: "Actions",
    //   accessor: (row) => (
    //     <div className="flex gap-2">
    //       <button
    //         onClick={() => handleView(row._id)}
    //         className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
    //       >
    //         View
    //       </button>
    //       {canPerformAction(rolePermissions, "batch", "update") && (
    //       <button
    //         onClick={() => handleEdit(row._id)}
    //         className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
    //       >
    //         Edit
    //       </button>
    //       )}

    //       {canPerformAction(rolePermissions, "batch", "delete") && (
    //       <button
    //         onClick={() => handleDelete(row._id)}
    //         className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
    //       >
    //         Delete
    //       </button>
    //       )}
    //     </div>
    //   ),
    // },

{
  header: "Actions",
  accessor: (row) => {
    const batchId = row._id;
    const courseIds = row.coursesAssigned?.map(c => c._id).join(","); // get all assigned course IDs

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleView(batchId)}
          className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
        >
          View
        </button>

        {canPerformAction(rolePermissions, "batch", "update") && (
          <button
            onClick={() => handleEdit(batchId)}
            className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
        )}

        {canPerformAction(rolePermissions, "batch", "delete") && (
          <button
            onClick={() => handleDelete(batchId)}
            className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        )}

        {canPerformAction(rolePermissions, "batch", "update") && (
          <button
            onClick={() =>
              navigate(
                `/enrollments/upload-excel?batchId=${batchId}&courseIds=${courseIds}`
              )
            }
            className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
          >
            Add Candidate
          </button>
        )}

        {/* ---------- View Candidate Button ---------- */}
        <button
          onClick={() =>
            navigate(`/enrolled-student-list?b_id=${batchId}`)
          }
          className="px-2 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600 text-sm"
        >
          View Candidate
        </button>
      </div>
    );
  },
}



//     {
//   header: "Actions",
//   accessor: (row) => {
//     const batchId = row._id;
//     const courseIds = row.coursesAssigned?.map(c => c._id).join(","); // get all assigned course IDs

//     return (
//       <div className="flex gap-2">
//         <button
//           onClick={() => handleView(batchId)}
//           className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
//         >
//           View
//         </button>

//         {canPerformAction(rolePermissions, "batch", "update") && (
//           <button
//             onClick={() => handleEdit(batchId)}
//             className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
//           >
//             Edit
//           </button>
//         )}

//         {canPerformAction(rolePermissions, "batch", "delete") && (
//           <button
//             onClick={() => handleDelete(batchId)}
//             className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
//           >
//             Delete
//           </button>
//         )}

//         {/* ---------- Add Candidate Button ---------- */}
//         {canPerformAction(rolePermissions, "batch", "update") && (
//           <button
//             onClick={() =>
//               navigate(
//                 `/enrollments/upload-excel?batchId=${batchId}&courseIds=${courseIds}`
//               )
//             }
//             className="px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
//           >
//             Add Candidate
//           </button>
//         )}
//       </div>
//     );
//   },
// }

  ];

  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Batches</h2>
         {canPerformAction(rolePermissions, "batch", "create") && (
        <button
          onClick={() => navigate("/add-batch")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          + Add Batch
        </button>
         )}
      </div>

      {/* ---------- Filter Section ---------- */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-gray-700">
            Filter by Training Program:
          </label>
          <select
            value={selectedCourseId}
            onChange={handleCourseFilterChange}
            className="p-2 border rounded-md border-gray-300"
          >
            <option value="all">All Training Programs</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Table Section ---------- */}
      <ScrollableTable
        columns={columns}
        data={batches}
        maxHeight="600px"
        emptyMessage={noBatchesMessage || "No batches found"}
      />

      {/* ---------- Modal for Batch Details ---------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          selectedBatch ? `Batch: ${selectedBatch.batchName}` : "Batch Details"
        }
      >
        {selectedBatch ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <strong>Time:</strong> {selectedBatch.time?.start || "-"} -{" "}
                {selectedBatch.time?.end || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Mode:</strong> {selectedBatch.mode || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Days:</strong>{" "}
                {selectedBatch.days?.length > 0
                  ? selectedBatch.days.join(", ")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <strong>Training Programs:</strong>{" "}
                {selectedBatch.coursesAssigned
                  ?.map((c) => c?.title)
                  .join(", ") || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Trainers:</strong>{" "}
                {selectedBatch.trainersAssigned
                  ?.map((t) => t?.fullName)
                  .join(", ") || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-600">
                <strong>Status:</strong> {selectedBatch.status || "-"}
              </p>
              <p className="text-gray-600">
                <strong>Notes:</strong>{" "}
                {selectedBatch.additionalNotes || "No notes available"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading batch details...</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageBatch;
