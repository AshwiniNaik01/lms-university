

const InputField = ({ label, name, type = "text", formik }) => {
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  const error =
    getNestedValue(formik.touched, name) && getNestedValue(formik.errors, name);

  // Custom change handler for nested fields
  const handleChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue(name, value);
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        onChange={handleChange}      // Use custom handler
        onBlur={formik.handleBlur}
        value={getNestedValue(formik.values, name) || ""}
        placeholder={label}
        className={`w-full px-4 py-2 rounded-lg border transition duration-300 outline-none bg-white
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-blue-400 focus:border-blue-500"
          }
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `}
      />

      {error && (
        <div className="text-red-500 text-xs font-medium">
          {getNestedValue(formik.errors, name)}
        </div>
      )}
    </div>
  );
};

export default InputField;


