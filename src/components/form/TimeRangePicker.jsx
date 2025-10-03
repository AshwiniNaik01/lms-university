
const TimeRangePicker = ({ formik }) => (
  <div className="space-y-4">
    {/* <h3 className="text-md font-semibold text-gray-900">Select Times</h3> */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Time*</label>
        <input
          type="time"
          name="startTime"
          value={formik.values.startTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className="w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Time*</label>
        <input
          type="time"
          name="endTime"
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className="w-full mt-1 border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>
    </div>
  </div>
);

export default TimeRangePicker;
