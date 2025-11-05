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
import { Navigation } from "../../widgets/navigation/Navigation";

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

  if (userLoading || expensesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {userError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <ProfileCard user={user} />
        <StatsCards expenses={expenses} />
        <ChartsSection expenses={expenses} />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <CategoryForm onAdd={addCategory} />
          <CategoryList onUpdate={updateCategory} onDelete={deleteCategory} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Personal Expenses</h2>
          <ExpenseForm onAdd={addExpense} />
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onUpdate={updateExpense}
            onUploadReceipt={uploadReceipt}
            onDeleteReceipt={deleteReceipt}
          />
        </div>
      </div>
    </div>
  );
};