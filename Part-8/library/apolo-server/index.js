const http = require('http');

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const depthLimit = require('graphql-depth-limit');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');

require('./src/db');
const logger = require('./src/utils/logger');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const { formatError } = require('./src/graphql/hooks/formatError');
const context = require('./src/graphql/context');
const { costLimitRule } = require('./src/graphql/costLimitRule');

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    formatError,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [depthLimit(5), costLimitRule]
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, { context })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    logger.info(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
