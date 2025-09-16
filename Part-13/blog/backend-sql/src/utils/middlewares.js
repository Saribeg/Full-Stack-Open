const jwt = require('jsonwebtoken');
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const { Blog, User } = require('../models');
const { SECRET, TEST_SECRET } = require('../utils/config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.scope('withUserName').findByPk(req.params.id);
  next();
};

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, _next) => {
  let statusCode = 500;
  let userError = { error: 'something went wrong' };

  if (error instanceof ValidationError) {
    statusCode = 400;
    userError = { error: error.message };
  } else if (error instanceof UniqueConstraintError) {
    statusCode = 400;
    userError = { error: 'unique constraint violation' };
  } else if (error instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    userError = { error: 'invalid foreign key reference' };
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    userError = { error: 'token invalid' };
  }

  console.error({
    status: statusCode,
    userError,
    originalError: {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
  });

  return res.status(statusCode).json(userError);
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const token = authorization.replace('Bearer ', '');
  const decodedToken = jwt.verify(
    token,
    (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? TEST_SECRET : SECRET
  );

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid (missing id)' });
  }

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: 'user not found for token' });
  }

  req.user = user;
  next();
};

module.exports = {
  blogFinder,
  unknownEndpoint,
  errorHandler,
  userExtractor
};