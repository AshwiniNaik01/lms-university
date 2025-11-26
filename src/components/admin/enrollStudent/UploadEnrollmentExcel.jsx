import { useRef, useState } from "react";
import { FiCheck, FiDownload, FiTrash2, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import apiClient from "../../../api/axiosConfig";
import { getAllCourses } from "../../../api/courses";
import { fetchBatchesByCourseId } from "../../../api/batch";
import Modal from "../../popupModal/Modal";
import Dropdown from "../../form/Dropdown";
import { Formik, Form } from "formik";

const UploadEnrollmentExcel = () => {
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  // Handle file upload & validate structure
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
          confirmButtonColor: "#f0ad4e",
        });
        setExcelData([]);
        return;
      }

      // Required fields for enrollment
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
            confirmButtonColor: "#d33",
          });
        }
      });

      if (hasErrors) {
        setExcelData([]);
        fileRef.current.value = "";
      } else {
        Swal.fire({
          icon: "success",
          title: `${jsonData.length} Students Found`,
          text: "Excel file is properly formatted.",
          confirmButtonColor: "#28a745",
        });
        setExcelData(jsonData);
      }
    };

    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "File Read Error",
        text: "Failed to read the Excel file.",
        confirmButtonColor: "#d33",
      });
    };
  };


  const handleImport = async () => {
    // STEP 1 — Check if there's data to import
    if (!excelData || excelData.length === 0) {
      return Swal.fire("Error", "No data to import", "error");
    }

    // STEP 2 — Confirm import
    const confirm = await Swal.fire({
      title: "Attach Students?",
      text: "Do you want to attach this list to the enrolled student section?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    // STEP 3 — Fetch courses
    const courses = await getAllCourses();
    const courseOptions = courses
      .map((c) => `<option value="${c._id}">${c.title}</option>`)
      .join("");

    // STEP 4 — Show Swal modal for selecting Training Program & Batch with nicer UI
    const { value: formValues } = await Swal.fire({
      title: "<strong>Assign Training Program & Batch</strong>",
      html: `
      <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
        <div style="display: flex; flex-direction: column; text-align: left;">
          <label for="trainingProgram" style="font-weight: 600; margin-bottom: 5px; color: #4a5568;">Training Program</label>
          <select id="trainingProgram" class="swal2-select" style="
            border-radius: 8px; 
            padding: 10px; 
            border: 1px solid #cbd5e0; 
            font-size: 14px;
            transition: all 0.2s;
          ">
            <option value="">Select Training Program</option>
            ${courseOptions}
          </select>
        </div>

        <div style="display: flex; flex-direction: column; text-align: left;">
          <label for="batch" style="font-weight: 600; margin-bottom: 5px; color: #4a5568;">Batch</label>
          <select id="batch" class="swal2-select" style="
            border-radius: 8px; 
            padding: 10px; 
            border: 1px solid #cbd5e0; 
            font-size: 14px;
            transition: all 0.2s;
          ">
            <option value="">Select Batch</option>
          </select>
        </div>
      </div>
    `,
      didOpen: () => {
        const courseSelect = Swal.getPopup().querySelector("#trainingProgram");
        const batchSelect = Swal.getPopup().querySelector("#batch");

        // Populate batches based on selected course
        courseSelect.addEventListener("change", () => {
          const selectedCourse = courses.find(
            (c) => c._id === courseSelect.value
          );
          batchSelect.innerHTML = `<option value="">Select Batch</option>`;
          if (
            !selectedCourse ||
            !selectedCourse.batches ||
            selectedCourse.batches.length === 0
          ) {
            batchSelect.innerHTML = `<option value="">No batches available</option>`;
            return;
          }
          batchSelect.innerHTML += selectedCourse.batches
            .map((b) => `<option value="${b._id}">${b.batchName}</option>`)
            .join("");
        });
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "✅ Assign",
      cancelButtonText: "❌ Cancel",
      customClass: {
        popup: "swal2-border-radius-xl",
        title: "text-lg font-semibold",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md",
      },
      preConfirm: () => {
        const trainingProgramId =
          document.getElementById("trainingProgram").value;
        const batchId = document.getElementById("batch").value;

        if (!trainingProgramId || !batchId) {
          Swal.showValidationMessage(
            "Please select both Training Program and Batch"
          );
        }

        return { trainingProgramId, batchId };
      },
    });

    if (!formValues) return;

    // STEP 5 — Submit JSON to backend
    try {
      const res = await apiClient.post("/api/enrollments/upload", {
        excelData, // filtered rows
        enrolledCourses: formValues.trainingProgramId,
        enrolledBatches: formValues.batchId,
      });

      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
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

  return (
    <div className="max-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* <div className="flex-1"> */}
            <h4 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Excel Uploading
            </h4>
            {/* <p className="text-gray-600 text-base">
        Upload Excel file to quickly enroll multiple students at once
      </p> */}
            {/* </div> */}

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-5 py-2 bg-gray-400 border border-gray-300 text-white font-bold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-200 shadow-sm text-sm"
              >
                ⬅ Back
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="">
          {/* Left Column - Instructions & Download */}

          {/* Right Column - Upload & Preview */}

          <div className="lg:col-span-2 space-y-4">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Excel File
                </h3>

                <a
                  href="/Enrollment_Sample.xlsx"
                  download
                  className="w-75 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm"
                >
                  <FiDownload className="w-5 h-5" />
                  Download Sample Excel
                </a>
              </div>
              {/* <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 cursor-pointer ${
                  file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onClick={() => fileRef.current?.click()}
              > */}

              {/* <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 
    ${
      excelData.length > 0
        ? "pointer-events-none opacity-50 border-gray-300 bg-gray-100"
        : "cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
    }`}
                onClick={() =>
                  excelData.length === 0 && fileRef.current?.click()
                }
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUpload className="text-blue-600 w-8 h-8" />
                </div>

                {file ? (
                  <div>
                    <p className="text-green-600 font-semibold mb-2">
                      File Selected <FiCheck className="inline" />
                    </p>
                    <p className="text-gray-600 text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 text-sm">
                      Excel files only (.xlsx, .xls)
                    </p>
                  </div>
                )}
              </div> */}

              {/* Hide upload box when excelData has records */}
              {excelData.length === 0 && (
                <div
                  className="border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 
    cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUpload className="text-blue-600 w-8 h-8" />
                  </div>

                  {file ? (
                    <div>
                      <p className="text-green-600 font-semibold mb-2">
                        File Selected <FiCheck className="inline" />
                      </p>
                      <p className="text-gray-600 text-sm">{file.name}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm">
                        Excel files only (.xlsx, .xls)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview Section */}
            {excelData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Data Preview
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {excelData.length} records found • Review before importing
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-6 gap-6">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Ready to Import
                    </div>

                    {file && (
                      <button
                        onClick={() => {
                          setExcelData([]);
                          setFile(null);
                          fileRef.current.value = "";
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 
                 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 
                 font-medium shadow-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remove File
                      </button>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-auto max-h-96">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          {Object.keys(excelData[0]).map((key, index) => (
                            <th
                              key={index}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b"
                            >
                              {key}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-b">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {/* <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {Object.values(row).map((val, j) => (
                              <td
                                key={j}
                                className="px-4 py-3 text-sm text-gray-900 border-b"
                              >
                                {val || (
                                  <span className="text-gray-400 italic">
                                    empty
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody> */}

                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {Object.values(row).map((val, j) => (
                              <td
                                key={j}
                                className="px-4 py-3 text-sm text-gray-900 border-b"
                              >
                                {val || (
                                  <span className="text-gray-400 italic">
                                    empty
                                  </span>
                                )}
                              </td>
                            ))}

                            {/* DELETE BUTTON */}
                            <td className="px-4 py-3 border-b text-center">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  const updated = excelData.filter(
                                    (_, index) => index !== i
                                  );
                                  setExcelData(updated);
                                }}
                              >
                                ❌
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex-1 sm:flex-none"
                    onClick={() => {
                      setExcelData([]);
                      setFile(null);
                      fileRef.current.value = "";
                    }}
                  >
                    Cancel Upload
                  </button>

                  <button
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    onClick={handleImport}
                  >
                    <FiCheck className="w-5 h-5" />
                    Import {excelData.length} Students
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadEnrollmentExcel;
