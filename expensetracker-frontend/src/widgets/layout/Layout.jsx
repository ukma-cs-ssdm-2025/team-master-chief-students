import React from "react";

export const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);
