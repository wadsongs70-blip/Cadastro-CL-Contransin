import { Piece } from '../types/piece';
import { DatabaseBackup, ImportResult } from '../types/database';
import { database } from './database';

/**
 * Exports all database records as a formatted JSON file.
 */
export async function exportBackup(): Promise<string> {
  const pieces = await database.getAllPieces();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const backupData: DatabaseBackup = {
    version: '1.0.0',
    exportedAt: now.toISOString(),
    totalPieces: pieces.length,
    data: pieces,
  };

  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const fileName = `CL_Parts_Backup_${dateStr}.json`;
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}

/**
 * Validates the structure of an imported JSON file.
 */
export function validateBackupFile(content: unknown): {
  valid: boolean;
  pieces: Piece[];
  error?: string;
} {
  if (!content || typeof content !== 'object') {
    return { valid: false, pieces: [], error: 'Arquivo inválido ou corrompido.' };
  }

  const candidate = content as Record<string, unknown>;
  let piecesList: unknown[] = [];

  if (Array.isArray(candidate.data)) {
    piecesList = candidate.data;
  } else if (Array.isArray(candidate)) {
    piecesList = candidate;
  } else {
    return {
      valid: false,
      pieces: [],
      error: 'Formato incompatível: o arquivo não contém uma lista de peças.',
    };
  }

  // Validate piece objects
  const validPieces: Piece[] = [];
  for (let i = 0; i < piecesList.length; i++) {
    const item = piecesList[i] as Record<string, unknown>;
    if (!item.id || typeof item.id !== 'string') {
      return {
        valid: false,
        pieces: [],
        error: `O registro na posição ${i + 1} não possui um ID válido.`,
      };
    }
    if (!item.description || typeof item.description !== 'string') {
      return {
        valid: false,
        pieces: [],
        error: `A peça "${item.id}" não possui uma descrição válida.`,
      };
    }

    const holesA = (item.holesA as Record<string, unknown>) || {};
    const holesB = (item.holesB as Record<string, unknown>) || {};

    validPieces.push({
      id: String(item.id).trim(),
      description: String(item.description).trim(),
      height: String(item.height || ''),
      width: String(item.width || ''),
      thickness: String(item.thickness || ''),
      holesA: {
        quantity: String(holesA.quantity || ''),
        diameter: String(holesA.diameter || ''),
        centerH: String(holesA.centerH || ''),
        centerV: String(holesA.centerV || ''),
      },
      holesB: {
        quantity: String(holesB.quantity || ''),
        diameter: String(holesB.diameter || ''),
        centerH: String(holesB.centerH || ''),
        centerV: String(holesB.centerV || ''),
      },
      observation: String(item.observation || ''),
      paUsed: String(item.paUsed || ''),
      systemCode: String(item.systemCode || ''),
      createdAt: String(item.createdAt || new Date().toISOString()),
      updatedAt: String(item.updatedAt || new Date().toISOString()),
    });
  }

  return { valid: true, pieces: validPieces };
}

/**
 * Checks for duplicate IDs between incoming pieces and existing database pieces.
 */
export async function detectDuplicates(
  incomingPieces: Piece[]
): Promise<{ duplicateIds: string[]; existingCount: number }> {
  const existing = await database.getAllPieces();
  const existingIdSet = new Set(existing.map((p) => p.id));
  const duplicateIds: string[] = [];

  for (const p of incomingPieces) {
    if (existingIdSet.has(p.id)) {
      duplicateIds.push(p.id);
    }
  }

  return {
    duplicateIds,
    existingCount: existing.length,
  };
}

/**
 * Executes the actual import with the selected strategy: 'merge' or 'replace'.
 */
export async function executeImport(
  pieces: Piece[],
  mode: 'merge' | 'replace'
): Promise<ImportResult> {
  try {
    const result = await database.bulkImport(pieces, mode);
    return {
      success: true,
      totalImported: result.imported,
      mode,
      duplicatesDetected: result.duplicates,
      message:
        mode === 'replace'
          ? `Banco substituído com sucesso! ${result.imported} registros carregados.`
          : `Importação concluída! ${result.imported} registros processados (${result.duplicates} atualizados).`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao importar dados.';
    return {
      success: false,
      totalImported: 0,
      mode,
      duplicatesDetected: 0,
      message: errorMsg,
    };
  }
}
