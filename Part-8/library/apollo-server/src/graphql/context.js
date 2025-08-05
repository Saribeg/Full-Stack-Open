const jwt = require('jsonwebtoken');
const User = require('../models/user');
const createBookCountLoader = require('../loaders/bookCountLoader');

const context = async ({ req }) => {
  const auth = req?.headers.authorization;

  if (auth?.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '');
      const SECRET = process.env.NODE_ENV === 'development' ? process.env.TEST_SECRET: process.env.SECRET;
      const decodedToken = jwt.verify(token, SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return {
        currentUser,
        loaders: {
          bookCountLoader: createBookCountLoader()
        }
      };
    } catch (err) {
      return {
        currentUser: null,
        error: err.message,
        loaders: {
          bookCountLoader: createBookCountLoader(),
        }
      };
    }
  }

  return {
    currentUser: null,
    loaders: {
      bookCountLoader: createBookCountLoader(),
    }
  };
};

module.exports = context;
