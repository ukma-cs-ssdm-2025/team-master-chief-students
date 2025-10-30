// src/widgets/stats/StatsCards.jsx
import { useMemo } from 'react';

export const StatsCards = ({ expenses }) => {
  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { total: 0, count: 0, average: 0 };
    }

    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    return {
      total: total.toFixed(2),
      count,
      average: average.toFixed(2)
    };
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-blue-600">${stats.total}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Transactions</h3>
        <p className="text-3xl font-bold text-green-600">{stats.count}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Average Expense</h3>
        <p className="text-3xl font-bold text-purple-600">${stats.average}</p>
      </div>
    </div>
  );
};