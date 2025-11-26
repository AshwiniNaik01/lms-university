import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

const EnrolledStudentList = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalType, setModalType] = useState(null); // "courses" | "batches"

  // ✅ Fetch all enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/enrollments`);
        setEnrollments(res.data.data || []);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // ✅ Table Columns
  const columns = [
    {
      header: "Student Name",
      accessor: (row) => row.student?.fullName || "-",
    },
    {
      header: "Email",
      accessor: (row) => row.student?.email || "-",
    },
    {
      header: "Mobile No",
      accessor: (row) => row.student?.mobileNo || "-",
    },
    // {
    //   header: "Program",
    //   accessor: (row) => row.student?.selectedProgram || "-",
    // },

    {
      header: "Training Program",
      accessor: (row) => {
        const count = row.enrollment?.enrolledCourses?.length || 0;
        return count > 0 ? (
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => {
              // Navigate to course details page
              navigate(`/enrollments/${row.enrollment._id}/courses`, {
                state: {
                  enrolledCourses: row.enrollment?.enrolledCourses || [],
                },
              });
            }}
          >
            {count} {count === 1 ? "Training" : "Trainings"}
          </button>
        ) : (
          "—"
        );
      },
    },
    // {
    //   header: "Courses",
    //   accessor: (row) => {
    //     const count = row.enrollment?.enrolledCourses?.length || 0;
    //     return count > 0 ? (
    //       <button
    //         className="text-blue-600 font-medium hover:underline"
    //         onClick={() => {
    //           setSelectedEnrollment(row);
    //           setModalType("courses");
    //           setIsModalOpen(true);
    //         }}
    //       >
    //         {count} {count === 1 ? "Course" : "Courses"}
    //       </button>
    //     ) : (
    //       "—"
    //     );
    //   },
    // },

    {
      header: "Enrolled At",
      accessor: (row) =>
        new Date(row.enrollment?.enrolledAt).toLocaleString() || "-",
    },

    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          {/* View Button */}
          {/* <button
            onClick={() => {
              setSelectedEnrollment(row);
              setModalType("details");
              setIsModalOpen(true);
            }}
            className="text-white font-medium bg-blue-500 px-4 py-2 rounded-md"
          >
            View
          </button> */}

          <button
            onClick={() => navigate(`/enrollments/${row.enrollment._id}`)}
            className="text-white font-medium bg-blue-500 px-4 py-2 rounded-md"
          >
            View
          </button>

          {/* Edit Button */}
          <button
            onClick={() =>
              navigate(`/enroll-student/${row.enrollment._id}`)
            }
            className="text-white font-medium bg-yellow-500 px-4 py-2 rounded-md"
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: "Are you sure?",
                text: `Do you want to delete ${row.student?.fullName}'s enrollment?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
              });

              if (result.isConfirmed) {
                try {
                  setLoading(true);
                  await apiClient.delete(
                    `/api/enrollments/${row.enrollment._id}`
                  );
                  Swal.fire(
                    "Deleted!",
                    "Enrollment has been deleted.",
                    "success"
                  );

                  // Refresh enrollments
                  setEnrollments((prev) =>
                    prev.filter((e) => e.enrollment._id !== row.enrollment._id)
                  );
                } catch (err) {
                  console.error(err);
                  Swal.fire(
                    "Error",
                    err.response?.data?.message ||
                      "Failed to delete enrollment.",
                    "error"
                  );
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="text-white font-medium bg-red-500 px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      ),
    },

    // {
    //   header: "Actions",
    //   accessor: (row) => (
    //     <button
    //       onClick={() => {
    //         setSelectedEnrollment(row);
    //         setModalType("details");
    //         setIsModalOpen(true);
    //       }}
    //       className="text-white hover:underline font-medium bg-blue-500 px-4 py-2 rounded-md"
    //     >
    //       View
    //     </button>
    //   ),
    // },
  ];

  // ✅ Modal content based on type
  const renderModalContent = () => {
    if (!selectedEnrollment) return null;

    const { enrollment } = selectedEnrollment;

    if (modalType === "courses") {
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-blue-700">
            Enrolled Training
          </h3>
          {enrollment.enrolledCourses?.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {enrollment.enrolledCourses.map((c, i) => (
                <li key={i} className="font-medium">
                  {c.title || c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No training enrolled.</p>
          )}
        </div>
      );
    }

    // if (modalType === "batches") {
    //   return (
    //     <div className="space-y-3">
    //       <h3 className="text-lg font-semibold text-green-700">
    //         Enrolled Batches
    //       </h3>
    //       {enrollment.enrolledBatches?.length > 0 ? (
    //         <ul className="list-disc pl-5 space-y-1 text-gray-700">
    //           {enrollment.enrolledBatches.map((b, i) => (
    //             <li key={i} className="font-medium">
    //               {b.batchName}
    //             </li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <p className="text-gray-500">No batches assigned.</p>
    //       )}
    //     </div>
    //   );
    // }

    // Default: Full details

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Student Name</span>
            <span className="text-gray-800">
              {selectedEnrollment.student?.fullName}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800">
              {selectedEnrollment.student?.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Mobile</span>
            <span className="text-gray-800">
              {selectedEnrollment.student?.mobileNo}
            </span>
          </div>
          {/* <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Program</span>
            <span className="text-gray-800">{selectedEnrollment.student?.selectedProgram || "-"}</span>
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col max-h-screen bg-white font-sans">
      {/* ✅ Header */}
      <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
        <h2 className="text-2xl font-bold text-gray-700">
          Manage Enrolled Student
        </h2>
        <button
          onClick={() => navigate("/enroll-student")}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
        >
          + Enroll New Student
        </button>
      </div>

      {/* ✅ Table Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              Loading enrollments...
            </div>
          ) : (
            <ScrollableTable
              columns={columns}
              data={enrollments}
              maxHeight="440px"
              emptyMessage="No enrollments found."
            />
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          modalType === "courses"
            ? "Courses Enrolled"
            : modalType === "batches"
            ? "Assigned Batches"
            : selectedEnrollment?.student?.fullName || "Enrollment Details"
        }
      >
        {renderModalContent()}
      </Modal> */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          modalType === "courses"
            ? "Training Enrolled"
            : selectedEnrollment?.student?.fullName || "Enrollment Details"
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default EnrolledStudentList;
