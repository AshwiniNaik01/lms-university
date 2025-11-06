import { useEffect, useState } from "react";
import { FaUpload, FaVideo } from "react-icons/fa";

const VideoUploadField = ({ label, name, formik }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const selectedFile = formik.values[name];

  // Handle preview for File or existing URL
  useEffect(() => {
    if (selectedFile instanceof File) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof selectedFile === "string") {
      setPreviewUrl(selectedFile); // for existing URL
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file && file.type === "video/mp4") {
      formik.setFieldValue(name, file);
    } else {
      formik.setFieldValue(name, null);
      alert("Please upload a valid MP4 file.");
    }
  };

  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Upload Field */}
      <div className="relative w-full">
        <input
          type="file"
          name={name}
          id={name}
          accept="video/mp4"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />

        <div
          className={`flex items-center justify-between border-2 border-dashed ${
            error ? "border-red-400" : "border-gray-300 hover:border-blue-400"
          } bg-white px-4 py-3 rounded-lg shadow-sm transition-all duration-300`}
        >
          <div className="flex items-center space-x-3">
            <FaVideo className="text-blue-600 text-xl" />
            <span className="text-gray-700 font-medium truncate max-w-[300px]">
              {selectedFile ? selectedFile.name : "Choose a video file (.mp4)"}
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden md:block">Max: 100MB</span>
        </div>
      </div>

      {/* Video Preview */}
      {previewUrl && (
        <div className="mt-3">
          <video
            src={previewUrl}
            controls
            className="w-72 h-44 object-cover rounded-lg border border-gray-300 shadow-md"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-xs font-medium">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default VideoUploadField;
