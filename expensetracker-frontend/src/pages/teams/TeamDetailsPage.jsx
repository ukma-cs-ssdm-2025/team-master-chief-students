// src/pages/teams/TeamDetailsPage.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamDetails, useTeamExpenses } from "../../entities/team/model/hooks";
import { useUser } from "../../entities/user/model/hooks";
import { AddMemberForm } from "../../features/team/add-member/ui/AddMemberForm";
import { MembersList } from "../../features/team/members/ui/MembersList";
import { TeamExpensesList } from "../../features/team/expenses/ui/TeamExpensesList";
import { CreateTeamExpenseForm } from "../../features/team/expenses/ui/CreateTeamExpenseForm";
import { TeamExpenseExport } from "../../features/team/export/ui/TeamExpenseExport";
import { DeleteTeamModal } from "../../features/team/delete/ui/DeleteTeamModal";
import { Modal } from "../../shared/ui/Modal";
import { TeamExpenseTrendChart } from "../../widgets/charts/TeamExpenseTrendChart";
import { TeamCategoryChart } from "../../widgets/charts/TeamCategoryChart";
import { TeamAnalyticsFilter } from "../../features/team/analytics";

export const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    team,
    loading: teamLoading,
    error: teamError,
    addMember,
    changeMemberRole,
    removeMember,
    deleteTeam,
  } = useTeamDetails(parseInt(teamId));

  const {
    expenses,
    hasNext,
    loading: expensesLoading,
    error: expensesError,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useTeamExpenses(parseInt(teamId));

  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("daily");
  const [filters, setFilters] = useState({});
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);

  const currentUserId = user?.data?.id;

  const userRole = useMemo(() => {
    if (!team?.members || !currentUserId) return null;

    const currentMember = team.members.find(
      member => member.userId === currentUserId
    );

    return currentMember?.role || null;
  }, [team?.members, currentUserId]);

  const canManage = userRole === "OWNER" || userRole === "ADMIN";
  const canDelete = userRole === "OWNER";

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam();
      navigate("/teams");
    } catch (err) {
      alert(err.message || "Failed to delete team");
    }
  };

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {teamError}
          </div>
          <button
            onClick={() => navigate("/teams")}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            ← Back to Teams
          </button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Team not found</p>
            <button
              onClick={() => navigate("/teams")}
              className="text-blue-500 hover:text-blue-600"
            >
              ← Back to Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  const memberCount = team.members?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Teams
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600 mt-1">
                {memberCount} member{memberCount !== 1 ? 's' : ''} •
                Your role: <span className={`font-medium ${
                  userRole === 'OWNER' ? 'text-purple-600' :
                  userRole === 'ADMIN' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>{userRole || 'Unknown'}</span>
                {canManage && (
                  <span className="ml-2 text-green-600">
                    ✓ Can manage
                  </span>
                )}
              </p>
            </div>

            {/* Delete Team Button */}
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Team
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("expenses")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "expenses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Expenses
                </span>
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Members
                </span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </span>
              </button>
              <button
                onClick={() => setActiveTab("export")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "export"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "expenses" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Expense</h2>
                <CreateTeamExpenseForm onCreate={createExpense} />
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Team Expenses</h2>

                {expensesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {expensesError}
                  </div>
                )}

                <TeamExpensesList
                  expenses={expenses}
                  hasNext={hasNext}
                  onLoadMore={loadMore}
                  loading={expensesLoading}
                  onUpdate={updateExpense}
                  onDelete={deleteExpense}
                />
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                {canManage ? (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                    Add Member
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Only OWNER and ADMIN can add members
                  </div>
                )}
              </div>

              <MembersList
                members={team.members}
                currentUserId={currentUserId}
                onChangeRole={changeMemberRole}
                onRemove={removeMember}
                canManage={canManage}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <TeamAnalyticsFilter
                filters={filters}
                onFiltersChange={setFilters}
                onReset={() => setFilters({})}
                isOpen={isAnalyticsFilterOpen}
                onToggle={() => setIsAnalyticsFilterOpen(!isAnalyticsFilterOpen)}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Category Distribution Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Category Distribution</h2>
                  <div className="flex-1 h-[400px]">
                    <TeamCategoryChart teamId={parseInt(teamId)} filters={filters} />
                  </div>
                </div>

                {/* Expense Trend Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-900">Expense Trend</h2>
                    <select
                      value={chartPeriod}
                      onChange={(e) => setChartPeriod(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:border-blue-400 transition"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="flex-1 h-[400px]">
                    <TeamExpenseTrendChart teamId={parseInt(teamId)} period={chartPeriod} filters={filters} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <TeamExpenseExport teamId={parseInt(teamId)} userRole={userRole} />
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <Modal onClose={() => setShowAddMember(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddMemberForm
                onAdd={addMember}
                onCancel={() => setShowAddMember(false)}
              />
            </div>
          </Modal>
        )}

        {/* Delete Team Modal */}
        <DeleteTeamModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteTeam}
          teamName={team.name}
        />
      </div>
    </div>
  );
};