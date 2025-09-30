
const DateRangePicker = ({ formik }) => (
  <div className="space-y-4">
    {/* <h3 className="text-md font-semibold text-gray-900">Select Dates</h3> */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date*</label>
        <input
          type="date"
          name="startDate"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className="w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date*</label>
        <input
          type="date"
          name="endDate"
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className="w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>
    </div>
  </div>
);

export default DateRangePicker;
