// src/features/auth/model/hooks.js
import { useState } from "react";
import { authApi } from "./api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        const { accessToken, refreshToken } = response.data;
        // зберігаємо токени
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // переходимо на дашборд
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
