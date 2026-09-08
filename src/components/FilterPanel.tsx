import { X, RotateCcw, Filter } from 'lucide-react';
import { FilterOptions } from '../types/piece';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  updateFilter: (key: keyof FilterOptions, val: string) => void;
  onReset: () => void;
  activeCount: number;
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  updateFilter,
  onReset,
  activeCount,
}: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Filtros Avançados
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Combine critérios técnicos para refinar a busca
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: filter categories */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Category: Identificação */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Identificação
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ID De (Nº)"
                  placeholder="Ex: 001"
                  value={filters.idFrom || ''}
                  onChange={(e) => updateFilter('idFrom', e.target.value)}
                />
                <Input
                  label="ID Até (Nº)"
                  placeholder="Ex: 050"
                  value={filters.idTo || ''}
                  onChange={(e) => updateFilter('idTo', e.target.value)}
                />
              </div>
            </div>

            {/* Category: Dimensões */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Dimensões
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                <Input
                  label="Altura (mm)"
                  placeholder="Ex: 180"
                  value={filters.height || ''}
                  onChange={(e) => updateFilter('height', e.target.value)}
                />
                <Input
                  label="Largura (mm)"
                  placeholder="Ex: 150"
                  value={filters.width || ''}
                  onChange={(e) => updateFilter('width', e.target.value)}
                />
                <Input
                  label="Espessura"
                  placeholder="5/16&quot;"
                  value={filters.thickness || ''}
                  onChange={(e) => updateFilter('thickness', e.target.value)}
                />
              </div>
            </div>

            {/* Category: Furos A */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Furos A
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantidade"
                  placeholder="Ex: 4"
                  value={filters.holesA_quantity || ''}
                  onChange={(e) => updateFilter('holesA_quantity', e.target.value)}
                />
                <Input
                  label="Diâmetro (mm)"
                  placeholder="Ex: 13"
                  value={filters.holesA_diameter || ''}
                  onChange={(e) => updateFilter('holesA_diameter', e.target.value)}
                />
                <Input
                  label="E.C. Horizontal"
                  placeholder="Ex: 100"
                  value={filters.holesA_centerH || ''}
                  onChange={(e) => updateFilter('holesA_centerH', e.target.value)}
                />
                <Input
                  label="E.C. Vertical"
                  placeholder="Ex: 130"
                  value={filters.holesA_centerV || ''}
                  onChange={(e) => updateFilter('holesA_centerV', e.target.value)}
                />
              </div>
            </div>

            {/* Category: Furos B */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Furos B
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantidade"
                  placeholder="Ex: 1"
                  value={filters.holesB_quantity || ''}
                  onChange={(e) => updateFilter('holesB_quantity', e.target.value)}
                />
                <Input
                  label="Diâmetro (mm)"
                  placeholder="Ex: 76"
                  value={filters.holesB_diameter || ''}
                  onChange={(e) => updateFilter('holesB_diameter', e.target.value)}
                />
                <Input
                  label="E.C. Horizontal"
                  placeholder="Ex: 75"
                  value={filters.holesB_centerH || ''}
                  onChange={(e) => updateFilter('holesB_centerH', e.target.value)}
                />
                <Input
                  label="E.C. Vertical"
                  placeholder="Ex: 90"
                  value={filters.holesB_centerV || ''}
                  onChange={(e) => updateFilter('holesB_centerV', e.target.value)}
                />
              </div>
            </div>

            {/* Category: Informações */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                Informações & Códigos
              </h3>
              <div className="space-y-3">
                <Input
                  label="PA Utilizado"
                  placeholder="Ex: PA0220846"
                  value={filters.pa || ''}
                  onChange={(e) => updateFilter('pa', e.target.value)}
                />
                <Input
                  label="Código Sistema"
                  placeholder="Ex: MP0100280"
                  value={filters.systemCode || ''}
                  onChange={(e) => updateFilter('systemCode', e.target.value)}
                />
                <Input
                  label="Observação contém"
                  placeholder="Ex: chanfro, roscado..."
                  value={filters.observation || ''}
                  onChange={(e) => updateFilter('observation', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onReset}
              disabled={activeCount === 0}
            >
              Limpar filtros
            </Button>
            <Button variant="primary" size="md" onClick={onClose}>
              Aplicar Filtros {activeCount > 0 ? `(${activeCount})` : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
