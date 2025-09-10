import React, { useState, useEffect } from 'react';
import Importer from './importer/Importer.jsx';
import Flashcards from './modes/Flashcards.jsx';
import Test from './modes/Test.jsx';
import Learn from './modes/Learn.jsx';
import Navbar from './ui/Navbar.jsx';
import { loadDecks } from './state/deckStore.js';
import './App.css';

export default function App() {
  const [deck, setDeck] = useState(null);
  const [mode, setMode] = useState('flashcards');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const decks = loadDecks();
    if (decks.length) setDeck(decks[0]);
  }, []);

  return (
    <main>
      <h1>SC-200 Quiz</h1>
      {deck ? (
        <>
          <Navbar
            mode={mode}
            setMode={setMode}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          {mode === 'flashcards' && <Flashcards deck={deck} />}
          {mode === 'learn' && <Learn deck={deck} />}
          {mode === 'test' && <Test deck={deck} />}
        </>
      ) : (
        <Importer onImported={setDeck} />
      )}
    </main>
  );
}
