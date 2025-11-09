// src/widgets/stats/StatsCards.jsx
import { useStats } from '@entities/stats';
import { Icon } from '@shared/ui/Icon';

export const StatsCards = () => {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { totalAmount = 0, count = 0 } = stats;
  const average = count > 0 ? (totalAmount / count).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Total Expenses</h3>
          <Icon name="dollar" className="w-8 h-8 opacity-80" />
        </div>
        <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Transactions</h3>
          <Icon name="file" className="w-8 h-8 opacity-80" />
        </div>
        <p className="text-3xl font-bold">{count}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Average</h3>
          <Icon name="chart" className="w-8 h-8 opacity-80" />
        </div>
        <p className="text-3xl font-bold">${average}</p>
      </div>
    </div>
  );
};