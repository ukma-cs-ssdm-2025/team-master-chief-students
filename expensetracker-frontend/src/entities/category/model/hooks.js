// src/entities/category/model/hooks.js
import { useContext } from "react";
import { CategoryContext } from "./CategoryContext";

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};