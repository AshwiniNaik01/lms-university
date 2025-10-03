
const TextAreaField = ({ label, name, formik, rows = 4 }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        placeholder={label}
        className={`w-full px-4 py-2 rounded-lg border transition duration-300 outline-none resize-y bg-white
          ${error ? "border-red-500 focus:border-red-500" : "border-blue-400 focus:border-blue-500"}
          focus:ring-2 focus:ring-opacity-50
          ${error ? "focus:ring-red-300" : "focus:ring-blue-300"}
        `}
      />

      {error && (
        <div className="text-red-500 text-xs font-medium">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default TextAreaField;
