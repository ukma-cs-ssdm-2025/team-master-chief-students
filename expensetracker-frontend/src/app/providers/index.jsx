import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./error-boundary";
import { CategoryProvider } from "@entities/category/model/CategoryProvider";
import { queryClient } from "@shared/lib/queryClient";

export const AppProvider = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <CategoryProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            {children}
          </BrowserRouter>
        </CategoryProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
