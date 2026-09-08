import { useNavigate } from 'react-router-dom';
import { usePieces } from '../hooks/usePieces';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';
import {
  Plus,
  Layers,
  Hash,
  Clock,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Database,
  Cpu,
  Boxes,
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { pieces, totalPieces, lastPiece, nextId, piecesTodayCount, loading } = usePieces();

  const recentPieces = [...pieces]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        {/* Subtle background tech grid effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              SISTEMA DE GESTÃO DE DESENHOS DE ENGENHARIA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CL Parts Manager
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Catálogo permanente e estruturado de peças mecânicas, tolerâncias e especificações de fabricação.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => navigate('/nova-peca')}
              className="shadow-lg shadow-sky-500/25 bg-sky-600 hover:bg-sky-500"
            >
              + Nova Peça
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Layers className="w-5 h-5" />}
              onClick={() => navigate('/pecas')}
            >
              Central de Peças
            </Button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS (Prompt Section 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total de peças */}
        <Card className="hover:border-sky-500/40 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Total de Peças
              </span>
              <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {loading ? '...' : totalPieces}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Peças cadastradas no catálogo
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Boxes className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 2: Último ID */}
        <Card className="hover:border-sky-500/40 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Último ID
              </span>
              <div className="mt-1 text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">
                {loading ? '...' : lastPiece ? lastPiece.id : '-'}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Próximo: <strong className="text-slate-700 dark:text-slate-300 font-mono">{nextId}</strong>
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Hash className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 3: Cadastradas Hoje */}
        <Card className="hover:border-sky-500/40 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Cadastradas Hoje
              </span>
              <div className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {loading ? '...' : piecesTodayCount}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Novos registros nesta data
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Card 4: Última Peça Cadastrada */}
        <Card className="hover:border-sky-500/40 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Última Peça
              </span>
              <div className="mt-1 text-base font-bold text-slate-900 dark:text-white truncate font-mono">
                {lastPiece ? lastPiece.id : '-'}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate block mt-0.5" title={lastPiece?.description}>
                {lastPiece ? lastPiece.description : 'Nenhuma peça cadastrada'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* RECENT PIECES & QUICK HUBS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pieces Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>Peças Recentes</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/pecas')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Ver todas
                </Button>
              </div>
            }
          >
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentPieces.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Nenhuma peça cadastrada ainda.
                </div>
              ) : (
                recentPieces.map((piece) => (
                  <div
                    key={piece.id}
                    onClick={() => navigate(`/peca/${piece.id}`)}
                    className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50 px-3 -mx-3 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge variant="blue" size="md">
                        {piece.id}
                      </Badge>
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate block">
                          {piece.description}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {piece.height}×{piece.width} mm | {piece.thickness}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">
                        {formatDate(piece.createdAt)}
                      </span>
                      {piece.paUsed && (
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {piece.paUsed}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Operations Sidebar */}
        <div className="space-y-4">
          <Card
            header={
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Acesso Rápido</span>
              </div>
            }
          >
            <div className="space-y-3">
              <button
                onClick={() => navigate('/nova-peca')}
                className="w-full text-left p-3.5 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-sky-900 dark:text-sky-200">
                    + Cadastrar Nova Peça
                  </div>
                  <div className="text-xs text-sky-700 dark:text-sky-400">
                    Próximo ID sugerido: <span className="font-mono font-bold">{nextId}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </button>

              <button
                onClick={() => navigate('/exportacao')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Exportar Excel (.xlsx)
                  </div>
                  <div className="text-xs text-slate-500">
                    Planilha formatada em duas linhas
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/backup')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-500" />
                    Backup JSON
                  </div>
                  <div className="text-xs text-slate-500">
                    Exportação e restauração completa
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
