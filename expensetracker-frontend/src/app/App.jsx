import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "@pages/auth/AuthPage";
import { DashboardPage } from "@pages/dashboard/DashboardPage";
import {
  TeamsPage,
  TeamDetailsLayout,
  TeamExpensesTab,
  TeamMembersTab,
  TeamAnalyticsTab,
  TeamExportTab,
  TeamsLayout,
} from "@pages/teams";
import { NotFoundPage } from "@pages/not-found/NotFoundPage";
import { ProtectedRoute } from "@shared/ui";
import { Layout } from "@widgets/layout/Layout";
import { getActiveAccount, getAuthToken } from "@shared/lib";

export const App = () => {
  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (activeAccount) {
      localStorage.setItem("accessToken", activeAccount.accessToken);
      localStorage.setItem("refreshToken", activeAccount.refreshToken);
    }
  }, []);

  const hasToken = !!getAuthToken();

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
      <Route path="/teams" element={<TeamsLayout />}>
        <Route index element={<TeamsPage />} />
        <Route path=":teamId" element={<TeamDetailsLayout />}>
          <Route index element={<Navigate to="expenses" replace />} />
          <Route path="expenses" element={<TeamExpensesTab />} />
          <Route path="members" element={<TeamMembersTab />} />
          <Route path="analytics" element={<TeamAnalyticsTab />} />
          <Route path="export" element={<TeamExportTab />} />
        </Route>
      </Route>
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
