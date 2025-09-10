import React, { useState, useEffect } from 'react';
import Importer from './importer/Importer.jsx';
import Flashcards from './modes/Flashcards.jsx';
import Test from './modes/Test.jsx';
import { loadDecks } from './state/deckStore.js';

export default function App() {
  const [deck, setDeck] = useState(null);
  const [mode, setMode] = useState('flashcards');

  useEffect(() => {
    const decks = loadDecks();
    if (decks.length) setDeck(decks[0]);
  }, []);

  return (
    <main>
      <h1>SC-200 Quiz</h1>
      {deck ? (
        <div>
          <nav>
            <button onClick={() => setMode('flashcards')} aria-label="Flashcards mode">
              Flashcards
            </button>
            <button onClick={() => setMode('test')} aria-label="Test mode">
              Test
            </button>
          </nav>
          {mode === 'flashcards' ? (
            <Flashcards deck={deck} />
          ) : (
            <Test deck={deck} />
          )}
        </div>
      ) : (
        <Importer onImported={setDeck} />
      )}
    </main>
  );
}
