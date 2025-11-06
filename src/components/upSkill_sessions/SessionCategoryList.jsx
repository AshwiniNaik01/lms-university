// SessionCategoryList.jsx
import { ArrowLeft, Calendar, CheckCircle, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  deleteEvent,
  deleteInternshipSession,
  deleteSessionCategory,
  deleteWebinar,
  deleteWorkshop,
  getAllEvents,
  getAllInternshipSessions,
  getAllWebinars,
  getAllWorkshops,
  getSessionCategories,
} from "./upSkillsApi";
import Modal from "../popupModal/Modal";

const SessionCategoryList = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // store selected item

  // -------------------
  // Fetch data
  // -------------------
  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let responseData = [];

      switch (slug) {
        case "event":
          responseData = await getAllEvents();
          break;
        case "webinar":
          responseData = await getAllWebinars();
          break;
        case "workshop":
          responseData = await getAllWorkshops();
          break;
        case "session-category":
          responseData = await getSessionCategories();
          break;
        case "internship-session":
          responseData = await getAllInternshipSessions();
          break;
        default:
          throw new Error("Unknown type");
      }

      setData(responseData || []);

      const sessionCategories = await getSessionCategories();
      setCategories(sessionCategories || []);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  // -------------------
  // Delete handler
  // -------------------
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete this ${slug}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      switch (slug) {
        case "event":
          await deleteEvent(id);
          break;
        case "webinar":
          await deleteWebinar(id);
          break;
        case "workshop":
          await deleteWorkshop(id);
          break;
        case "session-category":
          await deleteSessionCategory(id);
          break;
        case "internship-session":
          await deleteInternshipSession(id);
          break;
        default:
          throw new Error("Unknown type");
      }

      toast.success(`${slug} deleted successfully!`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error(`Failed to delete ${slug}.`);
    }
  };

  // -------------------
  // Handle Edit
  // -------------------
  const handleEdit = (item) => {
    const category = categories.find((cat) => cat.slug === slug);
    if (!category) {
      toast.error("Category not found!");
      return;
    }

    navigate(
      `/admin/session-category/${category.slug}/${category._id}/manage?type=edit&id=${item._id}`
    );
  };

  // Fields to hide in modal
  const hiddenFields = [
    "__v",
    "_id",
    "createdAt",
    "description",
    "updatedAt",
    "slug",
    "image",
    "banner",
    "thumbnail",
  ];

  // Determine if a value should be displayed
  const isDisplayable = (value, key) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "object") return false;
    if (Array.isArray(value)) return false;
    if (typeof value === "string" && value.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return false;
    if (hiddenFields.includes(key)) return false;
    return true;
  };

  // Format values based on type
  const formatValue = (key, value) => {
    if (typeof value === "boolean") {
      return value ? (
        <span className="flex items-center text-green-600 font-medium">
          <CheckCircle size={16} className="mr-1" /> Active
        </span>
      ) : (
        <span className="flex items-center text-red-500 font-medium">
          <XCircle size={16} className="mr-1" /> Inactive
        </span>
      );
    }

  if (
  key.toLowerCase().includes("date") ||
  key.toLowerCase().includes("createdat")
) {
  return (
    <span className="flex items-center text-blue-600">
      <Calendar size={16} className="mr-1" />
      {new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
}

return <span className="text-gray-900">{String(value)}</span>;
  }
  // Generate modal content
  const renderDetails = (item) => {
    if (!item) {
      return (
        <p className="text-gray-500 italic text-center">
          No details available.
        </p>
      );
    }

    const filteredEntries = Object.entries(item).filter(([key, value]) =>
      isDisplayable(value, key)
    );

    if (filteredEntries.length === 0) {
      return (
        <p className="text-gray-500 italic text-center">
          No readable text fields available.
        </p>
      );
    }

    return (
      <div className="relative bg-white overflow-hidden">
        {/* Details Section */}
        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
          {filteredEntries.length > 0 ? (
            <dl className="divide-y divide-gray-100">
              {filteredEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="py-3 grid grid-cols-3 items-start hover:bg-gray-50 rounded-lg px-2 transition-all"
                >
                  {/* Field Label */}
                  <dt className="col-span-1 text-sm font-medium text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </dt>

                  {/* Field Value */}
                  <dd
                    className={`col-span-2 text-sm text-gray-900 ${
                      key.toLowerCase().includes("description")
                        ? "line-clamp-3 hover:line-clamp-none cursor-pointer transition-all"
                        : ""
                    }`}
                    title={
                      key.toLowerCase().includes("description")
                        ? String(value)
                        : undefined
                    }
                  >
                    {formatValue(key, value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-gray-500 text-center italic">
              No details available.
            </p>
          )}
        </div>
      </div>
    );
  };

  // -------------------
  // Render
  // -------------------
  return (
    <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
          {slug.replace("-", " ")} 
        </h1>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-gray-600 text-center text-lg animate-pulse">
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center text-lg">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No {slug} found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item._id}
              className="relative flex flex-col bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 h-[220px]"
            >
              {/* Gradient top border */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              {/* Card content */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.title || item.name}
                  </h2>
                  <p
                    className="text-gray-700 text-sm mb-4 line-clamp-3"
                    title={item.description}
                  >
                    {item.description || "No description provided."}
                  </p>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-auto flex justify-between space-x-3 pt-4 border-t border-gray-100">
                  {/* View Button */}
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md font-semibold"
                  >
                    <Calendar size={18} /> View
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-md font-semibold"
                  >
                    <CheckCircle size={18} /> Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow-md font-semibold"
                  >
                    <XCircle size={18} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={selectedItem ? selectedItem.title || selectedItem.name : ""}
      >
        {renderDetails(selectedItem)}
      </Modal>
    </div>
  );
};

export default SessionCategoryList;
