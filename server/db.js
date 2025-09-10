const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function initDB() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'data', 'questions.db');
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      const schema = `CREATE TABLE questions (
        id INTEGER PRIMARY KEY,
        question TEXT NOT NULL,
        optionA TEXT,
        optionB TEXT,
        optionC TEXT,
        optionD TEXT,
        optionE TEXT,
        optionF TEXT,
        optionG TEXT,
        optionH TEXT,
        correct TEXT NOT NULL,
        explanation TEXT,
        reference TEXT,
        image TEXT,
        audio TEXT
      )`;
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS questions');
        db.run(schema, (err2) => {
          if (err2) return reject(err2);
          resolve(db);
        });
      });
    });
  });
}

module.exports = { initDB };
