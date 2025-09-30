


const daysOfWeek = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" },
];

const CustomDaysSelector = ({ name, formik }) => {
  const selected = formik.values[name] || [];

  const toggleDay = (day) => {
    const newSelection = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day];
    formik.setFieldValue(name, newSelection);
  };

//   return (
//     <div className="flex flex-wrap gap-4 mt-3">
//       {daysOfWeek.map((day) => (
//         <label key={day.value} className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             value={day.value}
//             checked={selected.includes(day.value)}
//             onChange={() => toggleDay(day.value)}
//             className="form-checkbox text-blue-600"
//           />
//           <span className="text-sm text-gray-700">{day.label}</span>
//         </label>
//       ))}
//     </div>
//   );

return (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mt-5">
      Select Preferred Days
    </label>

    <div className="bg-white shadow-md rounded-lg p-5 mt-2">
      <div className="flex flex-wrap gap-4">
        {daysOfWeek.map((day) => (
          <label
            key={day.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={day.value}
              checked={selected.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="form-checkbox text-blue-600"
            />
            <span className="text-sm text-gray-700">{day.label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

};

export default CustomDaysSelector;
