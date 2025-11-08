import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../contexts/AuthContext";
import Modal from "../../popupModal/Modal";
import ScrollableTable from "../../table/ScrollableTable";

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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/courses/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseList = Array.isArray(res.data.data) ? res.data.data : [];
      setCourses(courseList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to delete course."
      );
    }
    setDeletingId(null);
  };

  // Fetch course by ID and open modal
  const handleViewClick = async (id) => {
    setModalLoading(true);
    setIsModalOpen(true);

    try {
      const { data } = await apiClient.get(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setModalCourseData(data.data);
      } else {
        setModalCourseData(null);
        alert("Failed to fetch course details");
      }
    } catch (err) {
      console.error(err);
      setModalCourseData(null);
      alert("Error fetching course details");
    } finally {
      setModalLoading(false);
    }
  };

  // Clone course function
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
        const { data } = await apiClient.post(
          `/api/courses/${id}/clone`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Cloned!",
            text: data.message || "Course cloned successfully.",
          });
          fetchCourses(); // Refresh the table
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
          text: err.response?.data?.message || "Something went wrong!",
        });
      }
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewClick(row._id)}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={() => navigate(`/admin/courses/edit/${row._id}`)}
            className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            disabled={deletingId === row._id}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deletingId === row._id ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() =>
              navigate(`/admin/add-curriculum?type=phase&courseId=${row._id}`)
            }
            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Curriculum
          </button>
          <button
            onClick={() => handleClone(row._id)}
            className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Clone
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
    <div className="space-y-4">
      <button
        onClick={() => navigate("/admin/add-courses")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Create New Course
      </button>

      <ScrollableTable
        columns={columns}
        data={courses}
        maxHeight="600px"
        emptyMessage="No courses found"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={modalCourseData ? modalCourseData.title : "Loading..."}
      >
        {modalLoading ? (
          <p>Loading...</p>
        ) : modalCourseData ? (
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Description:</strong> {modalCourseData.description}
            </p>
            <p>
              <strong>Overview:</strong> {modalCourseData.overview}
            </p>

            <div>
              <strong>Learning Outcomes:</strong>
              <ul className="list-disc ml-5">
                {modalCourseData.learningOutcomes?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Benefits:</strong>
              <ul className="list-disc ml-5">
                {modalCourseData.benefits?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Key Features:</strong>
              <ul className="list-disc ml-5">
                {modalCourseData.keyFeatures?.map((feature) => (
                  <li key={feature._id}>
                    <strong>{feature.title}:</strong> {feature.description}
                    {feature.subPoints?.length > 0 && (
                      <ul className="list-decimal ml-5">
                        {feature.subPoints.map((sub, i) => (
                          <li key={i}>{sub}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {modalCourseData.trainer?.length > 0 && (
              <div>
                <strong>Trainer Info:</strong>
                {modalCourseData.trainer.map((t) => (
                  <div key={t._id} className="border p-2 rounded mb-2">
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
                        className="text-blue-600 underline"
                      >
                        {t.linkedinProfile?.trim()}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            )}

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
          <p>No data found.</p>
        )}
      </Modal>
    </div>
  );
};

export default CourseTable;
