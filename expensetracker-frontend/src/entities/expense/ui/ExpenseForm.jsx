// src/entities/expense/ui/ExpenseForm.jsx
import React, { useState } from "react";
import { useCategories } from "../../category/model/hooks";

export const ExpenseForm = ({ onAdd }) => {
  const { categories, loading, error } = useCategories();

  const [expense, setExpense] = useState({
    categoryId: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

   const handleSubmit = (e) => {
     e.preventDefault();

     if (!expense.categoryId || !expense.description.trim() || !expense.amount || !expense.date) {
       alert("Please fill in all fields");
       return;
     }

     const selectedCategory = categories.find(cat => cat.id === Number(expense.categoryId));

     onAdd({
       categoryId: selectedCategory?.id,
       categoryName: selectedCategory?.name,
       description: expense.description,
       amount: Number(expense.amount),
       date: expense.date,
     });

     setExpense({
       categoryId: "",
       description: "",
       amount: "",
       date: new Date().toISOString().split("T")[0],
     });
   };


  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow"
    >
      {loading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <select
        value={expense.categoryId}
        onChange={(e) => setExpense({ ...expense, categoryId: e.target.value })}
        className="border p-2 rounded"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

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

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600 transition"
      >
        Add Expense
      </button>
    </form>
  );
};
