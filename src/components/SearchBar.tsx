import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/Button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
  totalResults?: number;
}

export function SearchBar({
  value,
  onChange,
  onOpenFilters,
  activeFilterCount = 0,
  totalResults,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="🔎 Pesquisar por ID, descrição, PA, código, dimensões..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-11 pr-10 py-3 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Trigger Button */}
      <Button
        variant={activeFilterCount > 0 ? 'primary' : 'outline'}
        size="lg"
        icon={<SlidersHorizontal className="w-4 h-4" />}
        onClick={onOpenFilters}
        className="relative shrink-0 py-3"
      >
        <span>Filtros</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 bg-white text-sky-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {totalResults !== undefined && (
        <div className="hidden lg:flex items-center text-xs font-mono text-slate-500 dark:text-slate-400 px-2 select-none shrink-0">
          <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">
            {totalResults}
          </span>
          peça{totalResults === 1 ? '' : 's'} encontrada{totalResults === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}
