const express = require('express');

function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get('/api/questions', (req, res) => {
    db.all('SELECT * FROM questions', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.get('/api/questions/random', (req, res) => {
    const count = Math.max(parseInt(req.query.count, 10) || 1, 1);
    db.all('SELECT * FROM questions ORDER BY RANDOM() LIMIT ?', [count], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.get('/api/questions/:id', (req, res) => {
    db.get('SELECT * FROM questions WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(row);
    });
  });

  app.post('/api/questions/:id/answer', (req, res) => {
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    db.get(
      'SELECT correct, explanation, reference FROM questions WHERE id = ?',
      [req.params.id],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: 'Not found' });
        }

        const isCorrect = row.correct === answer;
        res.json({
          correct: isCorrect,
          explanation: row.explanation,
          reference: row.reference
        });
      }
    );
  });

  return app;
}

module.exports = { createApp };
