import { jsxs, jsx } from "react/jsx-runtime";
const RadioButtonGroup = ({ label, name, options, formik }) => {
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mt-5", children: label }),
    /* @__PURE__ */ jsx("div", { className: "bg-white shadow-md rounded-lg p-5 mt-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-6", children: options.map((option, index) => {
      const id = `${name}-${index}`;
      return /* @__PURE__ */ jsxs(
        "label",
        {
          htmlFor: id,
          className: "flex items-center space-x-3 cursor-pointer mt-2",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                id,
                name,
                value: option.value,
                checked: formik.values[name] === option.value,
                onChange: formik.handleChange,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${formik.values[name] === option.value ? "border-blue-600" : "border-gray-400"}`,
                children: formik.values[name] === option.value && /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-600 rounded-full" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-gray-800 font-sm", children: option.label })
          ]
        },
        id
      );
    }) }) }),
    formik.touched[name] && formik.errors[name] && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-medium mt-1", children: formik.errors[name] })
  ] });
};
export {
  RadioButtonGroup as R
};
