import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo, useState } from 'react';
import { useCategoryStats } from '@entities/stats/model/hooks';
import { LoadingSpinner } from '@shared/ui';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
  '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a'
];

export const CategoryChart = ({ filters = {} }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { stats, loading, error } = useCategoryStats(filters);

  const chartData = useMemo(() => {
    if (!stats?.categories || stats.categories.length === 0) return [];

    return stats.categories.map(category => ({
      name: category.categoryName || `Category ${category.categoryId}`,
      value: parseFloat(category.amount.toFixed(2)),
      percentage: category.percentage
    })).sort((a, b) => b.value - a.value);
  }, [stats?.categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="md" text="Loading chart data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data to display
      </div>
    );
  }

  const renderCustomLabel = (entry) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  const total = stats?.totalAmount || chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height={280} minHeight={280} minWidth={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-shrink-0 mt-4 h-32 overflow-y-auto border-t pt-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {chartData.map((entry, index) => {
            const percent = entry.percentage ? entry.percentage.toFixed(1) : ((entry.value / total) * 100).toFixed(1);
            return (
              <div
                key={`legend-${index}`}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-sm text-gray-700 truncate"
                      title={entry.name}
                    >
                      {entry.name}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {percent}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    ${entry.value.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};