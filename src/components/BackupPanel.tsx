import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';
import {
  exportBackup,
  validateBackupFile,
  detectDuplicates,
  executeImport,
} from '../services/backup';
import { Piece } from '../types/piece';
import {
  Database,
  Download,
  Upload,
  AlertTriangle,
  FileCheck,
  HardDrive,
  Copy,
  Layers,
} from 'lucide-react';

interface BackupPanelProps {
  totalPieces: number;
  onRefresh: () => Promise<void>;
}

export function BackupPanel({ totalPieces, onRefresh }: BackupPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pendingPieces, setPendingPieces] = useState<Piece[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleExport = async () => {
    try {
      setExporting(true);
      const filename = await exportBackup();
      showToast(`✓ Backup gerado com sucesso: ${filename}`, 'success');
    } catch {
      showToast('Falha ao gerar arquivo de backup.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateBackupFile(parsed);

      if (!validation.valid) {
        showToast(validation.error || 'Arquivo de backup inválido.', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Check duplicates
      const dupInfo = await detectDuplicates(validation.pieces);
      setPendingPieces(validation.pieces);
      setDuplicates(dupInfo.duplicateIds);
      setImportModalOpen(true);
    } catch {
      showToast('O arquivo selecionado não é um JSON válido.', 'error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = async () => {
    try {
      setImporting(true);
      const result = await executeImport(pendingPieces, importMode);
      if (result.success) {
        showToast(result.message, 'success');
        setImportModalOpen(false);
        await onRefresh();
      } else {
        showToast(result.message, 'error');
      }
    } catch {
      showToast('Erro durante a restauração do backup.', 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Database className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Backup & Restauração de Dados
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Gere cópias de segurança integrais em formato JSON ou restaure um catálogo anterior.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono">
          <HardDrive className="w-4 h-4 text-sky-400" />
          <span>Banco Atual: <strong>{totalPieces}</strong> peças</span>
        </div>
      </div>

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Backup */}
        <Card
          header={
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Download className="w-5 h-5 text-sky-500" />
              <span>Exportar Cópia de Segurança</span>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exporta todos os registros de peças, furos, observações e histórico do banco IndexedDB em um arquivo <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-sky-600">.json</code>.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-1">
              <div className="text-slate-400">Padrão de nomenclatura:</div>
              <div className="font-mono text-slate-700 dark:text-slate-200 font-semibold">
                CL_Parts_Backup_YYYY-MM-DD.json
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              disabled={exporting || totalPieces === 0}
              className="w-full"
            >
              {exporting ? 'Gerando backup...' : `Exportar Backup (${totalPieces} peças)`}
            </Button>
          </div>
        </Card>

        {/* Import Backup */}
        <Card
          header={
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Upload className="w-5 h-5 text-emerald-500" />
              <span>Importar / Restaurar Backup</span>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Carregue um arquivo JSON gerado anteriormente. O sistema valida a estrutura, verifica duplicidades e permite escolher entre mesclar ou substituir o banco existente.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-1">
              <div className="text-slate-400">Formatos suportados:</div>
              <div className="font-mono text-slate-700 dark:text-slate-200 font-semibold">
                Arquivos JSON válidos com esquema CL Parts
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Importar Backup (.json)
            </Button>
          </div>
        </Card>
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            <span>Confirmar Importação de Backup</span>
          </div>
        }
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setImportModalOpen(false)}
              disabled={importing}
            >
              Cancelar
            </Button>
            <Button
              variant={importMode === 'replace' ? 'danger' : 'primary'}
              size="md"
              onClick={handleConfirmImport}
              disabled={importing}
            >
              {importing
                ? 'Importando...'
                : importMode === 'replace'
                ? 'Confirmar e Substituir Tudo'
                : 'Confirmar e Mesclar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-sm flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">Registros identificados no arquivo:</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-base">
              {pendingPieces.length} peças
            </span>
          </div>

          {duplicates.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{duplicates.length} IDs já existentes no banco local detectados:</span>
              </div>
              <div className="font-mono text-slate-600 dark:text-slate-300 max-h-20 overflow-y-auto">
                {duplicates.slice(0, 10).join(', ')}
                {duplicates.length > 10 ? `... e mais ${duplicates.length - 10}` : ''}
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Como deseja importar?
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                  importMode === 'merge'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mt-1 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Copy className="w-4 h-4 text-sky-500" />
                    Adicionar aos registros existentes (Mesclar)
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Mantém as peças já cadastradas. Peças com IDs duplicados serão atualizadas com os dados do arquivo.
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-colors ${
                  importMode === 'replace'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="font-semibold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    Substituir banco atual
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Apaga todas as peças cadastradas atualmente e preenche o banco exclusivamente com as peças do arquivo.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
