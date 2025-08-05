const { unwrapResolverError } = require('@apollo/server/errors');
const mongoose = require('mongoose');

// In order to avoid try - catchs in resolvers
// I decided to utilize formatError hook from
// https://www.apollographql.com/docs/apollo-server/data/errors#handling-errors
const formatError = (formattedError, error) => {
  const original = unwrapResolverError(error);
  const operation = formattedError?.path?.[0] ?? 'unknown';

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

  if (original instanceof mongoose.Error.ValidationError) {
    const fields = Object.keys(original.errors || {});

    const duplicateFields = fields.filter(
      f => original.errors[f]?.kind === 'unique'
    );

    if (duplicateFields.length > 0) {
      const duplicates = duplicateFields
        .map(f => `${f} = "${original.errors[f].value}"`)
        .join(', ');

      return {
        message: `Duplicate value(s): ${duplicates}`,
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: duplicateFields,
        },
      };
    }

    return {
      message: `Validation failed on fields: "${fields.join(', ')}" during operation ${operation}`,
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: fields,
      },
    };
  }

  if (original.code === 11000 || (original.name === 'MongoServerError' && original.message.includes('E11000 duplicate key error'))) {
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
      ...formattedError.extensions,
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
    },
  };
};

module.exports = { formatError };
