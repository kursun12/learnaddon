import { scoreTest, getIncorrectCards } from '../src/util/scoreTest.js';

describe('scoreTest', () => {
  const deck = {
    cards: [
      { correct: 1 },
      { correct: 0 },
      { correct: 2 }
    ]
  };

  it('scores correct answers', () => {
    const res = scoreTest(deck, [1, 0, 2]);
    expect(res).toEqual({ correct: 3, total: 3, results: [true, true, true] });
  });

  it('scores mixed answers', () => {
    const res = scoreTest(deck, [0, 0, 1]);
    expect(res).toEqual({ correct: 1, total: 3, results: [false, true, false] });
  });

  it('gets incorrect cards', () => {
    const wrong = getIncorrectCards(deck.cards, [0, 0, 1]);
    expect(wrong).toHaveLength(2);
    expect(wrong[0]).toBe(deck.cards[0]);
    expect(wrong[1]).toBe(deck.cards[2]);
  });
});
