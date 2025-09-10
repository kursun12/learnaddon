/**
 * Parse a deck from either JSON or CSV text. Throws an Error if malformed.
 * The returned shape is:
 * {
 *   id: string,
 *   title: string,
 *   description?: string,
 *   cards: [
 *     {
 *       id: string,
 *       question: string,
 *       options: string[],
 *       correct: number,
 *       explanation?: string,
 *       refs?: string,
 *       image?: string,
 *       audio?: string,
 *     }
 *   ]
 * }
 */
export function parseDeck(input) {
  const text = input.trim();
  if (!text) throw new Error('Empty input');
  if (text.startsWith('{') || text.startsWith('[')) {
    return parseJSONDeck(text);
  }
  return parseCSVDeck(text);
}

function parseJSONDeck(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }
  if (!data || typeof data !== 'object') throw new Error('Deck must be an object');
  if (!data.title || typeof data.title !== 'string') throw new Error('Deck title missing');
  if (!Array.isArray(data.cards)) throw new Error('Deck cards missing');

  data.cards.forEach((card, idx) => validateCard(card, idx));
  return data;
}

function parseCSVDeck(csv) {
  const rows = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length);
  if (rows.length < 2) throw new Error('CSV must have a header and at least one row');

  const headers = splitCSVLine(rows[0]);
  const required = ['id', 'question', 'correct'];
  required.forEach((h) => {
    if (!headers.includes(h)) throw new Error(`Missing required column: ${h}`);
  });

  const optionCols = headers.filter((h) => /^option[A-H]$/i.test(h));

  const cards = rows.slice(1).map((line, idx) => {
    const values = splitCSVLine(line);
    if (values.length !== headers.length) {
      throw new Error(`Row ${idx + 1} has wrong number of columns`);
    }
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i];
    });

    const options = optionCols.map((c) => row[c]).filter(Boolean);
    const card = {
      id: row.id,
      question: row.question,
      options,
      correct: parseCorrect(row.correct, options.length, idx),
    };

    if (row.explanation) card.explanation = row.explanation;
    if (row.refs) card.refs = row.refs;
    if (row.image) card.image = row.image;
    if (row.audio) card.audio = row.audio;

    validateCard(card, idx);
    return card;
  });

  return {
    id: `deck-${Date.now()}`,
    title: 'Imported Deck',
    cards,
  };
}

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseCorrect(value, optionCount, rowIdx) {
  let index;
  if (/^[A-H]$/i.test(value)) {
    index = value.toUpperCase().charCodeAt(0) - 65;
  } else {
    const num = Number(value);
    if (!Number.isInteger(num)) {
      throw new Error(`Row ${rowIdx + 1} invalid correct value`);
    }
    index = num;
  }
  if (index < 0 || index >= optionCount) {
    throw new Error(`Row ${rowIdx + 1} correct index invalid`);
  }
  return index;
}

function validateCard(card, idx) {
  if (!card || typeof card !== 'object') throw new Error(`Card ${idx} invalid`);
  if (!card.id) throw new Error(`Card ${idx} missing id`);
  if (typeof card.question !== 'string' || !card.question) {
    throw new Error(`Card ${idx} missing question`);
  }
  if (!Array.isArray(card.options) || card.options.length === 0) {
    throw new Error(`Card ${idx} options missing`);
  }
  if (
    typeof card.correct !== 'number' ||
    card.correct < 0 ||
    card.correct >= card.options.length
  ) {
    throw new Error(`Card ${idx} correct index invalid`);
  }
}

