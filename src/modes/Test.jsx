import React, { useState, useEffect, useRef, useCallback } from 'react';
import { scoreTest, getIncorrectCards } from '../util/scoreTest.js';
import { keyToIndex } from '../util/keyToIndex.js';

export default function Test({ deck }) {
  const [cards, setCards] = useState(deck.cards);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const audioRef = useRef(null);

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
              {c.image && (
                <img
                  src={c.image}
                  alt={c.question}
                  style={{ maxWidth: '100%', marginTop: '0.5rem' }}
                />
              )}
              {c.audio && (
                <audio
                  controls
                  src={c.audio}
                  style={{ display: 'block', marginTop: '0.5rem' }}
                />
              )}
              {c.explanation && <p>{c.explanation}</p>}
              {c.refs && <p>{c.refs}</p>}
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

  const handleCheck = useCallback(() => {
    if (selected == null) return;
    const nextResponses = [...responses];
    nextResponses[index] = selected;
    setResponses(nextResponses);
    setChecked(true);
  }, [index, responses, selected]);

  const handleNext = useCallback(() => {
    setSelected(null);
    setChecked(false);
    setIndex((i) => i + 1);
  }, []);

  const playAudio = (e) => {
    e.stopPropagation();
    audioRef.current?.play();
  };

  useEffect(() => {
    const handler = (e) => {
      const idx = keyToIndex(e.key);
      if (!checked) {
        if (idx >= 0 && idx < card.options.length) {
          setSelected(idx);
        }
        if (e.key === 'Enter' && selected != null) {
          e.preventDefault();
          handleCheck();
        }
      } else {
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [checked, card.options.length, selected, handleCheck, handleNext]);

  return (
    <div>
      <h2>{deck.title} - Question {index + 1}</h2>
      <p>{card.question}</p>
      {card.image && (
        <img
          src={card.image}
          alt={card.question}
          style={{ maxWidth: '100%', marginTop: '1rem' }}
        />
      )}
      {card.audio && (
        <div style={{ marginTop: '1rem' }}>
          <audio ref={audioRef} src={card.audio} />
          <button onClick={playAudio} aria-label="Play audio">
            Play Audio
          </button>
        </div>
      )}
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
          {card.refs && <p>{card.refs}</p>}
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}
