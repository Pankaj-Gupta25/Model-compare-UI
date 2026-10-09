import { useState, useMemo } from 'react';
import type { FilterState, SortField, SortOrder } from '../types';

const DEFAULT_FILTER: FilterState = {
  searchQuery: '',
  selectedTags: [],
  sortField: 'overall',
  sortOrder: 'desc',
};

export const useFilters = (initialState?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTER, ...initialState });

  const setSearch = (searchQuery: string) =>
    setFilters((prev) => ({ ...prev, searchQuery }));

  const toggleTag = (tag: string) =>
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));

  const setSortField = (sortField: SortField) =>
    setFilters((prev) => ({
      ...prev,
      sortField,
      sortOrder: prev.sortField === sortField && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));

  const setSortOrder = (sortOrder: SortOrder) =>
    setFilters((prev) => ({ ...prev, sortOrder }));

  const resetFilters = () => setFilters({ ...DEFAULT_FILTER, ...initialState });

  const hasActiveFilters = useMemo(
    () =>
      filters.searchQuery !== '' ||
      filters.selectedTags.length > 0 ||
      filters.sortField !== 'overall' ||
      filters.sortOrder !== 'desc',
    [filters],
  );

  return { filters, setSearch, toggleTag, setSortField, setSortOrder, resetFilters, hasActiveFilters };
};
