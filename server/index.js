const { initDB } = require('./db');
const { createApp } = require('./app');

const port = process.env.PORT || 3001;

initDB()
  .then((db) => {
    const app = createApp(db);
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
  });
