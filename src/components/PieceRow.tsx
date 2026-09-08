import { Piece } from '../types/piece';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils/formatters';
import { Eye, Edit3, Copy, Trash2 } from 'lucide-react';

interface PieceRowProps {
  piece: Piece;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (piece: Piece) => void;
  onEdit: (piece: Piece) => void;
  onDuplicate: (piece: Piece) => void;
  onDelete: (piece: Piece) => void;
}

export function PieceRow({
  piece,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: PieceRowProps) {
  return (
    <tr
      className={`group border-b border-slate-100 dark:border-slate-800/80 transition-colors ${
        isSelected
          ? 'bg-sky-50/60 dark:bg-sky-950/30'
          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
      }`}
    >
      {/* Checkbox Selection */}
      <td className="w-10 px-4 py-3 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(piece.id)}
          className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
        />
      </td>

      {/* ID Badge */}
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => onView(piece)}
          className="hover:opacity-80 transition-opacity"
          title="Ver detalhes da peça"
        >
          <Badge variant="blue" size="md">
            {piece.id}
          </Badge>
        </button>
      </td>

      {/* Description */}
      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
        <button
          onClick={() => onView(piece)}
          className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left truncate block w-full"
          title={piece.description}
        >
          {piece.description}
        </button>
      </td>

      {/* Height x Width x Thickness */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-700 dark:text-slate-300">
        <span className="font-semibold">
          {piece.height ? `${piece.height}` : '-'}
        </span>
        <span className="text-slate-400 mx-1">×</span>
        <span className="font-semibold">
          {piece.width ? `${piece.width}` : '-'}
        </span>
        <span className="text-slate-400 text-[10px] ml-0.5">mm</span>
      </td>

      {/* Thickness */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
        {piece.thickness || '-'}
      </td>

      {/* Holes A (Qtde / Dia) */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-600 dark:text-slate-400">
        {piece.holesA?.quantity ? (
          <span>
            {piece.holesA.quantity}x ø{piece.holesA.diameter || '?'}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-slate-600">-</span>
        )}
      </td>

      {/* Holes B (Qtde / Dia) */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-600 dark:text-slate-400">
        {piece.holesB?.quantity ? (
          <span>
            {piece.holesB.quantity}x ø{piece.holesB.diameter || '?'}
          </span>
        ) : (
          <span className="text-slate-300 dark:text-slate-600">-</span>
        )}
      </td>

      {/* PA Used */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-700 dark:text-slate-300">
        {piece.paUsed || '-'}
      </td>

      {/* System Code */}
      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-700 dark:text-slate-300">
        {piece.systemCode || '-'}
      </td>

      {/* Creation Date */}
      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400 dark:text-slate-500">
        {formatDate(piece.createdAt)}
      </td>

      {/* Action Buttons */}
      <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(piece)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            title="Visualizar detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(piece)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            title="Editar peça"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(piece)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
            title="Duplicar peça"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(piece)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            title="Excluir peça"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
