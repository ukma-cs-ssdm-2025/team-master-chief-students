import React, { useMemo } from "react";
import { Outlet, useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useTeamDetails } from "@entities/team";
import { useUser } from "@entities/user";
import { DeleteTeamModal } from "@features/team/delete/ui/DeleteTeamModal";
import { Icon, Toast, LoadingSpinner } from "@shared/ui";
import { useToast } from "@shared/hooks/useToast";

export const TeamDetailsLayout = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUser();
  const {
    team,
    loading: teamLoading,
    error: teamError,
    deleteTeam,
  } = useTeamDetails(parseInt(teamId));

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { toast, showError, hideToast } = useToast();

  const currentUserId = user?.data?.id;

  const userRole = useMemo(() => {
    if (!team?.members || !currentUserId) return null;

    const currentMember = team.members.find(
      member => member.userId === currentUserId
    );

    return currentMember?.role || null;
  }, [team?.members, currentUserId]);

  const canDelete = userRole === "OWNER";

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam();
      navigate("/teams");
    } catch (err) {
      showError(err.message || "Failed to delete team");
    }
  };

  // Get current tab from location
  const pathParts = location.pathname.split('/');
  const currentTab = pathParts[pathParts.length - 1] || 'expenses';

  if (teamLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSpinner size="xl" text="Loading team details..." />
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {teamError}
        </div>
        <button
          onClick={() => navigate("/teams")}
          className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Icon name="arrowLeft" className="w-5 h-5" />
          Back to Teams
        </button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Team not found
        </div>
        <button
          onClick={() => navigate("/teams")}
          className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <Icon name="arrowLeft" className="w-5 h-5" />
          Back to Teams
        </button>
      </div>
    );
  }

  const membersCount = team.members?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/teams")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <Icon name="arrowLeft" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Teams</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
            <p className="text-gray-600">
              {membersCount} member{membersCount !== 1 ? 's' : ''} • Your role: <span className={`font-medium ${
                userRole === 'OWNER' ? 'text-purple-600' :
                userRole === 'ADMIN' ? 'text-blue-600' :
                'text-gray-600'
              }`}>{userRole || 'N/A'}</span>
              {canDelete && <span className="ml-2 text-green-600">✓ Can manage</span>}
            </p>
          </div>
          {canDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name="delete" className="w-5 h-5" />
              Delete team
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <Link
              to={`/teams/${teamId}/expenses`}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'expenses'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="receipt" className="w-5 h-5" />
                Expenses
              </span>
            </Link>
            <Link
              to={`/teams/${teamId}/members`}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'members'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="users" className="w-5 h-5" />
                Members
              </span>
            </Link>
            <Link
              to={`/teams/${teamId}/analytics`}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'analytics'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="chart" className="w-5 h-5" />
                Analytics
              </span>
            </Link>
            <Link
              to={`/teams/${teamId}/export`}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                currentTab === 'export'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="download" className="w-5 h-5" />
                Export
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <Outlet context={{ team, userRole, currentUserId }} />

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteTeamModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteTeam}
          teamName={team.name}
        />
      )}

      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};