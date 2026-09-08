import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePieces } from '../hooks/usePieces';
import { Piece } from '../types/piece';
import { database } from '../services/database';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatDate } from '../utils/formatters';
import { exportPiecesToExcel } from '../services/excel';
import {
  ArrowLeft,
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

export function PieceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { removePiece, duplicate } = usePieces();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Carregando detalhes da peça...
      </div>
    );
  }

  if (!piece) return null;

  const handleExport = () => {
    exportPiecesToExcel([piece], {
      fileName: `${piece.id}_${piece.description.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
      sheetName: piece.id,
    });
  };

  const handleDuplicate = async () => {
    const dup = await duplicate(piece.id);
    navigate(`/editar/${dup.id}`);
  };

  const handleDelete = async () => {
    await removePiece(piece.id);
    navigate('/pecas');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/pecas')}
          >
            Voltar para Peças
          </Button>
          <Badge variant="blue" size="md">
            {piece.id}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            onClick={handleExport}
          >
            Exportar Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Copy className="w-4 h-4" />}
            onClick={handleDuplicate}
          >
            Duplicar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Edit3 className="w-4 h-4" />}
            onClick={() => navigate(`/editar/${piece.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setDeleteOpen(true)}
          >
            Excluir
          </Button>
        </div>
      </div>

      {/* Main Spec Card */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {piece.description}
            </span>
            <span className="text-xs font-mono text-slate-400">Ficha Técnica Oficial</span>
          </div>
        }
      >
        <div className="space-y-6">
          {/* DIMENSÕES */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <Maximize2 className="w-4 h-4" />
              <span>Dimensões Principais</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Altura</span>
                <p className="text-xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {piece.height ? `${piece.height} mm` : '-'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Largura</span>
                <p className="text-xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {piece.width ? `${piece.width} mm` : '-'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Espessura</span>
                <p className="text-xl font-mono font-bold text-sky-600 dark:text-sky-400 mt-1">
                  {piece.thickness || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* FUROS A & FUROS B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FUROS A */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CircleDot className="w-4 h-4 text-sky-500" />
                  Furos A
                </span>
                <span className="text-xs font-mono bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 rounded-full font-bold">
                  {piece.holesA?.quantity ? `${piece.holesA.quantity} furos` : 'Nenhum'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Diâmetro:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesA?.diameter ? `${piece.holesA.diameter} mm` : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">E.C. Horizontal:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesA?.centerH ? `${piece.holesA.centerH} mm` : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">E.C. Vertical:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesA?.centerV ? `${piece.holesA.centerV} mm` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* FUROS B */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CircleDot className="w-4 h-4 text-purple-500" />
                  Furos B
                </span>
                <span className="text-xs font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                  {piece.holesB?.quantity ? `${piece.holesB.quantity} furos` : 'Nenhum'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Diâmetro:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesB?.diameter ? `${piece.holesB.diameter} mm` : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">E.C. Horizontal:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesB?.centerH ? `${piece.holesB.centerH} mm` : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">E.C. Vertical:</span>
                  <p className="font-mono font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {piece.holesB?.centerV ? `${piece.holesB.centerV} mm` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* OBSERVAÇÃO */}
          {piece.observation && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-4 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Observação Técnica
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {piece.observation}
              </p>
            </div>
          )}

          {/* RASTREABILIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">PA Utilizado</span>
              <p className="font-mono font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {piece.paUsed || '-'}
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Código Sistema</span>
              <p className="font-mono font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {piece.systemCode || '-'}
              </p>
            </div>
          </div>

          {/* TIMESTAMPS */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Cadastrada em: <strong>{formatDate(piece.createdAt)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Última atualização: <strong>{formatDate(piece.updatedAt)}</strong></span>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={`Excluir peça ${piece.id}?`}
        description="Esta ação removerá esta peça permanentemente do banco de dados local. Não poderá ser desfeita."
      />
    </div>
  );
}
