import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useTimeSeriesStats } from '@entities/stats/model/hooks';
import { LoadingSpinner } from '@shared/ui';

const formatDateLabel = (dateStr, period) => {
  const date = new Date(dateStr);

  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
    case 'weekly':
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}`;
    case 'monthly':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    default:
      return dateStr;
  }
};

const groupByPeriod = (byPeriod, period) => {
  if (!byPeriod || byPeriod.length === 0) return [];

  if (period === 'daily') {
    return byPeriod.map(item => ({
      date: formatDateLabel(item.date, 'daily'),
      amount: parseFloat(item.totalAmount.toFixed(2)),
      count: item.count,
      rawDate: item.date
    })).sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }

  const dateMap = byPeriod.reduce((acc, item) => {
    const date = new Date(item.date);
    let key;

    switch (period) {
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        weekStart.setHours(0, 0, 0, 0);
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!acc[key]) {
      acc[key] = { totalAmount: 0, count: 0, date: key };
    }
    acc[key].totalAmount += item.totalAmount;
    acc[key].count += item.count;

    return acc;
  }, {});

  return Object.entries(dateMap)
    .map(([date, data]) => {
      let formattedDate;
      if (period === 'monthly' && date.includes('-') && date.split('-').length === 2) {
        const [year, month] = date.split('-');
        const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        formattedDate = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        formattedDate = formatDateLabel(date, period);
      }
      return {
        date: formattedDate,
        amount: parseFloat(data.totalAmount.toFixed(2)),
        count: data.count,
        rawDate: date
      };
    })
    .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
};

export const ExpenseTrendChart = ({ period = 'daily', filters = {} }) => {
  const effectiveFilters = useMemo(() => {
    const today = new Date();
    const toDate = today.toISOString().split('T')[0];
    
    if (period === 'daily') {
      // Last month for daily
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      const fromDate = lastMonth.toISOString().split('T')[0];

      return {
        ...filters,
        fromDate,
        toDate
      };
    } else if (period === 'weekly') {
      // Last year for weekly
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      const fromDate = lastYear.toISOString().split('T')[0];

      return {
        ...filters,
        fromDate,
        toDate
      };
    } else if (period === 'monthly') {
      // All time for monthly - remove date filters if they exist
      const { fromDate, toDate, ...restFilters } = filters;
      return restFilters;
    }

    return filters;
  }, [period, filters]);

  const { stats, loading, error } = useTimeSeriesStats(effectiveFilters);

  const chartData = useMemo(() => {
    if (!stats?.byPeriod) return [];
    return groupByPeriod(stats.byPeriod, period);
  }, [stats?.byPeriod, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading chart data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500">
        No data to display
      </div>
    );
  }

  const maxAmount = Math.max(...chartData.map(d => d.amount), 0);
  const yAxisMax = maxAmount > 0 ? Math.ceil(maxAmount * 1.1) : 100;

  return (
    <div className="w-full h-full min-h-[400px] min-w-0">
      <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={0}>
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
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
            formatter={(value, name) => {
              if (name === 'amount') {
                return [`$${value.toFixed(2)}`, 'Total Amount'];
              }
              return [value, name];
            }}
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