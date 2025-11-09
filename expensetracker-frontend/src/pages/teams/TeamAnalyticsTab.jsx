import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { TeamExpenseTrendChart, TeamCategoryChart } from "@widgets/charts";
import { TeamAnalyticsFilter } from "@features/team/analytics";

export const TeamAnalyticsTab = () => {
  const { teamId } = useParams();
  const [chartPeriod, setChartPeriod] = useState("daily");
  const [filters, setFilters] = useState({});
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      <TeamAnalyticsFilter
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => setFilters({})}
        isOpen={isAnalyticsFilterOpen}
        onToggle={() => setIsAnalyticsFilterOpen(!isAnalyticsFilterOpen)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col min-w-0 w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex-shrink-0">Category Distribution</h2>
          <div className="w-full flex-1 min-h-0 overflow-hidden">
            <TeamCategoryChart teamId={parseInt(teamId)} filters={filters} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col min-w-0 w-full">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-900">Expense Trend</h2>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm hover:border-blue-400 transition"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="w-full h-[400px] min-h-[400px]">
            <TeamExpenseTrendChart teamId={parseInt(teamId)} period={chartPeriod} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

