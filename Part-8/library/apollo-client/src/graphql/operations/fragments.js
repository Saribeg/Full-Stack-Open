import { gql } from '@apollo/client';

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`;

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      id
      name
      born
    }
    published
    genres
  }
`;