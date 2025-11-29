// SessionCategoryForm.jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useSelector } from "react-redux";

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

import { ListCheckIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import { Tooltip } from "react-tooltip";
import Modal from "../popupModal/Modal";
import Dropdown from "../form/Dropdown";
import { canPerformAction } from "../../utils/permissionUtils";

// ----------------------
// Validation Schema
// ----------------------
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  desc: Yup.string().required("Description is required"),
  // type: Yup.string().required("Type is required"),
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const { rolePermissions } = useSelector((state) => state.permissions);

  const upSkillOptions = [
    { value: "internship-session", label: "Internship Session" },
    { value: "workshop", label: "Workshop" },
    { value: "webinar", label: "Webinar" },
    { value: "event", label: "Event" },
  ];

  // ----------------------
  // Fetch all session categories
  // ----------------------
  const fetchCategories = async () => {
    try {
      const data = await getSessionCategories();
      setSessionCategories(data || []);
    } catch (error) {
      console.error("Error fetching session categories:", error);
      Swal.fire("Warning !", "Failed to fetch session categories.", "warning");
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
      // type: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        let response;

        if (selectedCategory) {
          // Update existing category
          response = await updateSessionCategory(selectedCategory._id, values);

          Swal.fire(
            "Success!",
            response?.data?.message || "Session category updated successfully!",
            "success"
          );
        } else {
          // Create new category
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

        // Try to extract backend message
        const errorMessage =
          error.response?.data?.message || "Failed to save session category.";

        Swal.fire("Warning!", errorMessage, "warning");
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
    setIsFormOpen(true);
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
  // const handleManage = (category) => {
  //   setSelectedCategory(category);
  //   setIsTableOpen(true);
  //     // navigate(`/admin/session-category/${category._id}/list`);
  // };

  // New:
  const handleManage = (category) => {
    navigate(`/session-category/${category.slug}/${category._id}/list`);
  };

  // ----------------------
  // Open form for creating new category
  // ----------------------
  const handleNewCategory = () => {
    setSelectedCategory(null);
    formik.resetForm();
    setIsFormOpen(true);
  };

  // ----------------------
  // Close form
  // ----------------------
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  // ----------------------
  // Table columns
  // ----------------------
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "UpSkill Slug", accessor: "slug" },
    // { header: "Type", accessor: "type" },
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
          {canPerformAction(rolePermissions, "session", "update") && (
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Edit UpSkill"
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
              onClick={() => handleEdit(row)}
            >
              <Pencil size={18} />
            </button>
          )}

          {/* Delete */}
          {/* <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Delete UpSkill"
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 size={18} />
          </button> */}

          {/* Manage */}
          {canPerformAction(rolePermissions, "session", "read") && (
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content={`List ${row.slug}`}
              className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
              onClick={() => handleManage(row)}
            >
              <ListCheckIcon size={18} />
            </button>
          )}

          {/* Create content */}
          {canPerformAction(rolePermissions, "session", "create") && (
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content={`Add ${row.slug}`}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition"
              onClick={() =>
                navigate(`/session-category/${row.slug}/${row._id}/manage`)
              }
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="relative w-full max-h-fit p-4 bg-white">
      {/* ========== HEADER ========== */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">UpSkill Categories</h1>
        {/* <button
          onClick={handleNewCategory}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add New Category</span>
        </button> */}
      </div>

      {/* ========== TABLE SECTION (Full Page) ========== */}
      <div className="bg-white flex flex-col overflow-hidden h-[calc(100vh-150px)]">
        {/* Table Header */}
        {/* <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            📚 All UpSkill Categories
          </h2>
        </div> */}

        {/* Scrollable Table */}
        <div className="flex-1 overflow-hidden">
          <ScrollableTable
            columns={columns}
            data={sessionCategories}
            maxHeight="100%"
          />
        </div>
      </div>

      {/* ========== FORM POPUP ========== */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        header={
          selectedCategory
            ? "✏️ Edit UpSkill Category"
            : "➕ Add UpSkill Category"
        }
        primaryAction={{
          label: loading
            ? "⏳ Submitting..."
            : selectedCategory
            ? "💾 Update Category"
            : "🚀 Add Category",
          onClick: formik.handleSubmit,
        }}
      >
        {/* Form Content */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="UpSkill Title" name="name" formik={formik} />
            {/* <InputField label="UpSkill Slug" name="slug" formik={formik} /> */}
            <Dropdown
              label="UpSkill Type"
              name="slug"
              formik={formik}
              options={upSkillOptions.map((opt) => ({
                _id: opt.value,
                title: opt.label,
              }))}
            />

            {/* Active Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Status</span>
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

          {/* Optional Cancel Button inside form */}
          {selectedCategory && (
            <button
              type="button"
              onClick={handleCloseForm}
              className="mt-4 w-full bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all py-3"
            >
              ❌ Cancel Edit
            </button>
          )}
        </form>
      </Modal>

      {/* ========== MODAL ========== */}
      {/* <EventTableModal
        isOpen={isTableOpen}
        onClose={() => setIsTableOpen(false)}
        categoryId={selectedCategory?._id}
        categorySlug={selectedCategory?.slug}
      /> */}

      {/* ========== TOOLTIP ========== */}
      <Tooltip id="tooltip" place="top" />
    </div>
  );
};

export default SessionCategoryForm;
