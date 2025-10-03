
const RadioButtonGroup = ({ label, name, options, formik }) => {
return (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mt-5">{label}</label>

    <div className="bg-white shadow-md rounded-lg p-5 mt-2">
      <div className="flex flex-wrap gap-6">
        {options.map((option, index) => {
          const id = `${name}-${index}`;
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center space-x-3 cursor-pointer mt-2"
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={formik.values[name] === option.value}
                onChange={formik.handleChange}
                className="hidden"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  formik.values[name] === option.value
                    ? "border-blue-600"
                    : "border-gray-400"
                }`}
              >
                {formik.values[name] === option.value && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className="text-gray-800 font-sm">{option.label}</span>
            </label>
          );
        })}
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

export default RadioButtonGroup;
