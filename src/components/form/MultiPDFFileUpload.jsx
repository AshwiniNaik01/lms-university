import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";

/**
 * MultiPDFFileUpload
 *
 * Props:
 * - name: string (Formik field name)
 * - formik: object (Formik instance)
 * - label: string (Field label)
 * - multiple: boolean (allow multiple files)
 */
const MultiPDFFileUpload = ({ name, formik, label, multiple = true }) => {
  const [files, setFiles] = useState([]);

  // Sync with Formik values
  useEffect(() => {
    setFiles(formik.values[name] || []);
  }, [formik.values[name], name]);

  // Reset when Formik resets
  useEffect(() => {
    const unsubscribe = formik.registerField(name, {
      value: formik.values[name],
      onReset: () => {
        setFiles([]);
      },
    });

    return () => unsubscribe && unsubscribe();
  }, [formik, name]);

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = selected.filter((f) => allowedTypes.includes(f.type));
    const invalidFiles = selected.filter((f) => !allowedTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      formik.setFieldError(name, "Only PDF/DOC/DOCX files are allowed");
    } else {
      formik.setFieldError(name, "");
    }

    const updatedFiles = multiple
      ? [...(formik.values[name] || []), ...validFiles]
      : validFiles.slice(0, 1);

    formik.setFieldValue(name, updatedFiles);
    setFiles(updatedFiles);
  };

  const removeFile = (idx) => {
    const updatedFiles = [...(formik.values[name] || [])];
    updatedFiles.splice(idx, 1);
    formik.setFieldValue(name, updatedFiles);
    setFiles(updatedFiles);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <div className="relative w-full">
        <input
          type="file"
          name={name}
          accept=".pdf,.doc,.docx"
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />

        <div className="flex items-center space-x-3 border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
          <FaUpload className="text-blue-600" />
          <span className="text-gray-700 font-medium truncate">
            {multiple
              ? files.length > 0
                ? files.map((f) => f.name).join(", ")
                : "Choose PDF/DOC files..."
              : files[0]?.name || "Choose a PDF/DOC file..."}
          </span>
        </div>
      </div>

      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm font-medium mt-1">
          {formik.errors[name]}
        </div>
      )}

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border px-3 py-1 rounded bg-gray-50"
            >
              <span className="truncate">{file.name}</span>
              {/* <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiPDFFileUpload;
