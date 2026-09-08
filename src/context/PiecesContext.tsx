import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Piece } from '../types/piece';
import { database } from '../services/database';
import { useToast } from '../components/ui/Toast';
import { calculateNextFullId } from '../utils/generateId';

interface PiecesContextType {
  pieces: Piece[];
  loading: boolean;
  error: string | null;
  nextId: string;
  lastPiece: Piece | null;
  piecesTodayCount: number;
  totalPieces: number;
  refresh: () => Promise<void>;
  addPiece: (piece: Piece) => Promise<Piece>;
  editPiece: (piece: Piece) => Promise<Piece>;
  removePiece: (id: string) => Promise<boolean>;
  duplicate: (sourceId: string) => Promise<Piece>;
  removeDemo: () => Promise<number>;
  clearAllData: () => Promise<void>;
}

const PiecesContext = createContext<PiecesContextType | undefined>(undefined);

export function PiecesProvider({ children }: { children: React.ReactNode }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadPieces = useCallback(async () => {
    try {
      setLoading(true);
      await database.init();
      const all = await database.getAllPieces();
      setPieces(all);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar banco de dados.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    loadPieces();
  }, [loadPieces]);

  // Listen for multi-tab synchronization events
  useEffect(() => {
    const unsubscribe = database.onSync(() => {
      loadPieces();
    });
    return unsubscribe;
  }, [loadPieces]);

  // Dynamically calculate the next available ID from current pieces
  const nextId = useMemo(() => calculateNextFullId(pieces.map((p) => p.id)), [pieces]);

  // Identify last created/registered piece
  const lastPiece = useMemo(() => {
    if (pieces.length === 0) return null;
    return [...pieces].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [pieces]);

  // Count pieces registered today
  const piecesTodayCount = useMemo(() => {
    return pieces.filter((p) => {
      try {
        const d = new Date(p.createdAt);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      } catch {
        return false;
      }
    }).length;
  }, [pieces]);

  const addPiece = async (piece: Piece): Promise<Piece> => {
    try {
      const created = await database.createPiece(piece);
      setPieces((prev) => [...prev, created]);
      showToast(`✓ Peça ${piece.id} cadastrada com sucesso!`, 'success');
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao cadastrar peça.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const editPiece = async (piece: Piece): Promise<Piece> => {
    try {
      const updated = await database.updatePiece(piece);
      setPieces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(`✓ Peça ${piece.id} atualizada com sucesso!`, 'success');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar peça.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const removePiece = async (id: string): Promise<boolean> => {
    try {
      await database.deletePiece(id);
      setPieces((prev) => prev.filter((p) => p.id !== id));
      showToast(`✓ Peça ${id} excluída com sucesso.`, 'info');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir peça.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const duplicate = async (sourceId: string): Promise<Piece> => {
    try {
      const source = pieces.find((p) => p.id === sourceId) || (await database.getPiece(sourceId));
      if (!source) throw new Error('Peça original não encontrada.');

      const newId = calculateNextFullId(pieces.map((p) => p.id));
      const now = new Date().toISOString();
      const duplicated: Piece = {
        ...source,
        id: newId,
        description: `${source.description} (Cópia)`,
        createdAt: now,
        updatedAt: now,
      };

      const created = await database.createPiece(duplicated);
      setPieces((prev) => [...prev, created]);
      showToast(`✓ Peça duplicada com sucesso! Novo ID: ${newId}`, 'success');
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao duplicar peça.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const removeDemo = async (): Promise<number> => {
    try {
      const count = await database.removeDemoPieces();
      await loadPieces();
      showToast(`✓ ${count} peças de demonstração removidas.`, 'info');
      return count;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao remover demonstração.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const clearAllData = async (): Promise<void> => {
    try {
      await database.clearAll();
      setPieces([]);
      showToast('✓ Todos os dados foram limpos com sucesso.', 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao limpar dados.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const value = {
    pieces,
    loading,
    error,
    nextId,
    lastPiece,
    piecesTodayCount,
    totalPieces: pieces.length,
    refresh: loadPieces,
    addPiece,
    editPiece,
    removePiece,
    duplicate,
    removeDemo,
    clearAllData,
  };

  return <PiecesContext.Provider value={value}>{children}</PiecesContext.Provider>;
}

export function usePieces(): PiecesContextType {
  const context = useContext(PiecesContext);
  if (!context) {
    throw new Error('usePieces must be used within a PiecesProvider');
  }
  return context;
}
