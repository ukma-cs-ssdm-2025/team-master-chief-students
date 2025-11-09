import { useState, useEffect } from "react";
import { statsApi } from "./api";
import { getActiveAccount } from "../../../shared/lib/multiAccountStorage";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    // Check if user is authenticated before fetching
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      console.log("No auth token, skipping stats fetch");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await statsApi.getStats();
      setStats(data);
    } catch (err) {
      // Only set error if it's not an auth error (401/403)
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.message || "Failed to fetch statistics");
      }
      console.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if authenticated
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      fetchStats();
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export const useTimeSeriesStats = (params = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(params)]);

  const fetchStats = async () => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await statsApi.getTimeSeriesStats(params);
      setStats(data);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.message || "Failed to fetch time series stats");
      }
      console.error("Time series stats fetch error:", err);
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

export const useCategoryStats = (params = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [JSON.stringify(params)]);

  const fetchStats = async () => {
    const activeAccount = getActiveAccount();
    const token = activeAccount?.accessToken || localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await statsApi.getCategoryStats(params);
      setStats(data);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.message || "Failed to fetch category stats");
      }
      console.error("Category stats fetch error:", err);
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