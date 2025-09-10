import React, { useState } from 'react';
import { scoreTest, getIncorrectCards } from '../util/scoreTest.js';

export default function Test({ deck }) {
  const [cards, setCards] = useState(deck.cards);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const card = cards[index];

  if (index >= cards.length) {
    const summary = scoreTest({ cards }, responses);
    const incorrect = getIncorrectCards(cards, responses);

    const handleRetake = () => {
      if (!incorrect.length) return;
      setCards(incorrect);
      setIndex(0);
      setResponses([]);
      setSelected(null);
      setChecked(false);
    };

    return (
      <div>
        <h2>Results</h2>
        <p>
          Score: {summary.correct} / {summary.total}
        </p>
        <ul>
          {cards.map((c, i) => (
            <li key={c.id || i}>
              <p>{c.question}</p>
              {responses[i] === c.correct ? (
                <p>Correct</p>
              ) : (
                <p>
                  Incorrect. Correct: {c.options[c.correct]}
                </p>
              )}
              {c.explanation && <p>{c.explanation}</p>}
            </li>
          ))}
        </ul>
        {incorrect.length > 0 && (
          <button onClick={handleRetake} aria-label="Retake incorrect questions">
            Retake incorrect ({incorrect.length})
          </button>
        )}
      </div>
    );
  }

  const handleCheck = () => {
    if (selected == null) return;
    const nextResponses = [...responses];
    nextResponses[index] = selected;
    setResponses(nextResponses);
    setChecked(true);
  };

  const handleNext = () => {
    setSelected(null);
    setChecked(false);
    setIndex((i) => i + 1);
  };

  return (
    <div>
      <h2>{deck.title} - Question {index + 1}</h2>
      <p>{card.question}</p>
      <form>
        {card.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="option"
                checked={selected === i}
                onChange={() => setSelected(i)}
                disabled={checked}
              />
              {opt}
            </label>
          </div>
        ))}
      </form>
      {!checked ? (
        <button onClick={handleCheck} disabled={selected == null}>
          Check
        </button>
      ) : (
        <div>
          {selected === card.correct ? <p>Correct!</p> : <p>Incorrect.</p>}
          {card.explanation && <p>{card.explanation}</p>}
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}
