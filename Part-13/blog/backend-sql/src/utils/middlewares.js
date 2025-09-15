const { Blog } = require('../models');
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
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

module.exports = {
  blogFinder,
  unknownEndpoint,
  errorHandler
};