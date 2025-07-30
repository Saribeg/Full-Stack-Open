const { gql } = require('graphql-tag');

module.exports = gql`
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!,
      password: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;