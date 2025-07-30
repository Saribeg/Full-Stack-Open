const { gql } = require('graphql-tag');

module.exports = gql`
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int
  }
`;
