import React, { useState } from "react";
import { useAuth } from "../model/hooks";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ onSwitchToRegister }) => {
  const { login, loading, error } = useAuth();
  const { addAccountAfterAuth } = useMultiAccount();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result?.success) {
      if (result.data?.accessToken) {
        // Добавляем аккаунт в систему множественных аккаунтов
        await addAccountAfterAuth(
          email,
          result.data.accessToken,
          result.data.refreshToken
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-10 rounded-xl shadow-lg w-full border border-gray-200"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full p-4 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>Sign In</span>
            {loading && (
              <span className="absolute left-1/2 top-1/2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin -translate-x-1/2 -translate-y-1/2"></span>
            )}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl shadow-lg w-full text-center">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl mb-4">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Welcome back!
          </h3>
          <p className="text-gray-500 text-sm">
            Redirecting to your dashboard...
          </p>
        </div>
      )}
    </div>
  );
};