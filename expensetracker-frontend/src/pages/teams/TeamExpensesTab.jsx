import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useTeamExpenses } from "@entities/team";
import { TeamExpensesList } from "@features/team/expenses/ui/TeamExpensesList";
import { CreateTeamExpenseForm } from "@features/team/expenses/ui/CreateTeamExpenseForm";

export const TeamExpensesTab = () => {
  const { teamId } = useParams();
  const { team, userRole, currentUserId } = useOutletContext();

  const {
    expenses,
    hasNext,
    loading: expensesLoading,
    error: expensesError,
    loadMore,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useTeamExpenses(parseInt(teamId));

  const canManage = userRole === "OWNER" || userRole === "ADMIN";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {canManage && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Expense</h2>
          <CreateTeamExpenseForm onCreate={createExpense} />
        </div>
      )}

      <div className={canManage ? "border-t pt-6" : ""}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Expenses</h2>

        {expensesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {expensesError}
          </div>
        )}

        <TeamExpensesList
          expenses={expenses}
          hasNext={hasNext}
          onLoadMore={loadMore}
          loading={expensesLoading}
          onUpdate={updateExpense}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
};

