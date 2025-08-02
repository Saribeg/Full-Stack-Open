const { Kind } = require('graphql');
const createScalar = require('./utils/createScalar');

const validateYear = (value) => {
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(value)) {
    throw new Error('Year must be an integer');
  }

  if (value < 1000 || value > currentYear) {
    throw new Error(`Year must be a 4-digit number between 1000 and ${currentYear}`);
  }

  return value;
};

module.exports = createScalar(
  'Year',
  'A four-digit year between 1000 and the current year',
  validateYear,
  Kind.INT
);