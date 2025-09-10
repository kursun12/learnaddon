import React from 'react';
import './Landing.css';

export default function Landing({ decks, onImport, onSelect }) {
  return (
    <div className="landing">
      <p>Welcome to the SC-200 Quiz app.</p>
      {decks.length > 0 && (
        <div className="deck-list">
          {decks.map((d) => (
            <button key={d.id} onClick={() => onSelect(d)}>
              {d.title}
            </button>
          ))}
        </div>
      )}
      <button onClick={onImport}>Import Deck</button>
    </div>
  );
}
