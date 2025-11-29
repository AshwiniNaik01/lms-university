import { useRef, useState } from "react";
import { FiCheck, FiDownload, FiTrash2, FiUpload } from "react-icons/fi";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const ExcelUploader = ({
  sampleFileUrl,
  requiredFields = ["fullName", "mobileNo", "email"],
  onImport, // async function to call on import: receives excelData & returns Promise
  title = "Upload Excel File",
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
          text: "The uploaded file contains no data.",
          confirmButtonColor: "#f0ad4e",
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
    if (!excelData || excelData.length === 0) {
      return Swal.fire("Error", "No data to import", "error");
    }

    const confirm = await Swal.fire({
      title: "Attach Students?",
      text: "Do you want to attach this list?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      if (onImport && typeof onImport === "function") {
        await onImport(excelData);
      }
      Swal.fire("Success", "Students imported successfully!", "success");
      setExcelData([]);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Import failed",
        "error"
      );
    }
  };

  const removeFile = () => {
    setExcelData([]);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {sampleFileUrl && (
          <a
            href={sampleFileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm"
          >
            <FiDownload className="w-5 h-5" />
            Sample Excel
          </a>
        )}
      </div>

      {/* Upload Box */}
      {excelData.length === 0 && (
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 
          cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) handleFileUpload({ target: { files: [droppedFile] } });
          }}
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
              <p className="text-gray-500 text-sm">Excel files only (.xlsx, .xls)</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Section */}
      {excelData.length > 0 && (
        <div className="mt-6 border rounded-lg shadow-sm overflow-hidden">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {excelData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-4 py-3 text-sm text-gray-900 border-b"
                      >
                        {val || <span className="text-gray-400 italic">empty</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3 border-b text-center">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setExcelData(excelData.filter((_, index) => index !== i));
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex-1 sm:flex-none"
              onClick={removeFile}
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
  );
};

export default ExcelUploader;
