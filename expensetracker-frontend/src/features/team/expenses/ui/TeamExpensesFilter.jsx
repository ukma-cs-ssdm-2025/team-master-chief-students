// src/features/team/expenses/ui/TeamExpensesFilter.jsx
import { TeamFilter } from '@features/team/shared/ui/TeamFilter';

export const TeamExpensesFilter = ({ filters, onFiltersChange, onReset, isOpen, onToggle }) => {
  return (
    <TeamFilter
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      isOpen={isOpen}
      onToggle={onToggle}
      showReceipt={false}
      showSearch={false}
    />
  );
};

