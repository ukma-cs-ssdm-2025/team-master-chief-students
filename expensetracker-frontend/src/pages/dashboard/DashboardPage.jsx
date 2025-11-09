// src/pages/dashboard/DashboardPage.jsx
import React, { useState } from "react";
import { useUser } from "../../entities/user/model/hooks";
import { useExpenses } from "../../entities/expense/model/hooks";
import { useCategories } from "../../entities/category/model/hooks";
import { ProfileCard } from "../../entities/user/ui/ProfileCard";
import { ExpenseForm } from "../../entities/expense/ui/ExpenseForm";
import { ExpenseList } from "../../entities/expense/ui/ExpenseList";
import { CategoryForm } from "../../entities/category/ui/CategoryForm";
import { CategoryList } from "../../entities/category/ui/CategoryList";
import { StatsCards } from "../../widgets/stats/StatsCards";
import { ChartsSection } from "../../widgets/charts/ChartsSection";
import { Navigation } from "../../widgets/navigation/Navigation";
import { ExpenseExport } from "../../features/expense/export/ui/ExpenseExport";
import { DashboardFilter } from "../../features/dashboard/ui/DashboardFilter";
import { useDebounce } from "../../shared/hooks/useDebounce";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce filters to avoid too many API calls while typing
  const debouncedFilters = useDebounce(filters, 500);

  const {
    expenses,
    hasNext,
    loading: expensesLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    uploadReceipt,
    deleteReceipt,
    loadMore,
  } = useExpenses(debouncedFilters);

  const { addCategory, updateCategory, deleteCategory } = useCategories();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  // Only show full screen loading for initial user load, not for expense filtering
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4">
          {userError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex-1 w-full min-h-0 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full h-full overflow-hidden">

          {/* LEFT COLUMN */}
          <div className="h-full overflow-y-auto space-y-4">

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
              <CategoryForm onAdd={addCategory} />
              <div className="mt-6">
                <CategoryList
                  onUpdate={updateCategory}
                  onDelete={deleteCategory}
                />
              </div>
            </div>

            <ExpenseExport />
          </div>

          {/* CENTER COLUMN */}
          <div className="lg:col-span-2 h-full overflow-y-auto space-y-4">

            <StatsCards expenses={expenses} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ChartsSection />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Expenses</h2>
              </div>
              
              <DashboardFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />

              <ExpenseList
                expenses={expenses}
                hasNext={hasNext}
                loading={expensesLoading}
                onDelete={deleteExpense}
                onUpdate={updateExpense}
                onUploadReceipt={uploadReceipt}
                onDeleteReceipt={deleteReceipt}
                onLoadMore={loadMore}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="h-full overflow-y-auto space-y-4">

            <ProfileCard user={user} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Add Expense</h2>
              <ExpenseForm onAdd={addExpense} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};