import { useCategories } from '../../../../entities/category/model/hooks';

export const TeamFilter = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isOpen, 
  onToggle,
  showReceipt = false,
  showSearch = false
}) => {
  const { categories } = useCategories();

  const handleChange = (field, value) => {
    const newFilters = { ...filters };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length;

  return (
    <div className="w-full">
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
            hasActiveFilters
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Filter Panel */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Amount Range - always on new row */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Has Receipt - only if showReceipt is true */}
            {showReceipt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt
                </label>
                <select
                  value={filters.hasReceipt === undefined ? '' : filters.hasReceipt.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange('hasReceipt', value === '' ? undefined : value === 'true');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All</option>
                  <option value="true">With Receipt</option>
                  <option value="false">Without Receipt</option>
                </select>
              </div>
            )}

            {/* Search - only if showSearch is true */}
            {showSearch && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleChange('search', e.target.value)}
                  placeholder="Search in descriptions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

