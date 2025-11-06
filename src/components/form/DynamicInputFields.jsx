
import { useEffect } from "react";

const DynamicInputFields = ({ formik, name, label }) => {
  // Safe access to nested array values
  const values = formik.values[name] ?? [];

  // Ensure at least one input exists on first render
  useEffect(() => {
    if (!values || values.length === 0) {
      formik.setFieldValue(name, [""]);
    }
  }, [formik, name, values]);

  const addInput = () => {
    formik.setFieldValue(name, [...values, ""]);
  };

  const removeInput = (index) => {
    const updated = values.filter((_, i) => i !== index);
    formik.setFieldValue(name, updated.length > 0 ? updated : [""]); // keep at least 1
  };

  const handleInputChange = (index, value) => {
    const updated = [...values];
    updated[index] = value;
    formik.setFieldValue(name, updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {values.map((val, index) => {
        // Safely access errors/touched
        const error =
          formik.touched[name]?.[index] && formik.errors[name]?.[index];

        return (
          <div
            key={index}
            className={`flex items-center gap-2 ${index === 0 ? "" : "pl-6"}`}
          >
           <input
  type="text"
  name={`${name}[${index}]`}
  value={val}
  onChange={(e) => handleInputChange(index, e.target.value)}
  onBlur={formik.handleBlur}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit
      addInput(); // optionally add a new field
    }
  }}
  placeholder={`Enter ${label.toLowerCase()} ${index + 1}`}
  className={`flex-1 px-4 py-2 rounded-lg border transition duration-300 outline-none bg-white
    ${error ? "border-red-500 focus:border-red-500" : "border-blue-400 focus:border-blue-500"}
    focus:ring-2 focus:ring-opacity-50
    ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
  `}
/>


            {index === 0 && (
              <button
                type="button"
                onClick={addInput}
                className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                +
              </button>
            )}

            {values.length > 1 && (
              <button
                type="button"
                onClick={() => removeInput(index)}
                className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicInputFields;
