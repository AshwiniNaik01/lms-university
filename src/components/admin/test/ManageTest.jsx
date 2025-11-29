import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import ScrollableTable from "../../table/ScrollableTable";
import { useSelector } from "react-redux";
import { canPerformAction } from "../../../utils/permissionUtils";

const ManageTest = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { rolePermissions } = useSelector((state) => state.permissions);


const columns = [
  { header: "Test Name", accessor: (row) => row.title || "Untitled" },
  { header: "Level", accessor: (row) => row.testLevel || "N/A" },
  {
    header: "Duration",
    accessor: (row) =>
      `${row.testDuration?.minutes || 0}m ${row.testDuration?.seconds || 0}s`,
  },
  { header: "Total Marks", accessor: (row) => row.totalMarks || "--" },
  {
    header: "Actions",
    accessor: (row) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => navigate(`/view-excel/${row._id}`)}
        >
          📂 View
        </button>
        {canPerformAction(rolePermissions, "test", "delete") && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          onClick={() => handleDelete(row._id)}
        >
          🗑️ Delete
        </button>
        )}
      </div>
    ),
  },
];

  // Fetch tests
const fetchTests = async () => {
  setLoading(true);
  setError(null);

  try {
    // Use GET request instead of POST
    const response = await apiClient.get(`/api/tests`);

    console.log("API Response:", response.data);

    if (response.data?.data && Array.isArray(response.data.data)) {
      setTests(response.data.data);
    } else {
      setTests([]);
    }
  } catch (err) {
    console.error("Error fetching tests:", err);
    setError("Failed to fetch tests. Please try again.");
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response?.data?.message || "Error fetching data",
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this test?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/api/tests/${testId}`);
        Swal.fire("Deleted!", "Test has been deleted.", "success");
        fetchTests(); // refresh list after delete
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to delete test.",
          "error"
        ); 
      }
    }
  };

 return (
  <div className="max-w-full h-full mx-auto p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">All Tests 📘</h2>
      {canPerformAction(rolePermissions, "test", "create") && (
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all"
        onClick={() => navigate("/add-test")}
      >
        + Add Assessment Test
      </button>
      )}
    </div>

    {/* Loading/Error */}
    {loading && <p className="text-blue-500 font-semibold">Loading...</p>}
    {error && <p className="text-red-500 font-semibold">{error}</p>}

    {/* Scrollable Table */}
    <ScrollableTable
      columns={columns}
      data={tests}
      maxHeight="500px"
      emptyMessage="No tests found."
    />
  </div>
);

};

export default ManageTest;
