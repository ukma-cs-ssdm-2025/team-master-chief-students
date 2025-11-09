// src/features/team/analytics/ui/TeamAnalyticsFilter.jsx
import { TeamFilter } from '@features/team/shared/ui/TeamFilter';

export const TeamAnalyticsFilter = ({ filters, onFiltersChange, onReset, isOpen, onToggle }) => {
  return (
    <TeamFilter
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      isOpen={isOpen}
      onToggle={onToggle}
      showReceipt={true}
      showSearch={true}
    />
  );
};

