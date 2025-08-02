import { gql } from '@apollo/client';
import { AUTHOR_DETAILS, BOOK_DETAILS } from './fragments';

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Year!, $genres: [Genre!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const SET_BIRTH_YEAR = gql`
  mutation setBirthYear($name: String!, $setBornTo: Year!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`;

export const LOGIN = gql`
  mutation login($username: Username!, $password: Password!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;