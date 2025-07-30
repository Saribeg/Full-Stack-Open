const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
require('./src/db');
const logger = require('./src/utils/logger');
const { formatError } = require('./src/graphql/hooks/formatError');
const context = require('./src/graphql/context');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context
}).then(({ url }) => {
  logger.info(`Server ready at ${url}`);
});
