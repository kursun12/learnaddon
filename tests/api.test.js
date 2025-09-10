const request = require('supertest');
const path = require('path');
const { initDB } = require('../server/db');
const { createApp } = require('../server/app');
const { loadData } = require('../scripts/loadData');

let app;
let db;

beforeAll(async () => {
  db = await initDB();
  await loadData(db, path.join(__dirname, '..', 'data', 'questions.csv'));
  app = createApp(db);
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

test('POST /api/questions/:id/answer returns correct true for right answer', async () => {
  const res = await request(app)
    .post('/api/questions/1/answer')
    .send({ answer: 'optionA' });
  expect(res.status).toBe(200);
  expect(res.body.correct).toBe(true);
  expect(res.body).toHaveProperty('explanation');
});

test('POST /api/questions/:id/answer returns correct false for wrong answer', async () => {
  const res = await request(app)
    .post('/api/questions/1/answer')
    .send({ answer: 'optionB' });
  expect(res.status).toBe(200);
  expect(res.body.correct).toBe(false);
  expect(res.body).toHaveProperty('explanation');
});
