import { useEffect, useState } from "react";
import {
  createBranch,
  deleteBranch,
  fetchBranches,
  updateBranch,
} from "../../api/branches.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchDesc, setNewBranchDesc] = useState("");
  const [editingBranch, setEditingBranch] = useState(null); // { _id, name, description }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const loadBranches = async () => {
    setLoading(true);
    try {
      const data = await fetchBranches();
      setBranches(data || []);
    } catch (err) {
      setError("Failed to load branches.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      alert("Branch name cannot be empty.");
      return;
    }
    setError("");
    try {
      const response = await createBranch(
        { name: newBranchName, description: newBranchDesc },
        token
      );
      if (response.success) {
        loadBranches();
        setNewBranchName("");
        setNewBranchDesc("");
        alert("Branch created!");
      } else {
        setError(response.message || "Failed to create branch.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error creating branch.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBranch || !editingBranch.name.trim()) {
      alert("Branch name cannot be empty for update.");
      return;
    }
    setError("");
    try {
      const response = await updateBranch(
        editingBranch._id,
        { name: editingBranch.name, description: editingBranch.description },
        token
      );
      if (response.success) {
        loadBranches();
        setEditingBranch(null);
        alert("Branch updated!");
      } else {
        setError(response.message || "Failed to update branch.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating branch.");
    }
  };

  const handleDelete = async (branchId, branchName) => {
    // if (window.confirm(`Are you sure you want to delete branch "${branchName}"? Associated courses might prevent deletion.`)) {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        `Are you sure you want to delete branch "${branchName}"? Associated courses might prevent deletion.`
      )
    ) {
      setError("");
      try {
        const response = await deleteBranch(branchId, token);
        if (response.success) {
          loadBranches();
          alert("Branch deleted!");
        } else {
          setError(response.message || "Failed to delete branch.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting branch.");
      }
    }
  };

  if (loading) return <p>Loading branches...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-12 drop-shadow-lg">
          Branch Management
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
              {editingBranch ? (
                <>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm">
                    Editing
                  </span>{" "}
                  Edit Branch: {editingBranch.initialName || editingBranch.name}
                </>
              ) : (
                "Create New Branch"
              )}
            </h2>

            <form
              onSubmit={editingBranch ? handleUpdate : handleCreate}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={editingBranch ? editingBranch.name : newBranchName}
                  onChange={(e) =>
                    editingBranch
                      ? setEditingBranch({
                          ...editingBranch,
                          name: e.target.value,
                        })
                      : setNewBranchName(e.target.value)
                  }
                  required
                  placeholder="Enter branch name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={
                    editingBranch ? editingBranch.description : newBranchDesc
                  }
                  onChange={(e) =>
                    editingBranch
                      ? setEditingBranch({
                          ...editingBranch,
                          description: e.target.value,
                        })
                      : setNewBranchDesc(e.target.value)
                  }
                  placeholder="Optional branch description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                >
                  {editingBranch ? "Save Changes" : "Create Branch"}
                </button>

                {editingBranch && (
                  <button
                    type="button"
                    onClick={() => setEditingBranch(null)}
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition shadow-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Section */}
          {/* <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 max-h-[600px] overflow-auto hover:shadow-2xl transition">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Existing Branches</h2>

          {branches.length === 0 && !loading ? (
            <p className="text-gray-600 text-center py-4">No branches found.</p>
          ) : (
            <table className="min-w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-indigo-100 sticky top-0 z-10 text-indigo-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {branches.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3 text-gray-600">{b.description || "-"}</td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() => setEditingBranch({ ...b, initialName: b.name })}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs shadow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id, b.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> */}

          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 max-h-[600px]">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Existing Branches
            </h2>

            {branches.length === 0 && !loading ? (
              <p className="text-gray-600 text-center py-4">
                No branches found.
              </p>
            ) : (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Header Table (fixed) */}
                <table className="min-w-full text-sm">
                  <thead className="bg-indigo-100 text-indigo-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-left">
                        Name
                      </th>
                      <th className="px-4 py-3 font-semibold text-left">
                        Description
                      </th>
                      <th className="px-4 py-3 font-semibold text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                </table>

                {/* Scrollable Body */}
                <div className="overflow-auto max-h-[400px]">
                  <table className="min-w-full text-sm">
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {branches.map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{b.name}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {b.description || "-"}
                          </td>
                          <td className="px-4 py-3 flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                setEditingBranch({ ...b, initialName: b.name })
                              }
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs shadow"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(b._id, b.name)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs shadow"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchManagement;
