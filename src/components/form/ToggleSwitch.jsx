
const ToggleSwitch = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm font-medium text-gray-800">{label}</span>

      <label htmlFor={name} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300 shadow-md"></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
