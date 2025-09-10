const fs = require('fs');
const os = require('os');
const path = require('path');
const { initDB } = require('../server/db');
const { loadData } = require('../scripts/loadData');

function getRow(db, id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM questions WHERE id = ?', [id], (err, row) => {
      if (err) reject(err); else resolve(row);
    });
  });
}

test('loadData imports JSON files', async () => {
  const db = await initDB();
  await loadData(db, path.join(__dirname, '..', 'data', 'questions.json'));
  const row = await getRow(db, 1);
  expect(row.question).toMatch(/Defender for Identity/);
  db.close();
});

test('loadData rejects rows missing required fields', async () => {
  const db = await initDB();
  const badPath = path.join(os.tmpdir(), 'bad.json');
  fs.writeFileSync(badPath, JSON.stringify([{ id: 1, optionA: 'A', correct: 'optionA' }]));
  await expect(loadData(db, badPath)).rejects.toThrow(/question/);
  db.close();
});
