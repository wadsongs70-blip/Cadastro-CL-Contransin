import { useState, useCallback, useMemo } from 'react';
import { FilterOptions } from '../types/piece';

const initialFilters: FilterOptions = {
  search: '',
  idFrom: '',
  idTo: '',
  height: '',
  width: '',
  thickness: '',
  holesA_quantity: '',
  holesA_diameter: '',
  holesA_centerH: '',
  holesA_centerV: '',
  holesB_quantity: '',
  holesB_diameter: '',
  holesB_centerH: '',
  holesB_centerV: '',
  pa: '',
  systemCode: '',
  observation: '',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = useCallback((key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, val]) => {
      if (key === 'search') return false; // search is handled in main input
      return Boolean(val && val.trim() !== '');
    });
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, val]) => {
      if (key === 'search') return false;
      return Boolean(val && val.trim() !== '');
    }).length;
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
  };
}
