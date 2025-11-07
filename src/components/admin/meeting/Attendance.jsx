

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";

const Attendance = () => {
  const { meetingId } = useParams();

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
        // Use `res.data.data` instead of `res.data.message`
        const meetingData = res.data?.data;
        setMeeting(meetingData);

        const students = meetingData?.batch?.students || [];

        // Initialize attendance
        const initialAttendees = students.map((student) => ({
          studentId: student.studentId,
          batchId: meetingData.batch._id,
          fullName: student.fullName,
          email: student.email,
          present: false, // default value
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
    if (!meetingId || attendees.length === 0) return;

    const payload = {
      attendees: attendees.map(({ studentId, batchId, present }) => ({
        studentId,
        batchId,
        present,
      })),
    };

    apiClient
      .post(`/api/attendance/mark/${meetingId}`, payload)
      .then(() => alert("✅ Attendance marked successfully"))
      .catch((err) => console.error("Error marking attendance:", err));
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
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">Student</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase">Email</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">Status</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm uppercase">Action</th>
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
