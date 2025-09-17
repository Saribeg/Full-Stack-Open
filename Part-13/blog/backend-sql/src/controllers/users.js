const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { User, Blog } = require('../models');
const { userExtractor } = require('../utils/middlewares');

usersRouter.get('/', async (req, res) => {
  const users = await User.scope('withBlogs').findAll();

  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const { read } = req.query;

  const ownBlogs = {
    model: Blog,
    attributes: { exclude: ['userId'] }
  };

  const readings = {
    model: Blog,
    as: 'readings',
    attributes: { exclude: ['userId'] },
    through: {
      attributes: ['id', 'read']
    }
  };

  if (['true', 'false'].includes(read)) {
    readings.through.where = { read: read === 'true' };
  }

  const user = await User.findByPk(id, {
    attributes: ['id', 'name', 'username'],
    include: [ownBlogs, readings]
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});


usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: '`password` is required' });
  }

  if (password.length < 3) {
    return res.status(400).json({ error: '`password` must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.status(201).json(user);
});

usersRouter.put('/:username', userExtractor, async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({ error: '`newUsername` is required' });
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.user.id !== user.id) {
    return res.status(403).json({ error: 'You can only update your own account' });
  }

  user.username = newUsername;
  await user.save();

  const updatedUser = await User.scope('withBlogs').findByPk(user.id);

  res.json(updatedUser);
});

module.exports = usersRouter;