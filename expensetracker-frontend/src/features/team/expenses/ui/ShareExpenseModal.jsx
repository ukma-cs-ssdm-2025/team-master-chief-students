import React, { useState } from "react";
import { useTeams, teamApi } from "@entities/team";
import { Icon } from "@shared/ui";

export const ShareExpenseModal = ({ expenseId, onClose, onSuccess }) => {
  const { teams } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [mode, setMode] = useState("MOVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeamId) {
      setError("Please select a team");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await teamApi.shareExpense(expenseId, {
        teamId: parseInt(selectedTeamId),
        mode,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to share expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Share Expense to Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-2">
              Select Team
            </label>
            <select
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            >
              <option value="">Choose a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="MOVE"
                  checked={mode === "MOVE"}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Move (remove from personal expenses)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="COPY_REFERENCE"
                  checked={mode === "COPY_REFERENCE"}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Copy (keep in personal expenses)
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sharing..." : "Share Expense"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};