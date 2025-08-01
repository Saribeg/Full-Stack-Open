const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: Username!
    favoriteGenre: String!
    id: ObjectID!
  }
`;