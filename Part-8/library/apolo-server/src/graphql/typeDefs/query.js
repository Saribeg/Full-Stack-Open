const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: Genre): [Book!]
    allAuthors(offset: Int, limit: Int): [Author]
    me: User
  }
`;