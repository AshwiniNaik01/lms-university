import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../../api/axiosConfig";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";
import { fetchActiveBatchById } from "../../../api/batch";
import { COURSE_NAME } from "../../../utils/constants";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePassword } from "../../hooks/usePassword";
// import { usePassword } from "../../hooks/usePassword"; // adjust path if needed

const EnrolledStudentList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get("b_id"); // get b_id from URL
  const [enrollments, setEnrollments] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);

  const [resetUser, setResetUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    password: resetPassword,
    setPassword: setResetPassword,
    generate: generateResetPassword,
  } = usePassword("");

  // const handleResetPassword = async () => {
  //   if (!resetPassword || !confirmPassword) {
  //     Swal.fire("Error", "Password fields cannot be empty", "error");
  //     return;
  //   }

  //   if (resetPassword !== confirmPassword) {
  //     Swal.fire("Error", "Passwords do not match", "error");
  //     return;
  //   }

  //   try {
  //     await apiClient.put("/api/auth/reset-password", {
  //       email: resetUser.email,
  //       role: resetUser.role || "student",
  //       newPassword: resetPassword,
  //     });

  //     Swal.fire("Success", "Password reset successfully", "success");

  //     // cleanup
  //     setResetUser(null);
  //     setResetPassword("");
  //     setConfirmPassword("");
  //     setShowNewPassword(false);
  //     setShowConfirmPassword(false);
  //   } catch (err) {
  //     Swal.fire(
  //       "Error",
  //       err.response?.data?.message || "Failed to reset password",
  //       "error"
  //     );
  //   }
  // };

  // Fetch enrollments
  
const handleResetPassword = async () => {
  if (!resetPassword || !confirmPassword) {
    Swal.fire("Error", "Password fields cannot be empty", "error");
    return;
  }

  if (resetPassword !== confirmPassword) {
    Swal.fire("Error", "Passwords do not match", "error");
    return;
  }

  if (!resetUser?.enrollmentId) {
    Swal.fire("Error", "No enrollment selected for password reset", "error");
    return;
  }

  try {
    await apiClient.put(
      `/api/enrollments/${resetUser.enrollmentId}`,
      { password: resetPassword } // sending as JSON
    );

    Swal.fire("Success", "Password reset successfully", "success");

    // cleanup
    setResetUser(null);
    setResetPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to reset password",
      "error"
    );
  }
};

  
  
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
      header: "Participate Name",
      accessor: (row) => row.student?.fullName || "-",
    },
    {
      header: "Email",
      accessor: (row) => row.student?.email || "-",
    },

    // {
    //   header: "Mobile No",
    //   accessor: (row) => row.student?.mobileNo || "-",
    // },

    // ✅ Only show Training Program column if no batch filter
    !batchIdParam && {
      // header: "Training Program",
      header: COURSE_NAME,
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
  header: "Reset Password",
  accessor: (row) =>
    canPerformAction(rolePermissions, "enrollment", "update") ? (
      <button
        onClick={() =>
          setResetUser({ ...row.student, enrollmentId: row.enrollment._id })
        }
        className="text-indigo-600 hover:underline text-sm font-medium"
      >
        Reset
      </button>
    ) : null,
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
  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchIdParam) return;

      try {
        setBatchLoading(true);
        const response = await fetchActiveBatchById(batchIdParam);
        console.log("Fetched batch:", response); // DEBUG

        // Correct field name
        setBatchName(response?.batchName || "");
      } catch (err) {
        console.error("Error fetching batch:", err);
      } finally {
        setBatchLoading(false);
      }
    };

    fetchBatch();
  }, [batchIdParam]);

  return (
    <div className="flex flex-col max-h-screen bg-white font-sans">
      <div className="flex justify-between items-center px-8 py-2 bg-white shadow-md z-10">
        {/* <h2 className="text-2xl font-bold text-gray-700">
          Manage Enrolled Student
        </h2> */}

        <h2 className="text-2xl font-bold text-gray-700">
          {batchLoading
            ? "Loading batch..."
            : batchName
            ? `Enrolled Participate list for ${batchName}`
            : "Manage Enrolled Participate"}
        </h2>

        {canPerformAction(rolePermissions, "enrollment", "create") && (
          <button
            onClick={() => navigate("/enroll-student")}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            + Enroll New Participate
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
                <span className="text-gray-500 font-medium">
                  Participate Name
                </span>
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

      <Modal
        isOpen={!!resetUser}
        onClose={() => {
          setResetUser(null);
          setResetPassword("");
          setConfirmPassword("");
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        }}
        header="Reset Password"
        primaryAction={{
          label: "Save",
          onClick: handleResetPassword,
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Reset password for <b>{resetUser?.email}</b>
          </p>

          {/* New Password */}
          <div className="relative">
            <label className="text-sm font-medium">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              className="w-full border p-2 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Auto Generate */}
          <button
            type="button"
            onClick={() => generateResetPassword(6)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md"
          >
            Auto Generate
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EnrolledStudentList;
