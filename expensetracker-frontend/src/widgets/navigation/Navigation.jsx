import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccountSwitcher } from "../../features/auth/ui/AccountSwitcher";
import { useMultiAccount } from "../../features/auth/model/useMultiAccount";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAll, activeAccount } = useMultiAccount();

  const handleLogout = () => {
    if (window.confirm("Log out from all accounts?")) {
      logoutAll();
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-white shadow-sm border border-gray-200 w-full rounded-xl">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16 w-full">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ExpenseTracker
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/teams"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive("/teams")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Teams
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {activeAccount && <AccountSwitcher />}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-1 pb-3 w-full">
          <Link
            to="/dashboard"
            className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/teams"
            className={`flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/teams")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Teams
          </Link>
        </div>
      </div>
    </nav>
  );
};
