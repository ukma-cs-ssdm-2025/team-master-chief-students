// src/pages/not-found/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-300 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center px-4">
      {/* 404 Number with glow effect */}
      <div className="mb-8">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 drop-shadow-lg">
          404
        </h1>
        <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-400 rounded-full"></div>
      </div>

      {/* Message */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist. Let's get you back on track.
      </p>

      {/* Button */}
      <Link
        to="/dashboard"
        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
      >
        <span className="relative z-10">Back to Dashboard</span>
        <svg
          className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </div>

    {/* Floating particles effect */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-ping delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-sky-400 rounded-full opacity-30 animate-ping delay-1000"></div>
      <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-ping delay-700"></div>
    </div>

    {/* Abstract decorative shapes */}
    <div className="absolute top-10 right-10 w-20 h-20 border-4 border-blue-200 rounded-lg rotate-12 opacity-50"></div>
    <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-cyan-200 rounded-full opacity-50"></div>
  </div>
);