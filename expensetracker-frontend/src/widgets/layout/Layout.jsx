import React from "react";
import { Navigation } from "@widgets/navigation/Navigation";

export const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="flex-1 flex flex-col">
      <div className="p-6">
        <Navigation />
      </div>
      <main className="flex-1 px-6 pb-6">{children}</main>
    </div>
  </div>
);
