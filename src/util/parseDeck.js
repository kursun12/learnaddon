/**
 * Parse a deck JSON string. Throws an Error if malformed.
 * Expected shape:
 * {
 *   "id": string,
 *   "title": string,
 *   "description": string?,
 *   "cards": [
 *     {"id": string, "question": string, "options": string[], "correct": number, "explanation"?: string}
 *   ]
 * }
 */
export function parseDeck(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new Error('Invalid JSON');
  }
  if (!data || typeof data !== 'object') throw new Error('Deck must be an object');
  if (!data.title || typeof data.title !== 'string') throw new Error('Deck title missing');
  if (!Array.isArray(data.cards)) throw new Error('Deck cards missing');

  data.cards.forEach((card, idx) => {
    if (!card || typeof card !== 'object') throw new Error(`Card ${idx} invalid`);
    if (!card.id) throw new Error(`Card ${idx} missing id`);
    if (typeof card.question !== 'string') throw new Error(`Card ${idx} missing question`);
    if (!Array.isArray(card.options) || card.options.length === 0) {
      throw new Error(`Card ${idx} options missing`);
    }
    if (typeof card.correct !== 'number' || card.correct < 0 || card.correct >= card.options.length) {
      throw new Error(`Card ${idx} correct index invalid`);
    }
  });
  return data;
}
