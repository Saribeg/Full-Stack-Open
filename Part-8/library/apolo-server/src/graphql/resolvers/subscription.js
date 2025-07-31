const { GraphQLError } = require('graphql');
const pubsub = require('../pubsub');

module.exports = {
  bookAdded: {
    subscribe: (_root, _args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return pubsub.asyncIterator('BOOK_ADDED');
    }
  }
};