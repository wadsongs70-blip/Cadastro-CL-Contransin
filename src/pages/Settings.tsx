import { useState } from 'react';
import { usePieces } from '../hooks/usePieces';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { exportBackup } from '../services/backup';
import { useToast } from '../components/ui/Toast';
import {
  Settings as SettingsIcon,
  Trash2,
  Download,
  AlertTriangle,
  HardDrive,
  Hash,
  Layers,
  Database,
  Info,
} from 'lucide-react';

export function Settings() {
  const { totalPieces, nextId, lastPiece, removeDemo, clearAllData } = usePieces();
  const { showToast } = useToast();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [removeDemoOpen, setRemoveDemoOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleExportBackup = async () => {
    try {
      const filename = await exportBackup();
      showToast(`✓ Backup gerado: ${filename}`, 'success');
    } catch {
      showToast('Erro ao exportar backup.', 'error');
    }
  };

  const handleConfirmRemoveDemo = async () => {
    try {
      await removeDemo();
      setRemoveDemoOpen(false);
    } catch {
      // toast in hook
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      setClearing(true);
      await clearAllData();
      setClearDialogOpen(false);
    } catch {
      // toast in hook
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-sky-500" />
          Configurações do Catálogo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Estatísticas da base de dados, manutenção e gestão de registros locais
        </p>
      </div>

      {/* METRICS CARD (Section 34) */}
      <Card
        header={
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <HardDrive className="w-4 h-4 text-sky-500" />
            <span>Estatísticas do Banco Permanente</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Total de Peças
            </span>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">
              {totalPieces}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              Próximo ID Calculado
            </span>
            <p className="text-2xl font-mono font-bold text-sky-600 dark:text-sky-400 mt-1">
              {nextId}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Última Peça Cadastrada
            </span>
            <div className="mt-1 flex items-center gap-2">
              {lastPiece ? (
                <>
                  <Badge variant="blue">{lastPiece.id}</Badge>
                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate" title={lastPiece.description}>
                    {lastPiece.description}
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400 font-mono">Nenhum</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* SYSTEM ACTIONS CARD (Section 34) */}
      <Card
        header={
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <SettingsIcon className="w-4 h-4 text-sky-500" />
            <span>Ações de Manutenção</span>
          </div>
        }
      >
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Action: Remover Dados de Demonstração */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                Remover Dados de Demonstração
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Remove as 4 peças fictícias iniciais (ID-CL-001 a ID-CL-004) criadas na primeira execução.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-amber-500" />}
              onClick={() => setRemoveDemoOpen(true)}
              className="shrink-0"
            >
              Remover Demo
            </Button>
          </div>

          {/* Action: Bloquear Acesso / Encerrar Sessão */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <SettingsIcon className="w-4 h-4 text-sky-500" />
                Bloquear Acesso ao Catálogo
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Encerra a sessão atual e exige o código de acesso novamente.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem('cl_parts_auth_session');
                window.location.reload();
              }}
              className="shrink-0"
            >
              Bloquear Sessão
            </Button>
          </div>

          {/* Action: Limpar Todos os Dados (Destructive) */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Limpar Todos os Dados
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Exclui permanentemente todas as peças cadastradas do banco de dados local IndexedDB.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setClearDialogOpen(true)}
              className="shrink-0"
            >
              Limpar Tudo
            </Button>
          </div>
        </div>
      </Card>

      {/* Storage Architecture Note */}
      <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sky-900 dark:text-sky-300">
            Arquitetura de Dados Permanente:
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            O CL Parts Manager armazena suas peças diretamente no banco nativo <strong>IndexedDB</strong> do seu navegador. Os dados permanecem salvos permanentemente ao fechar o navegador ou reiniciar a máquina. O Excel é utilizado exclusivamente como camada de exportação oficial.
          </p>
        </div>
      </div>

      {/* Remove Demo Confirmation Dialog */}
      <ConfirmDialog
        isOpen={removeDemoOpen}
        onClose={() => setRemoveDemoOpen(false)}
        onConfirm={handleConfirmRemoveDemo}
        title="Remover peças de demonstração?"
        description="Esta ação irá remover do catálogo os registros de exemplo (ID-CL-001 a ID-CL-004) que foram inseridos inicialmente."
        confirmLabel="Remover Demonstração"
        variant="primary"
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={handleConfirmClearAll}
        title="⚠️ Tem certeza absoluta?"
        description={
          <div>
            Esta ação é irreversível e <strong>excluirá permanentemente todas as {totalPieces} peças</strong> cadastradas no banco IndexedDB.
            <div className="mt-2 text-rose-500 font-semibold">
              Recomendamos exportar um backup antes de prosseguir!
            </div>
          </div>
        }
        confirmLabel="Sim, Limpar Tudo"
        variant="danger"
        loading={clearing}
      />
    </div>
  );
}
