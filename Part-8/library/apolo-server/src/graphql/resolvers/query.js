const Author = require('../../models/author');
const Book = require('../../models/book');

module.exports = {
  bookCount: async () => Book.countDocuments(),

  authorCount: async () => Author.countDocuments(),

  // With coursor-based pagination
  allBooks: async (_root, args) => {
    const { author, genre, first = 30, after } = args;
    const filter = {};

    if (author) {
      const foundAuthor = await Author.findOne({ name: author });
      if (!foundAuthor) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null
          }
        };
      }
      filter.author = foundAuthor._id;
    }

    if (genre) {
      filter.genres = { $in: [genre] };
    }

    if (after) {
      filter._id = { $lt: after };
    }

    // Retrieve 1 more book to find out if there exists next page
    const books = await Book.find(filter)
      .sort({ _id: -1 })
      .limit(first + 1)
      .populate('author');

    const hasNextPage = books.length > first;
    const slicedBooks = hasNextPage ? books.slice(0, first) : books; // Do not include additional product

    const edges = slicedBooks.map(book => ({
      node: book,
      cursor: book._id
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor
      }
    };
  },

  allAuthors: async (_root, args) => {
    const { offset = 0, limit = 20 } = args;

    return await Author.find({})
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
  },

  allGenres: async () => {
    const result = await Book.aggregate([
      // Step 1: Deconstruct the genres array so each genre becomes its own document
      { $unwind: '$genres' },

      // Step 2: Group by genre and count how many times each appears
      { $group: { _id: '$genres', count: { $sum: 1 } } },

      // Step 3: Sort genres by frequency in descending order
      { $sort: { count: -1 } },

      // Step 4: Reshape the output to only include the genre string
      { $project: { _id: 0, genre: '$_id' } }
    ]);

    // Return the genre names as a flat array
    return result.map(g => g.genre);
  },

  me: (_root, _args, context) => {
    return context.currentUser;
  }
};