// src/pages/dashboard/DashboardPage.jsx
import React from "react";
import { useUser } from "../../entities/user/model/hooks";
import { useExpenses } from "../../entities/expense/model/hooks";
import { useCategories } from "../../entities/category/model/hooks";
import { ProfileCard } from "../../entities/user/ui/ProfileCard";
import { ExpenseForm } from "../../entities/expense/ui/ExpenseForm";
import { ExpenseList } from "../../entities/expense/ui/ExpenseList";
import { CategoryForm } from "../../entities/category/ui/CategoryForm";
import { CategoryList } from "../../entities/category/ui/CategoryList";
import { StatsCards } from "../../widgets/stats/StatsCards";
import { ChartsSection } from "../../widgets/charts/ChartsSection";
import { ExpenseExport } from "../../features/expense/export";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const {
    expenses,
    loading: expensesLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt
  } = useExpenses();
  const { addCategory, updateCategory, deleteCategory } = useCategories();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <ProfileCard user={user} />
      <StatsCards expenses={expenses} />
      <ChartsSection expenses={expenses} />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <CategoryForm onAdd={addCategory} />
        <CategoryList onUpdate={updateCategory} onDelete={deleteCategory} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Expenses</h2>
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          onUpdate={updateExpense}
          onUploadReceipt={uploadReceipt}
          onDeleteReceipt={deleteReceipt}
        />
      </div>

      <ExpenseExport />
    </div>
  );
};