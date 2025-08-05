const createScalar = require('./utils/createScalar');

const validatePassword = (value) => {
  if (typeof value !== 'string') {
    throw new Error('Password must be a string');
  }

  const trimmed = value.trim();

  if (trimmed.length < 3 || trimmed.length > 15) {
    throw new Error('Password must be between 3 and 15 characters');
  }

  return trimmed;
};

module.exports = createScalar(
  'Password',
  'A secure password (3–15 chars)',
  validatePassword
);
