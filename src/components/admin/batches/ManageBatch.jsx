// // src/components/Admin/Batch/ManageBatches.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient from "../../../api/axiosConfig";

// const ManageBatch = () => {
//   const [batches, setBatches] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState("all");
//   const [noBatchesMessage, setNoBatchesMessage] = useState("");
//   const navigate = useNavigate();

//   // -------------------- Fetch All Batches --------------------
//   const fetchBatches = async () => {
//     try {
//       const res = await apiClient.get("/api/batches");
//       const data = res.data.data || [];
//       setBatches(data);
//       setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
//     } catch (err) {
//       console.error("Error fetching batches:", err);
//       setNoBatchesMessage("Failed to fetch batches");
//     }
//   };

//   // -------------------- Fetch Batches by Course ID --------------------
//   const fetchBatchesByCourseId = async (courseId) => {
//     try {
//       if (courseId === "all") {
//         fetchBatches();
//         return;
//       }

//       const res = await apiClient.get(`/api/batches/course/${courseId}`);
//       if (res.data && res.data.success && res.data.data?.length > 0) {
//         setBatches(res.data.data);
//         setNoBatchesMessage("");
//       } else {
//         setBatches([]);
//         setNoBatchesMessage("No batches found for this course");
//       }
//     } catch (err) {
//       if (err.response?.status === 404) {
//         setBatches([]);
//         setNoBatchesMessage("No batches found for this course");
//       } else {
//         console.error("Error fetching batches by course ID:", err);
//         setNoBatchesMessage("Failed to fetch batches for this course");
//       }
//     }
//   };

//   // -------------------- Fetch All Courses --------------------
//   const getAllCourses = async () => {
//     try {
//       const res = await apiClient.get("/api/courses/all");
//       setCourses(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     }
//   };

//   // -------------------- Handle Delete --------------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this batch?")) return;
//     try {
//       await apiClient.delete(`/api/batches/${id}`);
//       fetchBatches();
//     } catch (err) {
//       console.error("Error deleting batch:", err.response?.data || err.message);
//       alert("❌ Failed to delete batch");
//     }
//   };

// // -------------------- Handle Edit --------------------
// const handleEdit = (batchId) => {
//   // Navigate using the batch ID
//   navigate(`/admin/add-batch/${batchId}`);
// };

// // -------------------- Handle Course Filter Change --------------------
// const handleCourseFilterChange = (e) => {
//   const batchId = e.target.value; // now using batch ID instead of course ID
//   setSelectedCourseId(batchId);   // consider renaming this state to selectedBatchId for clarity
//   fetchBatchesByCourseId(batchId); // if your API fetch expects courseId, you might need to update this
// };

//   useEffect(() => {
//     fetchBatches();
//     getAllCourses();
//   }, []);

//   // -------------------- JSX --------------------
//   return (
//     <div className="p-8 font-sans bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-semibold text-gray-800">Manage Batches</h2>
//         <button
//           onClick={() => navigate("/admin/add-batch")}
//           className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition"
//         >
//           + Add Batch
//         </button>
//       </div>

//       {/* ---------- TABLE SECTION ---------- */}
//       <div className="bg-white p-5 rounded-xl shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-700">All Batches</h3>

//           {/* Course Filter Dropdown */}
//           <div className="flex items-center gap-3">
//             <label className="font-semibold text-gray-600">Filter by Course:</label>
//             <select
//               value={selectedCourseId}
//               onChange={handleCourseFilterChange}
//               className="p-2 border rounded-md border-gray-300"
//             >
//               <option value="all">All Courses</option>
//               {courses.map((course) => (
//                 <option key={course._id} value={course._id}>
//                   {course.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {noBatchesMessage ? (
//             <p className="text-center text-gray-600 py-6 font-medium">
//               {noBatchesMessage}
//             </p>
//           ) : (
//             <table className="w-full table-auto border-collapse">
//               <thead>
//                 <tr className="bg-cyan-500 text-white text-left">
//                   <th className="p-2">Batch Name</th>
//                   <th className="p-2">Time</th>
//                   {/* <th className="p-2">Days</th> */}
//                   <th className="p-2">Mode</th>
//                   {/* <th className="p-2">Courses</th> */}
//                   <th className="p-2">Trainers</th>
//                   {/* <th className="p-2">Notes</th> */}
//                   {/* <th className="p-2">Students</th> */}
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {batches.map((batch) => (
//                   <tr key={batch._id} className="border-b hover:bg-gray-50">
//                     <td className="p-2 font-semibold text-gray-700">
//                       {batch.batchName}
//                     </td>
//                     <td className="p-2">
//                       {batch.time?.start || "-"} - {batch.time?.end || "-"}
//                     </td>
//                     {/* <td className="p-2">{batch.days?.join(", ") || "-"}</td> */}
//                     <td className="p-2">{batch.mode || "-"}</td>
//                     {/* <td className="p-2">
//                       {batch.coursesAssigned
//                         ?.map((c) => c?.title)
//                         .join(", ") || "-"}
//                     </td> */}
//                     <td className="p-2">
//                       {batch.trainersAssigned
//                         ?.map((t) => t?.fullName)
//                         .join(", ") || "-"}
//                     </td>
//                     {/* <td className="p-2">{batch.additionalNotes || "-"}</td> */}
//                     {/* <td className="p-2 text-center">
//                       {batch.studentCount || 0}
//                     </td> */}
//                     <td className="p-2 text-center">{batch.status || "-"}</td>
//                    <td className="p-2 flex gap-2">
//   <button
//     onClick={() => handleEdit(batch._id)} // <-- send batch ID instead of course ID
//     className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
//   >
//     Edit
//   </button>
//   <button
//     onClick={() => handleDelete(batch._id)}
//     className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
//   >
//     Delete
//   </button>
// </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageBatch;


// src/components/Admin/Batch/ManageBatches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
// import Modal from "../../common/Modal"; // ✅ adjust path if needed

const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [noBatchesMessage, setNoBatchesMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // -------------------- Fetch All Batches --------------------

const fetchBatches = async () => {
  try {
    const res = await apiClient.get("/api/batches/all");
    const data = res.data.data || [];
    setBatches(data);
    setNoBatchesMessage(data.length === 0 ? "No batches available" : "");
  } catch (err) {
    console.error("Error fetching batches:", err);
    const errorMessage =
      err.response?.data?.message || "Failed to fetch batches";
    setNoBatchesMessage(errorMessage);

    Swal.fire({
      icon: "error",
      title: "Failed to Fetch Batches",
      text: errorMessage,
      confirmButtonColor: "#3085d6",
    });
  }
};

  // -------------------- Fetch Batches by Course ID --------------------

  const fetchBatchesByCourseId = async (courseId) => {
  try {
    if (courseId === "all") {
      fetchBatches();
      return;
    }

    const res = await apiClient.get(`/api/batches/course/${courseId}`);
    if (res.data && res.data.success && res.data.data?.length > 0) {
      setBatches(res.data.data);
      setNoBatchesMessage("");
    } else {
      setBatches([]);
      setNoBatchesMessage("No batches found for this course");
      Swal.fire({
        icon: "info",
        title: "No Batches Found",
        text: "No batches found for this selected course.",
        confirmButtonColor: "#3085d6",
      });
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to fetch batches for this course";

    if (err.response?.status === 404) {
      setBatches([]);
      setNoBatchesMessage("No batches found for this course");
    }

    Swal.fire({
      icon: "error",
      title: "Error Fetching Course Batches",
      text: errorMessage,
      confirmButtonColor: "#d33",
    });
  }
};

  // -------------------- Fetch All Courses --------------------

  const getAllCourses = async () => {
  try {
    const res = await apiClient.get("/api/courses/all");
    setCourses(res.data.data || []);
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to fetch courses";

    Swal.fire({
      icon: "error",
      title: "Error Fetching Courses",
      text: errorMessage,
      confirmButtonColor: "#d33",
    });
  }
};

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
    await apiClient.delete(`/api/batches/${id}`);
    fetchBatches();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Batch has been deleted successfully.",
      confirmButtonColor: "#3085d6",
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
      confirmButtonColor: "#d33",
    });
  }
};


  // -------------------- Handle View --------------------
 const handleView = async (batchId) => {
  try {
    const res = await apiClient.get(`/api/batches/${batchId}`);
    const batch = Array.isArray(res.data.data)
      ? res.data.data[0]
      : res.data.data;
    setSelectedBatch(batch);
    setIsModalOpen(true);
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to fetch batch details";

    Swal.fire({
      icon: "error",
      title: "Error Fetching Details",
      text: errorMessage,
      confirmButtonColor: "#d33",
    });
  }
};


  // -------------------- Navigation Handler --------------------
  const handleEdit = (batchId) => navigate(`/admin/add-batch/${batchId}`);

  // -------------------- Handle Course Filter --------------------
  const handleCourseFilterChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchBatchesByCourseId(courseId);
  };

  // -------------------- Fetch on Mount --------------------
  useEffect(() => {
    fetchBatches();
    getAllCourses();
  }, []);

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
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row._id)}
            className="px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
          >
            View
          </button>
          <button
            onClick={() => handleEdit(row._id)}
            className="px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Batches</h2>
        <button
          onClick={() => navigate("/admin/add-batch")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          + Add Batch
        </button>
      </div>

      {/* ---------- Filter Section ---------- */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-gray-700">Filter by Course:</label>
          <select
            value={selectedCourseId}
            onChange={handleCourseFilterChange}
            className="p-2 border rounded-md border-gray-300"
          >
            <option value="all">All Courses</option>
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
        header={selectedBatch ? `Batch: ${selectedBatch.batchName}` : "Batch Details"}
      >
        {selectedBatch ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                <strong>Time:</strong>{" "}
                {selectedBatch.time?.start || "-"} - {selectedBatch.time?.end || "-"}
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
                <strong>Courses:</strong>{" "}
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
