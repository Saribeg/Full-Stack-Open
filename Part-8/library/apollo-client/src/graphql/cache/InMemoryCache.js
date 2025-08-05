import { InMemoryCache } from '@apollo/client';

// Apollo Client by default may overwrite paginated query results in the cache
// when using fetchMore, causing issues like duplicated items, data loss,
// or unnecessary network requests.
//
// This typePolicies configuration solves the problem specifically for the
// allBooks field:
//
// 1. keyArgs: ['genre', 'author'] tells Apollo to create separate cache
//    entries based on filter arguments. So results for different genres or authors
//    won't conflict with each other.
//
// 2. merge() defines how to combine paginated results. Instead of replacing
//    existing data, it appends new edges (books) to the previous ones, enabling
//    seamless infinite scrolling.
//
// Without this setup, Apollo would not know how to safely merge paginated pages,
// and would warn: "Cache data may be lost when replacing the allBooks field".
export const inMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        allBooks: {
          keyArgs: ['genre', 'author'],
          merge(existing = { edges: [] }, incoming) {
            return {
              ...incoming,
              edges: [...existing.edges, ...incoming.edges],
            };
          },
        },
      },
    },
  },
});
