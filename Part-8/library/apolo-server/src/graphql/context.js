const jwt = require('jsonwebtoken');
const User = require('../models/user');

const context = async ({ req }) => {
  const auth = req?.headers.authorization;

  if (auth?.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '');
      const SECRET = process.env.NODE_ENV === 'development' ? process.env.TEST_SECRET: process.env.SECRET;
      const decodedToken = jwt.verify(token, SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    } catch (err) {
      return { currentUser: null, error: err.message };
    }
  }

  return { currentUser: null };
};

module.exports = context;
