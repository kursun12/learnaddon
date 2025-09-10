export const STORAGE_KEY = 'decks';

export function loadDecks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDeck(deck) {
  const decks = loadDecks();
  decks.push(deck);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}
