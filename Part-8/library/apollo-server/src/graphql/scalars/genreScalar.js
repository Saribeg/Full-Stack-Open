const createScalar = require('./utils/createScalar');

const validateGenre = (value) => {
  if (typeof value !== 'string') throw new Error('Genre must be a string');

  const trimmed = value.trim().toLowerCase();

  if (trimmed.length < 2 || trimmed.length > 30) {
    throw new Error('Genre must be between 2 and 30 characters');
  }

  const regex = /^[a-z\s-]+$/;

  if (!regex.test(trimmed)) {
    throw new Error('Genre must contain only lowercase Latin letters, spaces, or hyphens');
  }

  return trimmed;
};

module.exports = createScalar(
  'Genre',
  'A normalized book genre (lowercase, 2–30 chars)',
  validateGenre
);
