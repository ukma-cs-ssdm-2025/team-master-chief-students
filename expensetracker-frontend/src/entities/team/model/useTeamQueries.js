import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { teamApi } from './api';
import { API_ENDPOINTS } from '@shared/config';
import { axiosInstance } from '@shared/api/axiosInstance';
import { getAuthToken, logger } from '@shared/lib';

const TEAMS_QUERY_KEY = ['teams'];
const TEAM_QUERY_KEY = (id) => ['teams', id];
const TEAM_EXPENSES_QUERY_KEY = (teamId) => ['teams', teamId, 'expenses'];
const TEAM_TIME_SERIES_STATS_QUERY_KEY = (teamId, params) => ['teams', teamId, 'time-series-stats', params];
const TEAM_CATEGORY_STATS_QUERY_KEY = (teamId, params) => ['teams', teamId, 'category-stats', params];

export const useTeamsQuery = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: async () => {
      if (!token) {
        return [];
      }
      const data = await teamApi.getAll();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
  });
};

export const useTeamQuery = (teamId) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: TEAM_QUERY_KEY(teamId),
    queryFn: async () => {
      if (!token || !teamId) {
        return null;
      }
      return await teamApi.getById(teamId);
    },
    enabled: !!token && !!teamId,
  });
};

export const useTeamExpensesQuery = (teamId, filters = {}) => {
  const token = getAuthToken();

  return useInfiniteQuery({
    queryKey: [...TEAM_EXPENSES_QUERY_KEY(teamId), filters],
    queryFn: async ({ pageParam = null }) => {
      if (!token || !teamId) {
        return { items: [], hasNext: false, nextCursor: null };
      }
      return await teamApi.getExpenses(teamId, { cursor: pageParam, limit: 20, ...filters });
    },
    enabled: !!token && !!teamId,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null,
  });
};

export const useTeamTimeSeriesStatsQuery = (teamId, params = {}) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: TEAM_TIME_SERIES_STATS_QUERY_KEY(teamId, params),
    queryFn: async () => {
      if (!token || !teamId) {
        return null;
      }
      return await teamApi.getTimeSeriesStats(teamId, params);
    },
    enabled: !!token && !!teamId,
  });
};

export const useTeamCategoryStatsQuery = (teamId, params = {}) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: TEAM_CATEGORY_STATS_QUERY_KEY(teamId, params),
    queryFn: async () => {
      if (!token || !teamId) {
        return null;
      }
      return await teamApi.getCategoryStats(teamId, params);
    },
    enabled: !!token && !!teamId,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamData) => teamApi.create(teamData),
    onSuccess: (newTeam) => {
      queryClient.setQueryData(TEAMS_QUERY_KEY, (old = []) => [...old, newTeam]);
    },
    onError: (error) => {
      logger.error('Failed to create team:', error);
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId) => teamApi.delete(teamId),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(TEAMS_QUERY_KEY, (old = []) =>
        old.filter((team) => team.id !== deletedId)
      );
      queryClient.removeQueries({ queryKey: TEAM_QUERY_KEY(deletedId) });
      queryClient.removeQueries({ queryKey: TEAM_EXPENSES_QUERY_KEY(deletedId) });
    },
    onError: (error) => {
      logger.error('Failed to delete team:', error);
    },
  });
};

export const useAddTeamMember = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberData) => teamApi.addMember(teamId, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to add team member:', error);
    },
  });
};

export const useChangeMemberRole = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => teamApi.changeMemberRole(teamId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to change member role:', error);
    },
  });
};

export const useRemoveTeamMember = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => teamApi.removeMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to remove team member:', error);
    },
  });
};

export const useCreateTeamExpense = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData) => teamApi.createExpense(teamId, expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_EXPENSES_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to create team expense:', error);
    },
  });
};

export const useUpdateTeamExpense = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, expenseData }) => teamApi.updateExpense(expenseId, expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_EXPENSES_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to update team expense:', error);
    },
  });
};

export const useDeleteTeamExpense = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId) => teamApi.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_EXPENSES_QUERY_KEY(teamId) });
    },
    onError: (error) => {
      logger.error('Failed to delete team expense:', error);
    },
  });
};

