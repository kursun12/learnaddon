import React, { useState, useEffect, useRef, useCallback } from 'react';
import { keyToIndex } from '../util/keyToIndex.js';
import { advanceLearnQueue } from '../util/learnQueue.js';

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

  const handleCheck = useCallback(() => {
    if (selected == null) return;
    setResult(selected === current.correct);
  }, [selected, current]);

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
  }, [result, current, selected, handleCheck, handleNext]);

  if (!current) {
    return (
      <div>
        <h2>{deck.title} - Mastered!</h2>
        <p>All cards mastered.</p>
      </div>
    );
  }

  const mastered = deck.cards.length - queue.length;
  return (
    <div>
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
        <div style={{ marginTop: '1rem' }}>
          <audio ref={audioRef} src={current.audio} />
          <button onClick={playAudio} aria-label="Play audio">
            Play Audio
          </button>
        </div>
      )}
      <form>
        {current.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="option"
                checked={selected === i}
                onChange={() => setSelected(i)}
                disabled={result != null}
              />
              {opt}
            </label>
          </div>
        ))}
      </form>
      {result == null ? (
        <button onClick={handleCheck} disabled={selected == null}>
          Check
        </button>
      ) : (
        <div>
          {result ? <p>Correct!</p> : <p>Incorrect.</p>}
          {current.explanation && <p>{current.explanation}</p>}
          {current.refs && <p>{current.refs}</p>}
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      <progress
        value={mastered}
        max={deck.cards.length}
        aria-label="Mastery progress"
      />
    </div>
  );
}
