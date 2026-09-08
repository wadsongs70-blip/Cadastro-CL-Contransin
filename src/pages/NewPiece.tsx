import { usePieces } from '../hooks/usePieces';
import { PieceForm } from '../components/PieceForm';
import { database } from '../services/database';
import { extractIdNumber, formatIdNumber } from '../utils/generateId';

export function NewPiece() {
  const { addPiece, nextId } = usePieces();

  const handleCalculateNext = async () => {
    return await database.getNextId();
  };

  const nextNum = extractIdNumber(nextId);
  const suggestedNumber = nextNum !== null ? formatIdNumber(nextNum) : '001';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Cadastro de Nova Peça
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Insira os dados dimensionais e tolerâncias do novo desenho técnico
          </p>
        </div>
      </div>

      <PieceForm
        nextSuggestedIdNumber={suggestedNumber}
        onSave={addPiece}
        onCalculateNextId={handleCalculateNext}
        isEditing={false}
      />
    </div>
  );
}
