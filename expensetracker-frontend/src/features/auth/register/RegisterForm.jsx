import React, { useState } from "react";
import { useAuth } from "@features/auth/model/hooks";
import { useMultiAccount } from "@features/auth/model/useMultiAccount";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/hooks/useToast";
import { Toast } from "@shared/ui";
import { env } from "@shared/config";
import { validateForm, validators } from "@shared/lib";

export const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const { addAccountAfterAuth } = useMultiAccount();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast, showError, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { username, email, password, confirmPassword };
    const validationRules = {
      username: [
        validators.required('Username is required'),
        validators.minLength(3)('Username must be at least 3 characters'),
        validators.maxLength(20)('Username must be less than 20 characters'),
      ],
      email: [
        validators.required('Email is required'),
        validators.email('Invalid email format'),
      ],
      password: [
        validators.required('Password is required'),
        validators.password('Password must be at least 6 characters'),
      ],
      confirmPassword: [
        validators.required('Please confirm your password'),
        validators.passwordMatch(password)('Passwords do not match'),
      ],
    };

    const { errors: validationErrors, isValid } = validateForm(formData, validationRules);

    if (!isValid) {
      setErrors(validationErrors);
      showError(Object.values(validationErrors)[0]);
      return;
    }

    setErrors({});

    const result = await register({ username, email, password });

    if (result?.data?.accessToken) {
      await addAccountAfterAuth(
        email,
        result.data.accessToken,
        result.data.refreshToken
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, env.REGISTER_REDIRECT_DELAY_MS);
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
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors({ ...errors, username: null });
            }}
            className={`p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            className={`p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: null });
              if (errors.confirmPassword && confirmPassword) {
                setErrors({ ...errors, confirmPassword: null });
              }
            }}
            className={`p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
            }}
            className={`p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};
