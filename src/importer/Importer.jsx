import React, { useState } from 'react';
import { parseDeck } from '../util/parseDeck.js';
import { saveDeck } from '../state/deckStore.js';
import './Importer.css';

export default function Importer({ onImported }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      const deck = parseDeck(text);
      saveDeck(deck);
      setText('');
      setError('');
      onImported(deck);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="importer">
      <h2>Import Deck (JSON or CSV)</h2>
      <input
        type="file"
        accept=".json,.csv"
        onChange={handleFile}
        aria-label="Deck file"
      />
      <textarea
        aria-label="Deck JSON or CSV"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleImport}>Import</button>
    </div>
  );
}
