// src/pages/dashboard/DashboardPage.jsx
import React from "react";
import { useState } from "react";
import { useUser } from "../../entities/user/model/hooks";
import { useExpenses } from "../../entities/expense/model/hooks";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { expenses, loading: expensesLoading, addExpense } = useExpenses();

  const [newExpense, setNewExpense] = useState({ title: "", amount: "" });

  const handleAddExpense = (e) => {
    e.preventDefault();
    addExpense({ ...newExpense, amount: Number(newExpense.amount) });
    setNewExpense({ title: "", amount: "" });
  };

  if (userLoading || expensesLoading) return <p>Loading...</p>;
  if (userError) return <p>{userError}</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Expense title"
          value={newExpense.title}
          onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="border p-2 rounded w-24"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add
        </button>
      </form>

      {/* Expenses List */}
      <ul className="border rounded p-4">
        {expenses.map((exp) => (
          <li key={exp.id} className="flex justify-between border-b py-2">
            <span>{exp.title}</span>
            <span>${exp.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

