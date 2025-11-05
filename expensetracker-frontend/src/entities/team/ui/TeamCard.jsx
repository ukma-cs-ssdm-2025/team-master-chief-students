// src/entities/team/ui/TeamCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {team.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Click to view details
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
          {team.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span>View team details</span>
      </div>
    </div>
  );
};