import { useEffect, useState } from "react";
import { FaClone, FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../contexts/AuthContext";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";
import { cloneCourse, deleteCourse, fetchCourseById, getAllCourses } from "../../../api/courses";

const CourseTable = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCourseData, setModalCourseData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const navigate = useNavigate();

  // const fetchCourses = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await apiClient.get("/api/courses/all", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const courseList = Array.isArray(res.data.data) ? res.data.data : [];
  //     setCourses(courseList);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to fetch courses.");
  //   }
  //   setLoading(false);
  // };

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCourses(); // API helper
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load courses",
        text: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // user cancelled

    setDeletingId(id);
    try {
      await deleteCourse(id); // using your API helper
      setCourses((prev) => prev.filter((course) => course._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Course deleted successfully.",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: err.message || "Failed to delete course.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch course by ID and open modal

const handleViewClick = async (id) => {
  setModalLoading(true);
  setIsModalOpen(true);

  try {
    const courseData = await fetchCourseById(id); // ✅ use helper API
    setModalCourseData(courseData); // directly set the returned data
  } catch (err) {
    console.error(err);
    setModalCourseData(null);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Failed to fetch course details",
    });
  } finally {
    setModalLoading(false);
  }
};

  // Clone course function
  // 3️⃣ Use it in handleClone
  const handleClone = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clone this course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, clone it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const data = await cloneCourse(id);

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Cloned!",
            text: data.message || "Course cloned successfully.",
          });
          fetchCourses(); // ✅ Works now because it's in scope
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || "Failed to clone course.",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Please Try Again !!",
        });
      }
    }
  };

  // const columns = [
  //   { header: "Title", accessor: "title" },
  //   { header: "Duration", accessor: "duration" },
  //   {
  //     header: "Actions",
  //     accessor: (row) => (
  //       <div className="flex gap-2">
  //         <button
  //           onClick={() => handleViewClick(row._id)}
  //           className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
  //         >
  //           View
  //         </button>
  //         <button
  //           onClick={() => navigate(`/admin/courses/edit/${row._id}`)}
  //           className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
  //         >
  //           Edit
  //         </button>
  //         <button
  //           onClick={() => handleDelete(row._id)}
  //           disabled={deletingId === row._id}
  //           className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
  //         >
  //           {deletingId === row._id ? "Deleting..." : "Delete"}
  //         </button>
  //         <button
  //           onClick={() =>
  //             navigate(`/admin/add-curriculum?type=phase&courseId=${row._id}`)
  //           }
  //           className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
  //         >
  //           Add Curriculum
  //         </button>
  //         <button
  //           onClick={() => handleClone(row._id)}
  //           className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
  //         >
  //           Clone
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          {/* View */}
          <button
            onClick={() => handleViewClick(row._id)}
            title="View"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaEye size={16} />
          </button>

          {/* Edit */}
          <button
            onClick={() => navigate(`/admin/courses/edit/${row._id}`)}
            title="Edit"
            className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            <FaEdit size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(row._id)}
            disabled={deletingId === row._id}
            title="Delete"
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            <FaTrash size={16} />
          </button>

          {/* Add Curriculum */}
          <button
            onClick={() =>
              navigate(`/admin/add-curriculum?type=phase&courseId=${row._id}`)
            }
            title="Add Curriculum"
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaPlus size={16} />
          </button>

          {/* Clone */}
          <button
            onClick={() => handleClone(row._id)}
            title="Clone"
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            <FaClone size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading)
    return <div className="text-center p-4 text-indigo-600">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="space-y-6">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 rounded-md">
        <h2 className="text-2xl font-bold text-gray-700 tracking-wide">
          Manage Training Program
        </h2>
        <button
          onClick={() => navigate("/admin/add-courses")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200"
        >
          + Create New Training Program
        </button>
      </div>

      {/* ✅ Table Section */}
      <div className="bg-white shadow-sm rounded-md p-4">
        <ScrollableTable
          columns={columns}
          data={courses}
          maxHeight="600px"
          emptyMessage="No Training Program found"
        />
      </div>

      {/* ✅ Modal for Course Details */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={modalCourseData ? modalCourseData.title : "Loading..."}
      >
        {modalLoading ? (
          <p className="text-gray-500 text-center py-6">Loading...</p>
        ) : modalCourseData ? (
          <div className="space-y-4 text-gray-700">
            {/* Description & Overview */}
            <p>
              <strong>Description:</strong> {modalCourseData.description}
            </p>
            <p>
              <strong>Overview:</strong> {modalCourseData.overview}
            </p>

            {/* Learning Outcomes */}
            {modalCourseData.learningOutcomes?.length > 0 && (
              <div>
                <strong>Learning Outcomes:</strong>
                <ul className="list-disc ml-5 space-y-1">
                  {modalCourseData.learningOutcomes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {modalCourseData.benefits?.length > 0 && (
              <div>
                <strong>Benefits:</strong>
                <ul className="list-disc ml-5 space-y-1">
                  {modalCourseData.benefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Features */}
            {modalCourseData.keyFeatures?.length > 0 && (
              <div>
                <strong>Key Features:</strong>
                <ul className="list-disc ml-5 space-y-2">
                  {modalCourseData.keyFeatures.map((feature) => (
                    <li key={feature._id}>
                      <strong>{feature.title}:</strong> {feature.description}
                      {feature.subPoints?.length > 0 && (
                        <ul className="list-decimal ml-5 mt-1">
                          {feature.subPoints.map((sub, i) => (
                            <li key={i}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trainer Info */}
            {modalCourseData.trainer?.length > 0 && (
              <div>
                <strong>Trainer Info:</strong>
                {modalCourseData.trainer.map((t) => (
                  <div
                    key={t._id}
                    className="border border-gray-200 p-3 rounded-md mb-3"
                  >
                    <p>
                      <strong>Name:</strong> {t.fullName}
                    </p>
                    <p>
                      <strong>Title:</strong> {t.title}
                    </p>
                    <p>
                      <strong>Qualification:</strong> {t.highestQualification}
                    </p>
                    <p>
                      <strong>College:</strong> {t.collegeName}
                    </p>
                    <p>
                      <strong>Total Experience:</strong> {t.totalExperience}
                    </p>
                    <p>
                      <strong>Available Timing:</strong> {t.availableTiming}
                    </p>
                    <p>
                      <strong>LinkedIn:</strong>{" "}
                      <a
                        href={t.linkedinProfile?.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {t.linkedinProfile?.trim()}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Ratings and Status */}
            <p>
              <strong>Rating:</strong> {modalCourseData.rating}
            </p>
            <p>
              <strong>Enrolled Count:</strong> {modalCourseData.enrolledCount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {modalCourseData.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No data found.</p>
        )}
      </Modal>
    </div>
  );
};

export default CourseTable;
