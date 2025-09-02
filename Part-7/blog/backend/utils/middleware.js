const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const { SECRET, TEST_SECRET } = require('./config');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  const correlationId = uuid();
  request.correlationId = correlationId;

  if (process.env.NODE_ENV === 'development') {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.originalUrl);
    if (request.body && Object.keys(request.body).length > 0) {
      logger.info('Body:  ', request.body);
    }
    logger.info('---');
  } else {
    response.on('finish', () => {
      if (
        request.originalUrl === '/health' &&
      (request.get('user-agent') || '').includes('Consul Health Check')
      ) {
        return;
      }

      logger.info({
        correlationId,
        method: request.method,
        path: request.originalUrl,
        status: response.statusCode,
        body: request.body ?? {},
        ip: request.ip,
        userAgent: request.get('user-agent')
      });
    });
  }

  return next();
};

const unknownEndpoint = (req, res) => {
  logger.info({
    correlationId: req.correlationId,
    message: 'unknown endpoint'
  });

  return res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, _next) => {
  let statusCode = 500;
  let userError = { error: 'something went wrong' };

  if (error.name === 'CastError') {
    statusCode = 400;
    userError = { error: 'malformatted id' };
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    userError = { error: error.message };
  } else if (
    error.code === 11000 ||
    (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error'))
  ) {
    statusCode = 400;
    userError = { error: 'expected `username` to be unique' };
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    userError = { error: 'token invalid' };
  }

  logger.error({
    correlationId: request.correlationId,
    status: statusCode,
    userError,
    originalError: {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
  });

  return response.status(statusCode).json(userError);
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
    (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? TEST_SECRET : SECRET
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