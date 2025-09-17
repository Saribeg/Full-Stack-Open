const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Session, User } = require('../models');
const { SECRET, TEST_SECRET, ACCESS_TTL, REFRESH_TTL_DAYS } = require('./config');

const getAccessTokenSecret = () =>
  (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')
    ? TEST_SECRET
    : SECRET;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, getAccessTokenSecret(), { expiresIn: ACCESS_TTL });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessTokenSecret());
};


const hashRefreshToken = (raw) => {
  return crypto.createHash('sha256').update(raw).digest('hex');
};

const generateRefreshToken = () => {
  const raw = crypto.randomBytes(32).toString('base64url');
  const hash = hashRefreshToken(raw);
  return { raw, hash };
};

const getRefreshExpiryDate = () => {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
};

const setRefreshSession = async (res, userId, { deviceId, ip, userAgent }) => {
  const { raw: refreshToken, hash: hashedRefreshToken } = generateRefreshToken();
  const expiresAt = getRefreshExpiryDate();

  await Session.create({
    userId,
    hashedRefreshToken,
    expiresAt,
    deviceId,
    ip,
    userAgent
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: process.env.NODE_ENV === 'production' ? '/api/refresh' : '/',
    maxAge: expiresAt.getTime() - Date.now(),
  });

  return { refreshToken, expiresAt };
};

const getRefreshSession = async (raw) => {
  const hashedRefreshToken = hashRefreshToken(raw);
  return await Session.findOne({
    where: { hashedRefreshToken },
    include: { model: User }
  });
};

async function validateRefreshSession(raw) {
  if (!raw) {
    throw { status: 401, message: 'refresh token missing' };
  }

  const dbRefreshToken = await getRefreshSession(raw);
  if (!dbRefreshToken) {
    throw { status: 401, message: 'invalid refresh token' };
  }

  if (dbRefreshToken.user.disabled) {
    throw { status: 403, message: 'access denied' };
  }

  if (dbRefreshToken.expiresAt < new Date()) {
    await dbRefreshToken.destroy();
    throw { status: 401, message: 'refresh token expired' };
  }

  return dbRefreshToken;
}

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: process.env.NODE_ENV === 'production' ? '/api/refresh' : '/',
  });
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  hashRefreshToken,
  setRefreshSession,
  validateRefreshSession,
  clearRefreshCookie
};
