// src/widgets/charts/CategoryChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from 'react';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
  '#8dd1e1', '#d084d0', '#a4de6c', '#ffa07a'
];

export const CategoryChart = ({ expenses }) => {
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const categoryMap = expenses.reduce((acc, expense) => {
      const category = expense.categoryName;
      const amount = parseFloat(expense.amount) || 0;

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;

      return acc;
    }, {});

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

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

  return (
    <div className="w-full h-80">
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
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => `${value}: $${entry.payload.value.toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
