import { jsxs, jsx } from "react/jsx-runtime";
const ToggleSwitch = ({ label, name, checked, onChange }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-800", children: label }),
    /* @__PURE__ */ jsxs("label", { htmlFor: name, className: "relative inline-flex items-center cursor-pointer", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          id: name,
          name,
          checked,
          onChange,
          className: "sr-only peer"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300" }),
      /* @__PURE__ */ jsx("div", { className: "absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300 shadow-md" })
    ] })
  ] });
};
export {
  ToggleSwitch as T
};
