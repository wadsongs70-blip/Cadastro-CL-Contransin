import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { Piece } from '../types/piece';
import { calculateNextFullId } from '../utils/generateId';

// =======================================================================
// 🔑 SUAS CREDENCIAIS DO FIREBASE:
// =======================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDdepT9RqhB7NGFfUX48pyhhNA6Wtr2Da4",
  authDomain: "catalogo-cl-contransin.firebaseapp.com",
  projectId: "catalogo-cl-contransin",
  storageBucket: "catalogo-cl-contransin.firebasestorage.app",
  messagingSenderId: "641503603405",
  appId: "1:641503603405:web:ffe18c2060d0fd6bc79784"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const PIECES_COLLECTION = 'pieces';

// Peças de demonstração inicial caso o banco esteja vazio
export const DEMO_PIECES: Piece[] = [
  {
    id: 'ID-CL-001',
    description: 'Suporte lateral do cubo',
    height: '180',
    width: '150',
    thickness: '5/16',
    holesA: { quantity: '4', diameter: '13', centerH: '100', centerV: '130' },
    holesB: { quantity: '1', diameter: '76', centerH: '75', centerV: '90' },
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
    thickness: '1/2',
    holesA: { quantity: '6', diameter: '18', centerH: '150', centerV: '200' },
    holesB: { quantity: '2', diameter: '10', centerH: '80', centerV: '100' },
    observation: 'Furos roscados M16 nas extremidades para fixação em perfil U.',
    paUsed: 'PA0220846',
    systemCode: 'MP0100345',
    createdAt: '2026-09-02T14:30:00.000Z',
    updatedAt: '2026-09-02T15:10:00.000Z',
  }
];

class DatabaseService {
  private syncCallbacks: Array<() => void> = [];

  constructor() {
    onSnapshot(collection(db, PIECES_COLLECTION), () => {
      this.syncCallbacks.forEach((cb) => cb());
    });
  }

  public onSync(callback: () => void): () => void {
    this.syncCallbacks.push(callback);
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter((cb) => cb !== callback);
    };
  }

  async init(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, PIECES_COLLECTION));
      if (snap.empty) {
        for (const piece of DEMO_PIECES) {
          await this.createPiece(piece);
        }
      }
    } catch (e) {
      console.error('Erro ao inicializar Firestore:', e);
    }
  }

  async getAllPieces(): Promise<Piece[]> {
    const snap = await getDocs(collection(db, PIECES_COLLECTION));
    return snap.docs.map((doc) => doc.data() as Piece);
  }

  async getPiece(id: string): Promise<Piece | null> {
    const docRef = doc(db, PIECES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Piece;
  }

  async createPiece(piece: Piece): Promise<Piece> {
    const existing = await this.getPiece(piece.id);
    if (existing) {
      throw new Error(`A peça com o ID "${piece.id}" já está cadastrada.`);
    }
    const docRef = doc(db, PIECES_COLLECTION, piece.id);
    await setDoc(docRef, piece);
    return piece;
  }

  async updatePiece(piece: Piece): Promise<Piece> {
    const updated: Piece = {
      ...piece,
      updatedAt: new Date().toISOString(),
    };
    const docRef = doc(db, PIECES_COLLECTION, piece.id);
    await setDoc(docRef, updated);
    return updated;
  }

  async deletePiece(id: string): Promise<boolean> {
    const docRef = doc(db, PIECES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  }

  async duplicatePiece(sourceId: string): Promise<Piece> {
    const source = await this.getPiece(sourceId);
    if (!source) {
      throw new Error(`Peça de origem "${sourceId}" não encontrada.`);
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

  async getNextId(): Promise<string> {
    const all = await this.getAllPieces();
    return calculateNextFullId(all.map((p) => p.id));
  }

  async removeDemoPieces(): Promise<number> {
    const demoIds = DEMO_PIECES.map((d) => d.id);
    let count = 0;
    for (const id of demoIds) {
      const exists = await this.getPiece(id);
      if (exists) {
        await this.deletePiece(id);
        count++;
      }
    }
    return count;
  }

  async clearAll(): Promise<void> {
    const all = await this.getAllPieces();
    const batch = writeBatch(db);
    all.forEach((piece) => {
      const docRef = doc(db, PIECES_COLLECTION, piece.id);
      batch.delete(docRef);
    });
    await batch.commit();
  }

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
    return { imported, duplicates };
  }
}

export const database = new DatabaseService();
