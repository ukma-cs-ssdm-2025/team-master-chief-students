import React from "react";
import { LoginForm } from "../../features/auth/login/LoginForm";

export const AuthPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};
