const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const rateLimit = require('express-rate-limit');
const express = require('express');

const logger = require('./logger');
const config = require('./config');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  const correlationId = uuid();
  request.correlationId = correlationId;

  if (config.isDev()) {
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
        userAgent: request.get('user-agent'),
      });
    });
  }

  return next();
};

const unknownEndpoint = (req, res) => {
  logger.info({
    correlationId: req.correlationId,
    message: 'unknown endpoint',
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
    (error.name === 'MongoServerError' &&
      error.message.includes('E11000 duplicate key error'))
  ) {
    statusCode = 400;
    userError = { error: 'expected `username` to be unique' };
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    userError = { error: 'token invalid' };
  } else if (error.type === 'entity.too.large' || error.name === 'PayloadTooLargeError') {
    statusCode = 413;
    userError = { error: 'Payload Too Large' };
  }

  logger.error({
    correlationId: request.correlationId,
    status: statusCode,
    userError,
    originalError: {
      name: error.name,
      message: error.message,
      ...(config.isDev() ? { stack: error.stack } : {}),
    },
  });

  return response.status(statusCode).json(userError);
};

const tokenExtractor = (request, _response, next) => {
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
    config.isProd() ? config.SECRET : config.TEST_SECRET
  );

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'token invalid (missing id)' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: 'user not found for token' });
  }

  request.user = user;
  next();
};

const jsonBodyLimit = express.json({ limit: config.JSON_BODY_LIMIT });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.AUTH_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({ error: 'Too many login attempts, try again later' }),
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.WRITE_RATE_MAX_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({ error: 'Too many write requests, slow down' }),
});

const writeLimiterMiddleware = (req, res, next) => {
  const isCI = process.env.CI === 'true' || config.isTest();
  if (isCI) return next();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  return next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  jsonBodyLimit,
  authLimiter,
  writeLimiterMiddleware,
};