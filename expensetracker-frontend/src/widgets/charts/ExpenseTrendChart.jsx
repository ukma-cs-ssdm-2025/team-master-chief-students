// src/widgets/charts/ExpenseTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useStats } from '../../entities/stats';

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

const groupByPeriod = (byDate, period) => {
  if (!byDate || byDate.length === 0) return [];

  const dateMap = byDate.reduce((acc, item) => {
    const date = new Date(item.date);
    let key;

    switch (period) {
      case 'daily':
        key = date.toISOString().split('T')[0];
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

    if (!acc[key]) acc[key] = 0;
    acc[key] += item.totalAmount;

    return acc;
  }, {});

  return Object.entries(dateMap)
    .map(([date, amount]) => ({
      date: formatDateLabel(date, period),
      amount: parseFloat(amount.toFixed(2)),
      rawDate: date
    }))
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
};

export const ExpenseTrendChart = ({ period = 'daily' }) => {
  const { stats, loading, error } = useStats();

  const chartData = useMemo(() => {
    if (!stats?.byDate) return [];
    return groupByPeriod(stats.byDate, period);
  }, [stats?.byDate, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data to display
      </div>
    );
  }

  const maxAmount = Math.max(...chartData.map(d => d.amount));
  const yAxisMax = Math.ceil(maxAmount * 1.1);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value}`}
            domain={[0, yAxisMax]}
            stroke="#9ca3af"
            width={80}
          />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7, fill: '#2563eb' }}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};