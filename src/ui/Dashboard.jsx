import React from 'react';
import './Dashboard.css';

export default function Dashboard({ deck, onSelectMode }) {
  return (
    <div className="dashboard">
      <h2>{deck.title}</h2>
      <p>{deck.cards.length} cards</p>
      <div className="actions">
        <button onClick={() => onSelectMode('flashcards')}>Flashcards</button>
        <button onClick={() => onSelectMode('learn')}>Learn</button>
        <button onClick={() => onSelectMode('test')}>Test</button>
      </div>
    </div>
  );
}
