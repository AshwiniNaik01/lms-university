import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { e as canPerformAction, I as InputField, D as Dropdown, C as COURSE_NAME, d as DIR, T as TextAreaField, j as apiClient, a3 as updateBatch, a4 as createBatch, g as getAllCourses, a5 as fetchBatchById, k as handleApiError } from "../entry-server.js";
import { f as fetchAllTrainers } from "./trainerApi-uqZoQf46.js";
import { FiDownload, FiUpload, FiCheck } from "react-icons/fi";
import * as XLSX from "xlsx";
import { u as useCourseParam } from "./useCourseParam-D0IDp8wz.js";
import { u as usePassword } from "./usePassword-CcEJjiKI.js";
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
const ExcelUploader = ({
  sampleFileUrl,
  requiredFields = ["fullName", "mobileNo", "email"],
  onImport,
  // NEW: returns { file, data }
  title = "Upload Excel File"
}) => {
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.readAsArrayBuffer(uploadedFile);
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      if (jsonData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Empty File",
          text: "The uploaded file contains no data."
        });
        setExcelData([]);
        return;
      }
      let hasErrors = false;
      jsonData.forEach((row, idx) => {
        const missingFields = requiredFields.filter((field) => !row[field]);
        if (missingFields.length > 0) {
          hasErrors = true;
          Swal.fire({
            icon: "warning",
            title: `Row ${idx + 2} Missing Fields`,
            text: `Missing: ${missingFields.join(", ")}`
          });
        }
      });
      if (hasErrors) {
        setExcelData([]);
        fileRef.current.value = "";
        return;
      }
      Swal.fire({
        icon: "success",
        title: `${jsonData.length} Participates Found`,
        text: "Excel file is properly formatted."
      });
      setExcelData(jsonData);
      if (onImport) {
        onImport({ file: uploadedFile, data: jsonData });
      }
    };
    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "File Read Error",
        text: "Failed to read the Excel file."
      });
    };
  };
  const removeFile = () => {
    setExcelData([]);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title }),
      sampleFileUrl && /* @__PURE__ */ jsxs(
        "a",
        {
          href: sampleFileUrl,
          download: true,
          className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700",
          children: [
            /* @__PURE__ */ jsx(FiDownload, { className: "w-5 h-5" }),
            "Sample Excel"
          ]
        }
      )
    ] }),
    excelData.length === 0 && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 hover:border-blue-400 hover:bg-blue-50",
        onClick: () => fileRef.current?.click(),
        onDragOver: (e) => e.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile)
            handleFileUpload({ target: { files: [droppedFile] } });
        },
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: ".xlsx, .xls",
              onChange: handleFileUpload,
              className: "hidden"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FiUpload, { className: "text-blue-600 w-8 h-8" }) }),
          !file ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium mb-2", children: "Click to upload or drag & drop" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Excel files only" })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-green-600 font-semibold mb-2", children: [
              "File Selected ",
              /* @__PURE__ */ jsx(FiCheck, { className: "inline" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: file.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-xs mt-1", children: [
              (file.size / 1024 / 1024).toFixed(2),
              " MB"
            ] })
          ] })
        ]
      }
    ),
    excelData.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 border rounded-lg shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-96", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { children: [
          Object.keys(excelData[0]).map((key, index) => /* @__PURE__ */ jsx(
            "th",
            {
              className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 border-b",
              children: key
            },
            index
          )),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-gray-700 border-b", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: excelData.map((row, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          Object.values(row).map((val, j) => /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm", children: val || /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "empty" }) }, j)),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              className: "text-red-600 hover:text-red-800",
              onClick: () => setExcelData((prev) => prev.filter((_, idx) => idx !== i)),
              children: "❌"
            }
          ) })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600",
          onClick: removeFile,
          children: "Cancel Upload"
        }
      ) })
    ] })
  ] });
};
const AddBatch = ({ onBatchSaved }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState(id || null);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { rolePermissions } = useSelector((state) => state.permissions);
  const [excelFile, setExcelFile] = useState(null);
  const [excelPreview, setExcelPreview] = useState([]);
  const { generate: generatePassword } = usePassword();
  const [formData, setFormData] = useState({
    batchName: "",
    // startTime: "",
    // endTime: "",
    time: { start: "", end: "" },
    days: [],
    mode: "Online",
    startDate: "",
    endDate: "",
    coursesAssigned: "",
    // single course ID string
    trainer: [],
    additionalNotes: "",
    durationPerDayHours: "",
    cloudLabsOption: "no",
    // yes | no
    cloudLabs: {
      link: "",
      excelFile: null
      // existing file from API
    },
    labs: null
    // newly uploaded excel
  });
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  const modeOptions = [
    { _id: "Online", title: "Online" },
    { _id: "Offline", title: "Offline" },
    { _id: "Hybrid", title: "Hybrid" }
  ];
  const [selectedCourse, setSelectedCourse, isPreselected] = useCourseParam(courses);
  const handleCancel = () => {
    setFormData({
      batchName: "",
      time: { start: "", end: "" },
      // startTime: "",
      // endTime: "",
      days: [],
      mode: "Online",
      startDate: "",
      endDate: "",
      coursesAssigned: "",
      trainer: [],
      additionalNotes: "",
      durationPerDayHours: "",
      cloudLabsLink: "",
      labs: null,
      cloudLabsOption: "no"
    });
    setExcelFile(null);
    setExcelPreview([]);
    setSelectedBatchId(null);
  };
  const trainerOptions = trainers.map((t) => ({
    ...t,
    title: t.fullName
    // needed for Dropdown
  }));
  useEffect(() => {
    const init = async () => {
      const data = await fetchCoursesAndTrainers();
      if (data?.data) {
        setTrainers(data.data);
      }
      if (id) {
        await loadBatch();
      } else if (isPreselected) {
        setFormData((prev) => ({
          ...prev,
          coursesAssigned: selectedCourse
        }));
      }
    };
    init();
  }, [id, selectedCourse, isPreselected]);
  const fetchCoursesAndTrainers = async () => {
    try {
      const [coursesData, trainersData] = await Promise.all([
        getAllCourses(),
        fetchAllTrainers()
      ]);
      setCourses(coursesData || []);
      setTrainers(trainersData || []);
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: err.response?.data?.message || `Failed to fetch ${COURSE_NAME} or Trainers.`
      });
    }
  };
  const loadBatch = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const batch = await fetchBatchById(id);
      const hasValidCloudLabs = !!batch.cloudLabs?.link || !!batch.cloudLabs?.cloudLabsFile?.fileUrl;
      if (batch) {
        setFormData({
          batchName: batch.batchName || "",
          // startTime: batch.time?.start || "",
          // endTime: batch.time?.end || "",
          time: { start: batch.time?.start || "", end: batch.time?.end || "" },
          days: batch.days || [],
          mode: batch.mode || "Online",
          startDate: batch.startDate || "",
          endDate: batch.endDate || "",
          coursesAssigned: batch.coursesAssigned?.[0]?._id || "",
          trainer: batch.trainer?.map((t) => t._id) || [],
          // ✅ Corrected
          additionalNotes: batch.additionalNotes || "",
          durationPerDayHours: batch.durationPerDayHours || "",
          // cloudLabsLink: batch.cloudLabsLink || "",
          // labs: null,
          cloudLabsOption: hasValidCloudLabs ? "yes" : "no",
          // cloudLabs: hasValidCloudLabs
          //   ? {
          //       link: batch.cloudLabs?.link || "",
          //       excelFile: batch.cloudLabs?.excelFile || null,
          //     }
          //   : { link: "", excelFile: null },
          cloudLabs: hasValidCloudLabs ? {
            link: batch.cloudLabs?.link || "",
            cloudLabsFile: batch.cloudLabs?.cloudLabsFile || null
            // <-- match JSX
          } : { link: "", cloudLabsFile: null },
          labs: null
          // never prefill new upload
        });
        setSelectedBatchId(id);
      } else {
        Swal.fire("Not Found", "Batch not found", "warning");
        navigate("/manage-batches");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        handleApiError(err) || "Failed to fetch batch.",
        "error"
      );
      navigate("/manage-batches");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const init = async () => {
      await fetchCoursesAndTrainers();
      if (id) {
        await loadBatch();
      } else if (isPreselected) {
        setFormData((prev) => ({
          ...prev,
          coursesAssigned: selectedCourse
        }));
      }
    };
    init();
  }, [id, selectedCourse, isPreselected]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && daysOfWeek.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        days: checked ? [...prev.days, value] : prev.days.filter((day) => day !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const basePayload = {
        batchName: formData.batchName,
        time: formData.time || { start: "", end: "" },
        days: formData.days,
        mode: formData.mode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        coursesAssigned: formData.coursesAssigned ? [formData.coursesAssigned] : [],
        trainer: formData.trainer,
        additionalNotes: formData.additionalNotes,
        durationPerDayHours: formData.durationPerDayHours
      };
      let batchId = selectedBatchId;
      let response;
      const isUpdate = !!selectedBatchId;
      const hasCloudLabsExcel = !!formData.labs;
      const hasCloudLabsLink = formData.cloudLabsOption === "yes" && formData.cloudLabs.link?.trim();
      if (hasCloudLabsExcel || hasCloudLabsLink) {
        const fd = new FormData();
        fd.append("batchName", basePayload.batchName);
        fd.append("time[start]", basePayload.time.start);
        fd.append("time[end]", basePayload.time.end);
        basePayload.days.forEach((day) => fd.append("days[]", day));
        fd.append("mode", basePayload.mode);
        fd.append("startDate", basePayload.startDate);
        fd.append("endDate", basePayload.endDate);
        fd.append("durationPerDayHours", basePayload.durationPerDayHours ?? "");
        fd.append("additionalNotes", basePayload.additionalNotes ?? "");
        basePayload.coursesAssigned.forEach((c) => fd.append("coursesAssigned[]", c));
        basePayload.trainer.forEach((t) => fd.append("trainer[]", t));
        if (hasCloudLabsLink) fd.append("cloudLabsLink", formData.cloudLabs.link);
        if (hasCloudLabsExcel) fd.append("labs", formData.labs);
        if (isUpdate) {
          await apiClient.put(`/api/batches/${selectedBatchId}`, fd, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          batchId = selectedBatchId;
          Swal.fire("Updated!", "Batch updated successfully.", "success");
        } else {
          response = await apiClient.post("/api/batches", fd, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          batchId = response?.data?.batch?._id || response?.data?.data?.batchId;
          ;
          if (!batchId) throw new Error("Batch ID not returned from API.");
          Swal.fire("Added!", "Batch added successfully.", "success");
        }
      } else {
        if (isUpdate) {
          await updateBatch(selectedBatchId, basePayload);
          batchId = selectedBatchId;
          Swal.fire("Updated!", "Batch updated successfully.", "success").then(() => {
            navigate("/manage-batches");
          });
        } else {
          response = await createBatch(basePayload);
          batchId = response?.data?.batch?._id || response?.data?.data?.batchId;
          ;
          if (!batchId) throw new Error("Batch ID not returned from API.");
          Swal.fire("Added!", "Batch added successfully.", "success");
        }
      }
      if (excelFile && batchId) {
        const excelFD = new FormData();
        excelFD.append("excelFile", excelFile);
        excelFD.append("enrolledCourses", JSON.stringify(basePayload.coursesAssigned));
        excelFD.append("enrolledBatches", JSON.stringify([batchId]));
        await apiClient.post("/api/batches/upload-excel", excelFD, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        Swal.fire("Success", "Excel file uploaded successfully!", "success");
      }
      if (!isUpdate) {
        const result = await Swal.fire({
          title: "Batch saved successfully! What would you like to do next?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Add New Batch",
          denyButtonText: "Show List",
          cancelButtonText: "Add Participant"
        });
        if (result.isConfirmed) {
          handleCancel();
        } else if (result.isDenied) {
          navigate(`/manage-batches?courseId=${formData.coursesAssigned || ""}`);
        } else if (result.isDismissed && batchId) {
          navigate(
            `/enrollments/upload-excel?batchId=${batchId}&courseIds=${formData.coursesAssigned}`
          );
        }
      }
      handleCancel();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || err?.message || "Failed to save batch. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "p-10 bg-blue-50 min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-10 rounded-xl shadow-xl max-w-5xl mx-auto border-4 border-blue-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-blue-700 underline", children: selectedBatchId ? "Update Batch" : "Create Batch" }),
      canPerformAction(rolePermissions, "batch", "read") && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/manage-batches"),
          className: "text-md bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition",
          children: "← Manage Batches"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(
          InputField,
          {
            label: "Batch Name*",
            name: "batchName",
            type: "text",
            formik: {
              values: formData,
              setFieldValue: (name, value) => setFormData((prev) => ({ ...prev, [name]: value })),
              touched: {},
              errors: {},
              handleBlur: () => {
              }
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "Duration (Hours Per Day)*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: "0.5",
              step: "any",
              placeholder: "e.g. 2, 2.5, 2.8",
              value: formData.durationPerDayHours,
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                durationPerDayHours: e.target.value
              })),
              className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "Start Date*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: formData.startDate,
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                startDate: e.target.value
              })),
              className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "End Date*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: formData.endDate,
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                endDate: e.target.value
              })),
              className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "Start Time*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              value: formData.time?.start || "",
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                time: { ...prev.time, start: e.target.value }
              })),
              className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "End Time*" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              value: formData.time?.end || "",
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                time: { ...prev.time, end: e.target.value }
              })),
              className: "w-full border-2 border-blue-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: "Mode*",
            name: "mode",
            options: modeOptions,
            formik: {
              values: formData,
              setFieldValue: (name, value) => setFormData((prev) => ({ ...prev, [name]: value })),
              touched: {},
              errors: {},
              handleBlur: () => {
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: `Assign ${COURSE_NAME}*`,
            name: "coursesAssigned",
            options: courses,
            formik: {
              values: formData,
              setFieldValue: (field, value) => setFormData((prev) => ({ ...prev, [field]: value })),
              handleBlur: () => {
              },
              touched: {},
              errors: {}
            },
            disabled: isPreselected
          }
        ),
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            label: "Assign Trainer*",
            name: "trainer",
            options: trainerOptions,
            formik: {
              values: formData,
              setFieldValue: (name, value) => setFormData((prev) => ({ ...prev, [name]: [value] })),
              handleBlur: () => {
              },
              touched: {},
              errors: {}
            },
            getOptionValue: (t) => t._id,
            getOptionLabel: (t) => t.fullName
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700 mb-2 block", children: "Days:*" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 mt-1", children: daysOfWeek.map((day) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer bg-blue-100 px-4 py-2 rounded-lg hover:bg-blue-200",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  value: day,
                  checked: formData.days.includes(day),
                  onChange: handleChange,
                  className: "accent-blue-700 w-5 h-5"
                }
              ),
              day
            ]
          },
          day
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-gray-700 mb-2 block", children: "Do you want to provide CloudLabs access?" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "cloudLabsOption",
                value: "yes",
                checked: formData.cloudLabsOption === "yes",
                onChange: () => setFormData((prev) => ({ ...prev, cloudLabsOption: "yes" })),
                className: "accent-blue-600"
              }
            ),
            "Yes"
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "cloudLabsOption",
                value: "no",
                checked: formData.cloudLabsOption === "no",
                onChange: () => setFormData((prev) => ({
                  ...prev,
                  cloudLabsOption: "no",
                  cloudLabs: { link: "", excelFile: null },
                  labs: null
                }))
              }
            ),
            "No"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/cloudlabs_sample_excel.xlsx",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-blue-600 hover:underline text-sm mt-2 inline-block",
          children: "Download sample Excel"
        }
      ),
      formData.cloudLabsOption === "yes" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(
          InputField,
          {
            label: "CloudLabs Link",
            name: "cloudLabs.link",
            type: "url",
            placeholder: "https://cloudlabs.example.com",
            formik: {
              values: { cloudLabs: formData.cloudLabs },
              setFieldValue: (_, value) => setFormData((prev) => ({
                ...prev,
                cloudLabs: { ...prev.cloudLabs, link: value }
              })),
              touched: {},
              errors: {},
              handleBlur: () => {
              }
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700 mb-1 block", children: "CloudLabs Excel" }),
          formData.cloudLabs?.cloudLabsFile && /* @__PURE__ */ jsxs(
            "a",
            {
              href: DIR.CLOUD_LABS + formData.cloudLabs.cloudLabsFile.fileName,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 underline text-sm mb-2 block",
              children: [
                "📄 ",
                formData.cloudLabs.cloudLabsFile.fileName
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: ".xlsx,.xls",
              onChange: (e) => setFormData((prev) => ({
                ...prev,
                labs: e.target.files[0]
              })),
              className: "w-full border-2 border-dashed border-gray-300 p-2 rounded-lg"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        TextAreaField,
        {
          label: "Additional Notes (optional)",
          name: "additionalNotes",
          formik: {
            values: formData,
            handleChange,
            handleBlur: () => {
            },
            touched: {},
            errors: {}
          },
          rows: 4
        }
      ),
      /* @__PURE__ */ jsx(
        ExcelUploader,
        {
          sampleFileUrl: "/Enrollment_Sample.xlsx",
          requiredFields: ["fullName", "mobileNo", "email"],
          title: "Upload Participate Excel (optional)",
          onImport: ({ file, data }) => {
            const processedData = data.map((row) => {
              const password = row.password ?? "";
              const needsPassword = password.toString().trim() === "";
              return {
                ...row,
                password: needsPassword ? generatePassword(8) : password.toString()
              };
            });
            setExcelFile(file);
            setExcelPreview(processedData);
          }
        },
        excelFile ? excelFile.name : "excel-uploader"
      ),
      excelPreview.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-700 mb-2", children: "Excel Preview:" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-blue-100", children: /* @__PURE__ */ jsx("tr", { children: Object.keys(excelPreview[0]).map((col) => /* @__PURE__ */ jsx(
            "th",
            {
              className: "px-4 py-2 border-b border-gray-300 text-gray-700 font-medium",
              children: col
            },
            col
          )) }) }),
          /* @__PURE__ */ jsx("tbody", { children: excelPreview.map((row, idx) => /* @__PURE__ */ jsx(
            "tr",
            {
              className: idx % 2 === 0 ? "bg-white" : "bg-blue-50",
              children: Object.values(row).map((val, i) => /* @__PURE__ */ jsx(
                "td",
                {
                  className: "px-4 py-2 border-b border-gray-200 text-gray-600",
                  children: val || /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "empty" })
                },
                i
              ))
            },
            idx
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center flex justify-end gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleCancel,
            disabled: loading,
            className: "bg-gray-300 text-gray-800 font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-gray-400 disabled:opacity-60",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "bg-blue-600 text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-60",
            children: loading ? "Saving..." : selectedBatchId ? "Update Batch" : "Create Batch"
          }
        )
      ] })
    ] })
  ] }) });
};
export {
  AddBatch as default
};
