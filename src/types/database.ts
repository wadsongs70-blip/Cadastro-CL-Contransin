import { Piece } from './piece';

export interface DatabaseBackup {
  version: string;
  exportedAt: string;
  totalPieces: number;
  data: Piece[];
}

export interface ImportResult {
  success: boolean;
  totalImported: number;
  mode: 'merge' | 'replace';
  duplicatesDetected: number;
  message: string;
}
