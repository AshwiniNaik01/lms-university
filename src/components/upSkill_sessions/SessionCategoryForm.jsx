// SessionCategoryForm.jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import {
  createSessionCategory,
  deleteSessionCategory,
  getSessionCategories,
  updateSessionCategory,
} from "./upSkillsApi";

import InputField from "../form/InputField";
import TextAreaField from "../form/TextAreaField";
import ScrollableTable from "../table/ScrollableTable";
import EventTableModal from "./EventTableModal";

import { Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

// ----------------------
// Validation Schema
// ----------------------
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  desc: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  isActive: Yup.boolean(),
});

// ----------------------
// Main Component
// ----------------------
const SessionCategoryForm = () => {
  const [sessionCategories, setSessionCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const navigate = useNavigate();

  // ----------------------
  // Fetch all session categories
  // ----------------------
  const fetchCategories = async () => {
    try {
      const data = await getSessionCategories();
      setSessionCategories(data || []);
    } catch (error) {
      console.error("Error fetching session categories:", error);
      Swal.fire("Error!", "Failed to fetch session categories.", "error");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // ----------------------
  // Formik setup
  // ----------------------
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      desc: "",
      type: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        if (selectedCategory) {
          // Update existing category
          await updateSessionCategory(selectedCategory._id, values);
          Swal.fire("Success!", "Session category updated successfully!", "success");
        } else {
          // Create new category
          await createSessionCategory(values);
          Swal.fire("Success!", "Session category created successfully!", "success");
        }

        resetForm();
        setSelectedCategory(null);
        fetchCategories();
      } catch (error) {
        console.error("❌ Error saving session category:", error);
        Swal.fire("Error!", "Failed to save session category.", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // ----------------------
  // Edit category
  // ----------------------
  const handleEdit = (category) => {
    setSelectedCategory(category);
    formik.setValues({
      name: category.name,
      slug: category.slug,
      desc: category.desc,
      type: category.type,
      isActive: category.isActive,
    });
  };

  // ----------------------
  // Delete category using SweetAlert
  // ----------------------
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSessionCategory(id);
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      } catch (error) {
        console.error("❌ Delete failed:", error);
        Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };

  // ----------------------
  // Open manage modal
  // ----------------------
  const handleManage = (category) => {
    setSelectedCategory(category);
    setIsTableOpen(true);
  };

  // ----------------------
  // Table columns
  // ----------------------
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex space-x-4">
          {/* Edit */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Edit"
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
            onClick={() => handleEdit(row)}
          >
            <Pencil size={18} />
          </button>

          {/* Delete */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Delete"
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 size={18} />
          </button>

          {/* Manage */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Manage"
            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
            onClick={() => handleManage(row)}
          >
            <Settings size={18} />
          </button>

          {/* Create content */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content={`Manage ${row.slug}`}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition"
            onClick={() =>
              navigate(`/admin/session-category/${row._id}/manage`)
            }
          >
            <Plus size={18} />
          </button>
        </div>
      ),
    },
  ];

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="relative h-[550px] w-full flex items-center justify-center p-2">
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-6 h-[75vh]">
        {/* ========== FORM SECTION ========== */}
        <div className="w-full lg:w-1/2 backdrop-blur-lg bg-white/60 border-3 border-blue-700 border-opacity-80 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/30">
            <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              {selectedCategory
                ? "✏️ Edit Session Category"
                : "➕ Create Session Category"}
            </h2>
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Name" name="name" formik={formik} />
                <InputField label="Slug" name="slug" formik={formik} />
                <InputField label="Type" name="type" formik={formik} />

                {/* Active Toggle */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>

              <TextAreaField label="Description" name="desc" formik={formik} />

              {/* Buttons */}
              <div className="pt-4 space-y-1 flex flex-col lg:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-70"
                >
                  {loading
                    ? "⏳ Submitting..."
                    : selectedCategory
                    ? "💾 Update Category"
                    : "🚀 Create Category"}
                </button>

                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      formik.resetForm();
                    }}
                    className="w-full bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    ❌ Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ========== TABLE SECTION ========== */}
        <div className="w-full lg:w-1/2 backdrop-blur-lg bg-white/60 border-3 border-blue-700 border-opacity-80 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/30 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              📚 Session Categories
            </h2>
          </div>

          {/* Scrollable Table */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <ScrollableTable
                columns={columns}
                data={sessionCategories}
                maxHeight="100%"
              />
            </div>
          </div>

          {/* Modal */}
          <EventTableModal
            isOpen={isTableOpen}
            onClose={() => setIsTableOpen(false)}
            categoryId={selectedCategory?._id}
            categorySlug={selectedCategory?.slug}
          />

          {/* Tooltip */}
          <Tooltip id="tooltip" place="top" />
        </div>
      </div>
    </div>
  );
};

export default SessionCategoryForm;
