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

test('parses optional image/audio fields', () => {
  const json = JSON.stringify({
    ...sample,
    cards: [
      {
        id: 'c1',
        question: 'Q1',
        options: ['A', 'B'],
        correct: 0,
        image: 'img.png',
        audio: 'sound.mp3',
      },
    ],
  });
  const deck = parseDeck(json);
  expect(deck.cards[0].image).toBe('img.png');
  expect(deck.cards[0].audio).toBe('sound.mp3');

  const csv = 'id,question,optionA,optionB,correct,image,audio\n1,Two?,Yes,No,A,pic.jpg,clip.mp3';
  const csvDeck = parseDeck(csv);
  expect(csvDeck.cards[0].image).toBe('pic.jpg');
  expect(csvDeck.cards[0].audio).toBe('clip.mp3');
});

test('CSV missing column throws', () => {
  const csv = 'id,optionA,correct\n1,Yes,A';
  expect(() => parseDeck(csv)).toThrow('Missing required column: question');
});
