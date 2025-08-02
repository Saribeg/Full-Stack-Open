export const updateCachesAfterBookAdded = (cache, addedBook) => {
  // When a new book is added - update book lists.
  const targetGenres = [null, ...(addedBook.genres ?? [])];

  targetGenres.forEach((genre) => {
    // Why we use `cache.modify()` instead of `updateQuery`
    //
    // When we add a new book (via mutation or subscription), we want to insert it
    // at the top of the paginated list (in `allBooks`) **without triggering network refetches**
    // and **without introducing duplicates**.
    //
    // ❌ `updateQuery(...)` doesn't work correctly here because:
    // - Apollo **ignores `updateQuery`** when a custom `merge()` is defined in `typePolicies`
    // - It cannot reliably find the correct query entry in the cache when variables vary (e.g., `genre`, `author`)
    // - It blindly rewrites the cache entry instead of safely merging
    //
    // ✅ `cache.modify()` works better because:
    // - It directly updates the cache field `allBooks` for the correct arguments (via `variables`)
    // - It gives fine-grained control via helpers like `readField` and `toReference`
    // - It works even when using cursor-based pagination with custom `merge()`
    //
    // Docs for Apollo cache manipulation:
    // - https://www.apollographql.com/docs/react/caching/cache-field-behavior/
    // - https://www.apollographql.com/docs/react/caching/cache-interaction
    cache.modify({
      fields: {
        allBooks(existingConnection = {}, { readField, toReference }) {
          // `existingConnection` is the current cached value for the `allBooks` field.
          // It contains the `edges`, `pageInfo`, and possibly other metadata.
          // We're going to add a new book to the start of it's `endes` list (prepend),
          // while avoiding duplicates.
          const existingEdges = existingConnection.edges ?? [];

          // `readField` is a helper provided by Apollo to safely access
          // fields from a reference object (normalized cache).
          // Why? Because Apollo often stores objects like { __ref: 'Book:abc123' }
          // and you can't just access `.node.id` directly.
          //
          // This checks if the book is already present in the cache (by ID),
          // to avoid inserting it twice.
          const alreadyExists = existingEdges.some((edge) => {
            const nodeId = readField('id', readField('node', edge));
            return nodeId === addedBook.id;
          });

          // If the book already exists in the list, don't add it again.
          if (alreadyExists) return existingConnection;

          // `toReference(addedBook)` creates a normalized Apollo reference
          // like { __ref: "Book:688e..." }.
          //
          // This is important because the `edges[].node` in the Apollo cache
          // is not supposed to be a full Book object — it's supposed to be
          // a reference to a normalized Book already in the cache.
          //
          // If you put the full object here instead of a reference, Apollo will
          // treat it as embedded data, which can lead to bugs, duplicates, and
          // inconsistent normalization.
          //
          // For objects already present in the cache with a proper `id`, this
          // ensures that Apollo reuses existing data instead of storing a new copy.
          const newEdgeRef = {
            __typename: 'BookEdge',
            node: toReference(addedBook),
            cursor: addedBook.id,
          };

          // Return the updated connection with the new book prepended to edges.
          // Keep `pageInfo` and other metadata as-is.
          return {
            ...existingConnection,
            edges: [newEdgeRef, ...existingEdges],
          };
        },
      },
      variables: { genre, first: 30 },
    });
  });
};
