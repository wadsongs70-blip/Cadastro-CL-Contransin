import { useState } from 'react';
import { Piece } from '../types/piece';
import { exportPiecesToExcel } from '../services/excel';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { useToast } from './ui/Toast';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Table,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

interface ExportPanelProps {
  pieces: Piece[];
  selectedIds: string[];
}

export function ExportPanel({ pieces, selectedIds }: ExportPanelProps) {
  const [fileName, setFileName] = useState('Cadastro_Pecas_CL.xlsx');
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  const selectedPieces = pieces.filter((p) => selectedIds.includes(p.id));

  const handleExportAll = () => {
    try {
      setExporting(true);
      exportPiecesToExcel(pieces, { fileName });
      showToast(`✓ Excel com ${pieces.length} peças exportado com sucesso!`, 'success');
    } catch {
      showToast('Erro ao exportar planilha Excel.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportSelected = () => {
    if (selectedPieces.length === 0) {
      showToast('Selecione ao menos uma peça na tabela antes de exportar.', 'warning');
      return;
    }
    try {
      setExporting(true);
      exportPiecesToExcel(selectedPieces, { fileName });
      showToast(`✓ Excel com ${selectedPieces.length} peças exportado com sucesso!`, 'success');
    } catch {
      showToast('Erro ao exportar planilha Excel.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Informative Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Exportação Técnica para Excel (.xlsx)
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Gera planilha oficial formatada com cabeçalho de engenharia em 2 linhas mescladas e filtros automáticos.
            </p>
          </div>
        </div>
      </div>

      {/* Export Options Card */}
      <Card
        header={
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Table className="w-5 h-5 text-emerald-500" />
            <span>Configuração da Exportação</span>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="max-w-md">
            <Input
              label="Nome do Arquivo"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              suffixText=".xlsx"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export All Card */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Table className="w-4 h-4 text-sky-500" />
                    Catálogo Completo
                  </span>
                  <span className="font-mono text-xs bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded font-bold">
                    {pieces.length} peças
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exporta todos os registros armazenados no banco de dados local permanente.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportAll}
                disabled={pieces.length === 0 || exporting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500/20"
              >
                Exportar todas ({pieces.length})
              </Button>
            </div>

            {/* Export Selected Card */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    Peças Selecionadas
                  </span>
                  <span className="font-mono text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                    {selectedPieces.length} selecionada{selectedPieces.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exporta somente as peças marcadas com checkbox na Central de Peças.
                </p>
              </div>

              <Button
                variant="secondary"
                size="lg"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportSelected}
                disabled={selectedPieces.length === 0 || exporting}
                className="w-full"
              >
                Exportar selecionadas ({selectedPieces.length})
              </Button>
            </div>
          </div>

          {/* Excel Format Preview Details */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Estrutura Técnica do Cabeçalho Excel Gerado:
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li><strong>Linha Superior 1:</strong> ID | Peça / Descrição | DIMENSÕES (mesclado) | FUROS A (mesclado) | FUROS B (mesclado) | INFORMAÇÕES ADICIONAIS</li>
              <li><strong>Linha 2 (Subcampos):</strong> Altura, Largura, Espessura, Qtde, Diâmetro, Centros Horizontal/Vertical, Observação, PA, Código Sistema</li>
              <li><strong>Estilização:</strong> Fundo azul escuro de engenharia, texto branco, bordas técnicas, congelamento do cabeçalho e filtros automáticos na linha 2.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
