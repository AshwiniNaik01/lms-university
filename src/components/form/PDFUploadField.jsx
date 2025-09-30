
import { FaUpload } from "react-icons/fa";

const PDFUploadField = ({ name, formik, label }) => {
  const selectedFile = formik.values[name];

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];

    // Validate PDF file type
    if (file && file.type !== "application/pdf") {
      formik.setFieldError(name, "Only PDF files are allowed");
      formik.setFieldValue(name, null);
      return;
    }

    formik.setFieldValue(name, file);
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
          accept="application/pdf"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
        />

        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10">
          <div className="flex items-center space-x-3">
            <FaUpload className="text-blue-600" />
            <span className="text-gray-700 font-medium truncate max-w-[300px]">
              {selectedFile ? selectedFile.name : "Choose a PDF file..."}
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden md:block">Only PDF (Max: 5MB)</span>
        </div>
      </div>

      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm font-medium mt-1">
          {formik.errors[name]}
        </div>
      )}
    </div>
  );
};

export default PDFUploadField;
