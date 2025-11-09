// src/entities/team/model/hooks.js
import { useState, useEffect } from "react";
import { teamApi } from "./api";

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await teamApi.getAll();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData) => {
    try {
      const data = await teamApi.create(teamData);
      setTeams((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create team");
      throw err;
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      await teamApi.delete(teamId);
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (err) {
      setError(err.message || "Failed to delete team");
      throw err;
    }
  };

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    deleteTeam,
  };
};

export const useTeamDetails = (teamId) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const data = await teamApi.getById(teamId);
      setTeam(data);
    } catch (err) {
      setError(err.message || "Failed to fetch team details");
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async () => {
    try {
      await teamApi.delete(teamId);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete team");
      throw err;
    }
  };

  const addMember = async (memberData) => {
    try {
      await teamApi.addMember(teamId, memberData);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to add member");
      throw err;
    }
  };

  const changeMemberRole = async (userId, role) => {
    try {
      await teamApi.changeMemberRole(teamId, userId, role);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to change member role");
      throw err;
    }
  };

  const removeMember = async (userId) => {
    try {
      await teamApi.removeMember(teamId, userId);
      await fetchTeamDetails();
    } catch (err) {
      setError(err.message || "Failed to remove member");
      throw err;
    }
  };

  return {
    team,
    loading,
    error,
    fetchTeamDetails,
    deleteTeam,
    addMember,
    changeMemberRole,
    removeMember,
  };
};

export const useTeamExpenses = (teamId) => {
  const [expenses, setExpenses] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchExpenses();
    }
  }, [teamId]);

  const fetchExpenses = async (cursor = null, limit = 20) => {
    setLoading(true);
    try {
      const data = await teamApi.getExpenses(teamId, { cursor, limit });

      if (cursor) {
        setExpenses((prev) => [...prev, ...(data.items || [])]);
      } else {
        setExpenses(data.items || []);
      }

      setHasNext(data.hasNext || false);
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      setError(err.message || "Failed to fetch team expenses");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNext && nextCursor && !loading) {
      fetchExpenses(nextCursor);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const data = await teamApi.createExpense(teamId, expenseData);
      setExpenses((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create team expense");
      throw err;
    }
  };

  const updateExpense = async (expenseId, expenseData) => {
    try {
      const data = await teamApi.updateExpense(expenseId, expenseData);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? data : exp))
      );
      return data;
    } catch (err) {
      setError(err.message || "Failed to update team expense");
      throw err;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await teamApi.deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    } catch (err) {
      setError(err.message || "Failed to delete team expense");
      throw err;
    }
  };

  return {
    expenses,
    hasNext,
    nextCursor,
    loading,
    error,
    fetchExpenses,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};

export const useTeamTimeSeriesStats = (teamId, params = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchStats();
    }
  }, [teamId, JSON.stringify(params)]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamApi.getTimeSeriesStats(teamId, params);
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch team time series stats");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export const useTeamCategoryStats = (teamId, params = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teamId) {
      fetchStats();
    }
  }, [teamId, JSON.stringify(params)]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamApi.getCategoryStats(teamId, params);
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch team category stats");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};