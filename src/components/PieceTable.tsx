import React from 'react';
import { Piece, SortDirection, SortField } from '../types/piece';
import { PieceRow } from './PieceRow';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Copy,
  Layers,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface PieceTableProps {
  pieces: Piece[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onView: (piece: Piece) => void;
  onEdit: (piece: Piece) => void;
  onDuplicate: (piece: Piece) => void;
  onDelete: (piece: Piece) => void;
  onBatchDelete: () => void;
  onBatchExport: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PieceTable({
  pieces,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onBatchDelete,
  onBatchExport,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PieceTableProps) {
  // Pagination calculations
  const totalItems = pieces.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPieces = pieces.slice(startIndex, startIndex + pageSize);

  const allSelected =
    paginatedPieces.length > 0 &&
    paginatedPieces.every((p) => selectedIds.includes(p.id));

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-sky-500 ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-sky-500 ml-1" />
    );
  };

  return (
    <div className="space-y-3">
      {/* Batch Selection Sticky Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-sky-900 dark:text-sky-200 font-medium">
            <span className="bg-sky-600 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {selectedIds.length}
            </span>
            <span>peça{selectedIds.length === 1 ? '' : 's'} selecionada{selectedIds.length === 1 ? '' : 's'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              onClick={onBatchExport}
            >
              Exportar Selecionadas
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={onBatchDelete}
            >
              Excluir
            </Button>
            <button
              onClick={onClearSelection}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-2"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Table Container */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 select-none">
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                    title="Selecionar todas desta página"
                  />
                </th>

                <th
                  onClick={() => onSort('id')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <span>ID</span>
                    {renderSortIcon('id')}
                  </div>
                </th>

                <th
                  onClick={() => onSort('description')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <span>Peça / Descrição</span>
                    {renderSortIcon('description')}
                  </div>
                </th>

                <th
                  onClick={() => onSort('height')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <span>Dimensões (A × L)</span>
                    {renderSortIcon('height')}
                  </div>
                </th>

                <th
                  onClick={() => onSort('thickness')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <span>Espessura</span>
                    {renderSortIcon('thickness')}
                  </div>
                </th>

                <th className="px-4 py-3">Furos A</th>
                <th className="px-4 py-3">Furos B</th>
                <th className="px-4 py-3">PA</th>
                <th className="px-4 py-3">Cód. Sistema</th>

                <th
                  onClick={() => onSort('createdAt')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center">
                    <span>Cadastro</span>
                    {renderSortIcon('createdAt')}
                  </div>
                </th>

                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedPieces.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Layers className="w-8 h-8 opacity-40" />
                      <p className="font-medium text-slate-600 dark:text-slate-400">
                        Nenhuma peça encontrada para os critérios informados.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPieces.map((piece) => (
                  <PieceRow
                    key={piece.id}
                    piece={piece}
                    isSelected={selectedIds.includes(piece.id)}
                    onToggleSelect={onToggleSelect}
                    onView={onView}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout Fallback */}
      <div className="block md:hidden space-y-3">
        {paginatedPieces.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            Nenhuma peça encontrada.
          </div>
        ) : (
          paginatedPieces.map((piece) => {
            const isSelected = selectedIds.includes(piece.id);
            return (
              <div
                key={piece.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-sky-50/70 border-sky-400 dark:bg-sky-950/40 dark:border-sky-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(piece.id)}
                      className="w-4 h-4 rounded text-sky-600 cursor-pointer"
                    />
                    <Badge variant="blue" size="md">
                      {piece.id}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDate(piece.createdAt)}
                  </span>
                </div>

                <div
                  onClick={() => onView(piece)}
                  className="font-bold text-slate-900 dark:text-white text-base cursor-pointer mb-2"
                >
                  {piece.description}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DIMENSÕES</span>
                    <span>{piece.height || '-'} × {piece.width || '-'} mm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESPESSURA</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{piece.thickness || '-'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => onView(piece)}>
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Edit3 className="w-4 h-4" />} onClick={() => onEdit(piece)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />} onClick={() => onDuplicate(piece)}>
                    Duplicar
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-rose-500" />} onClick={() => onDelete(piece)}>
                    Excluir
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
          <span className="hidden sm:inline">
            Total: <strong>{totalItems}</strong> peças
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
