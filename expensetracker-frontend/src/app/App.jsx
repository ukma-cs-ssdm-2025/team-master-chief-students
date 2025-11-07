import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../pages/auth/AuthPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { TeamsPage } from "../pages/teams/TeamsPage";
import { TeamDetailsPage } from "../pages/teams/TeamDetailsPage";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { Layout } from "../widgets/layout/Layout";
import { getActiveAccount } from "../shared/lib/multiAccountStorage";

export const App = () => {
  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (activeAccount) {
      localStorage.setItem("accessToken", activeAccount.accessToken);
      localStorage.setItem("refreshToken", activeAccount.refreshToken);
    }
  }, []);

  const activeAccount = getActiveAccount();
  const hasToken = activeAccount?.accessToken || !!localStorage.getItem("accessToken");

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:teamId"
        element={
          <ProtectedRoute>
            <Layout>
              <TeamDetailsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          hasToken ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={
          hasToken ? (
            <Layout>
              <NotFoundPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
