import React, { useState } from "react";
import { useUser, ProfileCard } from "@entities/user";
import { useExpenses } from "@entities/expense";
import { useCategories } from "@entities/category";
import { ExpenseForm, ExpenseList } from "@entities/expense";
import { CategoryForm, CategoryList } from "@entities/category";
import { StatsCards } from "@widgets/stats/StatsCards";
import { ChartsSection } from "@widgets/charts";
import { ExpenseExport } from "@features/expense/export/ui/ExpenseExport";
import { DashboardFilter } from "@features/dashboard/ui/DashboardFilter";
import { useDebounce } from "@shared/hooks/useDebounce";
import { LoadingSpinner } from "@shared/ui";

export const DashboardPage = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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
    loadReceipt,
    isReceiptLoading,
  } = useExpenses(debouncedFilters);

  const { addCategory, updateCategory, deleteCategory } = useCategories();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (userLoading) {
    return <LoadingSpinner size="xl" fullScreen text="Loading dashboard..." />;
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
    <div className="flex flex-col">
      <div className="flex-1 w-full min-h-0">
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
                onLoadReceipt={loadReceipt}
                isReceiptLoading={isReceiptLoading}
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