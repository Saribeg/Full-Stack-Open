import { ALL_BOOKS, ALL_AUTHORS } from '../operations'

export const uniqEdgesById = (edges) => {
  const seen = new Set();
  return edges.filter(({ node }) => {
    if (seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });
};

export const updateCachesAfterBookAdded = (cache, addedBook) => {
  const newEdge = {
    node: addedBook,
    cursor: addedBook.id,
  };

  // New books are added to top because of sorting, so that we are updating cache to show new book.
  cache.updateQuery({ query: ALL_BOOKS, variables: { first: 30 } }, (data) => {
    if (!data) return;

    const updatedEdges = uniqEdgesById([
      ...data.allBooks.edges,
      newEdge,
    ]);

    return {
      allBooks: {
        edges: updatedEdges,
        pageInfo: data.allBooks.pageInfo,
      },
    };
  });

  // The same per Genres as cache are separate per each genre.
  if (addedBook.genres) {
    addedBook.genres.forEach((genre) => {
      cache.updateQuery(
        {
          query: ALL_BOOKS,
          variables: { genre, first: 30 },
        },
        (data) => {
          if (!data) return;

          const updatedEdges = uniqEdgesById([
            ...data.allBooks.edges,
            newEdge,
          ]);

          return {
            allBooks: {
              edges: updatedEdges,
              pageInfo: data.allBooks.pageInfo,
            },
          };
        }
      );
    });
  }

  if (addedBook.author) {
    cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
      if (!data) return;

      const authors = data.allAuthors;
      const isExists = authors.some((a) => a.name === addedBook.author.name);

      if (isExists) {
        return {
          allAuthors: authors.map((a) =>
            a.name === addedBook.author.name
              ? { ...a, bookCount: a.bookCount + 1 }
              : a
          ),
        };
      }

      return {
        allAuthors: authors.concat({ ...addedBook.author, bookCount: 1 }),
      };
    });
  }
};
