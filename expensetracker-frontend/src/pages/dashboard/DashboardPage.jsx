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

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { expenses, loading: expensesLoading, addExpense, deleteExpense, updateExpense } = useExpenses();
  const { addCategory, updateCategory, deleteCategory } = useCategories();

  if (userLoading || expensesLoading) return <p>Loading...</p>;
  if (userError) return <p>{userError}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Profile */}
      <ProfileCard user={user} />

      {/* Categories Section */}
      <div className="mb-8">
        <CategoryForm onAdd={addCategory} />
        <CategoryList onUpdate={updateCategory} onDelete={deleteCategory} />
      </div>

      {/* Expenses Section */}
      <div>
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} onUpdate={updateExpense} />
      </div>
    </div>
  );
};