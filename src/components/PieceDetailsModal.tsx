import { Piece } from '../types/piece';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils/formatters';
import {
  Edit3,
  Copy,
  FileSpreadsheet,
  Trash2,
  Maximize2,
  CircleDot,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';
import { exportPiecesToExcel } from '../services/excel';

interface PieceDetailsModalProps {
  piece: Piece | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (piece: Piece) => void;
  onDuplicate: (piece: Piece) => void;
  onDelete: (piece: Piece) => void;
}

export function PieceDetailsModal({
  piece,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}: PieceDetailsModalProps) {
  if (!piece) return null;

  const handleExportSingle = () => {
    exportPiecesToExcel([piece], {
      fileName: `${piece.id}_${piece.description.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
      sheetName: piece.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Badge variant="blue" size="md">
            {piece.id}
          </Badge>
          <span className="text-base font-bold text-slate-900 dark:text-white truncate">
            {piece.description}
          </span>
        </div>
      }
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(piece)}
          >
            Excluir
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              onClick={handleExportSingle}
            >
              Exportar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Copy className="w-4 h-4" />}
              onClick={() => onDuplicate(piece)}
            >
              Duplicar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
              onClick={() => onEdit(piece)}
            >
              Editar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Technical Specification Card */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Descrição Técnica</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {piece.description}
          </div>
        </div>

        {/* DIMENSÕES */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <Maximize2 className="w-4 h-4" />
            <span>Dimensões Principais</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Altura</span>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {piece.height ? `${piece.height} mm` : '-'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Largura</span>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {piece.width ? `${piece.width} mm` : '-'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Espessura</span>
              <p className="text-base font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {piece.thickness || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* FUROS A & FUROS B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FUROS A */}
          <div className="bg-slate-50/70 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-sky-500" />
                Furos A
              </span>
              <span className="text-xs font-mono bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">
                {piece.holesA?.quantity ? `${piece.holesA.quantity}x` : '0x'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Diâmetro:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesA?.diameter ? `${piece.holesA.diameter} mm` : '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Horizontal:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesA?.centerH ? `${piece.holesA.centerH} mm` : '-'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Vertical:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesA?.centerV ? `${piece.holesA.centerV} mm` : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* FUROS B */}
          <div className="bg-slate-50/70 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-purple-500" />
                Furos B
              </span>
              <span className="text-xs font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                {piece.holesB?.quantity ? `${piece.holesB.quantity}x` : '0x'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Diâmetro:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesB?.diameter ? `${piece.holesB.diameter} mm` : '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Horizontal:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesB?.centerH ? `${piece.holesB.centerH} mm` : '-'}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Vertical:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {piece.holesB?.centerV ? `${piece.holesB.centerV} mm` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OBSERVAÇÃO */}
        {piece.observation && (
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-3.5 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Observação Técnica
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {piece.observation}
            </p>
          </div>
        )}

        {/* INFORMAÇÕES ADICIONAIS & RASTREABILIDADE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-semibold uppercase">PA Utilizado</span>
            <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
              {piece.paUsed || '-'}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-semibold uppercase">Código Sistema</span>
            <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5">
              {piece.systemCode || '-'}
            </p>
          </div>
        </div>

        {/* DATAS DE CADASTRO E ATUALIZAÇÃO */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Cadastrada em: <strong>{formatDate(piece.createdAt)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Última atualização: <strong>{formatDate(piece.updatedAt)}</strong></span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
