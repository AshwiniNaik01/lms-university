import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventForm from "./EventForm";
import InternshipSessionForm from "./InternshipSessionForm";
import WebinarForm from "./WebinarForm";
import WorkshopForm from "./WorkshopForm";
import { getSessionCategories } from "./upSkillsApi";

// Map session slugs to their respective forms
const formMap = {
  workshop: WorkshopForm,
  "internship-session": InternshipSessionForm,
  webinar: WebinarForm,
  event: EventForm,
  // Add more session types here as needed
};

const ManageSessionCategory = () => {
  // const { id } = useParams();
  const { slug, id } = useParams(); // slug and category ID

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------
  // Fetch category by ID
  // ----------------------
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        // Fetch all categories
        const categories = await getSessionCategories();
        console.log("✅ Available Categories:", categories.map((cat) => cat._id));
        console.log("🔍 Searching for ID:", id);

        // Find the category with the matching ID
        const foundCategory = categories.find(
          (item) => String(item._id) === String(id)
        );

        if (foundCategory) {
          console.log("✅ Found Category:", foundCategory);
        } else {
          console.warn("❌ No category found for the provided ID.");
        }

        setCategory(foundCategory || null);
      } catch (error) {
        console.error("❌ Error fetching session categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ----------------------
  // Handle loading and errors
  // ----------------------
  if (loading) return <p>Loading...</p>;
  if (!category)
    return (
      <p className="text-red-500 text-center mt-8 font-medium">
        Category not found.
      </p>
    );

  // Determine which form component to render based on category slug
  const FormComponent = formMap[category.slug.toLowerCase()];
  console.log("Category slug:", category.slug);

  // ----------------------
  // Render page
  // ----------------------
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start ">

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl p-2 md:p-4">

        {/* Header */}
      {/* <h2 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-6 tracking-wide animate-fade-in">
  {category?.name ? `📘 Manage ${category.name}` : "Loading..."}
</h2> */}


        {/* Form Component */}
        {FormComponent ? (
          <div className="w-full">
            <FormComponent category={category} />
          </div>
        ) : (
          <p className="text-center text-red-500 font-medium text-lg">
            No form available for this type.
          </p>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-200 to-transparent -z-10"></div>
    </div>
  );
};

export default ManageSessionCategory;
