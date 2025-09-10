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
  expect(() => parseDeck('{not json}')).toThrow('Invalid JSON');
});

test('throws on missing title', () => {
  const bad = { ...sample };
  delete bad.title;
  expect(() => parseDeck(JSON.stringify(bad))).toThrow('Deck title missing');
});

test('parses CSV deck', () => {
  const csv = 'id,question,optionA,optionB,correct\n1,Two?,Yes,No,A';
  const deck = parseDeck(csv);
  expect(deck.cards[0].question).toBe('Two?');
  expect(deck.cards[0].correct).toBe(0);
});

test('CSV missing column throws', () => {
  const csv = 'id,optionA,correct\n1,Yes,A';
  expect(() => parseDeck(csv)).toThrow('Missing required column: question');
});
