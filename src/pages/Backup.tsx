import { usePieces } from '../hooks/usePieces';
import { BackupPanel } from '../components/BackupPanel';

export function Backup() {
  const { totalPieces, refresh } = usePieces();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Backup do Banco de Dados
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Proteja seu catálogo com exportações de segurança ou transfira para outro computador
        </p>
      </div>

      <BackupPanel totalPieces={totalPieces} onRefresh={refresh} />
    </div>
  );
}
