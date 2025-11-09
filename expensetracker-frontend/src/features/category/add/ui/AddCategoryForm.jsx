import React, { useState } from "react";
import { useCategories } from "@entities/category";

export const AddCategoryForm = () => {
  const { addCategory } = useCategories();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addCategory({ name });
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New category name"
        className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add
      </button>
    </form>
  );
};
