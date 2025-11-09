import { TeamFilter } from '../../team/shared/ui/TeamFilter';

export const DashboardFilter = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isOpen, 
  onToggle 
}) => {
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

