const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { initDB } = require('../server/db');

async function load() {
  const db = await initDB();
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM questions', (err) => {
      if (err) reject(err); else resolve();
    });
  });

  const insert = db.prepare(`INSERT INTO questions
    (id, question, optionA, optionB, optionC, optionD, correct, explanation, reference)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const csvPath = path.join(__dirname, '..', 'data', 'questions.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        insert.run([
          row.id,
          row.question,
          row.optionA,
          row.optionB,
          row.optionC,
          row.optionD,
          row.correct,
          row.explanation,
          row.reference
        ]);
      })
      .on('end', () => {
        insert.finalize();
        db.close();
        console.log('Data loaded');
        resolve();
      })
      .on('error', reject);
  });
}

load().catch((err) => {
  console.error(err);
  process.exit(1);
});
