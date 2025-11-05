// src/entities/user/ui/ProfileCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (!user) return null;

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="relative overflow-hidden rounded-lg border p-4 mb-6 shadow-sm bg-white">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full -ml-6 -mb-6"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      {/* Avatar and basic info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
          {getInitials(user.data.username)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{user.data.username}</h3>
          <p className="text-xs text-gray-600 truncate">{user.data.email}</p>
          <p className="text-xs text-gray-500">ID: {user.data.id}</p>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition-colors"
      >
        Logout
      </button>
    </div>
  );
};