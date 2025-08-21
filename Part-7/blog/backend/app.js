const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

logger.info('connecting to MongoDB');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  /* c8 ignore next */
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
    process.exit(1);
  });

app.use(cors());
app.use(helmet());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;

  if (dbState === 1) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

if (process.env.NODE_ENV === 'test'
  /* c8 ignore next */
  || process.env.NODE_ENV === 'development') {
  const testRouter = require('./controllers/test');
  app.use('/api/test', testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;