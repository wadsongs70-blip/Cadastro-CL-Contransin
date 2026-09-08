import { Piece } from '../types/piece';
import { calculateNextFullId } from '../utils/generateId';

const DB_NAME = 'CLPartsManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'pieces';
const LOCAL_STORAGE_KEY = 'cl_parts_data_v1';
const DEMO_CLEARED_KEY = 'cl_parts_demo_cleared';

// Realistic sample demo engineering pieces
export const DEMO_PIECES: Piece[] = [
  {
    id: 'ID-CL-001',
    description: 'Suporte lateral do cubo',
    height: '180',
    width: '150',
    thickness: '5/16"',
    holesA: {
      quantity: '4',
      diameter: '13',
      centerH: '100',
      centerV: '130',
    },
    holesB: {
      quantity: '1',
      diameter: '76',
      centerH: '75',
      centerV: '90',
    },
    observation: 'Chanfro 25 mm em todos os lados. Desbaste conforme ISO 2768-m.',
    paUsed: 'PA0220149',
    systemCode: 'MP0100280',
    createdAt: '2026-09-01T10:15:00.000Z',
    updatedAt: '2026-09-01T10:15:00.000Z',
  },
  {
    id: 'ID-CL-002',
    description: 'Placa base de fixação do redutor',
    height: '250',
    width: '200',
    thickness: '1/2"',
    holesA: {
      quantity: '6',
      diameter: '18',
      centerH: '150',
      centerV: '200',
    },
    holesB: {
      quantity: '2',
      diameter: '10',
      centerH: '80',
      centerV: '100',
    },
    observation: 'Furos roscados M16 nas extremidades para fixação em perfil U.',
    paUsed: 'PA0220846',
    systemCode: 'MP0100345',
    createdAt: '2026-09-02T14:30:00.000Z',
    updatedAt: '2026-09-02T15:10:00.000Z',
  },
  {
    id: 'ID-CL-003',
    description: 'Flange de união com guia de centragem',
    height: '120',
    width: '120',
    thickness: '3/8"',
    holesA: {
      quantity: '8',
      diameter: '11',
      centerH: '90',
      centerV: '90',
    },
    holesB: {
      quantity: '1',
      diameter: '50',
      centerH: '60',
      centerV: '60',
    },
    observation: 'Tolerância H7 no furo central para acoplamento do eixo motriz.',
    paUsed: 'PA0220912',
    systemCode: 'MP0100412',
    createdAt: '2026-09-05T09:00:00.000Z',
    updatedAt: '2026-09-05T09:00:00.000Z',
  },
  {
    id: 'ID-CL-004',
    description: 'Mancal bipartido de articulação traseira',
    height: '95',
    width: '80',
    thickness: '5/8"',
    holesA: {
      quantity: '2',
      diameter: '14',
      centerH: '55',
      centerV: '70',
    },
    holesB: {
      quantity: '1',
      diameter: '35',
      centerH: '40',
      centerV: '45',
    },
    observation: 'Usinagem de canal de lubrificação interno com graxeira 1/4" NPT.',
    paUsed: 'PA0221005',
    systemCode: 'MP0100560',
    createdAt: '2026-09-08T08:00:00.000Z',
    updatedAt: '2026-09-08T08:00:00.000Z',
  },
];

class DatabaseService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('cl_parts_sync');
      } catch {
        // ignore if not supported
      }
    }
  }

  private notifySync() {
    try {
      this.channel?.postMessage({ type: 'DATA_CHANGED', timestamp: Date.now() });
    } catch {
      // ignore
    }
  }

  public onSync(callback: () => void): () => void {
    if (!this.channel) return () => {};
    const handler = () => callback();
    this.channel.addEventListener('message', handler);
    return () => this.channel?.removeEventListener('message', handler);
  }

  // --- LocalStorage Fail-safe Helpers ---
  private readFromLocalStorage(): Piece[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeToLocalStorage(pieces: Piece[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pieces));
    } catch (e) {
      console.warn('LocalStorage quota or write error:', e);
    }
  }

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('description', 'description', { unique: false });
          store.createIndex('paUsed', 'paUsed', { unique: false });
          store.createIndex('systemCode', 'systemCode', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onclose = () => {
          this.dbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Initializes the database with bulletproof dual-layer persistence:
   * 1. Opens IndexedDB.
   * 2. Checks if IndexedDB has pieces.
   * 3. Checks localStorage fallback.
   * 4. If IndexedDB has records, synchronizes to localStorage.
   * 5. If IndexedDB is empty but localStorage has records (e.g. port or origin change), restores into IndexedDB!
   * 6. If both are empty and user hasn't cleared demo, seeds initial demo pieces.
   */
  async init(): Promise<void> {
    let idbPieces: Piece[] = [];
    try {
      await this.openDB();
      idbPieces = await this.getAllFromIDB();
    } catch (e) {
      console.warn('IndexedDB open error, relying on localStorage:', e);
    }

    const localPieces = this.readFromLocalStorage();

    if (idbPieces.length > 0) {
      // IndexedDB has data: keep localStorage in sync
      this.writeToLocalStorage(idbPieces);
    } else if (localPieces.length > 0) {
      // IndexedDB was empty, but localStorage has records (e.g. restored session, port change):
      // Restore all records into IndexedDB!
      for (const p of localPieces) {
        try {
          await this.insertToIDB(p);
        } catch {
          // ignore duplicate
        }
      }
    } else {
      // Both are empty. Check if user explicitly cleared demo data
      const demoCleared = localStorage.getItem(DEMO_CLEARED_KEY);
      if (!demoCleared) {
        for (const demo of DEMO_PIECES) {
          try {
            await this.insertToIDB(demo);
          } catch {
            // ignore
          }
        }
        this.writeToLocalStorage(DEMO_PIECES);
      }
    }
  }

  private async getAllFromIDB(): Promise<Piece[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Piece[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  private async insertToIDB(piece: Piece): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(piece);

      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  /**
   * Fetch all pieces stored across IndexedDB and LocalStorage fallback.
   */
  async getAllPieces(): Promise<Piece[]> {
    try {
      const idb = await this.getAllFromIDB();
      if (idb && idb.length > 0) {
        this.writeToLocalStorage(idb);
        return idb;
      }
    } catch {
      // fallback
    }

    // Fallback to localStorage if IDB returned empty or failed
    const local = this.readFromLocalStorage();
    return local;
  }

  /**
   * Retrieve a single piece by its ID (e.g. "ID-CL-001").
   */
  async getPiece(id: string): Promise<Piece | null> {
    try {
      const db = await this.openDB();
      const piece = await new Promise<Piece | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve((request.result as Piece) || null);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
      if (piece) return piece;
    } catch {
      // fallback
    }

    const local = this.readFromLocalStorage();
    return local.find((p) => p.id === id) || null;
  }

  /**
   * Create a new piece. Guaranteed committed to IndexedDB and LocalStorage.
   */
  async createPiece(piece: Piece): Promise<Piece> {
    const existing = await this.getPiece(piece.id);
    if (existing) {
      throw new Error(`A peça com o ID "${piece.id}" já está cadastrada.`);
    }

    const db = await this.openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.add(piece);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    // Update LocalStorage mirror
    const current = this.readFromLocalStorage();
    if (!current.some((p) => p.id === piece.id)) {
      this.writeToLocalStorage([...current, piece]);
    }

    this.notifySync();
    return piece;
  }

  /**
   * Update an existing piece. Guaranteed committed.
   */
  async updatePiece(piece: Piece): Promise<Piece> {
    const updatedPiece: Piece = {
      ...piece,
      updatedAt: new Date().toISOString(),
    };

    const db = await this.openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(updatedPiece);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    // Update LocalStorage mirror
    const current = this.readFromLocalStorage();
    const updated = current.map((p) => (p.id === updatedPiece.id ? updatedPiece : p));
    if (!updated.some((p) => p.id === updatedPiece.id)) {
      updated.push(updatedPiece);
    }
    this.writeToLocalStorage(updated);

    this.notifySync();
    return updatedPiece;
  }

  /**
   * Delete a piece by ID.
   */
  async deletePiece(id: string): Promise<boolean> {
    const db = await this.openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    // Update LocalStorage mirror
    const current = this.readFromLocalStorage();
    this.writeToLocalStorage(current.filter((p) => p.id !== id));

    this.notifySync();
    return true;
  }

  /**
   * Duplicate a piece with a newly generated ID.
   */
  async duplicatePiece(sourceId: string): Promise<Piece> {
    const source = await this.getPiece(sourceId);
    if (!source) {
      throw new Error(`Peça de origem "${sourceId}" não encontrada para duplicação.`);
    }

    const nextId = await this.getNextId();
    const now = new Date().toISOString();
    const duplicated: Piece = {
      ...source,
      id: nextId,
      description: `${source.description} (Cópia)`,
      createdAt: now,
      updatedAt: now,
    };

    return await this.createPiece(duplicated);
  }

  /**
   * Search pieces dynamically.
   */
  async searchPieces(query: string): Promise<Piece[]> {
    const all = await this.getAllPieces();
    if (!query || query.trim() === '') return all;
    const lower = query.toLowerCase().trim();
    return all.filter((p) => {
      return (
        p.id.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.paUsed.toLowerCase().includes(lower) ||
        p.systemCode.toLowerCase().includes(lower) ||
        p.observation.toLowerCase().includes(lower) ||
        p.thickness.toLowerCase().includes(lower) ||
        p.height.toLowerCase().includes(lower) ||
        p.width.toLowerCase().includes(lower)
      );
    });
  }

  /**
   * Calculate next ID strictly based on existing records.
   */
  async getNextId(): Promise<string> {
    const all = await this.getAllPieces();
    const existingIds = all.map((p) => p.id);
    return calculateNextFullId(existingIds);
  }

  /**
   * Removes demo pieces from database.
   */
  async removeDemoPieces(): Promise<number> {
    const demoIds = DEMO_PIECES.map((d) => d.id);
    let removedCount = 0;
    for (const id of demoIds) {
      const exists = await this.getPiece(id);
      if (exists) {
        await this.deletePiece(id);
        removedCount++;
      }
    }
    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
    this.notifySync();
    return removedCount;
  }

  /**
   * Clears all pieces from the database.
   */
  async clearAll(): Promise<void> {
    const db = await this.openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    localStorage.setItem(DEMO_CLEARED_KEY, 'true');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.notifySync();
  }

  /**
   * Bulk import pieces with replace or merge strategy.
   */
  async bulkImport(
    pieces: Piece[],
    mode: 'merge' | 'replace'
  ): Promise<{ imported: number; duplicates: number }> {
    if (mode === 'replace') {
      await this.clearAll();
    }

    let imported = 0;
    let duplicates = 0;

    for (const piece of pieces) {
      const existing = await this.getPiece(piece.id);
      if (existing) {
        duplicates++;
        if (mode === 'merge') {
          await this.updatePiece(piece);
          imported++;
        }
      } else {
        await this.createPiece(piece);
        imported++;
      }
    }

    this.notifySync();
    return { imported, duplicates };
  }
}

export const database = new DatabaseService();
