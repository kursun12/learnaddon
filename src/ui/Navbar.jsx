import React from 'react';
import { Home, FlipHorizontal2, BookOpen, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function Navbar({ mode, setMode, theme, toggleTheme }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'flashcards', label: 'Flashcards', icon: <FlipHorizontal2 size={18} /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen size={18} /> },
    { id: 'test', label: 'Test', icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <header className="navbar">
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={mode === item.id ? 'active' : ''}
            onClick={() => setMode(item.id)}
            aria-label={`${item.label} mode`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
