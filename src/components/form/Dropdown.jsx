
const Dropdown = ({ label, name, options, formik, multiple = false }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        multiple={multiple}
        value={formik.values[name]}
        onBlur={formik.handleBlur}
        onChange={(e) => {
          const selected = multiple
            ? Array.from(e.target.selectedOptions).map((opt) => opt.value)
            : e.target.value;
          formik.setFieldValue(name, selected);
        }}
        className={`w-full px-4 py-2 rounded-lg border transition duration-300 outline-none bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `}
      >
        {!multiple && <option value="">Select {label}</option>}
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.title || option.name}
          </option>
        ))}
      </select>

      {error && (
        <div className="text-red-500 text-xs font-medium">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default Dropdown;

