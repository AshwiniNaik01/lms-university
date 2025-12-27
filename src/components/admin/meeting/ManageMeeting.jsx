import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import Dropdown from "../../form/Dropdown";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const ManageMeeting = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const { rolePermissions } = useSelector((state) => state.permissions);

  // 🆕 Attendance modal states
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please select the batch");


  const navigate = useNavigate();

  // 🧩 Fetch batches for dropdown
  useEffect(() => {
    apiClient
      .get("/api/batches/all")
      .then((res) => {
        const batchesArray = Array.isArray(res.data.data) ? res.data.data : [];
        const formattedBatches = batchesArray.map((batch) => ({
          _id: batch._id,
          name: batch.batchName,
        }));
        setBatches(formattedBatches);
      })
      .catch((err) => console.error("Error fetching batches:", err));
  }, []);

  // 🧩 Fetch meetings for selected batch
  // useEffect(() => {
  //   if (!selectedBatch) {
  //     setMeetings([]);
  //     return;
  //   }

  //   apiClient
  //     .get(`/api/meetings/batch/${selectedBatch}`)
  //     .then((res) => {
  //       const meetingsArray = Array.isArray(res.data.data) ? res.data.data : [];
  //       setMeetings(meetingsArray);
  //     })
  //     .catch((err) => console.error("Error fetching meetings:", err));
  // }, [selectedBatch]);

  useEffect(() => {
  if (!selectedBatch) {
    setMeetings([]);
    setErrorMessage("Please select the batch"); // reset error message when no batch selected
    return;
  }

  apiClient
    .get(`/api/meetings/batch/${selectedBatch}`)
    .then((res) => {
      const meetingsArray = Array.isArray(res.data.data) ? res.data.data : [];
      setMeetings(meetingsArray);
      setErrorMessage(meetingsArray.length === 0 ? "No sessions found for this batch" : "");
    })
    .catch((err) => {
      console.error("Error fetching sessions:", err);

      // Check if error response has message and statusCode === 404
      if (err.response?.status === 404 && err.response?.data?.message) {
        setMeetings([]);
        setErrorMessage(err.response.data.message);
      } else {
        setMeetings([]);
        setErrorMessage("Failed to fetch sessions");
      }
    });
}, [selectedBatch]);


  // 🧩 View meeting details
  const handleView = (meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  // 🧩 Navigate to attendance marking
  // const handleAttendance = (meeting) => {
  //   if (meeting.attendanceStatus === "Attendance already marked") {
  //     Swal.fire({
  //       icon: "info",
  //       title: "Attendance Already Done",
  //       text: "You have already marked attendance for this session.",
  //       confirmButtonText: "OK",
  //     });
  //   } else {
  //     navigate(`/attendance/${meeting._id}`, { state: { meeting } });
  //   }
  // };


  const handleAttendance = (meeting) => {
  if (meeting.attendanceDone) {
    Swal.fire({
      icon: "info",
      title: "Attendance Already Done",
      text: "You have already marked attendance for this session.",
      confirmButtonText: "OK",
    });
  } else {
    navigate(`/attendance/${meeting._id}`, { state: { meeting } });
  }
};

  // 🧩 View attendance data (popup modal)
  // 🧩 View attendance data (popup modal)
  const handleViewAttendance = async (meeting) => {
    try {
      setLoadingAttendance(true); // start loading
      const res = await apiClient.get(`/api/attendance/meeting/${meeting._id}`);

      if (res.data.success && res.data.data?.record) {
        const record = res.data.data.record;

        // Calculate counts in case API doesn't provide correct ones
        const students =
          record.attendees?.map((a) => ({
            fullName: a.studentDetails?.fullName || "-",
            email: a.studentDetails?.email || "-",
            mobileNo: a.studentDetails?.mobileNo || "-",
            program: a.studentDetails?.selectedProgram || "-",
            status: a.present ? "Present" : "Absent",
          })) || [];

        const presentCount = students.filter(
          (s) => s.status === "Present"
        ).length;
        const absentCount = students.filter(
          (s) => s.status === "Absent"
        ).length;

        const formattedData = {
          presentCount,
          absentCount,
          students,
        };

        setAttendanceData(formattedData);
        setAttendanceModalOpen(true);
      } else {
        const message =
          res.data.message || "No attendance records found for this session.";
        Swal.fire("Info", message, "info");
        setAttendanceData(null);

        // Swal.fire("Info", "No attendance records found for this meeting.", "info");
        // setAttendanceData(null);
      }
    } catch (err) {
      console.error(err);
      // If backend provides a message in error response
      const message =
        err.response?.data?.message || "Failed to fetch attendance data.";
      Swal.fire("Warning", message, "warning");
      setAttendanceData(null);
      // console.error(err);
      // Swal.fire("Error", "Failed to fetch attendance data.", "error");
      // setAttendanceData(null);
    } finally {
      setLoadingAttendance(false); // stop loading
    }
  };

  // 🧾 Columns for meetings table
  const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Platform",
    accessor: "platform",
  },
  {
    header: "Date",
    accessor: (row) =>
      row.startTime
        ? new Date(row.startTime).toLocaleDateString()
        : "-",
  },
  {
    header: "Start Time",
    accessor: (row) =>
      row.startTime
        ? new Date(row.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
  },
  {
    header: "End Time",
    accessor: (row) =>
      row.endTime
        ? new Date(row.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
  },
  {
    header: "Trainer",
    accessor: (row) => row.trainer?.fullName || "-",
  },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleView(row)}
            className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-indigo-600 transition-all"
          >
            View
          </button>

            {/* Show Attendance button ONLY if not already marked */}
      {canPerformAction(rolePermissions, "attendance", "create") &&
  
  !row.attendanceDone && (


              //  {canPerformAction(rolePermissions, "attendance", "create") && (
          <button
            onClick={() => handleAttendance(row)}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-600 transition-all"
          >
            Attendance
          </button>
               )}
          {/* 🆕 View Attendance Button */}
               {canPerformAction(rolePermissions, "attendance", "read") && (
          <button
            onClick={() => handleViewAttendance(row)}
            className="px-3 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-purple-600 transition-all"
          >
            View Attendance
          </button>
               )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Sessions</h2>

      {/* 🧩 Batch Dropdown */}
      <Dropdown
        label="Batch"
        name="batch"
        options={batches}
        formik={{
          values: { batch: selectedBatch },
          setFieldValue: (_, value) => setSelectedBatch(value),
          touched: {},
          errors: {},
        }}
      />

      {/* 🧾 Meetings Table */}
      <div className="mt-6">
        <ScrollableTable
          columns={columns}
          data={meetings}
          maxHeight="500px"
          emptyMessage={errorMessage}
        />
      </div>

      {/* 🪟 Meeting Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Session Details"
      >
        {selectedMeeting ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">
                {selectedMeeting.title}
              </h3>
              <p className="text-gray-600">{selectedMeeting.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Platform:</span>{" "}
                {selectedMeeting.platform || "-"}
              </div>
              {/* <div>
                <span className="font-medium text-gray-700">Trainer:</span>{" "}
                {selectedMeeting.trainerDetails?.fullName || "-"}
              </div> */}
              <div>
                <span className="font-medium text-gray-700">Start Time:</span>{" "}
                {new Date(selectedMeeting.startTime).toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-gray-700">End Time:</span>{" "}
                {new Date(selectedMeeting.endTime).toLocaleString()}
              </div>
              {/* <div>
                <span className="font-medium text-gray-700">Batch:</span>{" "}
                {selectedMeeting.batchDetails?.batchName || "-"}
              </div> */}
              <div>
                <span className="font-medium text-gray-700">Session ID:</span>{" "}
                {selectedMeeting.meetingId}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No session selected.</p>
        )}
      </Modal>

      {/* 🪟 Attendance Details Modal */}
      <Modal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        header="Attendance Details"
      >
        {loadingAttendance ? (
          <p className="text-gray-500 text-center py-4">
            Loading attendance...
          </p>
        ) : attendanceData ? (
          <div className="space-y-5">
            {/* Summary Counts */}
            <div className="flex justify-around text-center font-semibold">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-sm">
                Present: {attendanceData.presentCount ?? 0}
              </div>
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-sm">
                Absent: {attendanceData.absentCount ?? 0}
              </div>
            </div>

            {/* Students Table */}
            <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-indigo-50 text-indigo-900">
                  <tr>
                    <th className="px-4 py-2 text-left">Participate Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.students?.length ? (
                    attendanceData.students.map((s, idx) => (
                      <tr
                        key={idx}
                        className="border-b last:border-none hover:bg-indigo-50"
                      >
                        <td className="px-4 py-2">{s.fullName}</td>
                        <td className="px-4 py-2">{s.email}</td>
                        <td
                          className={`px-4 py-2 font-medium ${
                            s.status === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {s.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No attendance data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No data to display.</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageMeeting;
