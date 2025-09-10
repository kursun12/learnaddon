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

/**
 * Return cards answered incorrectly.
 * @param {{correct: number}[]} cards
 * @param {number[]} responses
 * @returns {{correct: number}[]}
 */
export function getIncorrectCards(cards, responses) {
  return cards.filter((card, i) => responses[i] !== card.correct);
}
