import React, { useState } from "react";
import { useAuth } from "../model/hooks";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const { addAccountAfterAuth } = useMultiAccount();
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // 🧍‍♂️ додали username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await register({ username, email, password }); // 🧠 передаємо username

    if (result?.data?.accessToken) {
      // Добавляем аккаунт в систему множественных аккаунтов
      await addAccountAfterAuth(
        email,
        result.data.accessToken,
        result.data.refreshToken
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl mb-4">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Account created successfully!
        </h3>
        <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
        Create Account
      </h2>
      <p className="text-gray-500 text-sm text-center mb-6">
        Fill in the details to sign up
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};
