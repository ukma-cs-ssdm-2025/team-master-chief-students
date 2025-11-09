import { useState } from 'react';
import { CategoryChart } from './CategoryChart';
import { ExpenseTrendChart } from './ExpenseTrendChart';

// Define a consistent chart height for both charts
const CHART_HEIGHT_CLASS = 'h-[400px]';

export const ChartsSection = () => {
  const [period, setPeriod] = useState('daily');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
      {/* Category Distribution Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">Category Distribution</h2>
        <div className={`flex-1 ${CHART_HEIGHT_CLASS}`}>
          <CategoryChart />
        </div>
      </div>

      {/* Expense Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Expense Trend</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:border-blue-400 transition"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className={`flex-1 ${CHART_HEIGHT_CLASS}`}>
          <ExpenseTrendChart period={period} />
        </div>
      </div>
    </div>
  );
};