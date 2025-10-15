// src/pages/dashboard/DashboardPage.jsx
import React from "react";
import { useUser } from "../../entities/user/model/hooks";
import { useExpenses } from "../../entities/expense/model/hooks";
import { ProfileCard } from "../../entities/user/ui/ProfileCard";
import { ExpenseForm } from "../../entities/expense/ui/ExpenseForm";
import { ExpenseList } from "../../entities/expense/ui/ExpenseList";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { expenses, loading: expensesLoading, addExpense, deleteExpense, updateExpense } = useExpenses();

  if (userLoading || expensesLoading) return <p>Loading...</p>;
  if (userError) return <p>{userError}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Profile */}
      <ProfileCard user={user} />

      {/* Expense Form */}
      <ExpenseForm onAdd={addExpense} />

      {/* Expenses List */}
      <ExpenseList expenses={expenses} onDelete={deleteExpense} onUpdate={updateExpense} />
    </div>
  );
};
