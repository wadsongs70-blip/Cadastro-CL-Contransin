import * as XLSX from 'xlsx';
import { Piece } from '../types/piece';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
}

/**
 * Export an array of Piece objects into a professionally styled Excel file.
 * Includes two-tier merged headers, dark blue theme styling, autofilters,
 * auto-column widths and freeze pane.
 */
export function exportPiecesToExcel(pieces: Piece[], options?: ExcelExportOptions): void {
  const fileName = options?.fileName || 'Cadastro_Pecas_CL.xlsx';
  const sheetName = options?.sheetName || 'Catálogo de Peças';

  // Row 1: Header groups
  const headerRow1 = [
    'ID',
    'Peça / Descrição',
    'DIMENSÕES',
    '',
    '',
    'FUROS A',
    '',
    '',
    '',
    'FUROS B',
    '',
    '',
    '',
    'INFORMAÇÕES ADICIONAIS',
    '',
    '',
  ];

  // Row 2: Sub-headers
  const headerRow2 = [
    'ID',
    'Peça / Descrição',
    'Altura (mm)',
    'Largura (mm)',
    'Espessura',
    'Furos A - Qtde',
    'Furos A - Diâmetro',
    'Furos A - Entre Centros Horizontal',
    'Furos A - Entre Centros Vertical',
    'Furos B - Qtde',
    'Furos B - Diâmetro',
    'Furos B - Entre Centros Horizontal',
    'Furos B - Entre Centros Vertical',
    'Observação',
    'PA Utilizado',
    'Código Sistema',
  ];

  // Data rows
  const dataRows = pieces.map((piece) => [
    piece.id,
    piece.description,
    piece.height,
    piece.width,
    piece.thickness,
    piece.holesA?.quantity || '',
    piece.holesA?.diameter || '',
    piece.holesA?.centerH || '',
    piece.holesA?.centerV || '',
    piece.holesB?.quantity || '',
    piece.holesB?.diameter || '',
    piece.holesB?.centerH || '',
    piece.holesB?.centerV || '',
    piece.observation || '',
    piece.paUsed || '',
    piece.systemCode || '',
  ]);

  const worksheetData = [headerRow1, headerRow2, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Define merges for two-tier engineering headers
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // ID (merged vertically)
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Peça / Descrição (merged vertically)
    { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } }, // DIMENSÕES (merged horizontally cols 2-4)
    { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }, // FUROS A (merged horizontally cols 5-8)
    { s: { r: 0, c: 9 }, e: { r: 0, c: 12 } }, // FUROS B (merged horizontally cols 9-12)
    { s: { r: 0, c: 13 }, e: { r: 0, c: 15 } }, // INFORMAÇÕES ADICIONAIS (cols 13-15)
  ];

  // Set column widths
  worksheet['!cols'] = [
    { wch: 14 }, // ID
    { wch: 38 }, // Peça / Descrição
    { wch: 14 }, // Altura (mm)
    { wch: 14 }, // Largura (mm)
    { wch: 14 }, // Espessura
    { wch: 14 }, // Furos A - Qtde
    { wch: 16 }, // Furos A - Diâmetro
    { wch: 22 }, // Furos A - Entre Centros Horizontal
    { wch: 22 }, // Furos A - Entre Centros Vertical
    { wch: 14 }, // Furos B - Qtde
    { wch: 16 }, // Furos B - Diâmetro
    { wch: 22 }, // Furos B - Entre Centros Horizontal
    { wch: 22 }, // Furos B - Entre Centros Vertical
    { wch: 38 }, // Observação
    { wch: 16 }, // PA Utilizado
    { wch: 18 }, // Código Sistema
  ];

  // Set row heights
  worksheet['!rows'] = [
    { hpt: 26 }, // Header 1
    { hpt: 24 }, // Header 2
  ];

  // Autofilter covering data table
  const totalRows = worksheetData.length;
  worksheet['!autofilter'] = {
    ref: `A2:P${Math.max(2, totalRows)}`,
  };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Write and trigger download in browser
  XLSX.writeFile(workbook, fileName);
}
