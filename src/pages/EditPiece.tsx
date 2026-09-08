import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePieces } from '../hooks/usePieces';
import { PieceForm } from '../components/PieceForm';
import { Piece } from '../types/piece';
import { database } from '../services/database';
import { extractIdNumber, formatIdNumber } from '../utils/generateId';
import { Layers } from 'lucide-react';

export function EditPiece() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { editPiece } = usePieces();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        const item = await database.getPiece(id);
        if (item) {
          setPiece(item);
        } else {
          navigate('/pecas');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleCalculateNext = async () => {
    return await database.getNextId();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <Layers className="w-8 h-8 animate-pulse text-sky-500" />
        <p>Carregando dados da peça {id}...</p>
      </div>
    );
  }

  if (!piece) {
    return null;
  }

  const num = extractIdNumber(piece.id);
  const numStr = num !== null ? formatIdNumber(num) : '001';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Editar Peça: <span className="font-mono text-sky-600 dark:text-sky-400">{piece.id}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Atualize as especificações, tolerâncias ou observações técnicas
          </p>
        </div>
      </div>

      <PieceForm
        initialData={piece}
        nextSuggestedIdNumber={numStr}
        onSave={editPiece}
        onCalculateNextId={handleCalculateNext}
        isEditing={true}
      />
    </div>
  );
}
