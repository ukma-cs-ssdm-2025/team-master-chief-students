import React, { useState } from "react";
import { LoginForm } from "../../features/auth/login/LoginForm";
import { RegisterForm } from "../../features/auth/register/RegisterForm";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      {isRegister ? (
        <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </div>
  );
};
