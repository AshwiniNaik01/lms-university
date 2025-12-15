const MeetingsDropdown = ({ batch, onClose }) => {
  if (!batch) return null;

  return (
    <div className="absolute right-0 mt-3 w-5xl bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              Meetings & Attendance
            </h3>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Meetings Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                🎯
              </span>
              Scheduled Meetings
            </h4>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {batch.meetings?.length || 0} Total
            </span>
          </div>

          {batch.meetings?.length > 0 ? (
            <div className="overflow-y-auto max-h-[55vh] pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {batch.meetings.map((meeting) => {
                  // Find the attendance for this meeting
                  const attendance = batch.attendance?.filter(
                    (att) => att.meeting === meeting._id
                  );

                  // Determine if attendance is marked
                  const isMarked = attendance?.length > 0;

                  return (
                    <div
                      key={meeting._id}
                      className={`relative rounded-xl border p-4 shadow-sm
                      ${
                        isMarked
                          ? "bg-gray-100 cursor-not-allowed opacity-80"
                          : "bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
                      }`}
                    >
                      {/* Attendance overlay */}
                      {isMarked && (
                        <div className="absolute inset-0 bg-white/80 z-10 rounded-xl flex flex-col items-center justify-center gap-2 p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Attendance
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {attendance.map((att) =>
                              att.student.map((stu) => (
                                <span
                                  key={stu._id}
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    att.present
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {stu.fullName}: {att.present ? "Present" : "Absent"}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meeting Title & Platform */}
                      <div className="flex justify-between mb-3">
                        <h5 className="font-bold text-gray-800 line-clamp-2">
                          {meeting.title}
                        </h5>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {meeting.platform}
                        </span>
                      </div>

                      {/* Time & Date */}
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          ⏰{" "}
                          {new Date(meeting.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          →{" "}
                          {new Date(meeting.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          📅 {new Date(meeting.startTime).toLocaleDateString()}
                        </div>
                        {/* Password Section */}
                        {meeting.meetingPassword && (
                          <div className="flex items-center gap-2">
                            🔑 Password:{" "}
                            <span className="font-medium text-gray-800">
                              {meeting.meetingPassword}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {!isMarked && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-2.5 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📅</span>
              </div>
              <p className="text-gray-500 font-medium">No meetings scheduled</p>
              <p className="text-gray-400 text-sm mt-1">
                Meetings will appear here when scheduled
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingsDropdown;



// const MeetingsDropdown = ({ batch, onClose }) => {
//   if (!batch) return null;

//   return (
//     <div className="absolute right-0 mt-3 w-5xl bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
//       {/* Header with gradient */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 relative">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-white">
//               Meetings & Attendance
//             </h3>
//             {/* <p className="text-blue-100 text-sm mt-1">
//               {batch.meetings?.length || 0} meetings
//             </p> */}
//           </div>

//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       <div className="p-5">
//         {/* Meetings Section */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
//                 🎯
//               </span>
//               Scheduled Meetings
//             </h4>
//             <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//               {batch.meetings?.length || 0} Total
//             </span>
//           </div>

//           {batch.meetings?.length > 0 ? (
//             // <div className="overflow-x-auto scrollbar-hide">
//             //   {/* Set container width to show 2 cards */}
//             //   <div
//             //     className="flex gap-4"
//             //     style={{ width: `${2 * 280 + 16}px` }} // 2 cards width + gap
//             //   >

//             <div className="overflow-y-auto max-h-[55vh] pr-2">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {batch.meetings.map((meeting) => {
//                   const attendance = batch.attendances?.find(
//                     (att) => att.meeting === meeting._id
//                   );
//                   const isMarked = attendance?.markedByTrainer;

//                   return (
//                     // <div
//                     //   key={meeting._id}
//                     //   className={`relative min-w-[280px] max-w-[280px] rounded-xl border p-4 shadow-sm flex-shrink-0
//                     //     ${
//                     //       isMarked
//                     //         ? "bg-gray-100 cursor-not-allowed opacity-80"
//                     //         : "bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
//                     //     }`}
//                     // >

//                     <div
//                       key={meeting._id}
//                       className={`relative rounded-xl border p-4 shadow-sm
//     ${
//       isMarked
//         ? "bg-gray-100 cursor-not-allowed opacity-80"
//         : "bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
//     }`}
//                     >
//                       {/* Attendance overlay */}
//                       {isMarked && attendance?.attendees?.length > 0 && (
//                         <div className="absolute inset-0 bg-white/80 z-10 rounded-xl flex flex-col items-center justify-center gap-2 p-4">
//                           <p className="text-sm font-semibold text-gray-700 mb-2">
//                             Attendance
//                           </p>
//                           <div className="flex flex-wrap justify-center gap-2">
//                             {attendance.attendees.map((att) => (
//                               <span
//                                 key={att.student}
//                                 className={`px-3 py-1 rounded-full text-sm font-medium ${
//                                   att.present
//                                     ? "bg-green-100 text-green-700"
//                                     : "bg-red-100 text-red-700"
//                                 }`}
//                               >
//                                 {att.present ? "Present" : "Absent"}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Meeting Title & Platform */}
//                       <div className="flex justify-between mb-3">
//                         <h5 className="font-bold text-gray-800 line-clamp-2">
//                           {meeting.title}
//                         </h5>
//                         <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
//                           {meeting.platform}
//                         </span>
//                       </div>

//                       {/* Time & Date */}
//                       <div className="space-y-2 mb-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           ⏰{" "}
//                           {new Date(meeting.startTime).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                           →{" "}
//                           {new Date(meeting.endTime).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           📅 {new Date(meeting.startTime).toLocaleDateString()}
//                         </div>
//                         {/* Password Section */}
//                         {meeting.meetingPassword && (
//                           <div className="flex items-center gap-2">
//                             🔑 Password:{" "}
//                             <span className="font-medium text-gray-800">
//                               {meeting.meetingPassword}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Action Button */}
//                       {!isMarked && (
//                         <a
//                           href={meeting.meetingLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="block w-full text-center py-2.5 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
//                         >
//                           Join Meeting
//                         </a>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl text-gray-400">📅</span>
//               </div>
//               <p className="text-gray-500 font-medium">No meetings scheduled</p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Meetings will appear here when scheduled
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MeetingsDropdown;
