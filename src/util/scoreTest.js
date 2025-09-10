/**
 * Compute quiz score.
 * @param {{cards: {correct: number}[]}} deck
 * @param {number[]} responses Index of chosen option per card.
 * @returns {{correct: number, total: number, results: boolean[]}}
 */
export function scoreTest(deck, responses) {
  const total = deck.cards.length;
  const results = deck.cards.map((card, i) => {
    return responses[i] === card.correct;
  });
  const correct = results.filter(Boolean).length;
  return { correct, total, results };
}
