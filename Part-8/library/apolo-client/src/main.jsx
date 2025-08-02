import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  split,
  from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { inMemoryCache } from './graphql/cache/InMemoryCache.js';
import { errorLink } from './graphql/links/errorLink.js';
import { retryLink } from './graphql/links/retryLink.js';

import App from './App.jsx';

import 'react-toastify/dist/ReactToastify.css';


// `authLink` adds the Authorization header (JWT) to outgoing HTTP requests.
// It uses Apollo Link middleware pattern via `setContext`.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  };
});

// `httpLink` defines the base GraphQL HTTP endpoint.
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

// `httpChain` defines the full HTTP request chain:
// auth header injection → retries → error handling → actual request.
// We use `from()` here because we want to combine **multiple** links in a linear pipeline.
const httpChain = from([
  authLink,        // applies auth headers
  retryLink,       // retries before fail
  errorLink,       // catches GraphQL and network errors
  httpLink         // sends the actual request
]);

// `wsLink` is the WebSocket link used for GraphQL subscriptions (real-time).
const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
);

// `splitLink` routes operations based on type:
// if it's a subscription → use wsLink (WebSocket),
// otherwise → use httpChain (HTTP with error & auth).
// `split()` is a router: it chooses between two links based on the operation.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,     // used for subscriptions
  httpChain   // used for queries & mutations
);

// ApolloClient ties everything together: cache + link
const client = new ApolloClient({
  cache: inMemoryCache, // your custom configured cache (e.g., for pagination)
  link: splitLink       // smart routing of operations
});

// Render the app with ApolloProvider at the root
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
