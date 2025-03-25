import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorProtectedRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DoctorProtectedRoute;
