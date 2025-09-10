import React, { useState, useEffect, useRef } from 'react';
import { shuffleArray } from '../util/shuffle.js';

export default function Flashcards({ deck }) {
  const [order, setOrder] = useState(() => deck.cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const audioRef = useRef(null);

  const card = deck.cards[order[index]];

  const next = () => {
    setIndex((i) => (i + 1) % deck.cards.length);
    setFlipped(false);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + deck.cards.length) % deck.cards.length);
    setFlipped(false);
  };

  const shuffle = () => {
    setOrder((o) => shuffleArray(o));
    setIndex(0);
    setFlipped(false);
  };

  const flip = () => setFlipped((f) => !f);
  const playAudio = (e) => {
    e.stopPropagation();
    audioRef.current?.play();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        flip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{deck.title}</h2>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '2rem',
          cursor: 'pointer',
          minHeight: '200px',
        }}
        onClick={flip}
        role="button"
        tabIndex={0}
        aria-label="flashcard"
        onKeyDown={(e) => e.key === 'Enter' && flip()}
      >
        <p>{flipped ? card.options[card.correct] : card.question}</p>
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
        {flipped && card.explanation && (
          <p style={{ marginTop: '1rem' }}>{card.explanation}</p>
        )}
        {flipped && card.refs && (
          <p style={{ marginTop: '0.5rem' }}>{card.refs}</p>
        )}
      </div>
      <p>
        Card {index + 1} / {deck.cards.length}
      </p>
      <progress value={index + 1} max={deck.cards.length} aria-label="Progress" />
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={shuffle} aria-label="Shuffle cards" style={{ marginRight: '0.5rem' }}>
          Shuffle
        </button>
      </div>
      <button onClick={prev} aria-label="Previous card">
        Prev
      </button>
      <button onClick={flip} aria-label="Flip card">
        Flip
      </button>
      <button onClick={next} aria-label="Next card">
        Next
      </button>
    </div>
  );
}
