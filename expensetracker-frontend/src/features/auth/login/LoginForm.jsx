import React, { useState } from "react";
import { useAuth } from "../model/hooks";

export const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        console.log("Redirect to dashboard...");
      }, 2000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto border-absolute">
      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-10 rounded-xl shadow-lg w-full border border-gray-200"
          noValidate
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your credentials to continue
            </p>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-4 md:p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg placeholder-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full p-4 md:p-5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 text-sm md:text-base"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative bg-blue-500 hover:bg-blue-600 text-white p-3 md:p-4 rounded-lg font-medium text-base md:text-lg transition-colors disabled:opacity-50"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>Sign In</span>
            {loading && (
              <span className="absolute left-1/2 top-1/2 w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin -translate-x-1/2 -translate-y-1/2"></span>
            )}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-2 md:text-base">{error}</p>}
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white p-10 md:p-12 rounded-xl shadow-lg w-full text-center">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl md:text-2xl mb-4">
            ✓
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Welcome back!</h3>
          <p className="text-gray-500 text-sm md:text-base">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
};