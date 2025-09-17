const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const { User, Session } = require('../models');
const { generateAccessToken, generateRefreshToken, getRefreshExpiryDate } = require('../utils/tokens');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { username } });

  const passwordCorrect = user && await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) return res.status(401).json({ error: 'invalid username or password' });
  if (user.disabled) return res.status(403).json({ error: 'access denied' });

  const payload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(payload);

  const { raw: refreshToken, hash: hashedRefreshToken } = generateRefreshToken();
  const expiresAt = getRefreshExpiryDate();
  await Session.create({ userId: user.id, hashedRefreshToken, expiresAt });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/refresh',
    maxAge: expiresAt.getTime() - Date.now(),
  });

  res.json({
    token: accessToken,
    username: user.username,
    name: user.name,
    id: user.id
  });
});

module.exports = loginRouter;