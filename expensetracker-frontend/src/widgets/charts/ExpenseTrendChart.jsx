// src/widgets/charts/ExpenseTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const formatDateLabel = (dateStr, period) => {
  const date = new Date(dateStr);

  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
    case 'weekly':
      return `Week ${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}`;
    case 'monthly':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return dateStr;
  }
};

export const ExpenseTrendChart = ({ expenses, period = 'daily' }) => {
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Group expenses by dates
    const dateMap = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date || expense.createdAt);
      let key;

      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      const amount = parseFloat(expense.amount) || 0;

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += amount;

      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.entries(dateMap)
      .map(([date, amount]) => ({
        date: formatDateLabel(date, period),
        amount: parseFloat(amount.toFixed(2)),
        rawDate: date
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [expenses, period]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Expenses']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};