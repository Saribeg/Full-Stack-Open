const { gql } = require('graphql-tag');

module.exports = gql`
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: Genre, first: Int, after: ObjectID): BookConnection
    allAuthors(offset: Int, limit: Int): [Author]
    allGenres: [Genre]
    me: User
  }
`;