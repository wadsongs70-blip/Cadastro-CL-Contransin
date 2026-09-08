import { useState } from 'react';
import { usePieces } from '../hooks/usePieces';
import { ExportPanel } from '../components/ExportPanel';

export function Export() {
  const { pieces } = usePieces();
  const [selectedIds] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Exportação de Catálogo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Gere planilhas XLSX prontas para integração de engenharia e produção
        </p>
      </div>

      <ExportPanel pieces={pieces} selectedIds={selectedIds} />
    </div>
  );
}
