
const CheckboxGroup = ({ label, name, options, formik }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target;
    const currentArray = formik.values[name] || [];

    if (checked) {
      formik.setFieldValue(name, [...currentArray, value]);
    } else {
      formik.setFieldValue(
        name,
        currentArray.filter((item) => item !== value)
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">

     
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 bg-blue-50/2 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={(formik.values[name] || []).includes(opt.value)}
              onChange={handleChange}
              className="form-checkbox text-blue-600 h-4 w-4"
            />
            <span className="text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-2">{formik.errors[name]}</p>
      )}
    </div>
    </div>
  );
};

export default CheckboxGroup;
