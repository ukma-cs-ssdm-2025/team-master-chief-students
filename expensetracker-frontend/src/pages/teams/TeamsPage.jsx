// src/pages/teams/TeamsPage.jsx
import React, { useState } from "react";
import { useTeams } from "../../entities/team/model/hooks";
import { TeamList } from "../../entities/team/ui/TeamList";
import { CreateTeamForm } from "../../features/team/create/ui/CreateTeamForm";
import { Modal } from "../../shared/ui/Modal";
import { Navigation } from "../../widgets/navigation/Navigation";

export const TeamsPage = () => {
  const { teams, loading, error, createTeam, fetchTeams } = useTeams();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTeam = async (teamData) => {
    await createTeam(teamData);
    await fetchTeams();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
            <p className="text-gray-600 mt-1">Manage your teams and collaborate with others</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Team
          </button>
        </div>

        <TeamList teams={teams} loading={loading} error={error} />
        
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Team</h2>
              <CreateTeamForm
                onCreate={handleCreateTeam}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};