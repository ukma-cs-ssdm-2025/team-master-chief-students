// src/features/team/expenses/ui/TeamExpensesFilter.jsx
import { TeamFilter } from '../../shared/ui/TeamFilter';

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

