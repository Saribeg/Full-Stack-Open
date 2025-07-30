const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author]
  }
`;