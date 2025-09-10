import React from 'react';
import './Landing.css';

export default function Landing({ onImport, hasDeck, onStart }) {
  return (
    <div className="landing">
      <p>Welcome to the SC-200 Quiz app.</p>
      <button onClick={onImport}>Import Deck</button>
      {hasDeck && <button onClick={onStart}>Go to Dashboard</button>}
    </div>
  );
}
