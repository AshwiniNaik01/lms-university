// import { useEffect, useRef, useState } from "react";
// import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

// const MultiSelectDropdown = ({
//   label,
//   name,
//   options,
//   formik,
//   getOptionValue = (option) => option,
//   getOptionLabel = (option) => option,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const selectedValues = Array.isArray(formik.values[name]) ? formik.values[name] : [];

//   // Init value as array
//   useEffect(() => {
//     if (!Array.isArray(formik.values[name])) {
//       try {
//         const parsed = JSON.parse(formik.values[name] || "[]");
//         formik.setFieldValue(name, Array.isArray(parsed) ? parsed : []);
//       } catch {
//         formik.setFieldValue(name, []);
//       }
//     }
//   }, [formik.values[name], formik.setFieldValue, name]);

//   // Click outside to close
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (option) => {
//     const value = getOptionValue(option);
//     if (selectedValues.includes(value)) {
//       formik.setFieldValue(
//         name,
//         selectedValues.filter((v) => v !== value)
//       );
//     } else {
//       formik.setFieldValue(name, [...selectedValues, value]);
//     }
//   };

//   const selectedLabels = selectedValues
//     .map((val) => {
//       const found = options.find((opt) => getOptionValue(opt) === val);
//       return found ? getOptionLabel(found) : null;
//     })
//     .filter(Boolean);

//   const error = formik?.touched?.[name] && formik?.errors?.[name];

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <label className="block text-sm font-medium text-gray-700">
//         {label}
//       </label>

//       <div
//         className={`border border-gray-300 focus:border-blue-500 rounded-lg w-full px-4 py-2 mt-1 bg-white flex justify-between items-center cursor-pointer transition-all ${
//           isOpen ? "ring-2 ring-blue-400" : "hover:shadow-lg"
//         }`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-gray-800 font-sm truncate w-[90%]">
//           {selectedLabels.length > 0 ? selectedLabels.join(", ") : "Select Options"}
//         </span>
//         {isOpen ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-gray-400" />}
//       </div>

//       {isOpen && (
//         <div className="absolute z-30 bg-white border border-gray-200 mt-2 w-full rounded-lg shadow-xl max-h-60 overflow-y-auto transition-all animate-fadeIn">
//           {options.map((option, i) => {
//             const value = getOptionValue(option);
//             const labelText = getOptionLabel(option);
//             const checked = selectedValues.includes(value);

//             return (
//               <label
//                 key={i}
//                 className="flex items-center gap-3 px-4 py-2 hover:bg-[#e7f3ff] cursor-pointer transition-all duration-150"
//               >
//                 <input
//                   type="checkbox"
//                   className="hidden"
//                   checked={checked}
//                   onChange={() => handleSelect(option)}
//                 />
//                 <div
//                   className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all ${
//                     checked ? "bg-[#485dac] border-[#485dac]" : "border-gray-300"
//                   }`}
//                 >
//                   {checked && <FaCheck className="text-white text-sm" />}
//                 </div>
//                 <span className="text-gray-800 font-medium">{labelText}</span>
//               </label>
//             );
//           })}
//         </div>
//       )}

//       {error && <p className="text-red-500 text-sm mt-1 font-medium">{formik.errors[name]}</p>}
//     </div>
//   );
// };

// export default MultiSelectDropdown;


import { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

const MultiSelectDropdown = ({
  label,
  name,
  options,
  formik = { values: {}, setFieldValue: () => {} },
  getOptionValue = (option) => option,
  getOptionLabel = (option) => option,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure formik.values[name] is always an array
  const selectedValues = Array.isArray(formik?.values?.[name]) ? formik.values[name] : [];

  // Init value as array if undefined or invalid
  useEffect(() => {
    if (!Array.isArray(formik?.values?.[name])) {
      try {
        const parsed = JSON.parse(formik?.values?.[name] || "[]");
        if (formik?.setFieldValue) {
          formik.setFieldValue(name, Array.isArray(parsed) ? parsed : []);
        }
      } catch {
        if (formik?.setFieldValue) {
          formik.setFieldValue(name, []);
        }
      }
    }
  }, [formik?.values?.[name], formik?.setFieldValue, name]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection
  const handleSelect = (option) => {
    const value = getOptionValue(option);
    if (selectedValues.includes(value)) {
      formik.setFieldValue(
        name,
        selectedValues.filter((v) => v !== value)
      );
    } else {
      formik.setFieldValue(name, [...selectedValues, value]);
    }
  };

  // Labels of selected items
  const selectedLabels = selectedValues
    .map((val) => {
      const found = options.find((opt) => getOptionValue(opt) === val);
      return found ? getOptionLabel(found) : null;
    })
    .filter(Boolean);

  // Validation error
  const error = formik?.touched?.[name] && formik?.errors?.[name];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        className={`border border-gray-300 focus:border-blue-500 rounded-lg w-full px-4 py-2 mt-1 bg-white flex justify-between items-center cursor-pointer transition-all ${
          isOpen ? "ring-2 ring-blue-400" : "hover:shadow-lg"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-800 font-sm truncate w-[90%]">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : "Select Options"}
        </span>
        {isOpen ? (
          <FaChevronUp className="text-blue-500" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-30 bg-white border border-gray-200 mt-2 w-full rounded-lg shadow-xl max-h-60 overflow-y-auto transition-all animate-fadeIn">
          {options.map((option, i) => {
            const value = getOptionValue(option);
            const labelText = getOptionLabel(option);
            const checked = selectedValues.includes(value);

            return (
              <label
                key={i}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#e7f3ff] cursor-pointer transition-all duration-150"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => handleSelect(option)}
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all ${
                    checked ? "bg-[#485dac] border-[#485dac]" : "border-gray-300"
                  }`}
                >
                  {checked && <FaCheck className="text-white text-sm" />}
                </div>
                <span className="text-gray-800 font-medium">{labelText}</span>
              </label>
            );
          })}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1 font-medium">{formik.errors?.[name]}</p>}
    </div>
  );
};

export default MultiSelectDropdown;

