import { FilterOptions, Piece, SortDirection, SortField } from '../types/piece';
import { extractIdNumber } from './generateId';

/**
 * Checks if a string contains another string, case-insensitive.
 */
function containsCaseInsensitive(source: string | undefined | null, query: string): boolean {
  if (!source) return false;
  return source.toLowerCase().includes(query.toLowerCase().trim());
}

/**
 * Filter pieces based on global search query across all 10+ fields.
 */
export function matchesGlobalSearch(piece: Piece, query: string): boolean {
  if (!query || query.trim() === '') return true;

  // Split query into terms to support multi-word search (e.g. "cubo 150")
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const searchableString = [
    piece.id,
    piece.description,
    piece.height,
    piece.width,
    piece.thickness,
    piece.holesA.quantity,
    piece.holesA.diameter,
    piece.holesA.centerH,
    piece.holesA.centerV,
    piece.holesB.quantity,
    piece.holesB.diameter,
    piece.holesB.centerH,
    piece.holesB.centerV,
    piece.observation,
    piece.paUsed,
    piece.systemCode,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // All terms must be found in the searchable string
  return terms.every((term) => searchableString.includes(term));
}

/**
 * Check if piece satisfies specific filter criteria.
 */
export function matchesFilters(piece: Piece, filters: FilterOptions): boolean {
  // Global search
  if (filters.search && !matchesGlobalSearch(piece, filters.search)) {
    return false;
  }

  // ID Range
  const pieceNum = extractIdNumber(piece.id);
  if (filters.idFrom) {
    const fromNum = parseInt(filters.idFrom, 10);
    if (!isNaN(fromNum) && (pieceNum === null || pieceNum < fromNum)) {
      return false;
    }
  }
  if (filters.idTo) {
    const toNum = parseInt(filters.idTo, 10);
    if (!isNaN(toNum) && (pieceNum === null || pieceNum > toNum)) {
      return false;
    }
  }

  // Dimensions
  if (filters.height && !containsCaseInsensitive(piece.height, filters.height)) {
    return false;
  }
  if (filters.width && !containsCaseInsensitive(piece.width, filters.width)) {
    return false;
  }
  if (filters.thickness && !containsCaseInsensitive(piece.thickness, filters.thickness)) {
    return false;
  }

  // Holes A
  if (filters.holesA_quantity && !containsCaseInsensitive(piece.holesA.quantity, filters.holesA_quantity)) {
    return false;
  }
  if (filters.holesA_diameter && !containsCaseInsensitive(piece.holesA.diameter, filters.holesA_diameter)) {
    return false;
  }
  if (filters.holesA_centerH && !containsCaseInsensitive(piece.holesA.centerH, filters.holesA_centerH)) {
    return false;
  }
  if (filters.holesA_centerV && !containsCaseInsensitive(piece.holesA.centerV, filters.holesA_centerV)) {
    return false;
  }

  // Holes B
  if (filters.holesB_quantity && !containsCaseInsensitive(piece.holesB.quantity, filters.holesB_quantity)) {
    return false;
  }
  if (filters.holesB_diameter && !containsCaseInsensitive(piece.holesB.diameter, filters.holesB_diameter)) {
    return false;
  }
  if (filters.holesB_centerH && !containsCaseInsensitive(piece.holesB.centerH, filters.holesB_centerH)) {
    return false;
  }
  if (filters.holesB_centerV && !containsCaseInsensitive(piece.holesB.centerV, filters.holesB_centerV)) {
    return false;
  }

  // Information
  if (filters.pa && !containsCaseInsensitive(piece.paUsed, filters.pa)) {
    return false;
  }
  if (filters.systemCode && !containsCaseInsensitive(piece.systemCode, filters.systemCode)) {
    return false;
  }
  if (filters.observation && !containsCaseInsensitive(piece.observation, filters.observation)) {
    return false;
  }

  return true;
}

/**
 * Sort pieces array by field and direction.
 */
export function sortPieces(
  pieces: Piece[],
  sortField: SortField,
  direction: SortDirection
): Piece[] {
  return [...pieces].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'id': {
        const numA = extractIdNumber(a.id) ?? 0;
        const numB = extractIdNumber(b.id) ?? 0;
        comparison = numA - numB;
        break;
      }
      case 'description':
        comparison = a.description.localeCompare(b.description, 'pt-BR');
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'height': {
        const hA = parseFloat(a.height) || 0;
        const hB = parseFloat(b.height) || 0;
        comparison = hA - hB;
        break;
      }
      case 'width': {
        const wA = parseFloat(a.width) || 0;
        const wB = parseFloat(b.width) || 0;
        comparison = wA - wB;
        break;
      }
      case 'thickness':
        comparison = a.thickness.localeCompare(b.thickness, 'pt-BR');
        break;
      default:
        comparison = 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
