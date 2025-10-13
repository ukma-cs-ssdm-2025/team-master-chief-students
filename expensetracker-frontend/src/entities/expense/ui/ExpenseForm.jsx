// src/entities/expense/ui/ExpenseForm.jsx
import React, { useState } from "react";

export const ExpenseForm = ({ onAdd }) => {
  const [expense, setExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !expense.category.trim() ||
      !expense.description.trim() ||
      !expense.amount ||
      !expense.date
    ) {
      alert("Please fill in all fields");
      return;
    }

    // відправляємо тільки потрібні поля
    onAdd({
      category: expense.category,
      description: expense.description,
      amount: Number(expense.amount),
      date: expense.date,
    });

    setExpense({
      category: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow">
      <input
        type="text"
        placeholder="Category"
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={expense.description}
        onChange={(e) => setExpense({ ...expense, description: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <input
        type="date"
        value={expense.date}
        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
        className="border p-2 rounded"
        required
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
        Add Expense
      </button>
    </form>
  );
};