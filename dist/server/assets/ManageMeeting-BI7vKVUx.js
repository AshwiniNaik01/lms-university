import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { j as apiClient, D as Dropdown, S as ScrollableTable, M as Modal, e as canPerformAction } from "../entry-server.js";
import { useSelector } from "react-redux";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
import "react-icons/fi";
const ManageMeeting = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please select the batch");
  const navigate = useNavigate();
  useEffect(() => {
    apiClient.get("/api/batches/all").then((res) => {
      const batchesArray = Array.isArray(res.data.data) ? res.data.data : [];
      const formattedBatches = batchesArray.map((batch) => ({
        _id: batch._id,
        name: batch.batchName
      }));
      setBatches(formattedBatches);
    }).catch((err) => console.error("Error fetching batches:", err));
  }, []);
  useEffect(() => {
    if (!selectedBatch) {
      setMeetings([]);
      setErrorMessage("Please select the batch");
      return;
    }
    apiClient.get(`/api/meetings/batch/${selectedBatch}`).then((res) => {
      const meetingsArray = Array.isArray(res.data.data) ? res.data.data : [];
      setMeetings(meetingsArray);
      setErrorMessage(meetingsArray.length === 0 ? "No sessions found for this batch" : "");
    }).catch((err) => {
      console.error("Error fetching sessions:", err);
      if (err.response?.status === 404 && err.response?.data?.message) {
        setMeetings([]);
        setErrorMessage(err.response.data.message);
      } else {
        setMeetings([]);
        setErrorMessage("Failed to fetch sessions");
      }
    });
  }, [selectedBatch]);
  const handleView = (meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };
  const handleAttendance = (meeting) => {
    if (meeting.attendanceDone) {
      Swal.fire({
        icon: "info",
        title: "Attendance Already Done",
        text: "You have already marked attendance for this session.",
        confirmButtonText: "OK"
      });
    } else {
      navigate(`/attendance/${meeting._id}`, { state: { meeting } });
    }
  };
  const handleViewAttendance = async (meeting) => {
    try {
      setLoadingAttendance(true);
      const res = await apiClient.get(`/api/attendance/meeting/${meeting._id}`);
      if (res.data.success && res.data.data?.record) {
        const record = res.data.data.record;
        const students = record.attendees?.map((a) => ({
          fullName: a.studentDetails?.fullName || "-",
          email: a.studentDetails?.email || "-",
          mobileNo: a.studentDetails?.mobileNo || "-",
          program: a.studentDetails?.selectedProgram || "-",
          status: a.present ? "Present" : "Absent"
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
          students
        };
        setAttendanceData(formattedData);
        setAttendanceModalOpen(true);
      } else {
        const message = res.data.message || "No attendance records found for this session.";
        Swal.fire("Info", message, "info");
        setAttendanceData(null);
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to fetch attendance data.";
      Swal.fire("Warning", message, "warning");
      setAttendanceData(null);
    } finally {
      setLoadingAttendance(false);
    }
  };
  const columns = [
    {
      header: "Title",
      accessor: "title"
    },
    {
      header: "Platform",
      accessor: "platform"
    },
    {
      header: "Date",
      accessor: (row) => row.startTime ? new Date(row.startTime).toLocaleDateString() : "-"
    },
    {
      header: "Start Time",
      accessor: (row) => row.startTime ? new Date(row.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }) : "-"
    },
    {
      header: "End Time",
      accessor: (row) => row.endTime ? new Date(row.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }) : "-"
    },
    {
      header: "Trainer",
      accessor: (row) => row.trainer?.fullName || "-"
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleView(row),
            className: "px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-indigo-600 transition-all",
            children: "View"
          }
        ),
        canPerformAction(rolePermissions, "attendance", "create") && !row.attendanceDone && //  {canPerformAction(rolePermissions, "attendance", "create") && (
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleAttendance(row),
            className: "px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-green-600 transition-all",
            children: "Attendance"
          }
        ),
        canPerformAction(rolePermissions, "attendance", "read") && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleViewAttendance(row),
            className: "px-3 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-purple-600 transition-all",
            children: "View Attendance"
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Manage Sessions" }),
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        label: "Batch",
        name: "batch",
        options: batches,
        formik: {
          values: { batch: selectedBatch },
          setFieldValue: (_, value) => setSelectedBatch(value),
          touched: {},
          errors: {}
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: meetings,
        maxHeight: "500px",
        emptyMessage: errorMessage
      }
    ) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        header: "Session Details",
        children: selectedMeeting ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-indigo-700", children: selectedMeeting.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: selectedMeeting.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Platform:" }),
              " ",
              selectedMeeting.platform || "-"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Start Time:" }),
              " ",
              new Date(selectedMeeting.startTime).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "End Time:" }),
              " ",
              new Date(selectedMeeting.endTime).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Session ID:" }),
              " ",
              selectedMeeting.meetingId
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "No session selected." })
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: attendanceModalOpen,
        onClose: () => setAttendanceModalOpen(false),
        header: "Attendance Details",
        children: loadingAttendance ? /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center py-4", children: "Loading attendance..." }) : attendanceData ? /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-around text-center font-semibold", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-sm", children: [
              "Present: ",
              attendanceData.presentCount ?? 0
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-sm", children: [
              "Absent: ",
              attendanceData.absentCount ?? 0
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 border rounded-lg overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-indigo-50 text-indigo-900", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Participate Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Email" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: attendanceData.students?.length ? attendanceData.students.map((s, idx) => /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b last:border-none hover:bg-indigo-50",
                children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: s.fullName }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: s.email }),
                  /* @__PURE__ */ jsx(
                    "td",
                    {
                      className: `px-4 py-2 font-medium ${s.status === "Present" ? "text-green-600" : "text-red-600"}`,
                      children: s.status
                    }
                  )
                ]
              },
              idx
            )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "3",
                className: "text-center py-4 text-gray-500 italic",
                children: "No attendance data available."
              }
            ) }) })
          ] }) })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-center", children: "No data to display." })
      }
    )
  ] });
};
export {
  ManageMeeting as default
};
