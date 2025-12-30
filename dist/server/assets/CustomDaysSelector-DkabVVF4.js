import { jsxs, jsx } from "react/jsx-runtime";
const daysOfWeek = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" }
];
const CustomDaysSelector = ({ name, formik }) => {
  const selected = formik.values[name] || [];
  const toggleDay = (day) => {
    const newSelection = selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day];
    formik.setFieldValue(name, newSelection);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mt-5", children: "Select Preferred Days" }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg p-5 mt-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4", children: daysOfWeek.map((day) => /* @__PURE__ */ jsxs(
      "label",
      {
        className: "flex items-center gap-2 cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              value: day.value,
              checked: selected.includes(day.value),
              onChange: () => toggleDay(day.value),
              className: "form-checkbox text-blue-600"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: day.label })
        ]
      },
      day.value
    )) }) })
  ] });
};
export {
  CustomDaysSelector as C
};
