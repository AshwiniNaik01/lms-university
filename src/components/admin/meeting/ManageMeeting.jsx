

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import Dropdown from "../../form/Dropdown";
import ScrollableTable from "../../table/ScrollableTable";
import Modal from "../../popupModal/Modal";
// import Dropdown from "./Dropdown";
// import ScrollableTable from "./ScrollableTable";
// import Modal from "./Modal";

const ManageMeeting = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch batches for dropdown
  useEffect(() => {
    apiClient
      .get("/api/batches")
      .then((res) => {
        console.log("Batches API response:", res.data);
        const batchesArray = Array.isArray(res.data.data) ? res.data.data : [];
        const formattedBatches = batchesArray.map((batch) => ({
          _id: batch._id,
          name: batch.batchName,
        }));
        setBatches(formattedBatches);
      })
      .catch((err) => console.error("Error fetching batches:", err));
  }, []);

  // Fetch meetings for selected batch
  useEffect(() => {
    if (!selectedBatch) {
      setMeetings([]);
      return;
    }

    apiClient
      .get(`/api/meetings/batch/${selectedBatch}`)
      .then((res) => {
        console.log("Meetings API response:", res.data);
        const meetingsArray = Array.isArray(res.data.data) ? res.data.data : [];
        setMeetings(meetingsArray);
      })
      .catch((err) => console.error("Error fetching meetings:", err));
  }, [selectedBatch]);

  // Handle "View" button click
  const handleView = (meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  // Handle "Attendance" navigation
  const handleAttendance = (meeting) => {
    navigate(`/admin/attendance/${meeting._id}`, {
      state: { meeting },
    });
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Platform", accessor: "platform" },
    {
      header: "Start Time",
      accessor: (row) => new Date(row.startTime).toLocaleString(),
    },
    {
      header: "End Time",
      accessor: (row) => new Date(row.endTime).toLocaleString(),
    },
    {
      header: "Trainer",
      accessor: (row) => row.trainerDetails?.fullName || "-",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleView(row)}
            className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            View
          </button>
          <button
            onClick={() => handleAttendance(row)}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Attendance
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Meetings</h2>

      {/* Batch Dropdown */}
      <Dropdown
        label="Select Batch"
        name="batch"
        options={batches}
        formik={{
          values: { batch: selectedBatch },
          setFieldValue: (_, value) => setSelectedBatch(value),
          touched: {},
          errors: {},
        }}
      />

      {/* Meetings Table */}
   <div className="mt-6">
  <ScrollableTable
    columns={columns}
    data={meetings}
    maxHeight="500px"
    emptyMessage="Please select the batch"
  />
</div>

      {/* View Meeting Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Meeting Details"
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
              <div>
                <span className="font-medium text-gray-700">Trainer:</span>{" "}
                {selectedMeeting.trainerDetails?.fullName || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Start Time:</span>{" "}
                {new Date(selectedMeeting.startTime).toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-gray-700">End Time:</span>{" "}
                {new Date(selectedMeeting.endTime).toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-gray-700">Batch:</span>{" "}
                {selectedMeeting.batchDetails?.batchName || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Meeting ID:</span>{" "}
                {selectedMeeting.meetingId}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No meeting selected.</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageMeeting;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiClient from "../../../api/axiosConfig";

// const ManageMeeting = () => {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [meetings, setMeetings] = useState([]);
//   const navigate = useNavigate();

//   // Fetch batches for dropdown
//   useEffect(() => {
//     apiClient
//       .get("/api/batches")
//       .then(res => {
//         if (res.data && res.data.success) {
//           setBatches(res.data.data);
//         }
//       })
//       .catch(err => console.error("Error fetching batches:", err));
//   }, []);

//   // Fetch meetings whenever selectedBatch changes
//   useEffect(() => {
//     if (!selectedBatch) {
//       setMeetings([]);
//       return;
//     }

//     apiClient
//       .get(`/api/meetings/batch/${selectedBatch}`)
//       .then(res => {
//         if (res.data && res.data.success) {
//           setMeetings(res.data.data);
//         }
//       })
//       .catch(err => console.error("Error fetching meetings:", err));
//   }, [selectedBatch]);

//   return (
//     <div>
//       <h2>Manage Meetings</h2>

//       {/* Batch Dropdown */}
//       <select
//         value={selectedBatch}
//         onChange={(e) => setSelectedBatch(e.target.value)}
//         style={{ marginBottom: "20px", padding: "5px" }}
//       >
//         <option value="">Select Batch</option>
//         {batches.map(batch => (
//           <option key={batch._id} value={batch._id}>
//             {batch.batchName}
//           </option>
//         ))}
//       </select>

//       {/* Meetings Table */}
//       <table border="1" cellPadding="10" style={{ width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Platform</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//             <th>Trainer</th>
//             <th>Batch</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {meetings.length > 0 ? (
//             meetings.map(meeting => (
//               <tr key={meeting._id}>
//                 <td>{meeting.title}</td>
//                 <td>{meeting.platform}</td>
//                 <td>{new Date(meeting.startTime).toLocaleString()}</td>
//                 <td>{new Date(meeting.endTime).toLocaleString()}</td>
//                 <td>{meeting.trainerDetails.fullName}</td>
//                 <td>{meeting.batchDetails.batchName}</td>
//                 <td>
//                   <button onClick={() => alert(JSON.stringify(meeting, null, 2))}>
//                     View
//                   </button>
//                   <button
//                     onClick={() =>
//                       navigate(`/admin/attendance/${meeting._id}`, { state: { meeting } })
//                     }
//                     style={{ marginLeft: "10px" }}
//                   >
//                     Attendance
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center" }}>
//                 {selectedBatch ? "No meetings found for this batch." : "Please select a batch."}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageMeeting;
