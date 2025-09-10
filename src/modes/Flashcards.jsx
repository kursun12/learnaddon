import React, { useState, useEffect } from 'react';

export default function Flashcards({ deck }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck.cards[index];

  const next = () => {
    setIndex((i) => (i + 1) % deck.cards.length);
    setFlipped(false);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + deck.cards.length) % deck.cards.length);
    setFlipped(false);
  };

  const flip = () => setFlipped((f) => !f);

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
  });

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
        {flipped ? card.options[card.correct] : card.question}
      </div>
      <p>
        Card {index + 1} / {deck.cards.length}
      </p>
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
