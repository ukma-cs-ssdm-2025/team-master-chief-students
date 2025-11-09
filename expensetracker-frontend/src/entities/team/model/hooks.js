import {
  useTeamsQuery,
  useTeamQuery,
  useTeamExpensesQuery,
  useTeamTimeSeriesStatsQuery,
  useTeamCategoryStatsQuery,
  useCreateTeam,
  useDeleteTeam,
  useAddTeamMember,
  useChangeMemberRole,
  useRemoveTeamMember,
  useCreateTeamExpense,
  useUpdateTeamExpense,
  useDeleteTeamExpense,
} from "./useTeamQueries";

export const useTeams = () => {
  const { data: teams = [], isLoading: loading, error, refetch: fetchTeams } = useTeamsQuery();
  const createMutation = useCreateTeam();
  const deleteMutation = useDeleteTeam();

  const createTeam = async (teamData) => {
    return await createMutation.mutateAsync(teamData);
  };

  const deleteTeam = async (teamId) => {
    await deleteMutation.mutateAsync(teamId);
  };

  return {
    teams,
    loading,
    error: error?.message || null,
    fetchTeams,
    createTeam,
    deleteTeam,
  };
};

export const useTeamDetails = (teamId) => {
  const { data: team, isLoading: loading, error, refetch: fetchTeamDetails } = useTeamQuery(teamId);
  const deleteMutation = useDeleteTeam();
  const addMemberMutation = useAddTeamMember(teamId);
  const changeRoleMutation = useChangeMemberRole(teamId);
  const removeMemberMutation = useRemoveTeamMember(teamId);

  const deleteTeam = async () => {
    await deleteMutation.mutateAsync(teamId);
    return { success: true };
  };

  const addMember = async (memberData) => {
    await addMemberMutation.mutateAsync(memberData);
  };

  const changeMemberRole = async (userId, role) => {
    await changeRoleMutation.mutateAsync({ userId, role });
  };

  const removeMember = async (userId) => {
    await removeMemberMutation.mutateAsync(userId);
  };

  return {
    team,
    loading,
    error: error?.message || null,
    fetchTeamDetails,
    deleteTeam,
    addMember,
    changeMemberRole,
    removeMember,
  };
};

export const useTeamExpenses = (teamId, filters = {}) => {
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch: fetchExpenses,
  } = useTeamExpensesQuery(teamId, filters);
  const createMutation = useCreateTeamExpense(teamId);
  const updateMutation = useUpdateTeamExpense(teamId);
  const deleteMutation = useDeleteTeamExpense(teamId);

  const expenses = data?.pages.flatMap((page) => page.items || []) || [];
  const hasNext = hasNextPage || false;

  const loadMore = () => {
    if (hasNext && !loading) {
      fetchNextPage();
    }
  };

  const createExpense = async (expenseData) => {
    return await createMutation.mutateAsync(expenseData);
  };

  const updateExpense = async (expenseId, expenseData) => {
    return await updateMutation.mutateAsync({ expenseId, expenseData });
  };

  const deleteExpense = async (expenseId) => {
    await deleteMutation.mutateAsync(expenseId);
  };

  return {
    expenses,
    hasNext,
    loading,
    error: error?.message || null,
    fetchExpenses,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};

export const useTeamTimeSeriesStats = (teamId, params = {}) => {
  const { data: stats, isLoading: loading, error, refetch } = useTeamTimeSeriesStatsQuery(teamId, params);

  return {
    stats,
    loading,
    error: error?.message || null,
    refetch,
  };
};

export const useTeamCategoryStats = (teamId, params = {}) => {
  const { data: stats, isLoading: loading, error, refetch } = useTeamCategoryStatsQuery(teamId, params);

  return {
    stats,
    loading,
    error: error?.message || null,
    refetch,
  };
};