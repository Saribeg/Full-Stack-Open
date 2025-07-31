const Author = require('../../models/author');
const Book = require('../../models/book');

module.exports = {
  bookCount: async () => Book.countDocuments(),

  authorCount: async () => Author.countDocuments(),

  allBooks: async (_root, args) => {
    const filter = {};
    if (args.author) {
      const author = await Author.findOne({ name: args.author });
      if (!author) return [];
      filter.author = author.id;
    }
    if (args.genre) {
      filter.genres = { $in: [args.genre] };
    }
    return Book.find(filter).populate('author');
  },

  allAuthors: async () => Author.find({}),

  me: (_root, _args, context) => {
    return context.currentUser;
  }
};