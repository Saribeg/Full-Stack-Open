const { Kind } = require('graphql');
const createScalar = require('./utils/createScalar');

const validateYear = (value) => {
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(value)) throw new Error('Year must be an integer');

  if (value < -400 || value > currentYear) {
    throw new Error(`Year must be between 1000 and ${currentYear}`);
  }

  return value;
};

module.exports = createScalar(
  'Year',
  'A four-digit year between -400 and the current year',
  validateYear,
  Kind.INT
);
