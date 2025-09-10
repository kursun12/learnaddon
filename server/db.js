const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function initDB() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'data', 'questions.db');
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        question TEXT NOT NULL,
        optionA TEXT,
        optionB TEXT,
        optionC TEXT,
        optionD TEXT,
        correct TEXT NOT NULL,
        explanation TEXT,
        reference TEXT
      )`, (err) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  });
}

module.exports = { initDB };
