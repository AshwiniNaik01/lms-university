import { jsxs, jsx } from "react/jsx-runtime";
import { FaUpload } from "react-icons/fa";
const PDFUploadField = ({ name, formik, label }) => {
  const selectedFile = formik.values[name];
  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file && file.type !== "application/pdf") {
      formik.setFieldError(name, "Only PDF files are allowed");
      formik.setFieldValue(name, null);
      return;
    }
    formik.setFieldValue(name, file);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-2", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          name,
          id: name,
          accept: "application/pdf",
          onChange: handleChange,
          className: "absolute inset-0 opacity-0 cursor-pointer z-20"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-4 py-3 rounded-lg shadow-sm hover:border-blue-400 transition-all duration-300 z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx(FaUpload, { className: "text-blue-600" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-medium truncate max-w-[300px]", children: selectedFile ? selectedFile.name : "Choose a PDF file..." })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 hidden md:block", children: "Only PDF (Max: 5MB)" })
      ] })
    ] }),
    formik.touched[name] && formik.errors[name] && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-1", children: formik.errors[name] })
  ] });
};
export {
  PDFUploadField as P
};
