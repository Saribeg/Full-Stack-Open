const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pubsub = require('../pubsub');

const Author = require('../../models/author');
const Book = require('../../models/book');
const User = require('../../models/user');
const { withAuth } = require('../hofs');

module.exports = {
  addBook: withAuth(async (_root, args) => {
    let author = await Author.findOne({ name: args.author });

    if (!author) {
      author = new Author({ name: args.author });
      await author.save();
    }

    const book = new Book({ ...args, author: author.id });
    await book.save();

    const populatedBook = await book.populate('author');

    pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });

    return populatedBook;
  }),

  editAuthor: withAuth(async (_root, { name, setBornTo }) => {
    const author = await Author.findOne({ name });
    if (!author) return null;

    author.born = setBornTo;
    await author.save();

    return author;
  }),

  createUser: async (_root, { username, favoriteGenre, password }) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, favoriteGenre, passwordHash });
    return user.save();
  },

  login: async (_root, { username, password }) => {
    const user = await User.findOne({ username });

    if (!user) {
      throw new GraphQLError('User is not found', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: ['username']
        },
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      throw new GraphQLError('Incorrect credentials', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: ['username', 'password']
        },
      });
    }

    const userData = {
      username: user.username,
      favoriteGenre: user.favoriteGenre,
      id: user.id
    };

    const token = jwt.sign(
      userData,
      (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? process.env.TEST_SECRET : process.env.SECRET
    );

    return { value: token };
  }
};
