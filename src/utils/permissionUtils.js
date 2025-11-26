// utils/permissionUtils.js

export const canAccessModule = (rolePermissions, module) => {
  if (!module) return false;
  return !!rolePermissions[module] || !!rolePermissions["*"];
};

export const canPerformAction = (rolePermissions, module, action) => {
  if (!module || !action) return false;
  return rolePermissions["*"]?.includes(action) || rolePermissions[module]?.includes(action);
};
