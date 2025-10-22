// src/app/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";

export const App = () => {
  const hasToken = !!localStorage.getItem("accessToken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={hasToken ? <NotFoundPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};
