const createScalar = require('./utils/createScalar');

const validateUsername = (value) => {
  if (typeof value !== 'string') {
    throw new Error('Username must be a string');
  }

  const trimmed = value.trim();
  const regex = /^[a-zA-Z0-9_-]{3,15}$/;

  if (!regex.test(trimmed)) {
    throw new Error('Username must be 3-15 characters long and contain only letters, numbers, underscores or hyphens');
  }

  return trimmed;
};

module.exports = createScalar(
  'Username',
  'Alphanumeric username (3–15 chars, a-z, 0-9, _ or -)',
  validateUsername
);
