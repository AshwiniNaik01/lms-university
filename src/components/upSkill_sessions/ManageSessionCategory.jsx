// src/pages/admin/ManageSessionCategory.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import apiClient from '../../api/axiosConfig';
import apiClient from "../../api/axiosConfig";
import EventForm from "./EventForm";
import InternshipSessionForm from "./InternshipSessionForm";
import WebinarForm from "./WebinarForm";
import WorkshopForm from "./WorkshopForm";
// import WorkshopForm from './forms/WorkshopForm';

// const formMap = {
//   workshop: WorkshopForm,
// //   "internship-sessions": InternshipSessionForm,
// //  hackathon: HackathonForm,
// //   webinar: WebinarForm,
// //   event: EventForm,
//   // add more form mappings for other session types
// };

const formMap = {
  workshop: WorkshopForm,
  "internship-session": InternshipSessionForm,
  // hackathon: HackathonForm,
  webinar: WebinarForm,
  event: EventForm,
};

const ManageSessionCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function fetchCategory() {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/session-category");
        const categories = res.data?.data || [];

        console.log(
          "✅ Available Categories:",
          categories.map((cat) => cat._id)
        );
        console.log("🔍 Searching for ID:", id);

        const found = categories.find(
          (item) => String(item._id) === String(id)
        );

        if (found) {
          console.log("✅ Found Category:", found);
        } else {
          console.warn("❌ No category found for the provided ID.");
        }

        setCategory(found || null);
      } catch (err) {
        console.error("❌ Error fetching session categories:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p className="text-red-500">Category not found.</p>;

  //   const FormComponent = formMap[category.slug.toLowerCase()];
  const FormComponent = formMap[category.slug.toLowerCase()];
  console.log("Category slug:", category.slug);

  // return (
  //   <div className="p-6">
  //     <h2 className="text-4xl font-semibold mb-4 text-white flex justify-center">{`Manage: ${category.name}`}</h2>
  //     {FormComponent ? <FormComponent category={category} /> : <p>No form available for this type.</p>}
  //   </div>
  // );

  return (
    <div
      className="relative p-6 min-h-screen flex flex-col items-center justify-start"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/023/123/229/non_2x/a-stack-of-antique-leather-books-in-a-vintage-library-generative-ai-photo.jpg')",
        backgroundSize: "cover",
        // backgroundPosition: "center",
        // filter: "grayscale(100%)",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/20 bg-opacity-40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full">
        <h2 className="text-4xl italic font-semibold mb-4 text-white text-center">{`Manage: ${category.name}`}</h2>
        {FormComponent ? (
          <FormComponent category={category} />
        ) : (
          <p className="text-white">No form available for this type.</p>
        )}
      </div>
    </div>
  );
};

export default ManageSessionCategory;
