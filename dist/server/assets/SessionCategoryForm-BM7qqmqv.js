import { jsxs, jsx } from "react/jsx-runtime";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { B as updateSessionCategory, E as createSessionCategory, S as ScrollableTable, M as Modal, I as InputField, D as Dropdown, T as TextAreaField, A as getSessionCategories, e as canPerformAction } from "../entry-server.js";
import { Pencil, ListCheckIcon, Plus } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-dom/server";
import "react-toastify";
import "react-icons/fa";
import "react-icons/md";
import "react-icons/vsc";
import "axios";
import "js-cookie";
import "react-dom";
import "framer-motion";
import "@reduxjs/toolkit";
import "react-icons/ri";
import "react-icons/fc";
import "react-hot-toast";
import "react-icons/fi";
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  desc: Yup.string().required("Description is required"),
  // type: Yup.string().required("Type is required"),
  isActive: Yup.boolean()
});
const SessionCategoryForm = () => {
  const [sessionCategories, setSessionCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);
  const upSkillOptions = [
    { value: "internship-session", label: "Internship Session" },
    { value: "workshop", label: "Workshop" },
    { value: "webinar", label: "Webinar" },
    { value: "event", label: "Event" }
  ];
  const fetchCategories = async () => {
    try {
      const data = await getSessionCategories();
      setSessionCategories(data || []);
    } catch (error) {
      console.error("Error fetching session categories:", error);
      Swal.fire("Warning !", "Failed to fetch session categories.", "warning");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      desc: "",
      // type: "",
      isActive: true
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory) {
          response = await updateSessionCategory(selectedCategory._id, values);
          Swal.fire(
            "Success!",
            response?.data?.message || "Session category updated successfully!",
            "success"
          );
        } else {
          response = await createSessionCategory(values);
          Swal.fire(
            "Success!",
            response?.data?.message || "Session category created successfully!",
            "success"
          );
        }
        resetForm();
        setSelectedCategory(null);
        setIsFormOpen(false);
        fetchCategories();
      } catch (error) {
        console.error("❌ Error saving session category:", error);
        const errorMessage = error.response?.data?.message || "Failed to save session category.";
        Swal.fire("Warning!", errorMessage, "warning");
      } finally {
        setLoading(false);
      }
    }
  });
  const handleEdit = (category) => {
    setSelectedCategory(category);
    formik.setValues({
      name: category.name,
      slug: category.slug,
      desc: category.desc,
      type: category.type,
      isActive: category.isActive
    });
    setIsFormOpen(true);
  };
  const handleManage = (category) => {
    navigate(`/session-category/${category.slug}/${category._id}/list`);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "UpSkill Slug", accessor: "slug" },
    // { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: (row) => /* @__PURE__ */ jsx(
        "span",
        {
          className: `px-2 py-1 rounded text-xs font-semibold ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
          children: row.isActive ? "Active" : "Inactive"
        }
      )
    },
    {
      header: "Actions",
      accessor: (row) => /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
        canPerformAction(rolePermissions, "session", "update") && /* @__PURE__ */ jsx(
          "button",
          {
            "data-tooltip-id": "tooltip",
            "data-tooltip-content": "Edit UpSkill",
            className: "p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition",
            onClick: () => handleEdit(row),
            children: /* @__PURE__ */ jsx(Pencil, { size: 18 })
          }
        ),
        canPerformAction(rolePermissions, "session", "read") && /* @__PURE__ */ jsx(
          "button",
          {
            "data-tooltip-id": "tooltip",
            "data-tooltip-content": `List ${row.slug}`,
            className: "p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition",
            onClick: () => handleManage(row),
            children: /* @__PURE__ */ jsx(ListCheckIcon, { size: 18 })
          }
        ),
        canPerformAction(rolePermissions, "session", "create") && /* @__PURE__ */ jsx(
          "button",
          {
            "data-tooltip-id": "tooltip",
            "data-tooltip-content": `Add ${row.slug}`,
            className: "p-2 rounded-lg hover:bg-green-50 text-green-600 transition",
            onClick: () => navigate(`/session-category/${row.slug}/${row._id}/manage`),
            children: /* @__PURE__ */ jsx(Plus, { size: 18 })
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full max-h-fit p-4 bg-white", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex justify-between items-center", children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "UpSkill Categories" }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white flex flex-col overflow-hidden h-[calc(100vh-150px)]", children: /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(
      ScrollableTable,
      {
        columns,
        data: sessionCategories,
        maxHeight: "100%"
      }
    ) }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: isFormOpen,
        onClose: handleCloseForm,
        header: selectedCategory ? "✏️ Edit UpSkill Category" : "➕ Add UpSkill Category",
        primaryAction: {
          label: loading ? "⏳ Submitting..." : selectedCategory ? "💾 Update Category" : "🚀 Add Category",
          onClick: formik.handleSubmit
        },
        children: /* @__PURE__ */ jsxs("form", { onSubmit: formik.handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx(InputField, { label: "UpSkill Title", name: "name", formik }),
            /* @__PURE__ */ jsx(
              Dropdown,
              {
                label: "UpSkill Type",
                name: "slug",
                formik,
                options: upSkillOptions.map((opt) => ({
                  _id: opt.value,
                  title: opt.label
                }))
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Status" }),
              /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: "isActive",
                    checked: formik.values.isActive,
                    onChange: formik.handleChange,
                    className: "sr-only peer"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "w-12 h-7 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300" }),
                /* @__PURE__ */ jsx("div", { className: "absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(TextAreaField, { label: "Description", name: "desc", formik }),
          selectedCategory && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleCloseForm,
              className: "mt-4 w-full bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all py-3",
              children: "❌ Cancel Edit"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Tooltip, { id: "tooltip", place: "top" })
  ] });
};
export {
  SessionCategoryForm as default
};
