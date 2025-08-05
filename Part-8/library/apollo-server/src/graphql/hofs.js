const { GraphQLError } = require('graphql');

const withAuth = (resolverFn) => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return resolverFn(root, args, context, info);
};

module.exports = {
  withAuth
};