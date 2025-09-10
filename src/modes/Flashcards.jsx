import React, { useState, useEffect, useRef } from 'react';
import { shuffleArray } from '../util/shuffle.js';
import './Flashcards.css';

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
    <div className="flashcard-container">
      <h2>{deck.title}</h2>
      <div
        className={`flashcard card ${flipped ? 'flipped' : ''}`}
        onClick={flip}
        role="button"
        tabIndex={0}
        aria-label="flashcard"
        onKeyDown={(e) => e.key === 'Enter' && flip()}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face front">
            <p>{card.question}</p>
            {card.image && <img src={card.image} alt={card.question} />}
          </div>
          <div className="flashcard-face back">
            <p>{card.options[card.correct]}</p>
            {card.explanation && <p style={{ marginTop: '1rem' }}>{card.explanation}</p>}
            {card.refs && <p style={{ marginTop: '0.5rem' }}>{card.refs}</p>}
          </div>
        </div>
      </div>
      {card.audio && (
        <div>
          <audio ref={audioRef} src={card.audio} />
          <button onClick={playAudio} aria-label="Play audio">Play Audio</button>
        </div>
      )}
      <p>
        Card {index + 1} / {deck.cards.length}
      </p>
      <progress
        className="progress"
        value={index + 1}
        max={deck.cards.length}
        aria-label="Progress"
      />
      <div>
        <button onClick={shuffle} aria-label="Shuffle cards">
          Shuffle
        </button>
      </div>
      <div>
        <button onClick={prev} aria-label="Previous card">Prev</button>
        <button onClick={flip} aria-label="Flip card">Flip</button>
        <button onClick={next} aria-label="Next card">Next</button>
      </div>
    </div>
  );
}
