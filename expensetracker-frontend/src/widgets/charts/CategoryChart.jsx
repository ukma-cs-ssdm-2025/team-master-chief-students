// src/widgets/charts/CategoryChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo, useState } from 'react';
import { useStats } from '../../entities/stats';
import { useCategories } from '../../entities/category/model/hooks';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
  '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a'
];

export const CategoryChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { stats, loading, error } = useStats();
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    if (!stats?.byCategory || !categories) return [];

    return Object.entries(stats.byCategory)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        return {
          name: category?.name || `Category ${categoryId}`,
          value: parseFloat(amount.toFixed(2))
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [stats?.byCategory, categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
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

      {/* Custom Legend with scrolling */}
      <div className="mt-4 max-h-32 overflow-y-auto border-t pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {chartData.map((entry, index) => {
            const percent = ((entry.value / total) * 100).toFixed(1);
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