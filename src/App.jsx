import React, { useState, useEffect } from 'react';
import Importer from './importer/Importer.jsx';
import Flashcards from './modes/Flashcards.jsx';
import { loadDecks } from './state/deckStore.js';

export default function App() {
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const decks = loadDecks();
    if (decks.length) setDeck(decks[0]);
  }, []);

  return (
    <main>
      <h1>SC-200 Quiz</h1>
      {deck ? (
        <Flashcards deck={deck} />
      ) : (
        <Importer onImported={setDeck} />
      )}
    </main>
  );
}
