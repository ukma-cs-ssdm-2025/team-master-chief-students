// src/app/providers/index.jsx
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";
import { CategoryProvider } from "../../entities/category/model/CategoryProvider.jsx";

export const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <CategoryProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </CategoryProvider>
    </ErrorBoundary>
  );
};
