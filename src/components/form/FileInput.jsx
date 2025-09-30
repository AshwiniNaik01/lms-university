

import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";

const FileInput = ({ label, name, formik }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const selectedFile = formik.values[name];

useEffect(() => {
  if (selectedFile instanceof File) {
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // cleanup
  } else if (typeof selectedFile === "string") {
    setPreviewUrl(selectedFile); // already a URL from backend
  } else {
    setPreviewUrl(null);
  }
}, [selectedFile]);


  const handleChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue(name, file); // ✅ store File object, not base64
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <div className="relative w-full">
        <input
          type="file"
          name={name}
          id={name}
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
          <div className="flex items-center space-x-3">
            <FaUpload className="text-blue-600" />
            <span className="text-gray-700 font-medium truncate max-w-[300px]">
              {selectedFile ? selectedFile.name : "Choose a file..."}
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden md:block">Max: 5MB</span>
        </div>
      </div>

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm"
          />
        </div>
      )}

      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm font-medium mt-1">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default FileInput;
