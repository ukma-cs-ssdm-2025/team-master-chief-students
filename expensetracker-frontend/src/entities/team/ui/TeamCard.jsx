import React from "react";
import { useNavigate } from "react-router-dom";

export const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${team.id}`);
  };

  const getMemberCount = () => {
    return team.members?.length || 0;
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
            {getMemberCount()} member{getMemberCount() !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
          {team.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Your role:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          team.userRole === 'OWNER'
            ? 'bg-purple-100 text-purple-700'
            : team.userRole === 'ADMIN'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {team.userRole}
        </span>
      </div>
    </div>
  );
};