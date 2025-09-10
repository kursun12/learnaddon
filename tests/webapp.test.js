const request = require('supertest');
const { initDB } = require('../server/db');
const { createApp } = require('../server/app');

let app;
let db;

beforeAll(async () => {
  db = await initDB();
  app = createApp(db);
});

afterAll(() => {
  db.close();
});

test('GET / serves the web app', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
  expect(res.type).toMatch(/html/);
  expect(res.text).toContain('SC-200 Quiz');
});
