const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.code === 11000 || (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error'))) {
    return response.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  let token = null;

  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  }

  request.token = token;
  next();
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const token = authorization.replace('Bearer ', '');
  const decodedToken = jwt.verify(
    token,
    (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? process.env.TEST_SECRET : process.env.SECRET
  );

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid (missing id)' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: 'user not found for token' });
  }

  request.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};