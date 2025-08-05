import { gql } from '@apollo/client';
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments';

export const ALL_AUTHORS = gql`
  query AllAuthors($offset: Int, $limit: Int) {
    authorCount
    allAuthors(offset: $offset, limit: $limit) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS = gql`
  query AllBooks($genre: Genre, $author: String, $first: Int, $after: ObjectID) {
    allBooks(genre: $genre, author: $author, first: $first, after: $after) {
      edges {
        node {
          ...BookDetails
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${BOOK_DETAILS}
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;