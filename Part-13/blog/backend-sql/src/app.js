const express = require('express');
const cors = require('cors');
const sequelize = require('./utils/db');
const middleware = require('./utils/middlewares');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
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

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;