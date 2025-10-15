import { useState } from "react";
import { login, register } from "./api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await login(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await register(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login: loginUser,
    register: registerUser,
    loading,
    error,
  };
};
