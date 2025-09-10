import React, { useState, useEffect, useRef, useCallback } from 'react';
import { keyToIndex } from '../util/keyToIndex.js';
import { advanceLearnQueue } from '../util/learnQueue.js';
import './Learn.css';

export default function Learn({ deck }) {
  const [queue, setQueue] = useState(deck.cards);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // null or boolean
  const audioRef = useRef(null);
  const current = queue[0];

  const playAudio = (e) => {
    e.stopPropagation();
    audioRef.current?.play();
  };

  const handleSelect = useCallback(
    (i) => {
      if (result != null) return;
      setSelected(i);
      setResult(i === current.correct);
    },
    [result, current]
  );

  const handleNext = useCallback(() => {
    setQueue((q) => advanceLearnQueue(q, result));
    setSelected(null);
    setResult(null);
  }, [result]);

  useEffect(() => {
    const handler = (e) => {
      const idx = keyToIndex(e.key);
      if (result == null) {
        if (idx >= 0 && idx < current.options.length) {
          handleSelect(idx);
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
  }, [result, current, handleSelect, handleNext]);

  if (!current) {
    return (
      <div className="learn-container">
        <h2>{deck.title} - Mastered!</h2>
        <p>All cards mastered.</p>
      </div>
    );
  }

  const mastered = deck.cards.length - queue.length;
  return (
    <div className="learn-container">
      <h2>
        {deck.title} - Learn ({mastered}/{deck.cards.length})
      </h2>
      <p>{current.question}</p>
      {current.image && (
        <img
          src={current.image}
          alt={current.question}
          style={{ maxWidth: '100%', marginTop: '1rem' }}
        />
      )}
      {current.audio && (
        <div>
          <audio ref={audioRef} src={current.audio} />
          <button onClick={playAudio} aria-label="Play audio">Play Audio</button>
        </div>
      )}
      <form className="options">
        {current.options.map((opt, i) => (
          <label
            key={i}
            className={`option ${selected === i ? 'selected' : ''} ${
              result != null
                ? i === current.correct
                  ? 'correct'
                  : selected === i
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => handleSelect(i)}
          >
            <input
              type="radio"
              name="option"
              checked={selected === i}
              onChange={() => handleSelect(i)}
              disabled={result != null}
              style={{ display: 'none' }}
            />
            {opt}
          </label>
        ))}
      </form>
      {result != null && (
        <div>
          <p className="feedback">{result ? 'Correct!' : 'Incorrect.'}</p>
          {current.explanation && <p>{current.explanation}</p>}
          {current.refs && <p>{current.refs}</p>}
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      <progress
        className="progress"
        value={mastered}
        max={deck.cards.length}
        aria-label="Mastery progress"
      />
    </div>
  );
}
