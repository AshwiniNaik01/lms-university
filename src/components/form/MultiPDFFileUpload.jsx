
import { useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

const MultiPDFFileUpload = ({ name, formik, label, multiple = true }) => {
  if (!formik) {
    console.error("Formik prop is missing in MultiPDFFileUpload!");
    return null;
  }

  // Ensure the field is at least an empty array
  useEffect(() => {
    if (!formik.values[name]) {
      formik.setFieldValue(name, []);
    }
  }, [formik, name]);

  const selectedFiles = formik.values[name] || [];

  const handleChange = (event) => {
    const files = Array.from(event.currentTarget.files);

    // Validate file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));
    const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      formik.setFieldError(name, "Only PDF/DOC/DOCX files are allowed");
    } else {
      formik.setFieldError(name, "");
    }

    if (multiple) {
      formik.setFieldValue(name, [...selectedFiles, ...validFiles]);
    } else {
      formik.setFieldValue(name, validFiles.slice(0, 1));
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    formik.setFieldValue(name, newFiles);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>

      <div className="relative w-full">
        <input
          type="file"
          name={name}
          id={name}
          accept=".pdf,.doc,.docx"
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
          <div className="flex items-center space-x-3">
            <FaUpload className="text-blue-600" />
            <span className="text-gray-700 font-medium truncate max-w-[300px]">
              {selectedFiles.length > 0
                ? selectedFiles.map((f) => f.name).join(", ")
                : multiple
                ? "Choose PDF/DOC files..."
                : "Choose a PDF/DOC file..."}
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden md:block">
            Allowed: PDF, DOC, DOCX (Max 5MB each)
          </span>
        </div>
      </div>

      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm font-medium mt-1">{formik.errors[name]}</div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between border px-3 py-1 rounded bg-gray-50">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiPDFFileUpload;
