const pubsub = require('../pubsub');

module.exports = {
  bookAdded: {
    subscribe: () => {
      return pubsub.asyncIterableIterator('BOOK_ADDED');
    }
  }
};