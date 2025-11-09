import { useState, useEffect } from "react";
import { statsApi } from "./api";
import { getAuthToken, logger } from "@shared/lib";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    const token = getAuthToken();

    if (!token) {
      logger.debug("No auth token, skipping stats fetch");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await statsApi.getStats();
      setStats(data);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.message || "Failed to fetch statistics");
      }
      logger.error("Stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();

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
    const token = getAuthToken();

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
      logger.error("Time series stats fetch error:", err);
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
    const token = getAuthToken();

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
      logger.error("Category stats fetch error:", err);
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