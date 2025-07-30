const Book = require('../../models/book');

module.exports = {
  bookCount: async (author) => {
    return Book.countDocuments({ author: author._id });
  }
};
