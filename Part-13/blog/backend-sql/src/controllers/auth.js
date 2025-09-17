const bcrypt = require('bcrypt');
const authRouter = require('express').Router();
const { User, Session } = require('../models');
const {
  generateAccessToken,
  hashRefreshToken,
  setRefreshSession,
  validateRefreshSession,
  clearRefreshCookie
} = require('../utils/tokens');
const { userExtractor } = require('../utils/middlewares');

authRouter.post('/login', async (req, res) => {
  const { username, password, deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: '`deviceId` is required' });
  }

  const user = await User.scope('withPassword').findOne({ where: { username } });

  const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) return res.status(401).json({ error: 'invalid username or password' });
  if (user.disabled) return res.status(403).json({ error: 'access denied' });

  const payload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(payload);

  await setRefreshSession(res, user.id, {
    deviceId,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  res.json({
    token: accessToken,
    username: user.username,
    name: user.name,
    id: user.id
  });
});

authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken: raw } = req.cookies;
    const dbRefreshToken = await validateRefreshSession(raw);

    const { id, username, name } = dbRefreshToken.user;
    const payload = { id, username };
    const accessToken = generateAccessToken(payload);

    await dbRefreshToken.destroy();
    await setRefreshSession(res, id, {
      deviceId: dbRefreshToken.deviceId,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    return res.json({ token: accessToken, username, name, id });
  } catch (err) {
    clearRefreshCookie(res);
    return res.status(err.status || 500).json({ error: err.message || 'server error' });
  }
});

authRouter.delete('/logout', async (req, res) => {
  const { refreshToken: raw } = req.cookies;
  if (!raw) {
    return res.status(401).json({ error: 'refresh token missing' });
  }

  const hashed = hashRefreshToken(raw);
  const dbRefreshToken = await Session.findOne({ where: { hashedRefreshToken: hashed } });

  if (dbRefreshToken) {
    await dbRefreshToken.destroy();
  }

  clearRefreshCookie(res);

  return res.status(204).end();
});

authRouter.get('/sessions', userExtractor, async (req, res) => {
  const { id: userId } = req.user;

  const sessions = await Session.findAll({
    where: { userId },
    attributes: ['id', 'deviceId', 'ip', 'userAgent', 'createdAt', 'updatedAt', 'expiresAt']
  });

  res.json(sessions);
});


module.exports = authRouter;