import { gql } from '@apollo/client'
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments'

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
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: Genre!) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`