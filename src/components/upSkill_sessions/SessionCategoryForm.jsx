import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

//  Yup Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  desc: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  isActive: Yup.boolean(),
});

const SessionCategoryForm = () => {
  const [sessionCategories, setSessionCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(false);
  const navigate = useNavigate();

  //  Fetch all session categories
  const fetchCategories = async () => {
    try {
      const data = await getSessionCategories();
      setSessionCategories(data || []);
    } catch (error) {
      console.error("Error fetching session categories:", error);
    }
  };

  //  Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  //  Formik Setup
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
      setMessage("");

      try {
        if (selectedCategory) {
          //  Update category
          await updateSessionCategory(selectedCategory._id, values);
          setMessage("✅ Session category updated successfully!");
        } else {
          //  Create new category
          await createSessionCategory(values);
          setMessage("✅ Session category created successfully!");
        }

        resetForm();
        setSelectedCategory(null);
        fetchCategories();
      } catch (error) {
        console.error("❌ Error saving session category:", error);
        setMessage("❌ Error saving session category.");
      } finally {
        setLoading(false);
      }
    },
  });

  //  Populate form for editing (prefilled)
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

  //  Handle delete
  const handleDelete = async (id) => {
    // if (window.confirm("Are you sure you want to delete this category?")) {
      
    if (typeof window !== 'undefined' && window.confirm("Are you sure you want to delete this category?")) {
 
    try {
        await deleteSessionCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("❌ Delete failed:", error);
      }
    }
  };

  //  Navigate to manage route
  const handleManage = (category) => {
    navigate(`/admin/session-category/${category._id}/manage`, {
      state: { category },
    });
  };

  //  Table columns
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
          {/* ✏️ Edit */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Edit"
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
            onClick={() => handleEdit(row)}
          >
            <Pencil size={18} />
          </button>

          {/* 🗑️ Delete */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Delete"
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 size={18} />
          </button>

          {/* ⚙️ Manage */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Manage"
            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
            onClick={() => {
              setSelectedCategory(row);
              setIsTableOpen(true);
            }}
          >
            <Settings size={18} />
          </button>

          {/* ➕ Create Content */}
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-start justify-center p-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/023/123/229/non_2x/a-stack-of-antique-leather-books-in-a-vintage-library-generative-ai-photo.jpg')",
          zIndex: 0,
        }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-6">
        {/*  Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            {selectedCategory
              ? "Edit Session Category"
              : "Create Session Category"}
          </h2>

          {message && (
            <p
              className={`mb-4 text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <InputField label="Name" name="name" formik={formik} />
            <InputField label="Slug" name="slug" formik={formik} />
            <TextAreaField label="Description" name="desc" formik={formik} />
            <InputField label="Type" name="type" formik={formik} />

            {/* isActive toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800">Active</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-300" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300 shadow-md" />
              </label>
            </div>

            {/*  Submit & Cancel */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {loading
                ? "Submitting..."
                : selectedCategory
                ? "Update Category"
                : "Create Category"}
            </button>

            {selectedCategory && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  formik.resetForm();
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/*  Table */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            Session Categories
          </h2>

          {/* Render the Scrollable Table */}
          <ScrollableTable
            columns={columns}
            data={sessionCategories}
            maxHeight="400px"
          />

          {/* Render the Manage Modal */}
          <EventTableModal
            isOpen={isTableOpen}
            onClose={() => setIsTableOpen(false)}
            categoryId={selectedCategory?._id}
            categorySlug={selectedCategory?.slug}
          />

          {/* Tooltip provider */}
          <Tooltip id="tooltip" place="top" />
        </div>
      </div>
    </div>
  );
};

export default SessionCategoryForm;
