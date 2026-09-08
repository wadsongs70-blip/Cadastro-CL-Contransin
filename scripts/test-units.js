import assert from 'assert';
import * as XLSX from 'xlsx';

// Test 1: ID Generation Logic
console.log('Testing ID Generation...');
const ID_PREFIX = 'ID-CL-';

function extractIdNumber(id) {
  if (!id) return null;
  const cleaned = id.replace(ID_PREFIX, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

function formatFullId(num) {
  const numericVal = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(numericVal) || numericVal < 0) return `${ID_PREFIX}001`;
  return `${ID_PREFIX}${String(numericVal).padStart(3, '0')}`;
}

function calculateNextIdNumber(existingIds) {
  if (!existingIds || existingIds.length === 0) return '001';
  let maxNum = 0;
  for (const id of existingIds) {
    const num = extractIdNumber(id);
    if (num !== null && num > maxNum) maxNum = num;
  }
  return String(maxNum + 1).padStart(3, '0');
}

assert.strictEqual(formatFullId(1), 'ID-CL-001');
assert.strictEqual(formatFullId(18), 'ID-CL-018');
assert.strictEqual(formatFullId(247), 'ID-CL-247');
assert.strictEqual(formatFullId(1050), 'ID-CL-1050');

assert.strictEqual(calculateNextIdNumber([]), '001');
assert.strictEqual(calculateNextIdNumber(['ID-CL-001', 'ID-CL-002', 'ID-CL-017']), '018');
assert.strictEqual(calculateNextIdNumber(['ID-CL-001', 'ID-CL-247']), '248');
console.log('✓ ID Generation passed!');

// Test 2: Global Search logic
console.log('Testing Global Search...');
function matchesGlobalSearch(piece, query) {
  if (!query || query.trim() === '') return true;
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const searchableString = [
    piece.id,
    piece.description,
    piece.height,
    piece.width,
    piece.thickness,
    piece.holesA?.quantity,
    piece.holesA?.diameter,
    piece.holesB?.quantity,
    piece.holesB?.diameter,
    piece.observation,
    piece.paUsed,
    piece.systemCode,
  ].filter(Boolean).join(' ').toLowerCase();

  return terms.every((term) => searchableString.includes(term));
}

const samplePiece = {
  id: 'ID-CL-047',
  description: 'Suporte lateral do cubo',
  height: '180',
  width: '150',
  thickness: '5/16"',
  holesA: { quantity: '4', diameter: '13', centerH: '100', centerV: '130' },
  holesB: { quantity: '1', diameter: '76', centerH: '75', centerV: '90' },
  observation: 'Chanfro 25 mm em todos os lados',
  paUsed: 'PA0220846',
  systemCode: 'MP0100280',
};

assert.strictEqual(matchesGlobalSearch(samplePiece, 'cubo'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, 'CUBO'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, 'PA0220846'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, '047'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, 'cubo 150'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, '5/16"'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, 'chanfro'), true);
assert.strictEqual(matchesGlobalSearch(samplePiece, 'engrenagem'), false);
console.log('✓ Global Search passed!');

// Test 3: Excel Structure and Merges
console.log('Testing Excel Structure...');
const headerRow1 = [
  'ID', 'Peça / Descrição', 'DIMENSÕES', '', '', 'FUROS A', '', '', '', 'FUROS B', '', '', '', 'INFORMAÇÕES ADICIONAIS', '', ''
];
const headerRow2 = [
  'ID', 'Peça / Descrição', 'Altura (mm)', 'Largura (mm)', 'Espessura',
  'Furos A - Qtde', 'Furos A - Diâmetro', 'Furos A - Entre Centros Horizontal', 'Furos A - Entre Centros Vertical',
  'Furos B - Qtde', 'Furos B - Diâmetro', 'Furos B - Entre Centros Horizontal', 'Furos B - Entre Centros Vertical',
  'Observação', 'PA Utilizado', 'Código Sistema'
];
const dataRow = [
  samplePiece.id, samplePiece.description, samplePiece.height, samplePiece.width, samplePiece.thickness,
  samplePiece.holesA.quantity, samplePiece.holesA.diameter, samplePiece.holesA.centerH, samplePiece.holesA.centerV,
  samplePiece.holesB.quantity, samplePiece.holesB.diameter, samplePiece.holesB.centerH, samplePiece.holesB.centerV,
  samplePiece.observation, samplePiece.paUsed, samplePiece.systemCode
];

const ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, dataRow]);
ws['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
  { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
  { s: { r: 0, c: 2 }, e: { r: 0, c: 4 } },
  { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } },
  { s: { r: 0, c: 9 }, e: { r: 0, c: 12 } },
  { s: { r: 0, c: 13 }, e: { r: 0, c: 15 } }
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Pecas');
const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
assert(buf.length > 0, 'Excel buffer must not be empty');
console.log(`✓ Excel Workbook generated successfully (${buf.length} bytes)!`);

console.log('\nALL 3 TEST SUITES PASSED FLAWLESSLY! ✨');
