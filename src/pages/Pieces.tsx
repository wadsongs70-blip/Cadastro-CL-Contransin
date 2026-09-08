import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePieces } from '../hooks/usePieces';
import { useFilters } from '../hooks/useFilters';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { PieceTable } from '../components/PieceTable';
import { PieceDetailsModal } from '../components/PieceDetailsModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Piece, SortDirection, SortField } from '../types/piece';
import { matchesFilters, sortPieces } from '../utils/search';
import { exportPiecesToExcel } from '../services/excel';
import { useToast } from '../components/ui/Toast';

interface PiecesPageProps {
  globalSearchQuery?: string;
  onGlobalSearchChange?: (val: string) => void;
}

export function Pieces({ globalSearchQuery = '', onGlobalSearchChange }: PiecesPageProps) {
  const navigate = useNavigate();
  const { pieces, removePiece, duplicate } = usePieces();
  const { filters, setFilters, updateFilter, resetFilters, activeFilterCount, isOpen: filterOpen, setIsOpen: setFilterOpen } = useFilters();
  const { showToast } = useToast();

  // Search query sync with header or local state
  const [localSearch, setLocalSearch] = useState(globalSearchQuery);
  const searchQuery = globalSearchQuery || localSearch;

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (onGlobalSearchChange) {
      onGlobalSearchChange(val);
    }
  };

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal states
  const [viewPiece, setViewPiece] = useState<Piece | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Piece | null>(null);
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & search pipeline
  const filteredPieces = useMemo(() => {
    const combinedFilters = {
      ...filters,
      search: searchQuery,
    };
    const matched = pieces.filter((p) => matchesFilters(p, combinedFilters));
    return sortPieces(matched, sortField, sortDirection);
  }, [pieces, filters, searchQuery, sortField, sortDirection]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const pageItems = filteredPieces.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const pageIds = pageItems.map((p) => p.id);
    const allSelectedOnPage = pageIds.every((id) => selectedIds.includes(id));

    if (allSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Row action handlers
  const handleView = (piece: Piece) => {
    setViewPiece(piece);
  };

  const handleEdit = (piece: Piece) => {
    navigate(`/editar/${piece.id}`);
  };

  const handleDuplicate = async (piece: Piece) => {
    try {
      const duplicated = await duplicate(piece.id);
      navigate(`/editar/${duplicated.id}`);
    } catch {
      // toast shown in hook
    }
  };

  const handleDeletePrompt = (piece: Piece) => {
    setDeleteCandidate(piece);
  };

  const handleConfirmSingleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await removePiece(deleteCandidate.id);
      setDeleteCandidate(null);
      if (viewPiece?.id === deleteCandidate.id) {
        setViewPiece(null);
      }
    } catch {
      // toast handled
    }
  };

  const handleBatchDelete = async () => {
    try {
      for (const id of selectedIds) {
        await removePiece(id);
      }
      showToast(`✓ ${selectedIds.length} peças excluídas com sucesso.`, 'info');
      setSelectedIds([]);
      setBatchDeleteOpen(false);
    } catch {
      showToast('Erro ao excluir peças selecionadas.', 'error');
    }
  };

  const handleBatchExport = () => {
    const selected = pieces.filter((p) => selectedIds.includes(p.id));
    if (selected.length === 0) return;
    exportPiecesToExcel(selected, {
      fileName: `Pecas_Selecionadas_${selected.length}_CL.xlsx`,
    });
    showToast(`✓ ${selected.length} peças exportadas para Excel com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search Bar & Filter Drawer Controls */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onOpenFilters={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        totalResults={filteredPieces.length}
      />

      {/* Main Table */}
      <PieceTable
        pieces={filteredPieces}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDeletePrompt}
        onBatchDelete={() => setBatchDeleteOpen(true)}
        onBatchExport={handleBatchExport}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Advanced Filter Slide-over Drawer */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        updateFilter={updateFilter}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      />

      {/* Technical Spec Sheet Modal */}
      <PieceDetailsModal
        piece={viewPiece}
        isOpen={Boolean(viewPiece)}
        onClose={() => setViewPiece(null)}
        onEdit={(p) => {
          setViewPiece(null);
          handleEdit(p);
        }}
        onDuplicate={(p) => {
          setViewPiece(null);
          handleDuplicate(p);
        }}
        onDelete={(p) => {
          setViewPiece(null);
          handleDeletePrompt(p);
        }}
      />

      {/* Single Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmSingleDelete}
        title={`Excluir peça ${deleteCandidate?.id}?`}
        description={
          <div>
            Tem certeza de que deseja remover a peça{' '}
            <strong className="text-slate-900 dark:text-white">
              {deleteCandidate?.description} ({deleteCandidate?.id})
            </strong>{' '}
            permanentemente do catálogo? Esta ação não poderá ser desfeita.
          </div>
        }
      />

      {/* Batch Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={batchDeleteOpen}
        onClose={() => setBatchDeleteOpen(false)}
        onConfirm={handleBatchDelete}
        title={`Excluir ${selectedIds.length} peças selecionadas?`}
        description={`Todas as ${selectedIds.length} peças selecionadas serão permanentemente removidas do banco de dados local. Esta ação não poderá ser desfeita.`}
      />
    </div>
  );
}
