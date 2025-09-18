const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();
const User = require('../models/user');
const { SECRET, TEST_SECRET } = require('../utils/config');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id).populate('blogs');

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  response.json(user);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).json({ error: '`password` is required' });
  }

  if (password.length < 3) {
    return response.status(400).json({ error: '`password` must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  const token = jwt.sign(
    userForToken,
    (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development')
      ? TEST_SECRET
      : SECRET
  );

  response.status(201).json({
    token,
    username: savedUser.username,
    name: savedUser.name,
    id: savedUser._id
  });
});

module.exports = usersRouter;