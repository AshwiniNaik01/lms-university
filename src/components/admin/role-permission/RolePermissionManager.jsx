import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import apiClient from "../../../api/axiosConfig";
import handleApiError from "../../../utils/handleApiError";
import Modal from "../../popupModal/Modal";

const allActions = ["create", "read", "update", "delete"];

const RolePermissionManager = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]); // dynamic modules from API
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  // --------------------------
  // Fetch roles
  // --------------------------
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get("/api/role");
        setRoles(res.data.message || []);
      } catch (err) {
        console.error("Error fetching roles", err);
      }
    };
    fetchRoles();
  }, []);

  // --------------------------
  // Fetch modules dynamically
  // --------------------------
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await apiClient.get("/api/module");
        if (res.data.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((m) => ({
            module: m.module.toLowerCase(),
            label: m.module,
          }));
          setModules(formatted);
        }
      } catch (err) {
        console.error("Error fetching modules", err);
      }
    };
    fetchModules();
  }, []);

  // --------------------------
  // Load selected role permissions
  // --------------------------
  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);

    apiClient
      .get(`/api/role/${selectedRoleId}`)
      .then((res) => {
        const role = res.data.message;
        setSelectedRoleName(role.role);

        const formatted = {};
        if (
          role.permissions.length === 1 &&
          role.permissions[0].module === "*"
        ) {
          modules.forEach((m) => {
            formatted[m.module] = [...allActions];
          });
        } else {
          modules.forEach((m) => (formatted[m.module] = []));
          role.permissions.forEach((p) => {
            formatted[p.module] = p.actions;
          });
        }
        setPermissions(formatted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRoleId, modules]);

  // --------------------------
  // Checkbox toggle
  // --------------------------
  const handleCheckboxChange = (module, action) => {
    setPermissions((prev) => {
      const moduleActions = prev[module] || [];
      const updated = moduleActions.includes(action)
        ? moduleActions.filter((a) => a !== action)
        : [...moduleActions, action];
      return { ...prev, [module]: updated };
    });
  };

  // --------------------------
  // Submit role permissions
  // --------------------------
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      role: selectedRoleName,
      permissions: Object.entries(permissions)
        .filter(([_, actions]) => actions.length > 0)
        .map(([module, actions]) => ({ module, actions })),
    };

    try {
      let res;
      if (selectedRoleId) {
        res = await apiClient.put(`/api/role/${selectedRoleId}`, payload);
      } else {
        res = await apiClient.post(`/api/role`, payload);
      }
      // alert("Permissions saved successfully!");
      Swal.fire({
        icon: "success",
        title: `${res?.data?.message}` || "Permissions saved successfully!",
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
      // alert("Error saving permissions.");
      Swal.fire({
        icon: "error",
        title: handleApiError(err),
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Add new role
  // --------------------------

  const handleAddNewRole = async () => {
    if (!newRoleName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Role name is required!",
      });
    }

    setCreatingRole(true);

    try {
      const payload = { role: newRoleName.trim().toLowerCase() };
      const res = await apiClient.post("/api/role", payload);

      Swal.fire({
        icon: "success",
        title: `${res?.data?.success}` || "New role added successfully!",
        // timer: 1500,
        showConfirmButton: true,
      });

      setRoles((prev) => [...prev, res.data.message]);
      setIsModalOpen(false);
      setNewRoleName("");
    } catch (err) {
      console.error(err);
      const errorMessage = handleApiError(err);

      Swal.fire({
        icon: "error",
        title: errorMessage || "Error creating role.",
      });
    } finally {
      setCreatingRole(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 max-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
            Role Permission Manager
          </h1>
          <p className="text-gray-500">Assign and manage access for roles.</p>
        </div>

        {/* Add New Role Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaPlus /> Add New Role
        </button>
      </div>

      {/* Role Dropdown */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
        <label className="block text-gray-700 font-semibold mb-3">
          Select Role
        </label>
        <select
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          className="w-64 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.role.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Permission Table */}
      {selectedRoleId && modules.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Module
                </th>
                {allActions.map((action) => (
                  <th
                    key={action}
                    className="px-6 py-3 text-center text-sm font-semibold text-gray-700"
                  >
                    {action.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.module} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {m.label}
                  </td>
                  {allActions.map((action) => (
                    <td key={action} className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[m.module]?.includes(action)}
                        onChange={() => handleCheckboxChange(m.module, action)}
                        // disabled={selectedRoleName === "admin"}
                         disabled={selectedRoleName === "admin" || selectedRoleName === "super_admin"}
                        className="h-5 w-5 text-indigo-600"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {selectedRoleId && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md"
          >
            {loading ? "Saving..." : "Save Permissions"}
          </button>
        </div>
      )}

      {/* Add New Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Add New Role"
        primaryAction={{
          label: "Create Role",
          onClick: handleAddNewRole,
          loading: creatingRole,
        }}
      >
        <div className="flex flex-col gap-4">
          <label className="text-gray-700 font-medium">Role Name*</label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="e.g., trainer"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
      </Modal>
    </div>
  );
};

export default RolePermissionManager;
