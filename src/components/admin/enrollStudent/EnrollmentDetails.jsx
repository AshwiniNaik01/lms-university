import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiBook,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiFileText,
    FiMail,
    FiMapPin,
    FiStar,
    FiUser,
    FiUsers,
    FiVideo,
    FiXCircle
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { COURSE_NAME } from "../../../utils/constants";

const EnrollmentDetails = () => {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Status badges with colors
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheckCircle,
      },
      completed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FiCheckCircle,
      },
      upcoming: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FiClock,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: FiClock,
      },
      inactive: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FiXCircle,
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        <IconComponent size={14} />
        {status}
      </span>
    );
  };

  // Tab navigation
  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart2 },
    { id: "courses",  label: COURSE_NAME, icon: FiBook },
    { id: "batches", label: "Batches", icon: FiCalendar },
    { id: "attendance", label: "Attendance", icon: FiCheckCircle },
    { id: "assignments", label: "Assignments", icon: FiFileText },
  ];

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/enrollments/${id}`);
        if (res.data.success) {
          setEnrollment(res.data.data);
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to fetch enrollment",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="text-gray-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Enrollment Found
          </h2>
          <p className="text-gray-600">
            The requested enrollment details could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // Calculate attendance stats
  const attendanceStats = enrollment.attendance?.reduce(
    (acc, record) => {
      const studentRecord = record.studentAttendance?.find(
        (s) => s.student === enrollment.studentId
      );
      if (studentRecord?.present) acc.present++;
      acc.total++;
      return acc;
    },
    { present: 0, total: 0 }
  ) || { present: 0, total: 0 };

  const attendancePercentage =
    attendanceStats.total > 0
      ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FiUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {enrollment.fullName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FiMail size={16} />
                  {enrollment.email}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Enrolled on{" "}
                  {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {/* <div className="flex flex-col items-end gap-2">
              {getStatusBadge("active")}
              <span className="text-sm text-gray-500">
                ID: {enrollment._id.slice(-8)}
              </span>
            </div> */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <FiBook className="text-blue-600 text-xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {enrollment.enrolledCourses.length}
            </p>
            <p className="text-sm text-gray-600">Training</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <FiCalendar className="text-green-600 text-xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {enrollment.enrolledBatches.length}
            </p>
            <p className="text-sm text-gray-600">Batches</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <FiCheckCircle className="text-purple-600 text-xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {attendancePercentage}%
            </p>
            <p className="text-sm text-gray-600">Attendance</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <FiFileText className="text-orange-600 text-xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {
                enrollment.assignmentSubmissions.filter((a) => a.submitted)
                  .length
              }
            </p>
            <p className="text-sm text-gray-600">Submitted</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-600" />
                  Participate Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold text-gray-900">
                      {enrollment.fullName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold text-gray-900">
                      {enrollment.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Mobile</span>
                    <span className="font-semibold text-gray-900">
                      {enrollment.mobileNo}
                    </span>
                  </div>
                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Password</span>
                    <span className="font-semibold text-gray-900">
                      {enrollment.password}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Enrollment Date</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" />
                  Attendance Summary
                </h2>
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {attendancePercentage}%
                        </p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                    </div>
                    <div
                      className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-green-500 border-t-8 border-r-8 border-b-8 border-l-8"
                      style={{
                        clipPath: `inset(0 0 0 50%)`,
                        transform: `rotate(${attendancePercentage * 3.6}deg)`,
                        transformOrigin: "center",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {attendanceStats.present}
                    </p>
                    <p className="text-sm text-gray-600">Present</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-400">
                      {attendanceStats.total - attendanceStats.present}
                    </p>
                    <p className="text-sm text-gray-600">Absent</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollment.enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <FiStar className="text-yellow-500" size={14} />
                      <span className="text-sm font-semibold text-yellow-700">
                        {course.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-semibold text-gray-900">
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Participates</span>
                      <div className="flex items-center gap-1">
                        <FiUsers className="text-gray-400" size={14} />
                        <span className="font-semibold text-gray-900">
                          {course.enrolledCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                      Resources
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Batches Tab */}
          {activeTab === "batches" && (
            <div className="grid grid-cols-1 gap-6">
              {enrollment.enrolledBatches.map((batch) => (
                <div
                  key={batch._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {batch.batchName}
                    </h3>
                    {getStatusBadge(batch.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FiCalendar className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Schedule</p>
                        <p className="font-semibold text-gray-900">
                          {batch.days.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FiClock className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Timing</p>
                        <p className="font-semibold text-gray-900">
                          {batch.time.start} - {batch.time.end}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FiMapPin className="text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Mode</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {batch.mode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FiUsers className="text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">Participates</p>
                        <p className="font-semibold text-gray-900">
                          {batch.studentCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {batch.additionalNotes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Notes: </strong>
                        {batch.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              {enrollment.attendance?.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                  <FiCheckCircle className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Attendance Records
                  </h3>
                  <p className="text-gray-500">
                    Attendance records will appear here once classes begin.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollment.attendance?.map((record) => {
                    const studentRecord = record.studentAttendance?.find(
                      (s) => s.student === enrollment.studentId
                    );

                    return (
                      <div
                        key={record._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {record.meeting?.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {record.course?.title}
                            </p>
                          </div>

                          <div className="text-right">
                            {studentRecord?.present ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                <FiCheckCircle size={14} />
                                Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                <FiXCircle size={14} />
                                Absent
                              </span>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(record.markedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-400" />
                            <span>
                              Duration: {record.meeting?.duration} minutes
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FiVideo className="text-gray-400" />
                            <span>Platform: {record.meeting?.platform}</span>
                          </div>
                        </div>

                        {record.meeting?.meetingDescription && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              {record.meeting.meetingDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              {enrollment.assignmentSubmissions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                  <FiFileText className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Assignments Yet
                  </h3>
                  <p className="text-gray-500">
                    Assignments will appear here once they are assigned.
                  </p>
                </div>
              ) : (
                enrollment.assignmentSubmissions.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600">
                          {assignment.description}
                        </p>
                      </div>
                      {assignment.submitted
                        ? getStatusBadge(assignment.submitted.status)
                        : getStatusBadge("pending")}
                    </div>

                    {assignment.submitted ? (
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">
                                Submitted:
                              </span>
                              <span className="text-sm text-gray-600">
                                {new Date(
                                  assignment.submitted.submittedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {assignment.submitted.remarks && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  Remarks:
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                  {assignment.submitted.remarks}
                                </p>
                              </div>
                            )}
                          </div>

                          <a
                            href={assignment.submitted.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors font-semibold text-sm"
                          >
                            <FiDownload size={16} />
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-xl p-4 text-center">
                        <p className="text-yellow-700 font-medium">
                          Awaiting submission
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                          Due:{" "}
                          {assignment.dueDate
                            ? new Date(assignment.dueDate).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetails;
