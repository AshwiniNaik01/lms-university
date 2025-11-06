// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import apiClient from "../../../api/axiosConfig";

// const Attendance = () => {
//   const { meetingId } = useParams();
//   const navigate = useNavigate();

//   const [meeting, setMeeting] = useState(null);
//   const [attendees, setAttendees] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch meeting + students from attendance API
// useEffect(() => {
//   if (!meetingId) {
//     console.error("No meetingId found in URL");
//     setLoading(false);
//     return;
//   }

//   apiClient.get(`/api/attendance/meeting/${meetingId}`)
//     .then(res => {
//       console.log("Meeting with students fetched:", res.data);
//       const meetingData = res.data;

//       setMeeting(meetingData);

//       const records = meetingData?.message?.records;
//       if (records?.length) {
//         const initialAttendees = records.map(record => ({
//           studentId: record.student._id,
//           present: record.present || false,
//         }));
//         setAttendees(initialAttendees);
//       } else {
//         console.warn("No students found in batch");
//         setAttendees([]);
//       }
//     })
//     .catch(err => {
//       console.error("Failed to fetch meeting with students:", err);
//     //   navigate("/admin/meetings");
//     })
//     .finally(() => setLoading(false));
// }, [meetingId, navigate]);


//   const handleToggle = (index) => {
//     const newAttendees = [...attendees];
//     newAttendees[index].present = !newAttendees[index].present;
//     setAttendees(newAttendees);
//   };

//   const handleSubmit = () => {
//     if (!meeting || !attendees.length) return;
//     apiClient.post(`/api/attendance/mark/${meeting._id}`, { attendees })
//       .then(() => alert("Attendance marked successfully"))
//       .catch(err => console.error(err));
//   };

//   if (loading) return <div>Loading meeting...</div>;
//   if (!meeting) return <div>No meeting data available.</div>;
//   if (!attendees.length) return <div>No students found in this batch.</div>;


// return (
//   <div className="max-h-fit">
//     <div className="max-w-7xl mx-auto px-4">
//       {/* Attendance Card */}
//       <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
//         {/* Stats Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-2">
//           <div className="flex justify-between items-center text-white">
//             <div>
//               <h2 className="text-2xl font-bold mb-2">Attendance Records</h2>
//               <p className="text-blue-100">Manage student attendance for this session</p>
//             </div>
//             <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
//               <div className="text-sm text-blue-100">Total Students</div>
//               <div className="text-2xl font-bold text-white">{attendees.length}</div>
//             </div>
//           </div>
//         </div>

//         {/* Attendance Table */}
//         <div className="p-6">
//           <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                     Student
//                   </th>
//                   <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100">
//                 {attendees.length > 0 ? (
//                   attendees.map((attendee, index) => {
//                     const record = meeting.message.records.find(
//                       (r) => r.student._id === attendee.studentId
//                     );
//                     if (!record) return null;
//                     const student = record.student;
                    
//                     return (
//                       <tr 
//                         key={attendee.studentId}
//                         className="transition-all duration-200 hover:bg-blue-50/50"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
//                               {student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-800">{student.fullName}</div>
//                               {/* <div className="text-xs text-gray-500">Student ID: {student._id.slice(-6)}</div> */}
//                             </div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="text-gray-600">{student.email}</div>
//                           {/* <div className="text-xs text-gray-400 mt-1">Email</div> */}
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="flex justify-center">
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                               attendee.present 
//                                 ? 'bg-green-100 text-green-800 border border-green-200' 
//                                 : 'bg-red-100 text-red-800 border border-red-200'
//                             }`}>
//                               {attendee.present ? (
//                                 <>
//                                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                                   Present
//                                 </>
//                               ) : (
//                                 <>
//                                   <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                                   Absent
//                                 </>
//                               )}
//                             </span>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() => handleToggle(index)}
//                               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                                 attendee.present 
//                                   ? 'bg-green-500' 
//                                   : 'bg-gray-300'
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                   attendee.present ? 'translate-x-6' : 'translate-x-1'
//                                 }`}
//                               />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-400">
//                         <div className="text-4xl mb-3">👥</div>
//                         <div className="text-lg font-medium text-gray-500 mb-2">No attendees found</div>
//                         <p className="text-sm">There are no students registered for this session.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary and Submit Section */}
//           <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">
//                   Present: <strong>{attendees.filter(a => a.present).length}</strong>
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">
//                   Absent: <strong>{attendees.filter(a => !a.present).length}</strong>
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleSubmit}
//               disabled={attendees.length === 0}
//               className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//             >
//               <span>✅</span>
//               <span>Submit Attendance</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions Footer */}
//       {/* <div className="mt-6 flex justify-center">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-3">
//           <div className="text-sm text-gray-600">
//             💡 <strong>Tip:</strong> Toggle attendance status using the switches or click student names for details
//           </div>
//         </div>
//       </div> */}
//     </div>
//   </div>
// );

// //   return (
// //     <div>
// //       <h2>Attendance for {meeting.title}</h2>
// //     <tbody>
// //   {attendees.map((attendee, index) => {
// //     const record = meeting.message.records.find(r => r.student._id === attendee.studentId);
// //     if (!record) return null;
// //     const student = record.student;
// //     return (
// //       <tr key={attendee.studentId}>
// //         <td>{student.fullName}</td>
// //         <td>{student.email}</td>
// //         <td>
// //           <input
// //             type="checkbox"
// //             checked={attendee.present}
// //             onChange={() => handleToggle(index)}
// //           />
// //         </td>
// //       </tr>
// //     );
// //   })}
// // </tbody>

// //       <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
// //         Submit Attendance
// //       </button>
// //     </div>
// //   );

// // return (
// //   <div className="p-6 bg-gray-50 min-h-screen">
// //     <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
// //       <h2 className="text-2xl font-bold text-indigo-700 mb-6">
// //         Attendance for <span className="text-gray-800">{meeting.title}</span>
// //       </h2>

// //       {/* Attendance Table */}
// //       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
// //         <table className="min-w-full text-sm text-left border-collapse">
// //           <thead className="bg-indigo-50 text-indigo-900 uppercase tracking-wide text-xs border-b">
// //             <tr>
// //               <th className="px-6 py-3 font-semibold">#</th>
// //               <th className="px-6 py-3 font-semibold">Student Name</th>
// //               <th className="px-6 py-3 font-semibold">Email</th>
// //               <th className="px-6 py-3 font-semibold text-center">Present</th>
// //             </tr>
// //           </thead>

// //           <tbody className="divide-y divide-gray-100">
// //             {attendees.length > 0 ? (
// //               attendees.map((attendee, index) => {
// //                 const record = meeting.message.records.find(
// //                   (r) => r.student._id === attendee.studentId
// //                 );
// //                 if (!record) return null;
// //                 const student = record.student;
// //                 return (
// //                   <tr
// //                     key={attendee.studentId}
// //                     className={`transition hover:bg-indigo-50 ${
// //                       index % 2 === 0 ? "bg-white" : "bg-gray-50"
// //                     }`}
// //                   >
// //                     <td className="px-6 py-3 font-medium text-gray-700">{index + 1}</td>
// //                     <td className="px-6 py-3 text-gray-800">{student.fullName}</td>
// //                     <td className="px-6 py-3 text-gray-600">{student.email}</td>
// //                     <td className="px-6 py-3 text-center">
// //                       <input
// //                         type="checkbox"
// //                         checked={attendee.present}
// //                         onChange={() => handleToggle(index)}
// //                         className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-2 focus:ring-green-400"
// //                       />
// //                     </td>
// //                   </tr>
// //                 );
// //               })
// //             ) : (
// //               <tr>
// //                 <td
// //                   colSpan="4"
// //                   className="text-center text-gray-500 py-6 italic"
// //                 >
// //                   No attendees found.
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Submit Button */}
// //       <div className="flex justify-end mt-8">
// //         <button
// //           onClick={handleSubmit}
// //           className="px-6 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all"
// //         >
// //           Submit Attendance
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // );


// };

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
// import apiClient from "../apiClient"; // adjust import path

const Attendance = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markAll, setMarkAll] = useState(false);

  // Fetch meeting + students
  useEffect(() => {
    if (!meetingId) {
      console.error("No meetingId found in URL");
      setLoading(false);
      return;
    }

    apiClient
      .get(`/api/meetings/${meetingId}`)
      .then((res) => {
        const meetingData = res.data?.message;
        setMeeting(meetingData);

        // Extract students from the batch
        const students = meetingData?.batch?.students || [];

        // Build initial attendees array
        const initialAttendees = students.map((student) => ({
          studentId: student.studentId,
          batchId: meetingData.batch._id, // <-- Add batchId here
          fullName: student.fullName,
          email: student.email,
          present: false,
        }));

        setAttendees(initialAttendees);
      })
      .catch((err) => console.error("Failed to fetch meeting details:", err))
      .finally(() => setLoading(false));
  }, [meetingId]);

  const handleToggle = (index) => {
    const newAttendees = [...attendees];
    newAttendees[index].present = !newAttendees[index].present;
    setAttendees(newAttendees);
  };

  const handleToggleAll = () => {
    const newMarkAll = !markAll;
    setMarkAll(newMarkAll);
    setAttendees((prev) =>
      prev.map((a) => ({ ...a, present: newMarkAll }))
    );
  };

  const handleSubmit = () => {
    if (!meetingId || !attendees.length) return;

    const payload = { attendees: attendees.map(({ studentId, batchId, present }) => ({ studentId, batchId, present })) };

    apiClient
      .post(`/api/attendance/mark/${meetingId}`, payload)
      .then(() => alert("✅ Attendance marked successfully"))
      .catch((err) => console.error(err));
  };

  if (loading) return <div>Loading meeting...</div>;
  if (!meeting) return <div>No meeting data available.</div>;
  if (!attendees.length) return <div>No students found in this batch.</div>;

  return (
    <div className="max-h-fit">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 flex justify-between items-center text-white">
            <div>
              <h2 className="text-2xl font-bold mb-1">Attendance Records</h2>
              <p className="text-blue-100 text-sm">
                Manage student attendance for this session
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-sm text-blue-100">Total Students</div>
                <div className="text-2xl font-bold text-white">{attendees.length}</div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-100">Mark All</span>
                <button
                  onClick={handleToggleAll}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${markAll ? "bg-green-400" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${markAll ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="p-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {attendees.map((attendee, index) => (
                    <tr key={attendee.studentId} className="transition hover:bg-blue-50/50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          {attendee.fullName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="font-semibold text-gray-800">{attendee.fullName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{attendee.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${attendee.present ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${attendee.present ? "bg-green-500" : "bg-red-500"}`}></span>
                          {attendee.present ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggle(index)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${attendee.present ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${attendee.present ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary & Submit */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Present: <strong>{attendees.filter((a) => a.present).length}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Absent: <strong>{attendees.filter((a) => !a.present).length}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={attendees.length === 0}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>✅</span>
                <span>Submit Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;


// ----------------------------------------------------------------------
// const Attendance = () => {
//   const { meetingId } = useParams();
//   const navigate = useNavigate();

//   const [meeting, setMeeting] = useState(null);
//   const [attendees, setAttendees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [markAll, setMarkAll] = useState(false); // ✅ NEW STATE for "Mark All"

//   // Fetch meeting + students
// //   useEffect(() => {
// //     if (!meetingId) {
// //       console.error("No meetingId found in URL");
// //       setLoading(false);
// //       return;
// //     }

// //     apiClient
// //       .get(`/api/meetings/${meetingId}`)
// //       .then((res) => {
// //         console.log("Meeting with students fetched:", res.data);
// //         const meetingData = res.data;
// //         setMeeting(meetingData);

// //         const records = meetingData?.message?.records;
// //         if (records?.length) {
// //           const initialAttendees = records.map((record) => ({
// //             studentId: record.student._id,
// //             present: record.present || false,
// //           }));
// //           setAttendees(initialAttendees);
// //         } else {
// //           setAttendees([]);
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Failed to fetch meeting with students:", err);
// //       })
// //       .finally(() => setLoading(false));
// //   }, [meetingId, navigate]);

// useEffect(() => {
//   if (!meetingId) {
//     console.error("No meetingId found in URL");
//     setLoading(false);
//     return;
//   }

//   apiClient
//     .get(`/api/meetings/${meetingId}`)
//     .then((res) => {
//       console.log("Meeting with students fetched:", res.data);
      
//       const meetingData = res.data?.message;
//       setMeeting(meetingData);

//       // Extract students from the batch
//       const students = meetingData?.batch?.students || [];

//       // Build initial attendees array
//       const initialAttendees = students.map((student) => ({
//         studentId: student.studentId,
//         fullName: student.fullName,
//         email: student.email,
//         present: false, // default to absent
//       }));

//       setAttendees(initialAttendees);
//     })
//     .catch((err) => {
//       console.error("Failed to fetch meeting details:", err);
//     })
//     .finally(() => setLoading(false));
// }, [meetingId]);


//   const handleToggle = (index) => {
//     const newAttendees = [...attendees];
//     newAttendees[index].present = !newAttendees[index].present;
//     setAttendees(newAttendees);
//   };

//   // ✅ NEW FUNCTION — Toggle all present/absent
//   const handleToggleAll = () => {
//     const newMarkAll = !markAll;
//     setMarkAll(newMarkAll);
//     setAttendees((prev) =>
//       prev.map((a) => ({ ...a, present: newMarkAll }))
//     );
//   };

// const handleSubmit = () => {
//   if (!meetingId || !attendees.length) return;
//   apiClient
//     .post(`/api/attendance/mark/${meetingId}`, { attendees })
//     .then(() => alert("✅ Attendance marked successfully"))
//     .catch(console.error);
// };

//   if (loading) return <div>Loading meeting...</div>;
//   if (!meeting) return <div>No meeting data available.</div>;
//   if (!attendees.length) return <div>No students found in this batch.</div>;

//   return (
//     <div className="max-h-fit">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 flex justify-between items-center text-white">
//             <div>
//               <h2 className="text-2xl font-bold mb-1">Attendance Records</h2>
//               <p className="text-blue-100 text-sm">
//                 Manage student attendance for this session
//               </p>
//             </div>

//             <div className="flex items-center space-x-6">
//               {/* Total Students */}
//               <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
//                 <div className="text-sm text-blue-100">Total Students</div>
//                 <div className="text-2xl font-bold text-white">{attendees.length}</div>
//               </div>

//               {/* ✅ Mark All Toggle */}
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm text-blue-100">Mark All</span>
//                 <button
//                   onClick={handleToggleAll}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
//                     markAll ? "bg-green-400" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       markAll ? "translate-x-6" : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Attendance Table */}
//           <div className="p-6">
//             <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">
//                       Student
//                     </th>
//                     <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">
//                       Email
//                     </th>
//                     <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {attendees.map((attendee, index) => {
//                     const record = meeting.message.records.find(
//                       (r) => r.student._id === attendee.studentId
//                     );
//                     if (!record) return null;
//                     const student = record.student;

//                     return (
//                       <tr
//                         key={attendee.studentId}
//                         className="transition hover:bg-blue-50/50"
//                       >
//                         <td className="px-6 py-4 flex items-center">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
//                             {student.fullName.split(" ").map((n) => n[0]).join("")}
//                           </div>
//                           <div className="font-semibold text-gray-800">
//                             {student.fullName}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">{student.email}</td>
//                         <td className="px-6 py-4 text-center">
//                           <span
//                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                               attendee.present
//                                 ? "bg-green-100 text-green-800 border border-green-200"
//                                 : "bg-red-100 text-red-800 border border-red-200"
//                             }`}
//                           >
//                             <span
//                               className={`w-2 h-2 rounded-full mr-2 ${
//                                 attendee.present ? "bg-green-500" : "bg-red-500"
//                               }`}
//                             ></span>
//                             {attendee.present ? "Present" : "Absent"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-center">
//                           <button
//                             onClick={() => handleToggle(index)}
//                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                               attendee.present ? "bg-green-500" : "bg-gray-300"
//                             }`}
//                           >
//                             <span
//                               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                 attendee.present ? "translate-x-6" : "translate-x-1"
//                               }`}
//                             />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Summary & Submit */}
//             <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
//               <div className="flex items-center space-x-6">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">
//                     Present: <strong>{attendees.filter((a) => a.present).length}</strong>
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">
//                     Absent: <strong>{attendees.filter((a) => !a.present).length}</strong>
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 disabled={attendees.length === 0}
//                 className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//               >
//                 <span>✅</span>
//                 <span>Submit Attendance</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Attendance;
