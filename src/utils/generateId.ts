export const ID_PREFIX = 'ID-CL-';

/**
 * Extracts the integer number from an ID string like "ID-CL-018" or "018".
 */
export function extractIdNumber(id: string): number | null {
  if (!id) return null;
  const cleaned = id.replace(ID_PREFIX, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

/**
 * Formats a number into standard 3-digit padded ID format, e.g. 1 -> "ID-CL-001", 18 -> "ID-CL-018", 247 -> "ID-CL-247".
 */
export function formatFullId(num: number | string): string {
  const numericVal = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(numericVal) || numericVal < 0) {
    return `${ID_PREFIX}001`;
  }
  const padded = String(numericVal).padStart(3, '0');
  return `${ID_PREFIX}${padded}`;
}

/**
 * Formats just the numeric portion padded to 3 digits (or more if >= 1000).
 */
export function formatIdNumber(num: number | string): string {
  const numericVal = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(numericVal) || numericVal < 0) {
    return '001';
  }
  return String(numericVal).padStart(3, '0');
}

/**
 * Computes the next available ID number based on an array of existing IDs.
 * Finds the maximum number in existing IDs and adds 1.
 * If empty, returns "001".
 */
export function calculateNextIdNumber(existingIds: string[]): string {
  if (!existingIds || existingIds.length === 0) {
    return '001';
  }

  let maxNum = 0;
  for (const id of existingIds) {
    const num = extractIdNumber(id);
    if (num !== null && num > maxNum) {
      maxNum = num;
    }
  }

  return formatIdNumber(maxNum + 1);
}

/**
 * Computes the full next available ID string (e.g. "ID-CL-018").
 */
export function calculateNextFullId(existingIds: string[]): string {
  return `${ID_PREFIX}${calculateNextIdNumber(existingIds)}`;
}
