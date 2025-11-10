import { useState, useEffect } from "react";
import { axiosInstance } from "@shared/api/axiosInstance";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/v1/users/me");
      setUser(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, fetchUser };
};