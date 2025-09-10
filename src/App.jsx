import React, { useState, useEffect } from 'react';
import Importer from './importer/Importer.jsx';
import Flashcards from './modes/Flashcards.jsx';
import Test from './modes/Test.jsx';
import Learn from './modes/Learn.jsx';
import Navbar from './ui/Navbar.jsx';
import Landing from './ui/Landing.jsx';
import Dashboard from './ui/Dashboard.jsx';
import { loadDecks, saveDeck } from './state/deckStore.js';
import { parseDeck } from './util/parseDeck.js';
import defaultCsv from '../data/questions.csv?raw';
import './App.css';

export default function App() {
  const [deck, setDeck] = useState(null);
  const [decks, setDecks] = useState([]);
  const [view, setView] = useState('landing');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    }
  }, []);

  return (
    <main>
      <h1>SC-200 Quiz</h1>
      {view === 'landing' && (
        <Landing
          decks={decks}
          onImport={() => setView('import')}
          onSelect={(d) => {
            setDeck(d);
            setView('dashboard');
          }}
        />
      )}
      {view === 'import' && (
        <Importer
          onImported={(d) => {
            setDeck(d);
            setDecks((ds) => [...ds, d]);
            setView('dashboard');
          }}
        />
      )}
      {view === 'dashboard' && deck && (
        <>
          <Navbar
            mode={view}
            setMode={setView}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <Dashboard deck={deck} onSelectMode={setView} />
        </>
      )}
      {['flashcards', 'learn', 'test'].includes(view) && deck && (
        <>
          <Navbar
            mode={view}
            setMode={setView}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          {view === 'flashcards' && <Flashcards deck={deck} />}
          {view === 'learn' && <Learn deck={deck} />}
          {view === 'test' && <Test deck={deck} />}
        </>
      )}
    </main>
  );
}
