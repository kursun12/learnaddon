const request = require('supertest');
const { initDB } = require('../server/db');
const { createApp } = require('../server/app');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let app;
let db;

beforeAll(async () => {
  db = await initDB();
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM questions', (err) => {
      if (err) reject(err); else resolve();
    });
  });

  const insert = db.prepare(`INSERT INTO questions
    (id, question, optionA, optionB, optionC, optionD, correct, explanation, reference)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const csvPath = path.join(__dirname, '..', 'data', 'questions.csv');

  await new Promise((resolve, reject) => {
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
        resolve();
      })
      .on('error', reject);
  });

  app = createApp(db);
});

afterAll(() => {
  db.close();
});

test('GET /api/questions returns questions', async () => {
  const res = await request(app).get('/api/questions');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  expect(res.body[0]).toHaveProperty('question');
});

test('GET /api/questions/random returns one question by default', async () => {
  const res = await request(app).get('/api/questions/random');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(1);
  expect(res.body[0]).toHaveProperty('question');
});

test('GET /api/questions/random?count=2 returns two random questions', async () => {
  const res = await request(app).get('/api/questions/random?count=2');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(2);
  const ids = res.body.map((q) => q.id);
  expect(new Set(ids).size).toBe(2);
});
