import { parseDeck } from '../src/util/parseDeck.js';

const sample = {
  id: '1',
  title: 'Sample',
  cards: [
    { id: 'c1', question: 'Q1', options: ['A', 'B'], correct: 0 },
  ],
};

test('parses valid deck', () => {
  const deck = parseDeck(JSON.stringify(sample));
  expect(deck.title).toBe('Sample');
  expect(deck.cards).toHaveLength(1);
});

test('throws on invalid json', () => {
  expect(() => parseDeck('not json')).toThrow('Invalid JSON');
});

test('throws on missing title', () => {
  const bad = { ...sample };
  delete bad.title;
  expect(() => parseDeck(JSON.stringify(bad))).toThrow('Deck title missing');
});
