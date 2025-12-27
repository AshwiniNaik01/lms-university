

import { useMemo } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";

const MultiImageUpload = ({ name, formik, label }) => {
  if (!formik) {
    console.error("Formik prop is missing in MultiImageUpload!");
    return null;
  }

  const files = formik.values[name] || [];

  // Generate previews only when files change

const previews = useMemo(() => {
  if (!files || files.length === 0) return [];
  return files.map((file) => {
    if (file instanceof File) {
      return {
        url: URL.createObjectURL(file),
        name: file.name,
      };
    } else if (typeof file === "string") {
      return {
        url: file, // ✅ Already a full URL, don't prepend anything
        name: file.split("/").pop(),
      };
    } else {
      return { url: "", name: "Unknown" };
    }
  });
}, [files]);



  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    formik.setFieldValue(name, [...files, ...newFiles]);
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    formik.setFieldValue(name, updatedFiles);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      {/* Upload input */}
      <div className="relative w-full mb-4">
        <input
          type="file"
          multiple
          accept="image/*"
          id={name}
          name={name}
          onChange={handleFilesChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
          <div className="flex items-center space-x-3">
            <FaUpload className="text-blue-600" />
            <span className="text-gray-700 font-medium">
              Upload one or multiple images
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden md:block">
            Max: 5MB each
          </span>
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={preview.url}
                alt={`preview-${index}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
              >
                <FaTrash size={14} />
              </button>
              {/* <div className="p-1 text-xs text-gray-600 truncate">
                {preview.name}
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm font-medium mt-2">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
