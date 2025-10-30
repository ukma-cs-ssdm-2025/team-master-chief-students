// src/widgets/charts/ChartsSection.jsx
import { useState } from 'react';
import { CategoryChart } from './CategoryChart';
import { ExpenseTrendChart } from './ExpenseTrendChart';

export const ChartsSection = ({ expenses }) => {
  const [period, setPeriod] = useState('daily');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
        <CategoryChart expenses={expenses} />
      </div>

      {/* Expense Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Expense Trend</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <ExpenseTrendChart expenses={expenses} period={period} />
      </div>
    </div>
  );
};