import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { FiDownload, FiUpload, FiCheck, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { g as getAllCourses, C as COURSE_NAME, j as apiClient } from "../entry-server.js";
import { u as usePassword } from "./usePassword-CcEJjiKI.js";
import "react-dom/server";
import "react-router-dom";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "formik";
import "yup";
import "react-redux";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "lucide-react";
import "react-hot-toast";
const UploadEnrollmentExcel = () => {
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const { generate } = usePassword();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const batchId = params.get("batchId");
    const courseIds = params.get("courseIds");
    const loadCourses = async () => {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
      if (courseIds) {
        const firstCourse = allCourses.find(
          (c) => c._id === courseIds.split(",")[0]
        );
        if (firstCourse) {
          setSelectedCourseId(firstCourse._id);
          setSelectedCourseName(firstCourse.title);
        }
      }
      if (batchId) {
        const batch = allCourses.flatMap((c) => c.batches).find((b) => b._id === batchId);
        if (batch) {
          setSelectedBatchId(batch._id);
          setSelectedBatchName(batch.batchName);
        }
      }
    };
    loadCourses();
  }, [location.search]);
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
          text: "The uploaded file contains no data.",
          confirmButtonColor: "#f0ad4e"
        });
        setExcelData([]);
        return;
      }
      const requiredFields = ["fullName", "mobileNo", "email"];
      let hasErrors = false;
      jsonData.forEach((row, idx) => {
        const missingFields = requiredFields.filter((field) => !row[field]);
        if (missingFields.length > 0) {
          hasErrors = true;
          Swal.fire({
            icon: "warning",
            title: `Row ${idx + 2} Missing Fields`,
            text: `Missing: ${missingFields.join(", ")}`,
            confirmButtonColor: "#d33"
          });
        }
        if (!row.password || row.password.toString().trim() === "") {
          row.password = generate(8);
        }
      });
      if (hasErrors) {
        setExcelData([]);
        fileRef.current.value = "";
      } else {
        setExcelData(jsonData);
      }
    };
    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "File Read Error",
        text: "Failed to read the Excel file.",
        confirmButtonColor: "#d33"
      });
    };
  };
  const handleImport = async () => {
    if (!excelData || excelData.length === 0) {
      return Swal.fire("Error", "No data to import", "error");
    }
    let courseId = selectedCourseId;
    let batchId = selectedBatchId;
    if (!courseId || !batchId) {
      const { value: formValues } = await Swal.fire({
        title: `<strong>Assign ${COURSE_NAME} & Batch</strong>`,
        html: `
          <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
            <div style="display: flex; flex-direction: column; text-align: left;">
              <label for="trainingProgram" style="font-weight: 600; margin-bottom: 5px; color: #4a5568;">${COURSE_NAME}</label>
              <select id="trainingProgram" class="swal2-select" style="border-radius: 8px; padding: 10px; border: 1px solid #cbd5e0; font-size: 14px;">
                <option value="">Select ${COURSE_NAME}</option>
                ${courses.map((c) => `<option value="${c._id}">${c.title}</option>`).join("")}
              </select>
            </div>
            <div style="display: flex; flex-direction: column; text-align: left;">
              <label for="batch" style="font-weight: 600; margin-bottom: 5px; color: #4a5568;">Batch</label>
              <select id="batch" class="swal2-select" style="border-radius: 8px; padding: 10px; border: 1px solid #cbd5e0; font-size: 14px;">
                <option value="">Select Batch</option>
              </select>
            </div>
          </div>
        `,
        didOpen: () => {
          const courseSelect = Swal.getPopup().querySelector("#trainingProgram");
          const batchSelect = Swal.getPopup().querySelector("#batch");
          courseSelect.addEventListener("change", () => {
            const selectedCourse = courses.find(
              (c) => c._id === courseSelect.value
            );
            batchSelect.innerHTML = '<option value="">Select Batch</option>';
            if (!selectedCourse || !selectedCourse.batches?.length) {
              batchSelect.innerHTML = '<option value="">No batches available</option>';
              return;
            }
            batchSelect.innerHTML += selectedCourse.batches.map((b) => `<option value="${b._id}">${b.batchName}</option>`).join("");
          });
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "✅ Assign",
        cancelButtonText: "❌ Cancel",
        preConfirm: () => {
          const trainingProgramId = document.getElementById("trainingProgram").value;
          const batchId2 = document.getElementById("batch").value;
          if (!trainingProgramId || !batchId2) {
            Swal.showValidationMessage(
              `Please select both ${COURSE_NAME} and Batch`
            );
          }
          return { trainingProgramId, batchId: batchId2 };
        }
      });
      if (!formValues) return;
      courseId = formValues.trainingProgramId;
      batchId = formValues.batchId;
    }
    try {
      const res = await apiClient.post("/api/enrollments/upload", {
        excelData,
        enrolledCourses: courseId,
        enrolledBatches: batchId
      });
      if (res.data.success) {
        const { skippedStudents = [] } = res.data.data || {};
        if (!skippedStudents.length) {
          Swal.fire({
            icon: "success",
            title: "Import Successful",
            text: res.data.message,
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Import Completed",
            text: res.data.message,
            // ✅ success message at top
            html: skippedStudents.length ? `
        <hr style="margin: 10px 0; border-color:#ddd;"/>
        <p style="margin-bottom:10px;">
          The following students are already assigned to the selected training program and batch:
        </p>
        <div style="text-align:left; max-height:200px; overflow:auto;">
          <ul style="padding-left:18px;">
            ${skippedStudents.map(
              (s) => `<li style="margin-bottom:6px;">
                    <strong>${s.fullName}</strong><br/>
                    <span style="color:#555;font-size:13px;">${s.email}</span>
                  </li>`
            ).join("")}
          </ul>
        </div>
      ` : null,
            // if somehow skippedStudents is empty, no html
            confirmButtonText: "OK"
          });
        }
        setExcelData([]);
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Upload failed",
        "error"
      );
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "max-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow border border-gray-200 p-4 mb-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: /* @__PURE__ */ jsx("h4", { className: "text-2xl lg:text-3xl font-bold text-gray-900 mb-2", children: selectedCourseId && selectedBatchId ? `Add Participate for ${selectedCourseName} - ${(() => {
      const course = courses.find(
        (c) => c._id === selectedCourseId
      );
      const batch = course?.batches?.find(
        (b) => b._id === selectedBatchId
      );
      return batch?.batchName || "N/A";
    })()}` : "Add Participate" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Upload Excel File" }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/Enrollment_Sample.xlsx",
              download: true,
              className: "w-75 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm",
              children: [
                /* @__PURE__ */ jsx(FiDownload, { className: "w-5 h-5" }),
                "Download Sample Excel"
              ]
            }
          )
        ] }),
        excelData.length === 0 && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 \r\n                cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50",
            onClick: () => fileRef.current?.click(),
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
              file ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-green-600 font-semibold mb-2", children: [
                  "File Selected ",
                  /* @__PURE__ */ jsx(FiCheck, { className: "inline" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: file.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-xs mt-1", children: [
                  (file.size / 1024 / 1024).toFixed(2),
                  " MB"
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium mb-2", children: "Click to upload or drag and drop" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: "Excel files only (.xlsx, .xls)" })
              ] })
            ]
          }
        )
      ] }),
      excelData.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-200 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900", children: "Data Preview" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: "Ready to Import" }),
            file && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setExcelData([]);
                  setFile(null);
                  fileRef.current.value = "";
                },
                className: "flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 \r\n                        bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 font-medium shadow-sm",
                children: [
                  /* @__PURE__ */ jsx(FiTrash2, { className: "w-4 h-4" }),
                  "Remove File"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border rounded-lg shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-auto max-h-96", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { children: [
            Object.keys(excelData[0]).map((key, index) => /* @__PURE__ */ jsx(
              "th",
              {
                className: "px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b",
                children: key
              },
              index
            )),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-b", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: excelData.map((row, i) => /* @__PURE__ */ jsxs(
            "tr",
            {
              className: "hover:bg-gray-50 transition-colors",
              children: [
                Object.values(row).map((val, j) => /* @__PURE__ */ jsx(
                  "td",
                  {
                    className: "px-4 py-3 text-sm text-gray-900 border-b",
                    children: val || /* @__PURE__ */ jsx("span", { className: "text-gray-400 italic", children: "empty" })
                  },
                  j
                )),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 border-b text-center", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "text-red-600 hover:text-red-800",
                    onClick: () => {
                      const updated = excelData.filter(
                        (_, index) => index !== i
                      );
                      setExcelData(updated);
                    },
                    children: "❌"
                  }
                ) })
              ]
            },
            i
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-6 border-t border-gray-200", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex-1 sm:flex-none",
              onClick: () => {
                setExcelData([]);
                setFile(null);
                fileRef.current.value = "";
              },
              children: "Cancel Upload"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none",
              onClick: handleImport,
              children: [
                /* @__PURE__ */ jsx(FiCheck, { className: "w-5 h-5" }),
                "Import ",
                excelData.length,
                " Participates"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] }) });
};
export {
  UploadEnrollmentExcel as default
};
