const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const blogsRouter = require('./controllers/blogs');

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();

app.get('/health', (req, res) => {
  res.send('Working');
});

app.use('/api/blogs', blogsRouter);

module.exports = app;