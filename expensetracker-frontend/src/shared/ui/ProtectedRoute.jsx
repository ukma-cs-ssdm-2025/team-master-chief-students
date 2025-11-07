import React from "react";
import { Navigate } from "react-router-dom";
import { getActiveAccount } from "../lib/multiAccountStorage";

export const ProtectedRoute = ({ children }) => {
  const activeAccount = getActiveAccount();
  const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
