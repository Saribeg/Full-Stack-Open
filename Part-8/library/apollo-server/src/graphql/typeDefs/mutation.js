const { gql } = require('graphql-tag');

module.exports = gql`
  type Mutation {
    addBook(
      title: String!
      published: Year!
      author: String!
      genres: [Genre!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Year!
    ): Author

    createUser(
      username: Username!
      favoriteGenre: String!,
      password: Password!
    ): User

    login(
      username: Username!
      password: Password!
    ): Token
  }
`;