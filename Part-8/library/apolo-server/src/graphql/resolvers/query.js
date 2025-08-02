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

  allAuthors: async (_root, args) => {
    const { offset = 0, limit = 20 } = args;

    return await Author.find({})
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
  },

  me: (_root, _args, context) => {
    return context.currentUser;
  }
};