import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./app/providers/index";
import { App } from "./app/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
