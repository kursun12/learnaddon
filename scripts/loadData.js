const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { initDB } = require('../server/db');

const REQUIRED_FIELDS = ['id', 'question', 'correct'];
const OPTION_KEYS = ['optionA','optionB','optionC','optionD','optionE','optionF','optionG','optionH'];

function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.json') {
    const text = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('Invalid JSON: ' + err.message);
    }
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array');
    }
    return data;
  }
  if (ext === '.csv') {
    return new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
  throw new Error('Unsupported file type: ' + ext);
}

function validateRow(row, index) {
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || String(row[field]).trim() === '') {
      throw new Error(`Row ${index} is missing required field '${field}'`);
    }
  }
  const hasOption = OPTION_KEYS.some((k) => row[k] && String(row[k]).trim() !== '');
  if (!hasOption) {
    throw new Error(`Row ${index} must include at least one option`);
  }
  const correct = String(row.correct).trim();
  if (!OPTION_KEYS.includes(correct)) {
    throw new Error(`Row ${index} has invalid correct option '${correct}'`);
  }
  if (!row[correct] || String(row[correct]).trim() === '') {
    throw new Error(`Row ${index} correct option '${correct}' has no value`);
  }
}

async function loadData(db, filePath) {
  const rows = await parseFile(filePath);
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM questions', (err) => (err ? reject(err) : resolve()));
  });
  const stmt = db.prepare(`INSERT INTO questions
    (id, question, optionA, optionB, optionC, optionD, optionE, optionF, optionG, optionH, correct, explanation, reference, image, audio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  try {
    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i];
      const index = i + 1;
      const row = {};
      Object.keys(raw).forEach((k) => {
        row[k] = typeof raw[k] === 'string' ? raw[k].trim() : raw[k];
      });
      validateRow(row, index);
      const values = [
        Number(row.id),
        row.question,
        row.optionA || null,
        row.optionB || null,
        row.optionC || null,
        row.optionD || null,
        row.optionE || null,
        row.optionF || null,
        row.optionG || null,
        row.optionH || null,
        row.correct,
        row.explanation || null,
        row.reference || null,
        row.image || null,
        row.audio || null
      ];
      await new Promise((resolve, reject) => stmt.run(values, (err) => (err ? reject(err) : resolve())));
    }
  } finally {
    await new Promise((resolve, reject) => stmt.finalize((err) => (err ? reject(err) : resolve())));
  }
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '..', 'data', 'questions.csv');
  initDB()
    .then((db) => loadData(db, file).then(() => {
      db.close();
      console.log('Data loaded');
    }))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = { loadData };
