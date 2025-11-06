// src/entities/user/ui/ProfileCard.jsx
import React from "react";

export const ProfileCard = ({ user }) => {
  if (!user) return null;

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {getInitials(user.data.username)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{user.data.username}</h3>
          <p className="text-sm text-gray-600">{user.data.email}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {user.data.id}</p>
        </div>
      </div>
    </div>
  );
};