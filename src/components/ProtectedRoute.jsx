import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const token = localStorage.getItem("adminToken");

  const admin = JSON.parse(
    localStorage.getItem("adminData")
  );

  if (!token || !admin) {
    return <Navigate to="/admin" />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(admin.role)
  ) {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default ProtectedRoute;