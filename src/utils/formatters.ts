/**
 * Formats an ISO date string to Brazilian format DD/MM/YYYY
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Formats an ISO date string to DD/MM/YYYY HH:mm
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

/**
 * Check if an ISO date string is from today
 */
export function isToday(isoString: string): boolean {
  if (!isoString) return false;
  try {
    const date = new Date(isoString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Clean and format dimension string with unit
 */
export function formatDimension(val: string | number | undefined, unit = 'mm'): string {
  if (val === undefined || val === null || val === '') return '-';
  const str = String(val).trim();
  if (str.endsWith(unit) || str.endsWith('"') || str.includes('x')) {
    return str;
  }
  return `${str} ${unit}`;
}
