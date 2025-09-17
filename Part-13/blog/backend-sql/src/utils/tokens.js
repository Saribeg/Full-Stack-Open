const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { SECRET, TEST_SECRET, ACCESS_TTL, REFRESH_TTL_DAYS } = require('./config');

const getAccessTokenSecret = () =>
  (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')
    ? TEST_SECRET
    : SECRET;

function generateAccessToken(payload) {
  return jwt.sign(payload, getAccessTokenSecret(), { expiresIn: ACCESS_TTL });
}

function generateRefreshToken() {
  const raw = crypto.randomBytes(32).toString('base64url');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

function getRefreshExpiryDate() {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshExpiryDate,
};
