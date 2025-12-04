import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const EnrolledStudentList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get("b_id"); // get b_id from URL
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/enrollments");
        let data = res.data.data || [];

        // ✅ Filter by batch if b_id is present
        if (batchIdParam) {
          data = data.filter((enroll) =>
            enroll.enrollment?.enrolledBatches?.some(
              (b) => b._id === batchIdParam
            )
          );
        }

        setEnrollments(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [batchIdParam]);

  // Table Columns
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

    // ✅ Only show Training Program column if no batch filter
    !batchIdParam && {
      header: "Training Program",
      accessor: (row) => {
        const count = row.enrollment?.enrolledCourses?.length || 0;
        return count > 0 ? (
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => {
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

    {
      header: "Enrolled At",
      accessor: (row) =>
        new Date(row.enrollment?.enrolledAt).toLocaleString() || "-",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/enrollments/${row.enrollment._id}`)}
            className="text-white font-medium bg-blue-500 px-4 py-2 rounded-md"
          >
            View
          </button>

          {canPerformAction(rolePermissions, "enrollment", "update") && (
            <button
              onClick={() => navigate(`/enroll-student/${row.enrollment._id}`)}
              className="text-white font-medium bg-yellow-500 px-4 py-2 rounded-md"
            >
              Edit
            </button>
          )}

          {canPerformAction(rolePermissions, "enrollment", "delete") && (
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

                    setEnrollments((prev) =>
                      prev.filter(
                        (e) => e.enrollment._id !== row.enrollment._id
                      )
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
          )}
        </div>
      ),
    },
  ].filter(Boolean); // remove `false` column when batchIdParam exists

  return (
    <div className="flex flex-col max-h-screen bg-white font-sans">
      <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
        <h2 className="text-2xl font-bold text-gray-700">
          Manage Enrolled Student
        </h2>
        {canPerformAction(rolePermissions, "enrollment", "create") && (
          <button
            onClick={() => navigate("/enroll-student")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            + Enroll New Student
          </button>
        )}
      </div>

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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          modalType === "courses"
            ? "Training Enrolled"
            : selectedEnrollment?.student?.fullName || "Enrollment Details"
        }
      >
        {selectedEnrollment && (
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnrolledStudentList;
