const { unwrapResolverError } = require('@apollo/server/errors');
const mongoose = require('mongoose');

// In order to avoid try - catchs in resolvers
// I decided to utilize formatError hook from
// https://www.apollographql.com/docs/apollo-server/data/errors#handling-errors
const formatError = (formattedError, error) => {
  const original = unwrapResolverError(error);
  const operation = formattedError.path[0];

  if (original instanceof mongoose.Error.ValidationError) {
    const fields = Object.keys(original.errors).join(', ');

    return {
      message: `Validation failed on fields: "${fields}" during operation "${operation}"`,
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: Object.keys(original.errors),
        error
      },
    };
  }

  if (original instanceof mongoose.Error.CastError) {
    const field = original.path;

    return {
      message: `Invalid ID format for field "${field}"`,
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: [original.path],
        error
      },
    };
  }

  if (original?.code === 11000) {
    const fields = Object.keys(original.keyValue || {});
    const values = Object.values(original.keyValue || {});

    return {
      message: `Duplicate value for field(s): "${fields.join(', ')} (${values.join(', ')})"`,
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: Object.keys(original.keyValue || {}),
        error
      },
    };
  }

  // fallback
  return {
    message: formattedError.message,
    extensions: {
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
    },
  };
};

module.exports = { formatError };
