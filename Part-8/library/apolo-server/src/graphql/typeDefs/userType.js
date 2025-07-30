const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
`;